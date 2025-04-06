import axios from 'axios';

// Financial Modeling Prep API key from environment variables
const FMP_API_KEY = process.env.FMP_API_KEY || '';

// Alpha Vantage API key from environment variables
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || '';

// News API key from environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY || '';

// Base URLs
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Check if the required API keys are available
const isFMPEnabled = !!FMP_API_KEY;
const isAlphaVantageEnabled = !!ALPHA_VANTAGE_API_KEY;
const isNewsAPIEnabled = !!NEWS_API_KEY;

// Log warnings if API keys are missing
if (!isFMPEnabled) {
  console.warn('Financial Modeling Prep API key not provided. Market data will be limited.');
}

if (!isAlphaVantageEnabled) {
  console.warn('Alpha Vantage API key not provided. Some market data functionalities will be limited.');
}

if (!isNewsAPIEnabled) {
  console.warn('News API key not provided. News data will not be available.');
}

/**
 * Get real-time stock quote for a symbol
 * @param symbol Stock symbol (e.g., AAPL, MSFT)
 * @returns Stock quote data
 */
export async function getStockQuote(symbol: string) {
  try {
    if (!isFMPEnabled) {
      throw new Error('Financial Modeling Prep API key not provided');
    }
    
    const response = await axios.get(`${FMP_BASE_URL}/quote/${symbol}`, {
      params: {
        apikey: FMP_API_KEY
      }
    });
    
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    throw new Error('No data found for this symbol');
  } catch (error: any) {
    console.error(`Error fetching stock quote for ${symbol}:`, error.message);
    throw error;
  }
}

/**
 * Get historical stock prices for a symbol
 * @param symbol Stock symbol
 * @param from Start date (YYYY-MM-DD)
 * @param to End date (YYYY-MM-DD)
 * @returns Historical price data
 */
export async function getHistoricalPrices(symbol: string, from: string, to: string) {
  try {
    if (!isFMPEnabled) {
      throw new Error('Financial Modeling Prep API key not provided');
    }
    
    const response = await axios.get(`${FMP_BASE_URL}/historical-price-full/${symbol}`, {
      params: {
        from,
        to,
        apikey: FMP_API_KEY
      }
    });
    
    if (response.data && response.data.historical) {
      return response.data.historical;
    }
    
    throw new Error('No historical data found for this symbol');
  } catch (error: any) {
    console.error(`Error fetching historical prices for ${symbol}:`, error.message);
    throw error;
  }
}

/**
 * Get company profile information
 * @param symbol Stock symbol
 * @returns Company profile data
 */
export async function getCompanyProfile(symbol: string) {
  try {
    if (!isFMPEnabled) {
      throw new Error('Financial Modeling Prep API key not provided');
    }
    
    const response = await axios.get(`${FMP_BASE_URL}/profile/${symbol}`, {
      params: {
        apikey: FMP_API_KEY
      }
    });
    
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    throw new Error('No company profile found for this symbol');
  } catch (error: any) {
    console.error(`Error fetching company profile for ${symbol}:`, error.message);
    throw error;
  }
}

/**
 * Get market indices data
 * @returns Market indices data
 */
export async function getMarketIndices() {
  try {
    if (!isFMPEnabled) {
      throw new Error('Financial Modeling Prep API key not provided');
    }
    
    // Major market indices from different regions
    const majorIndices = ['^GSPC', '^DJI', '^IXIC', '^FTSE', '^N225', '000001.SS'];
    const globalIndices = ['^GDAXI', '^FCHI', '^IBEX', '^FTMIB', '^AXJO', '^KS11', '^BSESN', '^HSI', '^BVSP', '^MXX'];
    
    // Get major indices
    const majorResponse = await axios.get(`${FMP_BASE_URL}/quote/${majorIndices.join(',')}`, {
      params: {
        apikey: FMP_API_KEY
      }
    });
    
    // Get global indices
    const globalResponse = await axios.get(`${FMP_BASE_URL}/quote/${globalIndices.join(',')}`, {
      params: {
        apikey: FMP_API_KEY
      }
    });
    
    if (majorResponse.data?.length > 0 && globalResponse.data?.length > 0) {
      // Map the data to our expected format
      const majorMarkets = mapIndices(majorResponse.data);
      const globalIndices = mapIndices(globalResponse.data);
      
      // Get regional performance data (sample data for now - would be calculated from actual data)
      const regionPerformance = getSampleRegionPerformance();
      
      // Get sector performance data (sample data for now)
      const sectorPerformance = getSampleSectorPerformance();
      
      // Sample currencies and market hours data
      const currencies = getSampleCurrencies();
      const globalEvents = getSampleGlobalEvents();
      const marketHours = getSampleMarketHours();
      
      return {
        majorMarkets,
        globalIndices,
        regionPerformance,
        sectorPerformance,
        currencies,
        globalEvents,
        marketHours,
        lastUpdated: new Date().toISOString()
      };
    }
    
    throw new Error('No market indices data found');
  } catch (error: any) {
    console.error('Error fetching market indices:', error.message);
    throw error;
  }
}

