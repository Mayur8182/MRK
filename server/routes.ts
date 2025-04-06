import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPortfolioSchema, 
  insertInvestmentSchema, 
  insertTransactionSchema,
  insertPerformanceSchema,
  User
} from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";
import * as marketAPI from "./market-api";
import * as email from "./email";
import { generatePDFReport, generateCSVReport } from "./reports";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Create HTTP server
  const httpServer = createServer(app);

  // Protected route middleware
  const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: "Authentication required" });
  };
  
  // Admin-only route middleware
  const adminRoute = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && (req.user as User).username === 'admin') {
      return next();
    }
    res.status(403).json({ error: "Admin access required" });
  };

  // User endpoints - Only accessible by admins
  app.get("/api/users", adminRoute, async (req, res) => {
    try {
      const users = await storage.getPortfolios();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", adminRoute, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // User management (creating/updating users) is now handled by auth routes

  // Portfolio endpoints
  app.get("/api/portfolios", protectedRoute, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as User).id;
      const portfolios = await storage.getPortfolios(userId);
      res.json(portfolios);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      res.status(500).json({ error: "Failed to fetch portfolios" });
    }
  });

  app.get("/api/portfolios/:id", protectedRoute, async (req: Request, res: Response) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      // Check if portfolio exists and belongs to the current user
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      
      if (portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  app.post("/api/portfolios", protectedRoute, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as User).id;
      const portfolioData = insertPortfolioSchema.parse({
        ...req.body,
        user_id: userId
      });
      
      const newPortfolio = await storage.createPortfolio(portfolioData);
      res.status(201).json(newPortfolio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating portfolio:", error);
      res.status(500).json({ error: "Failed to create portfolio" });
    }
  });

  app.put("/api/portfolios/:id", protectedRoute, async (req: Request, res: Response) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      // Check if portfolio exists and belongs to the current user
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      
      if (portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const updatedPortfolio = await storage.updatePortfolio(portfolioId, req.body);
      res.json(updatedPortfolio);
    } catch (error) {
      console.error("Error updating portfolio:", error);
      res.status(500).json({ error: "Failed to update portfolio" });
    }
  });

  app.delete("/api/portfolios/:id", protectedRoute, async (req: Request, res: Response) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      // Check if portfolio exists and belongs to the current user
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      
      if (portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const success = await storage.deletePortfolio(portfolioId);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Portfolio not found" });
      }
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      res.status(500).json({ error: "Failed to delete portfolio" });
    }
  });

  // Investment endpoints
  app.get("/api/investments", protectedRoute, async (req: Request, res: Response) => {
    try {
      const portfolioId = req.query.portfolioId ? parseInt(req.query.portfolioId as string) : undefined;
      
      // If portfolioId is provided, verify that it belongs to the user
      if (portfolioId) {
        const portfolio = await storage.getPortfolio(portfolioId);
        if (!portfolio) {
          return res.status(404).json({ error: "Portfolio not found" });
        }
        
        if (portfolio.user_id !== (req.user as User).id) {
          return res.status(403).json({ error: "Access denied" });
        }
        
        const investments = await storage.getInvestments(portfolioId);
        res.json(investments);
      } else {
        // Get all investments that belong to the user's portfolios
        const userPortfolios = await storage.getPortfolios((req.user as User).id);
        if (userPortfolios.length === 0) {
          return res.json([]);
        }
        
        const portfolioIds = userPortfolios.map(p => p.id);
        const allInvestments = await storage.getInvestments();
        const userInvestments = allInvestments.filter(investment => 
          portfolioIds.includes(investment.portfolio_id)
        );
        
        res.json(userInvestments);
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
      res.status(500).json({ error: "Failed to fetch investments" });
    }
  });

  app.get("/api/investments/:id", protectedRoute, async (req: Request, res: Response) => {
    try {
      const investmentId = parseInt(req.params.id);
      const investment = await storage.getInvestment(investmentId);
      
      if (!investment) {
        return res.status(404).json({ error: "Investment not found" });
      }
      
      // Verify that the investment's portfolio belongs to the user
      const portfolio = await storage.getPortfolio(investment.portfolio_id);
      if (!portfolio || portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(investment);
    } catch (error) {
      console.error("Error fetching investment:", error);
      res.status(500).json({ error: "Failed to fetch investment" });
    }
  });

  app.post("/api/investments", protectedRoute, async (req: Request, res: Response) => {
    try {
      const { portfolio_id } = req.body;
      
      // Verify that the portfolio belongs to the user
      const portfolio = await storage.getPortfolio(portfolio_id);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      
      if (portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const investmentData = insertInvestmentSchema.parse(req.body);
      const newInvestment = await storage.createInvestment(investmentData);
      res.status(201).json(newInvestment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating investment:", error);
      res.status(500).json({ error: "Failed to create investment" });
    }
  });

  app.put("/api/investments/:id", protectedRoute, async (req: Request, res: Response) => {
    try {
      const investmentId = parseInt(req.params.id);
      const investment = await storage.getInvestment(investmentId);
      
      if (!investment) {
        return res.status(404).json({ error: "Investment not found" });
      }
      
      // Verify that the investment's portfolio belongs to the user
      const portfolio = await storage.getPortfolio(investment.portfolio_id);
      if (!portfolio || portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const updatedInvestment = await storage.updateInvestment(investmentId, req.body);
      res.json(updatedInvestment);
    } catch (error) {
      console.error("Error updating investment:", error);
      res.status(500).json({ error: "Failed to update investment" });
    }
  });

  app.delete("/api/investments/:id", protectedRoute, async (req: Request, res: Response) => {
    try {
      const investmentId = parseInt(req.params.id);
      const investment = await storage.getInvestment(investmentId);
      
      if (!investment) {
        return res.status(404).json({ error: "Investment not found" });
      }
      
      // Verify that the investment's portfolio belongs to the user
      const portfolio = await storage.getPortfolio(investment.portfolio_id);
      if (!portfolio || portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const success = await storage.deleteInvestment(investmentId);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Investment not found" });
      }
    } catch (error) {
      console.error("Error deleting investment:", error);
      res.status(500).json({ error: "Failed to delete investment" });
    }
  });

  // Transaction endpoints
  app.get("/api/transactions", protectedRoute, async (req: Request, res: Response) => {
    try {
      const portfolioId = req.query.portfolioId ? parseInt(req.query.portfolioId as string) : undefined;
      const investmentId = req.query.investmentId ? parseInt(req.query.investmentId as string) : undefined;
      
      // Verify access to portfolio/investment
      if (portfolioId) {
        const portfolio = await storage.getPortfolio(portfolioId);
        if (!portfolio) {
          return res.status(404).json({ error: "Portfolio not found" });
        }
        
        if (portfolio.user_id !== (req.user as User).id) {
          return res.status(403).json({ error: "Access denied" });
        }
      }
      
      if (investmentId) {
        const investment = await storage.getInvestment(investmentId);
        if (!investment) {
          return res.status(404).json({ error: "Investment not found" });
        }
        
        const portfolio = await storage.getPortfolio(investment.portfolio_id);
        if (!portfolio || portfolio.user_id !== (req.user as User).id) {
          return res.status(403).json({ error: "Access denied" });
        }
      }
      
      // If no specific portfolio or investment is requested, filter to user's data
      if (!portfolioId && !investmentId) {
        const userPortfolios = await storage.getPortfolios((req.user as User).id);
        if (userPortfolios.length === 0) {
          return res.json([]);
        }
        
        const portfolioIds = userPortfolios.map(p => p.id);
        const allTransactions = await storage.getTransactions();
        const userTransactions = allTransactions.filter(transaction => 
          portfolioIds.includes(transaction.portfolio_id)
        );
        
        return res.json(userTransactions);
      }
      
      const transactions = await storage.getTransactions(portfolioId, investmentId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", protectedRoute, async (req: Request, res: Response) => {
    try {
      const transactionId = parseInt(req.params.id);
      const transaction = await storage.getTransaction(transactionId);
      
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      // Verify that the transaction's portfolio belongs to the user
      const portfolio = await storage.getPortfolio(transaction.portfolio_id);
      if (!portfolio || portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", protectedRoute, async (req: Request, res: Response) => {
    try {
      const { investment_id, portfolio_id } = req.body;
      
      // Verify that the investment belongs to the portfolio
      const investment = await storage.getInvestment(investment_id);
      if (!investment) {
        return res.status(404).json({ error: "Investment not found" });
      }
      
      if (investment.portfolio_id !== portfolio_id) {
        return res.status(400).json({ error: "Investment does not belong to the specified portfolio" });
      }
      
      // Verify that the portfolio belongs to the user
      const portfolio = await storage.getPortfolio(portfolio_id);
      if (!portfolio || portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const transactionData = insertTransactionSchema.parse(req.body);
      const newTransaction = await storage.createTransaction(transactionData);
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating transaction:", error);
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // Performance endpoints
  app.get("/api/performance/:portfolioId", protectedRoute, async (req: Request, res: Response) => {
    try {
      const portfolioId = parseInt(req.params.portfolioId);
      
      // Verify that the portfolio belongs to the user
      const portfolio = await storage.getPortfolio(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      
      if (portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const performanceHistory = await storage.getPerformanceHistory(portfolioId);
      res.json(performanceHistory);
    } catch (error) {
      console.error("Error fetching performance history:", error);
      res.status(500).json({ error: "Failed to fetch performance history" });
    }
  });

  app.post("/api/performance", protectedRoute, async (req: Request, res: Response) => {
    try {
      const { portfolio_id } = req.body;
      
      // Verify that the portfolio belongs to the user
      const portfolio = await storage.getPortfolio(portfolio_id);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      
      if (portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const performanceData = insertPerformanceSchema.parse(req.body);
      const newPerformance = await storage.recordPerformance(performanceData);
      res.status(201).json(newPerformance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error recording performance:", error);
      res.status(500).json({ error: "Failed to record performance data" });
    }
  });

  // Market data endpoints
  app.get("/api/market/quote/:symbol", protectedRoute, async (req: Request, res: Response) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const quote = await marketAPI.getStockQuote(symbol);
      res.json(quote);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch stock quote" });
    }
  });

  app.get("/api/market/historical/:symbol", protectedRoute, async (req: Request, res: Response) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const from = req.query.from as string || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const to = req.query.to as string || new Date().toISOString().split('T')[0];
      
      const historicalData = await marketAPI.getHistoricalPrices(symbol, from, to);
      res.json(historicalData);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch historical prices" });
    }
  });

  app.get("/api/market/company/:symbol", protectedRoute, async (req: Request, res: Response) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const companyProfile = await marketAPI.getCompanyProfile(symbol);
      res.json(companyProfile);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch company profile" });
    }
  });

  app.get("/api/market/indices", protectedRoute, async (req: Request, res: Response) => {
    try {
      const indices = await marketAPI.getMarketIndices();
      res.json(indices);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch market indices" });
    }
  });

  app.get("/api/market/news", protectedRoute, async (req: Request, res: Response) => {
    try {
      const symbol = req.query.symbol as string;
      const news = await marketAPI.getFinancialNews(symbol);
      res.json(news);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch financial news" });
    }
  });

  app.get("/api/market/search", protectedRoute, async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const results = await marketAPI.searchStocks(query);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to search stocks" });
    }
  });

  app.get("/api/market/technical/:symbol", protectedRoute, async (req: Request, res: Response) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const interval = req.query.interval as 'daily' | 'weekly' | 'monthly' || 'daily';
      const timePeriod = parseInt(req.query.period as string) || 14;
      const indicatorType = req.query.indicator as 'SMA' | 'EMA' | 'RSI' | 'MACD' || 'SMA';
      
      const technicalData = await marketAPI.getTechnicalIndicator(symbol, interval, timePeriod, indicatorType);
      res.json(technicalData);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch technical indicators" });
    }
  });

  app.get("/api/market/sentiment/:symbol", protectedRoute, async (req: Request, res: Response) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const sentiment = await marketAPI.getNewsSentiment(symbol);
      res.json(sentiment);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to analyze news sentiment" });
    }
  });

  // Report generation endpoint
  app.get("/api/reports/generate/:portfolioId", protectedRoute, async (req: Request, res: Response) => {
    try {
      const portfolioId = parseInt(req.params.portfolioId);
      
      // Verify that the portfolio belongs to the user
      const portfolio = await storage.getPortfolio(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      
      if (portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Get all portfolio data
      const investments = await storage.getInvestments(portfolioId);
      const transactions = await storage.getTransactions(portfolioId);
      const performance = await storage.getPerformanceHistory(portfolioId);
      
      // Calculate total current value from investments
      const totalCurrentValue = investments.reduce((total, inv) => total + Number(inv.current_value), 0);
      
      // Calculate total cost from investments
      const totalCost = investments.reduce((total, inv) => total + Number(inv.amount), 0);
      
      // Generate report
      const report = {
        portfolioId,
        portfolioName: portfolio.name,
        generated: new Date(),
        timeframe: req.query.timeframe || 'all',
        portfolioData: portfolio,
        investments,
        transactions,
        performance,
        summary: {
          totalValue: totalCurrentValue,
          totalCost: totalCost,
          totalReturn: totalCurrentValue - totalCost,
          returnPercentage: totalCost > 0 
            ? ((totalCurrentValue - totalCost) / totalCost) * 100 
            : 0,
          investmentCount: investments.length,
          transactionCount: transactions.length
        }
      };
      
      res.json(report);
    } catch (error: any) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: error.message || "Failed to generate report" });
    }
  });
  
  // Download report as PDF
  app.get("/api/reports/download/pdf/:portfolioId", protectedRoute, async (req: Request, res: Response) => {
    try {
      const portfolioId = parseInt(req.params.portfolioId);
      
      // Verify that the portfolio belongs to the user
      const portfolio = await storage.getPortfolio(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      
      if (portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Get all portfolio data
      const investments = await storage.getInvestments(portfolioId);
      const transactions = await storage.getTransactions(portfolioId);
      const performance = await storage.getPerformanceHistory(portfolioId);
      
      // Calculate total current value from investments
      const totalCurrentValue = investments.reduce((total, inv) => total + Number(inv.current_value), 0);
      
      // Calculate total cost from investments
      const totalCost = investments.reduce((total, inv) => total + Number(inv.amount), 0);
      
      // Generate report data
      const reportData = {
        portfolioId,
        portfolioName: portfolio.name,
        generated: new Date(),
        timeframe: String(req.query.timeframe || 'all'),
        portfolioData: portfolio,
        investments,
        transactions,
        performance,
        summary: {
          totalValue: totalCurrentValue,
          totalCost: totalCost,
          totalReturn: totalCurrentValue - totalCost,
          returnPercentage: totalCost > 0 
            ? ((totalCurrentValue - totalCost) / totalCost) * 100 
            : 0,
          investmentCount: investments.length,
          transactionCount: transactions.length
        }
      };
      
      // Generate PDF report
      generatePDFReport(res, reportData);
      
    } catch (error: any) {
      console.error("Error generating PDF report:", error);
      res.status(500).json({ error: error.message || "Failed to generate PDF report" });
    }
  });
  
  // Download report as CSV
  app.get("/api/reports/download/csv/:portfolioId", protectedRoute, async (req: Request, res: Response) => {
    try {
      const portfolioId = parseInt(req.params.portfolioId);
      
      // Verify that the portfolio belongs to the user
      const portfolio = await storage.getPortfolio(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      
      if (portfolio.user_id !== (req.user as User).id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Get all portfolio data
      const investments = await storage.getInvestments(portfolioId);
      const transactions = await storage.getTransactions(portfolioId);
      const performance = await storage.getPerformanceHistory(portfolioId);
      
      // Calculate total current value from investments
      const totalCurrentValue = investments.reduce((total, inv) => total + Number(inv.current_value), 0);
      
      // Calculate total cost from investments
      const totalCost = investments.reduce((total, inv) => total + Number(inv.amount), 0);
      
      // Generate report data
      const reportData = {
        portfolioId,
        portfolioName: portfolio.name,
        generated: new Date(),
        timeframe: String(req.query.timeframe || 'all'),
        portfolioData: portfolio,
        investments,
        transactions,
        performance,
        summary: {
          totalValue: totalCurrentValue,
          totalCost: totalCost,
          totalReturn: totalCurrentValue - totalCost,
          returnPercentage: totalCost > 0 
            ? ((totalCurrentValue - totalCost) / totalCost) * 100 
            : 0,
          investmentCount: investments.length,
          transactionCount: transactions.length
        }
      };
      
      // Generate CSV report
      generateCSVReport(res, reportData);
      
    } catch (error: any) {
      console.error("Error generating CSV report:", error);
      res.status(500).json({ error: error.message || "Failed to generate CSV report" });
    }
  });
  
  // API key check endpoints
  app.get("/api/market/status", protectedRoute, async (req: Request, res: Response) => {
    try {
      const status = {
        fmpEnabled: !!process.env.FMP_API_KEY,
        alphaVantageEnabled: !!process.env.ALPHA_VANTAGE_API_KEY,
        newsApiEnabled: !!process.env.NEWS_API_KEY,
        emailEnabled: !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS
      };
      
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to check API status" });
    }
  });

  return httpServer;
}
