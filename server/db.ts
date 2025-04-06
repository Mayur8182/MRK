import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { MongoClient } from "mongodb";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mkbharvad8080:Mkb%408080@mk.jnchrec.mongodb.net/p2p_system?retryWrites=true&w=majority&ssl=true&tlsAllowInvalidCertificates=true";

export const mongoClient = new MongoClient(MONGODB_URI);
export const mongodb = mongoClient.db("p2p_system");

// Initialize MongoDB connection
try {
  mongoClient.connect()
    .then(() => console.log("MongoDB Atlas connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));
} catch (error) {
  console.error("Failed to initialize MongoDB connection:", error);
}
