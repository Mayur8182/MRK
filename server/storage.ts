import { 
  users, portfolios, investments, transactions, performance,
  type User, type InsertUser, 
  type Portfolio, type InsertPortfolio,
  type Investment, type InsertInvestment,
  type Transaction, type InsertTransaction,
  type Performance, type InsertPerformance
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Portfolio operations
  getPortfolios(userId?: number): Promise<Portfolio[]>;
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, portfolio: Partial<Portfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: number): Promise<boolean>;
  
  // Investment operations
  getInvestments(portfolioId?: number): Promise<Investment[]>;
  getInvestment(id: number): Promise<Investment | undefined>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: number, investment: Partial<Investment>): Promise<Investment | undefined>;
  deleteInvestment(id: number): Promise<boolean>;
  
  // Transaction operations
  getTransactions(portfolioId?: number, investmentId?: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Performance operations
  getPerformanceHistory(portfolioId: number): Promise<Performance[]>;
  recordPerformance(performance: InsertPerformance): Promise<Performance>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private portfolios: Map<number, Portfolio>;
  private investments: Map<number, Investment>;
  private transactions: Map<number, Transaction>;
  private performances: Map<number, Performance>;
  
  private userCurrentId: number;
  private portfolioCurrentId: number;
  private investmentCurrentId: number;
  private transactionCurrentId: number;
  private performanceCurrentId: number;

  constructor() {
    this.users = new Map();
    this.portfolios = new Map();
    this.investments = new Map();
    this.transactions = new Map();
    this.performances = new Map();
    
    this.userCurrentId = 1;
    this.portfolioCurrentId = 1;
    this.investmentCurrentId = 1;
    this.transactionCurrentId = 1;
    this.performanceCurrentId = 1;
    
    // Initialize with sample data
    this.seedInitialData();
  }

  private seedInitialData() {
    // Create a demo user
    const demoUser = this.createUser({
      username: "demo",
      password: "password123",
      name: "Demo User",
      email: "demo@example.com"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const timestamp = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      created_at: timestamp
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Portfolio operations
  async getPortfolios(userId?: number): Promise<Portfolio[]> {
    const allPortfolios = Array.from(this.portfolios.values());
    if (userId) {
      return allPortfolios.filter(p => p.user_id === userId);
    }
    return allPortfolios;
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = this.portfolioCurrentId++;
    const timestamp = new Date();
    const portfolio: Portfolio = {
      ...insertPortfolio,
      id,
      total_value: "0",
      created_at: timestamp
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(id: number, portfolioData: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const portfolio = await this.getPortfolio(id);
    if (!portfolio) return undefined;
    
    const updatedPortfolio = { ...portfolio, ...portfolioData };
    this.portfolios.set(id, updatedPortfolio);
    return updatedPortfolio;
  }

  async deletePortfolio(id: number): Promise<boolean> {
    return this.portfolios.delete(id);
  }

  // Investment operations
  async getInvestments(portfolioId?: number): Promise<Investment[]> {
    const allInvestments = Array.from(this.investments.values());
    if (portfolioId) {
      return allInvestments.filter(i => i.portfolio_id === portfolioId);
    }
    return allInvestments;
  }

  async getInvestment(id: number): Promise<Investment | undefined> {
    return this.investments.get(id);
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = this.investmentCurrentId++;
    const timestamp = new Date();
    const investment: Investment = {
      ...insertInvestment,
      id,
      purchase_date: timestamp
    };
    this.investments.set(id, investment);
    
    // Update portfolio total value
    const portfolio = await this.getPortfolio(investment.portfolio_id);
    if (portfolio) {
      const newTotalValue = Number(portfolio.total_value) + Number(investment.amount);
      await this.updatePortfolio(portfolio.id, { 
        total_value: newTotalValue.toString() 
      });
    }
    
    return investment;
  }

  async updateInvestment(id: number, investmentData: Partial<Investment>): Promise<Investment | undefined> {
    const investment = await this.getInvestment(id);
    if (!investment) return undefined;
    
    const updatedInvestment = { ...investment, ...investmentData };
    this.investments.set(id, updatedInvestment);
    return updatedInvestment;
  }

  async deleteInvestment(id: number): Promise<boolean> {
    const investment = await this.getInvestment(id);
    if (!investment) return false;
    
    // Update portfolio total value before deleting
    const portfolio = await this.getPortfolio(investment.portfolio_id);
    if (portfolio) {
      const newTotalValue = Number(portfolio.total_value) - Number(investment.amount);
      await this.updatePortfolio(portfolio.id, { 
        total_value: Math.max(0, newTotalValue).toString()
      });
    }
    
    return this.investments.delete(id);
  }

  // Transaction operations
  async getTransactions(portfolioId?: number, investmentId?: number): Promise<Transaction[]> {
    const allTransactions = Array.from(this.transactions.values());
    if (portfolioId && investmentId) {
      return allTransactions.filter(t => t.portfolio_id === portfolioId && t.investment_id === investmentId);
    } else if (portfolioId) {
      return allTransactions.filter(t => t.portfolio_id === portfolioId);
    } else if (investmentId) {
      return allTransactions.filter(t => t.investment_id === investmentId);
    }
    return allTransactions;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCurrentId++;
    const timestamp = new Date();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      date: timestamp
    };
    this.transactions.set(id, transaction);
    
    // Update investment value based on transaction type
    const investment = await this.getInvestment(transaction.investment_id);
    if (investment) {
      let newCurrentValue = Number(investment.current_value);
      
      if (transaction.transaction_type === 'purchase' || transaction.transaction_type === 'deposit') {
        newCurrentValue += Number(transaction.amount);
      } else if (transaction.transaction_type === 'sale' || transaction.transaction_type === 'withdrawal') {
        newCurrentValue -= Number(transaction.amount);
      }
      
      await this.updateInvestment(investment.id, {
        current_value: Math.max(0, newCurrentValue).toString()
      });
      
      // Update portfolio total value
      const portfolio = await this.getPortfolio(transaction.portfolio_id);
      if (portfolio) {
        let newTotalValue = Number(portfolio.total_value);
        
        if (transaction.transaction_type === 'purchase' || transaction.transaction_type === 'deposit') {
          newTotalValue += Number(transaction.amount);
        } else if (transaction.transaction_type === 'sale' || transaction.transaction_type === 'withdrawal') {
          newTotalValue -= Number(transaction.amount);
        }
        
        await this.updatePortfolio(portfolio.id, {
          total_value: Math.max(0, newTotalValue).toString()
        });
      }
    }
    
    return transaction;
  }

  // Performance operations
  async getPerformanceHistory(portfolioId: number): Promise<Performance[]> {
    const allPerformances = Array.from(this.performances.values());
    return allPerformances.filter(p => p.portfolio_id === portfolioId);
  }

  async recordPerformance(insertPerformance: InsertPerformance): Promise<Performance> {
    const id = this.performanceCurrentId++;
    const timestamp = new Date();
    const performance: Performance = {
      ...insertPerformance,
      id,
      date: timestamp
    };
    this.performances.set(id, performance);
    return performance;
  }
}

export const storage = new MemStorage();