// Helper function to map API response to our expected format
function mapIndices(indices: any[]) {
  const regionMap: Record<string, string> = {
    '^GSPC': 'North America',
    '^DJI': 'North America',
    '^IXIC': 'North America',
    '^FTSE': 'Europe',
    '^GDAXI': 'Europe',
    '^FCHI': 'Europe',
    '^IBEX': 'Europe',
    '^FTMIB': 'Europe',
    '^N225': 'Asia',
    '000001.SS': 'Asia',
    '^KS11': 'Asia',
    '^BSESN': 'Asia',
    '^HSI': 'Asia',
    '^AXJO': 'Asia-Pacific',
    '^BVSP': 'South America',
    '^MXX': 'North America'
  };
  
  const countryMap: Record<string, string> = {
    '^GSPC': 'United States',
    '^DJI': 'United States',
    '^IXIC': 'United States',
    '^FTSE': 'United Kingdom',
    '^GDAXI': 'Germany',
    '^FCHI': 'France',
    '^IBEX': 'Spain',
    '^FTMIB': 'Italy',
    '^N225': 'Japan',
    '000001.SS': 'China',
    '^KS11': 'South Korea',
    '^BSESN': 'India',
    '^HSI': 'Hong Kong',
    '^AXJO': 'Australia',
    '^BVSP': 'Brazil',
    '^MXX': 'Mexico'
  };
  
  const nameMap: Record<string, string> = {
    '^GSPC': 'S&P 500',
    '^DJI': 'Dow Jones Industrial',
    '^IXIC': 'NASDAQ Composite',
    '^FTSE': 'FTSE 100',
    '^GDAXI': 'DAX',
    '^FCHI': 'CAC 40',
    '^IBEX': 'IBEX 35',
    '^FTMIB': 'FTSE MIB',
    '^N225': 'Nikkei 225',
    '000001.SS': 'Shanghai Composite',
    '^KS11': 'KOSPI',
    '^BSESN': 'BSE SENSEX',
    '^HSI': 'Hang Seng',
    '^AXJO': 'ASX 200',
    '^BVSP': 'Bovespa',
    '^MXX': 'IPC Mexico'
  };
  
  const currencyMap: Record<string, string> = {
    '^GSPC': 'USD',
    '^DJI': 'USD',
    '^IXIC': 'USD',
    '^FTSE': 'GBP',
    '^GDAXI': 'EUR',
    '^FCHI': 'EUR',
    '^IBEX': 'EUR',
    '^FTMIB': 'EUR',
    '^N225': 'JPY',
    '000001.SS': 'CNY',
    '^KS11': 'KRW',
    '^BSESN': 'INR',
    '^HSI': 'HKD',
    '^AXJO': 'AUD',
    '^BVSP': 'BRL',
    '^MXX': 'MXN'
  };
  
  return indices.map((index: any) => ({
    id: index.symbol,
    name: nameMap[index.symbol] || index.name,
    region: regionMap[index.symbol] || 'Global',
    country: countryMap[index.symbol] || 'Global',
    value: index.price,
    change: index.change,
    changePercent: index.changesPercentage,
    currency: currencyMap[index.symbol] || 'USD',
    lastUpdated: new Date().toISOString()
  }));
}

// Sample data for regional performance
function getSampleRegionPerformance() {
  return [
    { region: "North America", color: "#10B981", ytd: 15.2, month1: 1.7, month3: 5.1, month6: 11.3, year1: 19.8, year5: 71.5 },
    { region: "Europe", color: "#6366F1", ytd: 8.7, month1: 0.5, month3: 2.9, month6: 4.8, year1: 9.4, year5: 38.9 },
    { region: "Asia", color: "#F59E0B", ytd: 5.3, month1: -0.8, month3: 1.2, month6: 3.5, year1: 7.2, year5: 29.7 },
    { region: "Asia-Pacific", color: "#EC4899", ytd: 6.8, month1: 0.2, month3: 1.9, month6: 3.8, year1: 8.6, year5: 31.5 },
    { region: "South America", color: "#8B5CF6", ytd: 10.4, month1: 1.1, month3: 4.2, month6: 6.9, year1: 12.3, year5: 41.2 }
  ];
}

