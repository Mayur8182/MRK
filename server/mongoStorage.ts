import { 
  type User, type InsertUser, 
  type Portfolio, type InsertPortfolio,
  type Investment, type InsertInvestment,
  type Transaction, type InsertTransaction,
  type Performance, type InsertPerformance
} from "@shared/schema";
import { IStorage } from "./storage";
import { mongodb, mongoClient } from "./db";
import { ObjectId } from "mongodb";
import session from "express-session";
import connectMongo from "connect-mongo";

export class MongoDBStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = connectMongo.create({
      client: mongoClient,
      dbName: "p2p_system",
      ttl: 14 * 24 * 60 * 60, // 14 days session expiry
      autoRemove: 'native'
    });
    this.initCollections();
  }

  private async initCollections() {
    // Create collections if they don't exist
    const collections = await mongodb.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('users')) {
      await mongodb.createCollection('users');
    }
    
    if (!collectionNames.includes('portfolios')) {
      await mongodb.createCollection('portfolios');
    }
    
    if (!collectionNames.includes('investments')) {
      await mongodb.createCollection('investments');
    }
    
    if (!collectionNames.includes('transactions')) {
      await mongodb.createCollection('transactions');
    }
    
    if (!collectionNames.includes('performance')) {
      await mongodb.createCollection('performance');
    }
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const user = await mongodb.collection('users').findOne({ id });
    return user ? this.mapUser(user) : undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await mongodb.collection('users').findOne({ username });
    return user ? this.mapUser(user) : undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await mongodb.collection('users').findOne({ email });
    return user ? this.mapUser(user) : undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    // Get the highest id and increment by 1
    const lastUser = await mongodb.collection('users')
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = lastUser.length > 0 ? lastUser[0].id + 1 : 1;
    
    const now = new Date();
    const user: User = {
      id: nextId,
      username: insertUser.username,
      password: insertUser.password,
      name: insertUser.name,
      email: insertUser.email,
      profile_image: insertUser.profile_image || null,
      preferences: insertUser.preferences || null,
      notifications_enabled: insertUser.notifications_enabled || true,
      created_at: now,
      last_login: null
    };
    
    await mongodb.collection('users').insertOne(user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const updateData = {
      ...userData,
      updated_at: new Date()
    };
    
    const result = await mongodb.collection('users').findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return result ? this.mapUser(result) : undefined;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const result = await mongodb.collection('users').deleteOne({ id });
    return result.deletedCount > 0;
  }
  
  // Portfolio operations
  async getPortfolios(userId?: number): Promise<Portfolio[]> {
    const query = userId ? { user_id: userId } : {};
    const portfolios = await mongodb.collection('portfolios').find(query).toArray();
    return portfolios.map(p => this.mapPortfolio(p));
  }
  
  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    const portfolio = await mongodb.collection('portfolios').findOne({ id });
    return portfolio ? this.mapPortfolio(portfolio) : undefined;
  }
  
  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    // Get the highest id and increment by 1
    const lastPortfolio = await mongodb.collection('portfolios')
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = lastPortfolio.length > 0 ? lastPortfolio[0].id + 1 : 1;
    
    const now = new Date();
    const portfolio: Portfolio = {
      id: nextId,
      name: insertPortfolio.name,
      user_id: insertPortfolio.user_id,
      description: insertPortfolio.description || null,
      total_value: "0",
      created_at: now,
      is_active: insertPortfolio.is_active || true
    };
    
    await mongodb.collection('portfolios').insertOne(portfolio);
    return portfolio;
  }
  
  async updatePortfolio(id: number, portfolioData: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const updateData = {
      ...portfolioData,
      updated_at: new Date()
    };
    
    const result = await mongodb.collection('portfolios').findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return result ? this.mapPortfolio(result) : undefined;
  }
  
  async deletePortfolio(id: number): Promise<boolean> {
    const result = await mongodb.collection('portfolios').deleteOne({ id });
    return result.deletedCount > 0;
  }
  
  // Investment operations
  async getInvestments(portfolioId?: number): Promise<Investment[]> {
    const query = portfolioId ? { portfolio_id: portfolioId } : {};
    const investments = await mongodb.collection('investments').find(query).toArray();
    return investments.map(i => this.mapInvestment(i));
  }
  
  async getInvestment(id: number): Promise<Investment | undefined> {
    const investment = await mongodb.collection('investments').findOne({ id });
    return investment ? this.mapInvestment(investment) : undefined;
  }
  
  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    // Get the highest id and increment by 1
    const lastInvestment = await mongodb.collection('investments')
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = lastInvestment.length > 0 ? lastInvestment[0].id + 1 : 1;
    
    const now = new Date();
    const investment: Investment = {
      id: nextId,
      name: insertInvestment.name,
      type: insertInvestment.type,
      description: insertInvestment.description || null,
      is_active: insertInvestment.is_active || true,
      portfolio_id: insertInvestment.portfolio_id,
      amount: insertInvestment.amount,
      current_value: insertInvestment.current_value,
      risk_level: insertInvestment.risk_level || null,
      purchase_date: now
    };
    
    await mongodb.collection('investments').insertOne(investment);
    return investment;
  }
  
  async updateInvestment(id: number, investmentData: Partial<Investment>): Promise<Investment | undefined> {
    const updateData = {
      ...investmentData,
      updated_at: new Date()
    };
    
    const result = await mongodb.collection('investments').findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return result ? this.mapInvestment(result) : undefined;
  }
  
  async deleteInvestment(id: number): Promise<boolean> {
    const result = await mongodb.collection('investments').deleteOne({ id });
    return result.deletedCount > 0;
  }
  
  // Transaction operations
  async getTransactions(portfolioId?: number, investmentId?: number): Promise<Transaction[]> {
    let query = {};
    if (portfolioId) {
      query = { portfolio_id: portfolioId };
    }
    if (investmentId) {
      query = { ...query, investment_id: investmentId };
    }
    
    const transactions = await mongodb.collection('transactions').find(query).toArray();
    return transactions.map(t => this.mapTransaction(t));
  }
  
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const transaction = await mongodb.collection('transactions').findOne({ id });
    return transaction ? this.mapTransaction(transaction) : undefined;
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    // Get the highest id and increment by 1
    const lastTransaction = await mongodb.collection('transactions')
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = lastTransaction.length > 0 ? lastTransaction[0].id + 1 : 1;
    
    const now = new Date();
    const transaction: Transaction = {
      id: nextId,
      date: now,
      portfolio_id: insertTransaction.portfolio_id,
      investment_id: insertTransaction.investment_id,
      amount: insertTransaction.amount,
      transaction_type: insertTransaction.transaction_type,
      notes: insertTransaction.notes || null
    };
    
    await mongodb.collection('transactions').insertOne(transaction);
    return transaction;
  }
  
  // Performance operations
  async getPerformanceHistory(portfolioId: number): Promise<Performance[]> {
    const performances = await mongodb.collection('performance')
      .find({ portfolio_id: portfolioId })
      .sort({ date: 1 })
      .toArray();
    
    return performances.map(p => this.mapPerformance(p));
  }
  
  async recordPerformance(insertPerformance: InsertPerformance): Promise<Performance> {
    // Get the highest id and increment by 1
    const lastPerformance = await mongodb.collection('performance')
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = lastPerformance.length > 0 ? lastPerformance[0].id + 1 : 1;
    
    const now = new Date();
    const performance: Performance = {
      id: nextId,
      date: now,
      portfolio_id: insertPerformance.portfolio_id,
      value: insertPerformance.value
    };
    
    await mongodb.collection('performance').insertOne(performance);
    return performance;
  }

  // Helper methods to map MongoDB documents to schema types
  private mapUser(doc: any): User {
    const { _id, ...user } = doc;
    return user as User;
  }
  
  private mapPortfolio(doc: any): Portfolio {
    const { _id, ...portfolio } = doc;
    return portfolio as Portfolio;
  }
  
  private mapInvestment(doc: any): Investment {
    const { _id, ...investment } = doc;
    return investment as Investment;
  }
  
  private mapTransaction(doc: any): Transaction {
    const { _id, ...transaction } = doc;
    return transaction as Transaction;
  }
  
  private mapPerformance(doc: any): Performance {
    const { _id, ...performance } = doc;
    return performance as Performance;
  }
}