import { pgTable, text, serial, numeric, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  profile_image: text("profile_image"),
  preferences: text("preferences"), // JSON string of user preferences
  notifications_enabled: boolean("notifications_enabled").notNull().default(true),
  created_at: timestamp("created_at").defaultNow(),
  last_login: timestamp("last_login")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  profile_image: true,
  preferences: true,
  notifications_enabled: true
});

// Portfolios table
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  total_value: numeric("total_value").notNull().default("0"),
  created_at: timestamp("created_at").defaultNow(),
  is_active: boolean("is_active").notNull().default(true)
});

export const insertPortfolioSchema = createInsertSchema(portfolios).pick({
  user_id: true,
  name: true,
  description: true,
  is_active: true
});

// Investments table
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  portfolio_id: integer("portfolio_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  amount: numeric("amount").notNull(),
  current_value: numeric("current_value").notNull(),
  type: text("type").notNull(),
  risk_level: text("risk_level"),
  purchase_date: timestamp("purchase_date").defaultNow(),
  is_active: boolean("is_active").notNull().default(true)
});

export const insertInvestmentSchema = createInsertSchema(investments).pick({
  portfolio_id: true,
  name: true,
  description: true,
  amount: true,
  current_value: true,
  type: true,
  risk_level: true,
  is_active: true
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  investment_id: integer("investment_id").notNull(),
  portfolio_id: integer("portfolio_id").notNull(),
  transaction_type: text("transaction_type").notNull(), // purchase, sale, dividend, deposit, withdrawal
  amount: numeric("amount").notNull(),
  date: timestamp("date").defaultNow(),
  notes: text("notes")
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  investment_id: true,
  portfolio_id: true,
  transaction_type: true,
  amount: true,
  notes: true
});

// Performance table (for tracking portfolio performance over time)
export const performance = pgTable("performance", {
  id: serial("id").primaryKey(),
  portfolio_id: integer("portfolio_id").notNull(),
  date: timestamp("date").defaultNow(),
  value: numeric("value").notNull()
});

export const insertPerformanceSchema = createInsertSchema(performance).pick({
  portfolio_id: true,
  value: true
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;

export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Performance = typeof performance.$inferSelect;
export type InsertPerformance = z.infer<typeof insertPerformanceSchema>;