// Sample data for sector performance
function getSampleSectorPerformance() {
  return [
    { sector: "Technology", value: 25.8, ytdChange: 21.4 },
    { sector: "Healthcare", value: 15.3, ytdChange: 12.8 },
    { sector: "Financials", value: 18.7, ytdChange: 15.6 },
    { sector: "Consumer Discretionary", value: 14.2, ytdChange: 10.3 },
    { sector: "Communication Services", value: 19.5, ytdChange: 16.7 },
    { sector: "Industrials", value: 12.6, ytdChange: 9.8 },
    { sector: "Materials", value: 8.9, ytdChange: 7.1 },
    { sector: "Energy", value: 5.2, ytdChange: -3.4 },
    { sector: "Utilities", value: 6.8, ytdChange: 4.2 },
    { sector: "Real Estate", value: 9.5, ytdChange: 6.8 },
    { sector: "Consumer Staples", value: 11.2, ytdChange: 8.5 }
  ];
}

// Sample currencies data
function getSampleCurrencies() {
  return [
    { code: "EUR/USD", name: "Euro / US Dollar", rate: 1.0915, change: 0.0032, changePercent: 0.29 },
    { code: "USD/JPY", name: "US Dollar / Japanese Yen", rate: 150.25, change: -0.42, changePercent: -0.28 },
    { code: "GBP/USD", name: "British Pound / US Dollar", rate: 1.2685, change: 0.0058, changePercent: 0.46 },
    { code: "USD/CHF", name: "US Dollar / Swiss Franc", rate: 0.8973, change: -0.0024, changePercent: -0.27 },
    { code: "AUD/USD", name: "Australian Dollar / US Dollar", rate: 0.6615, change: 0.0041, changePercent: 0.62 },
    { code: "USD/CAD", name: "US Dollar / Canadian Dollar", rate: 1.3658, change: -0.0057, changePercent: -0.42 },
    { code: "USD/CNY", name: "US Dollar / Chinese Yuan", rate: 7.1842, change: 0.0125, changePercent: 0.17 },
    { code: "USD/INR", name: "US Dollar / Indian Rupee", rate: 83.1425, change: -0.0375, changePercent: -0.05 }
  ];
}

// Sample global events data
function getSampleGlobalEvents() {
  return [
    { id: 1, date: "2023-12-15", title: "Fed Interest Rate Decision", description: "The Federal Reserve kept interest rates unchanged at 5.25-5.50%", impact: "high", regions: ["North America", "Global"], type: "Economic" },
    { id: 2, date: "2023-12-14", title: "ECB Monetary Policy Meeting", description: "The European Central Bank maintained its key interest rate at 4.0%", impact: "medium", regions: ["Europe"], type: "Economic" },
    { id: 3, date: "2023-12-13", title: "US CPI Data Release", description: "US inflation cooled to 3.1% year-on-year in November", impact: "high", regions: ["North America", "Global"], type: "Economic" },
    { id: 4, date: "2023-12-12", title: "OPEC Monthly Report", description: "OPEC maintained its forecast for global oil demand growth in 2024", impact: "medium", regions: ["Global"], type: "Commodity" },
    { id: 5, date: "2023-12-11", title: "UK GDP Data", description: "UK economy expanded by 0.2% in October, beating expectations", impact: "medium", regions: ["Europe"], type: "Economic" },
    { id: 6, date: "2023-12-08", title: "Japan GDP Revision", description: "Japan's Q3 GDP was revised down to -0.7% annualized rate", impact: "low", regions: ["Asia"], type: "Economic" }
  ];
}

// Sample market hours data
function getSampleMarketHours() {
  return [
    { market: "New York Stock Exchange", region: "North America", status: "open", openTime: "09:30", closeTime: "16:00", localTime: "10:45", timeZone: "EST" },
    { market: "NASDAQ", region: "North America", status: "open", openTime: "09:30", closeTime: "16:00", localTime: "10:45", timeZone: "EST" },
    { market: "London Stock Exchange", region: "Europe", status: "open", openTime: "08:00", closeTime: "16:30", localTime: "15:45", timeZone: "GMT" },
    { market: "Tokyo Stock Exchange", region: "Asia", status: "closed", openTime: "09:00", closeTime: "15:00", localTime: "23:45", timeZone: "JST" },
    { market: "Shanghai Stock Exchange", region: "Asia", status: "closed", openTime: "09:30", closeTime: "15:00", localTime: "23:45", timeZone: "CST" },
    { market: "Hong Kong Stock Exchange", region: "Asia", status: "closed", openTime: "09:30", closeTime: "16:00", localTime: "23:45", timeZone: "HKT" },
    { market: "Frankfurt Stock Exchange", region: "Europe", status: "open", openTime: "09:00", closeTime: "17:30", localTime: "16:45", timeZone: "CET" },
    { market: "Bombay Stock Exchange", region: "Asia", status: "closed", openTime: "09:15", closeTime: "15:30", localTime: "21:15", timeZone: "IST" },
    { market: "Australian Securities Exchange", region: "Asia-Pacific", status: "closed", openTime: "10:00", closeTime: "16:00", localTime: "02:45", timeZone: "AEST" },
    { market: "B3 (Brazil)", region: "South America", status: "closed", openTime: "10:00", closeTime: "17:00", localTime: "12:45", timeZone: "BRT" },
    { market: "Mexican Stock Exchange", region: "North America", status: "open", openTime: "08:30", closeTime: "15:00", localTime: "09:45", timeZone: "CST" }
  ];
}

