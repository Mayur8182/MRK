import axios from 'axios';

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatHistoryMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  object: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations?: {
    [key: string]: string;
  }[];
}

/**
 * Make a request to the Perplexity API
 * @param messages Array of messages in the conversation history
 * @param options Additional options for the API request
 * @returns The Perplexity API response
 */
export async function queryPerplexity(
  messages: PerplexityMessage[],
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<PerplexityResponse> {
  // Check if API key is available
  if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error('PERPLEXITY_API_KEY is required but not provided in environment variables');
  }

  // Set default options
  const {
    model = 'llama-3.1-sonar-small-128k-online',
    temperature = 0.2,
    max_tokens = 1000
  } = options;

  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model,
        messages,
        max_tokens,
        temperature,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: "month",
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Perplexity API Error:', error.response?.data || error.message);
    throw new Error(`Failed to query Perplexity API: ${error.message}`);
  }
}

/**
 * Generate investment recommendations based on current investments, market data, and risk tolerance
 * @param portfolioData Portfolio information including investments and risk profile
 * @returns Recommendations with reasoning
 */
export async function generateInvestmentRecommendations(portfolioData: any): Promise<any> {
  try {
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are a professional investment advisor with expertise in financial markets, ' +
          'portfolio optimization, and risk management. Provide well-reasoned investment recommendations ' +
          'with specific actionable insights. Base your analysis on the portfolio data provided. ' +
          'Your recommendations should consider market trends, risk tolerance, and portfolio diversification. ' +
          'Always provide reasoning for your recommendations.'
      },
      {
        role: 'user',
        content: `Please analyze my investment portfolio and provide recommendations: ${JSON.stringify(portfolioData, null, 2)}`
      }
    ];

    const response = await queryPerplexity(messages, {
      temperature: 0.2,
      max_tokens: 1500
    });

    // Extract the assistant's response
    const recommendations = response.choices[0].message.content;
    
    // Format response with citations if available
    return {
      recommendations,
      citations: response.citations || [],
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Failed to generate investment recommendations:', error);
    throw new Error(`Failed to generate investment recommendations: ${error.message}`);
  }
}

/**
 * Analyze market sentiment for a specific symbol or the market in general
 * @param symbol Stock symbol to analyze or 'market' for general market sentiment
 * @param newsSummaries Recent news summaries related to the symbol or market
 * @returns Sentiment analysis with scores and reasoning
 */
export async function analyzeMarketSentiment(symbol: string, newsSummaries: string[]): Promise<any> {
  try {
    const newsContext = newsSummaries.join('\n\n');
    
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are a financial sentiment analysis expert specializing in market analysis. ' +
          'Analyze the provided news summaries and determine the overall sentiment regarding the specific ' +
          'investment or market. Provide a sentiment score on a scale of 1-100 (with 100 being most positive), ' +
          'key factors influencing the sentiment, and potential market implications. ' +
          'Format your response as structured JSON.'
      },
      {
        role: 'user',
        content: `Please analyze the sentiment for ${symbol === 'market' ? 'the overall market' : symbol} based on these recent news items:\n\n${newsContext}`
      }
    ];

    const response = await queryPerplexity(messages, {
      temperature: 0.1,
      max_tokens: 1000
    });

    // Extract and parse the content as JSON if possible
    let parsedContent: any;
    try {
      const content = response.choices[0].message.content;
      // Check if the content starts with a code block
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      
      if (jsonMatch && jsonMatch[1]) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        // Try to parse the entire content as JSON
        parsedContent = JSON.parse(content);
      }
    } catch (e) {
      // If parsing fails, return the raw content
      parsedContent = { 
        sentiment: null, 
        analysis: response.choices[0].message.content,
        structured: false
      };
    }

    return {
      ...parsedContent,
      citations: response.citations || [],
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Failed to analyze market sentiment:', error);
    throw new Error(`Failed to analyze market sentiment: ${error.message}`);
  }
}

