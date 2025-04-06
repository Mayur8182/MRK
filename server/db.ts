import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { MongoClient } from "mongodb";

neonConfig.webSocketConstructor = ws;

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set. Did you forget to configure the database connection?",
  );
}

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI;

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