/**
 * Get financial news for a specific symbol or general market news
 * @param symbol Optional stock symbol for company-specific news
 * @returns News articles
 */
export async function getFinancialNews(symbol?: string) {
  try {
    if (!isNewsAPIEnabled) {
      throw new Error('News API key not provided');
    }
    
    let query = 'finance OR stock OR market';
    if (symbol) {
      query = `${symbol} OR ${query}`;
    }
    
    const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: NEWS_API_KEY
      }
    });
    
    if (response.data && response.data.articles) {
      return response.data.articles;
    }
    
    throw new Error('No news data found');
  } catch (error: any) {
    console.error('Error fetching financial news:', error.message);
    throw error;
  }
}

/**
 * Search for stocks by keyword
 * @param query Search keyword
 * @returns List of matching stocks
 */
export async function searchStocks(query: string) {
  try {
    if (!isFMPEnabled) {
      throw new Error('Financial Modeling Prep API key not provided');
    }
    
    const response = await axios.get(`${FMP_BASE_URL}/search`, {
      params: {
        query,
        limit: 10,
        apikey: FMP_API_KEY
      }
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error('No search results found');
  } catch (error: any) {
    console.error(`Error searching stocks for "${query}":`, error.message);
    throw error;
  }
}

/**
 * Get technical indicators for a stock
 * @param symbol Stock symbol
 * @param interval Time interval (e.g., daily, weekly, monthly)
 * @param timePeriod Number of data points to calculate the indicator
 * @param indicatorType Type of indicator (e.g., SMA, EMA, RSI)
 * @returns Technical indicator data
 */
export async function getTechnicalIndicator(
  symbol: string,
  interval: 'daily' | 'weekly' | 'monthly',
  timePeriod: number,
  indicatorType: 'SMA' | 'EMA' | 'RSI' | 'MACD'
) {
  try {
    if (!isAlphaVantageEnabled) {
      throw new Error('Alpha Vantage API key not provided');
    }
    
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: `TECHNICAL_INDICATOR_${indicatorType}`,
        symbol,
        interval,
        time_period: timePeriod,
        series_type: 'close',
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(`No ${indicatorType} data found for ${symbol}`);
  } catch (error: any) {
    console.error(`Error fetching ${indicatorType} for ${symbol}:`, error.message);
    throw error;
  }
}

/**
 * Perform sentiment analysis on news articles for a stock
 * @param symbol Stock symbol
 * @returns Sentiment data
 */
export async function getNewsSentiment(symbol: string) {
  try {
    // First get relevant news
    const news = await getFinancialNews(symbol);
    
    // If we had a sentiment analysis API, we would process the news here
    // For now, we'll just classify based on simple keyword analysis
    const sentimentData = news.map((article: any) => {
      let sentiment = 0;
      
      // Very basic sentiment analysis (for demonstration only)
      const positiveKeywords = ['rise', 'gain', 'grow', 'positive', 'up', 'profit', 'good', 'success'];
      const negativeKeywords = ['fall', 'drop', 'decline', 'negative', 'down', 'loss', 'bad', 'fail'];
      
      const text = (article.title + ' ' + (article.description || '')).toLowerCase();
      
      positiveKeywords.forEach(keyword => {
        if (text.includes(keyword)) sentiment += 1;
      });
      
      negativeKeywords.forEach(keyword => {
        if (text.includes(keyword)) sentiment -= 1;
      });
      
      return {
        title: article.title,
        url: article.url,
        publishedAt: article.publishedAt,
        sentiment: sentiment > 0 ? 'positive' : sentiment < 0 ? 'negative' : 'neutral',
        score: sentiment
      };
    });
    
    // Calculate overall sentiment
    const sentimentScores = sentimentData.map((item: any) => item.score);
    const averageSentiment = sentimentScores.reduce((a: number, b: number) => a + b, 0) / sentimentScores.length;
    
    return {
      symbol,
      overallSentiment: averageSentiment > 0.5 ? 'positive' : averageSentiment < -0.5 ? 'negative' : 'neutral',
      averageScore: averageSentiment,
      articles: sentimentData
    };
  } catch (error: any) {
    console.error(`Error analyzing sentiment for ${symbol}:`, error.message);
    throw error;
  }
}