/**
 * Generate a risk analysis report for a portfolio
 * @param portfolioData Portfolio data including investments
 * @param marketData Current market data and trends
 * @returns Risk analysis with scores, factors, and recommendations
 */
export async function generateRiskAnalysis(portfolioData: any, marketData: any): Promise<any> {
  try {
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are a risk management specialist focusing on investment portfolios. ' +
          'Analyze the provided portfolio and market data to identify risk factors, assess ' +
          'portfolio vulnerability, and provide risk mitigation strategies. Include an overall ' +
          'risk score (1-10), specific risk factors with individual scores, and actionable recommendations. ' +
          'Format your response as structured JSON.'
      },
      {
        role: 'user',
        content: `Please analyze the risk profile of this investment portfolio:\n\nPortfolio Data: ${JSON.stringify(portfolioData, null, 2)}\n\nMarket Data: ${JSON.stringify(marketData, null, 2)}`
      }
    ];

    const response = await queryPerplexity(messages, {
      temperature: 0.2,
      max_tokens: 1500
    });

    // Extract and parse the content as JSON if possible
    let parsedContent: any;
    try {
      const content = response.choices[0].message.content;
      // Check if the content starts with a code block
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      
      if (jsonMatch && jsonMatch[1]) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        // Try to parse the entire content as JSON
        parsedContent = JSON.parse(content);
      }
    } catch (e) {
      // If parsing fails, return the raw content
      parsedContent = { 
        riskScore: null, 
        analysis: response.choices[0].message.content,
        structured: false
      };
    }

    return {
      ...parsedContent,
      citations: response.citations || [],
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Failed to generate risk analysis:', error);
    throw new Error(`Failed to generate risk analysis: ${error.message}`);
  }
}

/**
 * Process a chat message for the AI assistant
 * @param message User's message
 * @param history Previous conversation history
 * @param userData User and portfolio data for context
 * @returns Assistant's response
 */
export async function processAIAssistantMessage(
  message: string, 
  history: ChatHistoryMessage[],
  userData?: any
): Promise<ChatHistoryMessage> {
  try {
    // Convert chat history to Perplexity format
    const perplexityMessages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are an AI investment assistant for a portfolio management platform. ' +
          'Your primary purpose is to help users with market analysis, risk assessment, and investment recommendations. ' +
          'Use your knowledge of financial markets, geopolitical trends, and economic data to provide thoughtful advice. ' +
          'You can analyze market sentiment, suggest portfolio adjustments, explain market trends, and advise on risk management. ' +
          'Always be respectful, clear, and helpful. When making recommendations, explain your reasoning. ' +
          'Provide concise responses when appropriate, but be thorough when analyzing complex topics. ' +
          'If you don\'t know something, admit it rather than making up information. ' +
          'You may reference citations when providing market insights. ' +
          'Your goal is to help users make more informed investment decisions.'
      }
    ];

    // Add history (limit to most recent messages)
    const recentHistory = history.slice(-10); // Only use the 10 most recent messages
    recentHistory.forEach(msg => {
      perplexityMessages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    // Add user context if available
    if (userData) {
      perplexityMessages.push({
        role: 'system',
        content: `Additional context about the user: ${JSON.stringify(userData, null, 2)}`
      });
    }

    // Add current message
    perplexityMessages.push({
      role: 'user',
      content: message
    });

    const response = await queryPerplexity(perplexityMessages, {
      temperature: 0.7, // Slightly higher temperature for more dynamic responses
      max_tokens: 1500
    });

    const assistantResponse = response.choices[0].message.content;
    
    return {
      id: response.id,
      role: 'assistant',
      content: assistantResponse,
      timestamp: new Date()
    };
  } catch (error: any) {
    console.error('Failed to process AI assistant message:', error);
    
    // Return a graceful error message
    return {
      id: `error-${Date.now()}`,
      role: 'assistant',
      content: "I'm sorry, I encountered an error processing your request. Please try again or contact support if the problem persists.",
      timestamp: new Date()
    };
  }
}