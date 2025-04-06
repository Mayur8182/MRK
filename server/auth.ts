import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { pool } from "./db";
import { User, InsertUser } from "@shared/schema";
import { storage } from "./storage";
import connectPgSimple from "connect-pg-simple";
import { sendWelcomeEmail } from "./email";

// Extend Express.User to contain our user type
declare global {
  namespace Express {
    // Define the user interface to match what's in the storage
    interface User {
      id: number;
      username: string;
      email: string;
      password: string;
      name?: string;
      profile_image?: string | null;
      preferences?: string | null;
      notifications_enabled?: boolean;
      role?: string;
      created_at: Date | null;
      updated_at?: Date | null;
      last_login?: Date | null;
    }
  }
}

const scryptAsync = promisify(scrypt);

// Password hashing function
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Password verification function
async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Initialize session with a secure random secret (better practice for production)
  const sessionSecret = process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex');
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    store: storage.sessionStore
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Incorrect username or password" });
        } else {
          // Update last_login timestamp
          await storage.updateUser(user.id, { last_login: new Date() });
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  // Session serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  // Register new user
  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, email, name } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
      
      // Create new user with hashed password
      const hashedPassword = await hashPassword(password);
      const newUser = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });
      
      // Remove password from response
      const { password: _, ...safeUser } = newUser;
      
      // Create a default portfolio for the new user
      try {
        await storage.createPortfolio({
          name: `${newUser.name || newUser.username}'s Portfolio`,
          description: "My primary investment portfolio",
          user_id: newUser.id,
          is_active: true
        });
        console.log(`Default portfolio created for user ${newUser.id}`);
      } catch (portfolioError) {
        console.error("Failed to create default portfolio:", portfolioError);
      }

      // Automatically log in the new user
      req.login(newUser, async (err) => {
        if (err) return next(err);
        
        // Send welcome email with high priority
        try {
          // Use catch internally to prevent waiting if email fails
          sendWelcomeEmail(newUser.email, newUser.username || newUser.name || 'Investor')
            .catch(emailError => {
              console.error("Failed to send welcome email:", emailError);
            });
          // We're using fire-and-forget approach here to not block registration
        } catch (emailError) {
          console.error("Error preparing welcome email:", emailError);
          // Continue registration process even if email fails
        }
        
        res.status(201).json(safeUser);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login
  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: info?.message || "Authentication failed" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...safeUser } = user;
        return res.json(safeUser);
      });
    })(req, res, next);
  });

  // Logout
  app.post("/api/logout", (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie("connect.sid");
        return res.sendStatus(200);
      });
    });
  });

  // Get current user
  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const { password, ...safeUser } = req.user as User;
    res.json(safeUser);
  });

  // Change password
  app.post("/api/user/change-password", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await storage.getUser((req.user as User).id);
      
      if (!user || !(await comparePasswords(currentPassword, user.password))) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(user.id, { password: hashedPassword });
      
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // Update user profile
  app.put("/api/user/profile", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { id } = req.user as User;
      const { name, email, profile_image, notifications_enabled } = req.body;
      
      // Check if email is being changed and if it already exists
      if (email && email !== (req.user as User).email) {
        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail && existingEmail.id !== id) {
          return res.status(400).json({ error: "Email already exists" });
        }
      }
      
      const updatedUser = await storage.updateUser(id, {
        name,
        email,
        profile_image,
        notifications_enabled
      });
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Authentication middleware for routes that require authentication
  app.use("/api/protected/*", (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ error: "Authentication required" });
  });
}