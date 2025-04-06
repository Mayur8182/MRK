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
    
    const indices = ['^GSPC', '^DJI', '^IXIC', '^RUT', '^FTSE', '^N225'];
    const response = await axios.get(`${FMP_BASE_URL}/quote/${indices.join(',')}`, {
      params: {
        apikey: FMP_API_KEY
      }
    });
    
    if (response.data && response.data.length > 0) {
      return response.data;
    }
    
    throw new Error('No market indices data found');
  } catch (error: any) {
    console.error('Error fetching market indices:', error.message);
    throw error;
  }
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