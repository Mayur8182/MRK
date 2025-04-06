import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  BarChart,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Cog,
  Download,
  FileDown,
  Filter,
  Globe,
  HelpCircle,
  LineChart,
  PieChart,
  Plus,
  RefreshCcw,
  Search,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
  Zap,
  ThumbsUp,
  AlertTriangle,
  ShieldAlert,
  Lightbulb
} from "lucide-react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

// Sample data for AI recommendations
const aiRecommendations = [
  {
    id: 1,
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    industry: "Semiconductors",
    recommendation: "Strong Buy",
    confidenceScore: 92,
    targetPrice: 850.00,
    currentPrice: 789.50,
    upside: 7.66,
    timeHorizon: "6-12 months",
    riskLevel: "Moderate-High",
    aiRationale: "NVIDIA continues to dominate the AI chip market with its GPUs being essential for AI model training and inference. Recent partnerships with major cloud providers and consistent product innovation maintain its competitive edge. The company is well-positioned to benefit from the ongoing AI boom, with demand for AI chips expected to grow significantly over the next 5 years.",
    keyMetrics: {
      pe: 98.2,
      marketCap: "1.95T",
      revenueGrowth: 122.4,
      profitMargin: 53.6,
      debtToEquity: 0.28,
      roi: 56.8,
    },
    triggers: ["AI adoption acceleration", "Data center expansion", "New product launches"],
    risks: ["Valuation concerns", "Increased competition", "Market saturation"],
    sentimentScore: 84,
    expertConsensus: {
      buy: 42,
      hold: 5,
      sell: 1
    },
    technicalSignals: {
      macd: "bullish",
      rsi: 68,
      movingAverages: "bullish",
      supportLevels: [750, 720, 680],
      resistanceLevels: [800, 825, 850]
    },
    alternatives: ["AMD", "TSM", "MRVL"]
  },
  {
    id: 2,
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    industry: "Software",
    recommendation: "Buy",
    confidenceScore: 88,
    targetPrice: 480.00,
    currentPrice: 420.45,
    upside: 14.16,
    timeHorizon: "Long-term",
    riskLevel: "Low",
    aiRationale: "Microsoft's strong positioning in cloud computing (Azure) and AI integration across its product ecosystem provides multiple growth vectors. The company has successfully transformed into a cloud-first business with recurring revenue streams. Its partnership with OpenAI and integration of AI into productivity tools gives it a competitive advantage. Strong balance sheet and consistent dividend growth make it a stable long-term investment.",
    keyMetrics: {
      pe: 36.8,
      marketCap: "3.12T",
      revenueGrowth: 15.3,
      profitMargin: 35.6,
      debtToEquity: 0.35,
      roi: 28.9,
    },
    triggers: ["Azure growth acceleration", "AI integration", "Gaming expansion"],
    risks: ["Regulatory scrutiny", "Cloud competition", "Economic slowdown"],
    sentimentScore: 82,
    expertConsensus: {
      buy: 38,
      hold: 4,
      sell: 0
    },
    technicalSignals: {
      macd: "bullish",
      rsi: 58,
      movingAverages: "bullish",
      supportLevels: [400, 380, 360],
      resistanceLevels: [440, 460, 480]
    },
    alternatives: ["AAPL", "GOOGL", "AMZN"]
  },
  {
    id: 3,
    ticker: "TSLA",
    name: "Tesla, Inc.",
    sector: "Consumer Cyclical",
    industry: "Auto Manufacturers",
    recommendation: "Hold",
    confidenceScore: 65,
    targetPrice: 180.00,
    currentPrice: 175.30,
    upside: 2.68,
    timeHorizon: "6-12 months",
    riskLevel: "High",
    aiRationale: "Tesla faces a mix of positive catalysts and significant challenges. While the company maintains leadership in EV technology and energy storage, increasing competition from traditional automakers and EV startups is pressuring margins. The autonomous driving potential remains strong but regulatory and technical hurdles persist. Recent price cuts have impacted profitability and consumer sentiment has been volatile. Consider maintaining current positions but exercise caution with new capital allocation.",
    keyMetrics: {
      pe: 46.2,
      marketCap: "558B",
      revenueGrowth: 8.8,
      profitMargin: 13.5,
      debtToEquity: 0.15,
      roi: 16.3,
    },
    triggers: ["FSD breakthrough", "Energy business growth", "New model launches"],
    risks: ["Margin pressure", "EV competition", "Executive focus concerns"],
    sentimentScore: 58,
    expertConsensus: {
      buy: 20,
      hold: 15,
      sell: 9
    },
    technicalSignals: {
      macd: "neutral",
      rsi: 52,
      movingAverages: "neutral",
      supportLevels: [160, 150, 140],
      resistanceLevels: [190, 200, 220]
    },
    alternatives: ["GM", "F", "RIVN"]
  },
  {
    id: 4,
    ticker: "V",
    name: "Visa Inc.",
    sector: "Financial Services",
    industry: "Credit Services",
    recommendation: "Buy",
    confidenceScore: 84,
    targetPrice: 310.00,
    currentPrice: 275.80,
    upside: 12.40,
    timeHorizon: "Long-term",
    riskLevel: "Low",
    aiRationale: "Visa's entrenched position in the global payments infrastructure provides a wide economic moat. The ongoing shift to cashless transactions globally continues to drive growth, particularly in emerging markets. The company's high operating margins and capital-light business model generate substantial free cash flow, enabling share repurchases and dividend growth. Visa's investments in fintech partnerships and blockchain technology position it well for future payment evolution.",
    keyMetrics: {
      pe: 28.9,
      marketCap: "562B",
      revenueGrowth: 9.6,
      profitMargin: 56.8,
      debtToEquity: 0.58,
      roi: 28.3,
    },
    triggers: ["International expansion", "Digital payment growth", "B2B payments adoption"],
    risks: ["Regulatory changes", "Fintech disruption", "Economic downturn"],
    sentimentScore: 79,
    expertConsensus: {
      buy: 32,
      hold: 3,
      sell: 0
    },
    technicalSignals: {
      macd: "bullish",
      rsi: 62,
      movingAverages: "bullish",
      supportLevels: [260, 250, 240],
      resistanceLevels: [280, 295, 310]
    },
    alternatives: ["MA", "PYPL", "AXP"]
  },
  {
    id: 5,
    ticker: "COST",
    name: "Costco Wholesale Corporation",
    sector: "Consumer Defensive",
    industry: "Discount Stores",
    recommendation: "Buy",
    confidenceScore: 82,
    targetPrice: 875.00,
    currentPrice: 792.15,
    upside: 10.46,
    timeHorizon: "Long-term",
    riskLevel: "Low",
    aiRationale: "Costco's membership-based business model provides predictable recurring revenue and customer loyalty. The company consistently delivers value to consumers, which becomes particularly attractive during inflationary periods. International expansion offers significant growth potential, with strong performance in existing international markets. Costco's e-commerce capabilities have improved substantially, addressing a previous growth limitation. The company maintains pricing power and operational efficiency advantages over competitors.",
    keyMetrics: {
      pe: 48.6,
      marketCap: "351B",
      revenueGrowth: 7.3,
      profitMargin: 2.7,
      debtToEquity: 0.37,
      roi: 23.6,
    },
    triggers: ["Membership fee increase", "International expansion", "E-commerce growth"],
    risks: ["Valuation concerns", "Margin pressure", "Consumer spending slowdown"],
    sentimentScore: 76,
    expertConsensus: {
      buy: 24,
      hold: 8,
      sell: 1
    },
    technicalSignals: {
      macd: "bullish",
      rsi: 60,
      movingAverages: "bullish",
      supportLevels: [750, 730, 700],
      resistanceLevels: [800, 835, 875]
    },
    alternatives: ["WMT", "TGT", "BJ"]
  },
];

const globalMarketData = [
  {
    region: "North America",
    performance: 12.4,
    sentiment: 76,
    volatility: 18.2,
    opportunities: ["Technology", "Healthcare", "Financial Services"],
    risks: ["Inflation", "Monetary Policy", "Consumer Spending"],
    topPerformers: ["NVDA", "MSFT", "AAPL"]
  },
  {
    region: "Europe",
    performance: 8.7,
    sentiment: 62,
    volatility: 16.5,
    opportunities: ["Industrials", "Consumer Staples", "Renewable Energy"],
    risks: ["Energy Crisis", "Political Instability", "Economic Growth"],
    topPerformers: ["ASML", "NOVO", "LVMH"]
  },
  {
    region: "Asia",
    performance: 7.2,
    sentiment: 59,
    volatility: 22.6,
    opportunities: ["E-commerce", "Semiconductors", "Electric Vehicles"],
    risks: ["Regulatory Changes", "Property Market", "Geopolitical Tensions"],
    topPerformers: ["TSM", "9988.HK", "SONY"]
  },
  {
    region: "Latin America",
    performance: 15.3,
    sentiment: 68,
    volatility: 25.8,
    opportunities: ["Commodities", "Financial", "Utilities"],
    risks: ["Currency Fluctuations", "Political Uncertainty", "Inflation"],
    topPerformers: ["VALE", "ITUB", "CX"]
  }
];

const riskFactors = [
  { name: "Volatility", value: 68 },
  { name: "Market Risk", value: 72 },
  { name: "Credit Risk", value: 45 },
  { name: "Liquidity Risk", value: 38 },
  { name: "Operational Risk", value: 55 },
  { name: "Regulatory Risk", value: 62 },
  { name: "Geopolitical Risk", value: 78 },
  { name: "Interest Rate Risk", value: 85 }
];

const behavioralInsights = [
  {
    id: 1,
    pattern: "Loss Aversion",
    description: "You tend to sell winning positions too early and hold losing positions too long",
    impact: "high",
    recommendation: "Consider implementing trailing stop orders and pre-defined exit strategies",
    detectionConfidence: 85
  },
  {
    id: 2,
    pattern: "Recency Bias",
    description: "Recent market movements appear to heavily influence your trading decisions",
    impact: "medium",
    recommendation: "Focus on long-term trends and fundamentals rather than recent price action",
    detectionConfidence: 78
  },
  {
    id: 3,
    pattern: "Overconfidence",
    description: "Position sizing suggests overconfidence in certain sectors, particularly technology",
    impact: "high",
    recommendation: "Diversify holdings and reduce individual position sizes to manage risk",
    detectionConfidence: 82
  },
  {
    id: 4,
    pattern: "Herd Mentality",
    description: "Trading pattern shows tendency to follow popular investment trends",
    impact: "medium",
    recommendation: "Develop independent investment thesis before entering popular positions",
    detectionConfidence: 71
  }
];

// Get recommendation badge color
const getRecommendationColor = (recommendation: string) => {
  if (recommendation === 'Strong Buy') return 'bg-green-100 text-green-800';
  if (recommendation === 'Buy') return 'bg-emerald-100 text-emerald-800';
  if (recommendation === 'Hold') return 'bg-yellow-100 text-yellow-800';
  if (recommendation === 'Sell') return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800'; // Strong Sell
};

// Get recommendation badge variant
const getRecommendationVariant = (recommendation: string): "default" | "secondary" | "destructive" | "outline" => {
  if (recommendation === 'Strong Buy') return "default";
  if (recommendation === 'Buy') return "secondary";
  if (recommendation === 'Hold') return "outline";
  return "destructive"; // Sell or Strong Sell
};

// Get upside color
const getUpsideColor = (upside: number) => {
  if (upside >= 20) return 'text-green-600';
  if (upside >= 10) return 'text-green-500';
  if (upside >= 0) return 'text-green-400';
  if (upside >= -10) return 'text-red-400';
  return 'text-red-500';
};

// Get MACD signal color
const getMacdColor = (signal: string) => {
  if (signal === 'bullish') return 'text-green-500';
  if (signal === 'neutral') return 'text-yellow-500';
  return 'text-red-500';
};

// Get confidence level text and color
const getConfidenceLevel = (score: number) => {
  if (score >= 85) return { text: 'Very High', color: 'text-green-600' };
  if (score >= 70) return { text: 'High', color: 'text-green-500' };
  if (score >= 50) return { text: 'Moderate', color: 'text-yellow-500' };
  if (score >= 30) return { text: 'Low', color: 'text-orange-500' };
  return { text: 'Very Low', color: 'text-red-500' };
};

export default function AIRecommendations() {
  const [selectedRecommendation, setSelectedRecommendation] = useState<number | null>(1);
  const [riskTolerance, setRiskTolerance] = useState<number[]>([50]);
  const [timeHorizon, setTimeHorizon] = useState("medium");
  const [investmentGoals, setInvestmentGoals] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [filterSector, setFilterSector] = useState("all");
  
  // Simulate loading AI recommendations data
  const { data: recommendationsData, isLoading } = useQuery({
    queryKey: ['/api/ai-recommendations'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        recommendations: aiRecommendations,
        globalMarketData,
        riskFactors,
        behavioralInsights,
        lastUpdated: "2023-12-15T08:30:00Z",
        insightsSummary: "The AI model has detected a moderate risk environment with opportunities in technology, healthcare, and select consumer sectors. Based on your portfolio composition, risk tolerance, and market conditions, the recommendations focus on high-quality growth stocks with reasonable valuations and strong competitive positions. Consider taking profits in some high-momentum positions while adding to defensive holdings to balance portfolio risk.",
      };
    }
  });

  // Filter recommendations based on sector filter
  const filteredRecommendations = recommendationsData?.recommendations.filter(rec => {
    if (filterSector === "all") return true;
    return rec.sector === filterSector;
  }) || [];
  
  // Get current selected recommendation
  const currentRecommendation = selectedRecommendation 
    ? recommendationsData?.recommendations.find(r => r.id === selectedRecommendation)
    : filteredRecommendations[0];

  // Toggle investment goal selection
  const toggleInvestmentGoal = (goal: string) => {
    if (investmentGoals.includes(goal)) {
      setInvestmentGoals(investmentGoals.filter(g => g !== goal));
    } else {
      setInvestmentGoals([...investmentGoals, goal]);
    }
  };

  // Generate custom recommendations
  const generateCustomRecommendations = () => {
    console.log('Generating custom recommendations with:');
    console.log('Risk Tolerance:', riskTolerance[0]);
    console.log('Time Horizon:', timeHorizon);
    console.log('Investment Goals:', investmentGoals);
    console.log('Custom Prompt:', customPrompt);
    // In a real app, this would call a backend API with these parameters
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">AI Investment Recommendations</h1>
            <Badge variant="secondary" className="ml-2">
              <BrainCircuit className="mr-1 h-3.5 w-3.5" />
              AI-Powered
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Personalized investment recommendations powered by advanced AI analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="shrink-0">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="shrink-0">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* AI Insight Summary */}
      <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-violet-100 text-violet-700 mt-1">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">AI Market Insight</h3>
              <p className="text-sm text-muted-foreground">
                {recommendationsData?.insightsSummary}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Last updated: {recommendationsData?.lastUpdated 
                    ? new Date(recommendationsData.lastUpdated).toLocaleString() 
                    : "Loading..."}
                </span>
                <Button variant="link" size="sm" className="h-6 p-0">
                  <HelpCircle className="h-3.5 w-3.5 mr-1" />
                  How this works
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="global">Global Markets</TabsTrigger>
          <TabsTrigger value="geopolitical">Risk Analysis</TabsTrigger>
          <TabsTrigger value="custom">Custom Analysis</TabsTrigger>
        </TabsList>
        
        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Financial Services">Financial Services</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Consumer Defensive">Consumer Defensive</SelectItem>
                  <SelectItem value="Consumer Cyclical">Consumer Cyclical</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
            <div className="flex items-center">
              <Button variant="link" size="sm" className="text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 h-4 w-4"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
                AI Methodology
              </Button>
            </div>
          </div>
          
          {/* Split view - Recommendations list and details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recommendations list */}
            <div className="md:col-span-1 border rounded-lg overflow-hidden">
              <div className="bg-muted p-3 border-b flex justify-between items-center">
                <h3 className="font-medium text-sm">Top AI Recommendations</h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {filteredRecommendations.length} recommendations
                </Badge>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredRecommendations.length === 0 ? (
                  <div className="p-8 text-center">
                    <BrainCircuit className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium text-lg mb-1">No recommendations found</h3>
                    <p className="text-muted-foreground text-sm">
                      Try adjusting your filters or generate new recommendations
                    </p>
                  </div>
                ) : (
                  filteredRecommendations.map(recommendation => (
                    <div 
                      key={recommendation.id}
                      className={`p-3 cursor-pointer transition-colors hover:bg-muted/50
                        ${selectedRecommendation === recommendation.id ? 'bg-muted/50 border-l-4 border-l-primary' : ''}`}
                      onClick={() => setSelectedRecommendation(recommendation.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{recommendation.ticker}</h4>
                          <Badge className={getRecommendationColor(recommendation.recommendation)}>
                            {recommendation.recommendation}
                          </Badge>
                        </div>
                        <div className={`font-medium text-sm ${getUpsideColor(recommendation.upside)}`}>
                          {recommendation.upside > 0 ? '+' : ''}{recommendation.upside.toFixed(1)}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{recommendation.name}</p>
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-muted-foreground">{recommendation.sector}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className={getConfidenceLevel(recommendation.confidenceScore).color}>
                            {recommendation.confidenceScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Recommendation details */}
            <div className="md:col-span-2">
              {currentRecommendation ? (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle>{currentRecommendation.ticker}</CardTitle>
                          <Badge variant={getRecommendationVariant(currentRecommendation.recommendation)}>
                            {currentRecommendation.recommendation}
                          </Badge>
                        </div>
                        <CardDescription className="mt-1">
                          {currentRecommendation.name} • {currentRecommendation.sector} • {currentRecommendation.industry}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Cog className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                          <div className="text-lg font-bold">
                            ${currentRecommendation.currentPrice.toFixed(2)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Target Price</p>
                          <div className="text-lg font-bold">
                            ${currentRecommendation.targetPrice.toFixed(2)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Upside</p>
                          <div className={`text-lg font-bold ${getUpsideColor(currentRecommendation.upside)}`}>
                            {currentRecommendation.upside > 0 ? '+' : ''}{currentRecommendation.upside.toFixed(1)}%
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Time Horizon</p>
                          <div className="text-sm font-medium">
                            {currentRecommendation.timeHorizon}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                          <div className="text-sm font-medium">
                            {currentRecommendation.riskLevel}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                          <div className={`text-sm font-medium ${getConfidenceLevel(currentRecommendation.confidenceScore).color}`}>
                            {currentRecommendation.confidenceScore}% ({getConfidenceLevel(currentRecommendation.confidenceScore).text})
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* AI Rationale */}
                    <div>
                      <h3 className="text-sm font-medium flex items-center mb-2">
                        <BrainCircuit className="h-4 w-4 mr-2 text-violet-500" />
                        AI Analysis Rationale
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentRecommendation.aiRationale}
                      </p>
                    </div>
                    
                    {/* Key Metrics */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Key Financial Metrics</h3>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">P/E Ratio</p>
                          <p className="font-medium">{currentRecommendation.keyMetrics.pe}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Market Cap</p>
                          <p className="font-medium">{currentRecommendation.keyMetrics.marketCap}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Rev. Growth</p>
                          <p className="font-medium">{currentRecommendation.keyMetrics.revenueGrowth}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Profit Margin</p>
                          <p className="font-medium">{currentRecommendation.keyMetrics.profitMargin}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Debt/Equity</p>
                          <p className="font-medium">{currentRecommendation.keyMetrics.debtToEquity}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">ROI</p>
                          <p className="font-medium">{currentRecommendation.keyMetrics.roi}%</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Catalyst & Risks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-green-50 border-green-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-green-800">Potential Catalysts</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {currentRecommendation.triggers.map((trigger, i) => (
                              <li key={i} className="text-sm flex items-center text-green-700">
                                <TrendingUp className="h-3.5 w-3.5 mr-2 text-green-600" />
                                {trigger}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-red-50 border-red-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-red-800">Key Risks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {currentRecommendation.risks.map((risk, i) => (
                              <li key={i} className="text-sm flex items-center text-red-700">
                                <AlertTriangle className="h-3.5 w-3.5 mr-2 text-red-600" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Technical & Sentiment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Technical Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>MACD Signal:</span>
                              <span className={getMacdColor(currentRecommendation.technicalSignals.macd)}>
                                {currentRecommendation.technicalSignals.macd.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>RSI (14):</span>
                              <span className={
                                currentRecommendation.technicalSignals.rsi > 70 ? "text-red-500" :
                                currentRecommendation.technicalSignals.rsi < 30 ? "text-green-500" :
                                "text-yellow-500"
                              }>
                                {currentRecommendation.technicalSignals.rsi}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Moving Averages:</span>
                              <span className={getMacdColor(currentRecommendation.technicalSignals.movingAverages)}>
                                {currentRecommendation.technicalSignals.movingAverages.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Support Levels:</span>
                              <span>
                                {currentRecommendation.technicalSignals.supportLevels.map((level, i) => (
                                  <span key={i}>
                                    ${level}{i < currentRecommendation.technicalSignals.supportLevels.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Resistance Levels:</span>
                              <span>
                                {currentRecommendation.technicalSignals.resistanceLevels.map((level, i) => (
                                  <span key={i}>
                                    ${level}{i < currentRecommendation.technicalSignals.resistanceLevels.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Sentiment & Consensus</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Sentiment Score:</span>
                                <span className={getConfidenceLevel(currentRecommendation.sentimentScore).color}>
                                  {currentRecommendation.sentimentScore}/100
                                </span>
                              </div>
                              <Progress value={currentRecommendation.sentimentScore} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="text-sm mb-2">Expert Consensus:</div>
                              <div className="flex items-center gap-2">
                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center">
                                  <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                                  Buy: {currentRecommendation.expertConsensus.buy}
                                </div>
                                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs flex items-center">
                                  Hold: {currentRecommendation.expertConsensus.hold}
                                </div>
                                <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs flex items-center">
                                  Sell: {currentRecommendation.expertConsensus.sell}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm mb-2">Similar Alternatives:</div>
                              <div className="flex flex-wrap gap-2">
                                {currentRecommendation.alternatives.map((alt, i) => (
                                  <Badge key={i} variant="outline" className="cursor-pointer hover:bg-muted">
                                    {alt}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                      <Button>
                        Add to Watchlist
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-10 border rounded-lg">
                  <Search className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Recommendation Selected</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Select a recommendation from the list to view detailed analysis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Global Markets Tab */}
        <TabsContent value="global">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-medium">Global Market Analysis</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter Regions
              </Button>
              <Button variant="outline" size="sm">
                <Clock className="mr-2 h-4 w-4" />
                Historical View
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Regional Performance</CardTitle>
                <CardDescription>
                  Year-to-date performance by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={recommendationsData?.globalMarketData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                      <Bar dataKey="performance" fill="#6366F1" name="YTD Performance" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Regional Risk Profile</CardTitle>
                <CardDescription>
                  Sentiment, volatility, and market opportunity analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={recommendationsData?.globalMarketData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="region" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Sentiment" dataKey="sentiment" stroke="#22C55E" fill="#22C55E" fillOpacity={0.5} />
                      <Radar name="Volatility" dataKey="volatility" stroke="#F97316" fill="#F97316" fillOpacity={0.5} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            {recommendationsData?.globalMarketData.map((region, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <CardTitle>{region.region}</CardTitle>
                    </div>
                    <Badge variant={region.performance > 10 ? "default" : "secondary"}>
                      {region.performance}% YTD
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-sm">Top Opportunities</h4>
                      </div>
                      <div className="space-y-1">
                        {region.opportunities.map((opp, j) => (
                          <div key={j} className="text-sm pl-6">• {opp}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                        <h4 className="font-medium text-sm">Key Risks</h4>
                      </div>
                      <div className="space-y-1">
                        {region.risks.map((risk, j) => (
                          <div key={j} className="text-sm pl-6">• {risk}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <h4 className="font-medium text-sm">Top Performers</h4>
                      </div>
                      <div className="space-y-1">
                        {region.topPerformers.map((performer, j) => (
                          <div key={j} className="text-sm pl-6">• {performer}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Detailed Analysis
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Geopolitical & Risk Tab */}
        <TabsContent value="geopolitical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Risk Factor Analysis</CardTitle>
                <CardDescription>
                  Current market risk assessment by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={recommendationsData?.riskFactors}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar 
                        name="Risk Level" 
                        dataKey="value" 
                        stroke="#EF4444" 
                        fill="#EF4444" 
                        fillOpacity={0.5} 
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Behavioral Investing Analysis</CardTitle>
                <CardDescription>
                  AI-detected behavioral patterns in your investment decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendationsData?.behavioralInsights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                      <div className={`p-2 rounded-md shrink-0 
                        ${insight.impact === 'high' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-yellow-100 text-yellow-600'}`}
                      >
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{insight.pattern}</h4>
                          <Badge variant={insight.impact === 'high' ? "destructive" : "outline"}>
                            {insight.impact.toUpperCase()} IMPACT
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{insight.description}</p>
                        <p className="text-sm font-medium">Recommendation: {insight.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Current Market Conditions Assessment</CardTitle>
              <CardDescription>
                Aggregated analysis of market indicators and risk factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Current Risk Assessment</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Market Volatility</span>
                          <span className="font-medium">Elevated (68/100)</span>
                        </div>
                        <Progress value={68} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Liquidity Conditions</span>
                          <span className="font-medium">Moderate (54/100)</span>
                        </div>
                        <Progress value={54} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Credit Risk</span>
                          <span className="font-medium">Low (32/100)</span>
                        </div>
                        <Progress value={32} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Geopolitical Risks</span>
                          <span className="font-medium">High (78/100)</span>
                        </div>
                        <Progress value={78} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Policy Uncertainty</span>
                          <span className="font-medium">Elevated (72/100)</span>
                        </div>
                        <Progress value={72} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Current Macroeconomic Outlook</h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-800 p-1 rounded">GDP Growth:</span>
                        <span>Expected to moderate to 2.2% globally in next 12 months</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-800 p-1 rounded">Inflation:</span>
                        <span>Trending downward but still above central bank targets</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-800 p-1 rounded">Interest Rates:</span>
                        <span>Peaking, with potential cuts in second half of year</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-800 p-1 rounded">Labor Markets:</span>
                        <span>Resilient but showing signs of softening</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Key Risk Factors</h3>
                    <div className="space-y-2">
                      <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-700">Monetary Policy Transition</p>
                              <p className="text-xs text-red-600">
                                Central banks transitioning from tightening to neutral stance creates policy uncertainty
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-700">Elevated Geopolitical Tensions</p>
                              <p className="text-xs text-red-600">
                                Multiple regional conflicts creating supply chain disruptions and market uncertainty
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-700">AI Regulatory Environment</p>
                              <p className="text-xs text-red-600">
                                Evolving regulations around AI adoption creating uncertainty for tech sector valuations
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Portfolio Implications</h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-start gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>Consider increasing allocation to high-quality defensive stocks</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>Maintain exposure to sectors benefiting from secular growth trends</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>Consider tactical allocation to fixed income as rates stabilize</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <span>Reduce exposure to highly leveraged companies</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <span>Avoid excessive concentration in geopolitically sensitive sectors</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Full Risk Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Custom Analysis Tab */}
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Generate Custom AI Investment Analysis</CardTitle>
              <CardDescription>
                Set your preferences and the AI will generate tailored investment recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="risk-tolerance" className="mb-2 block">
                    Risk Tolerance
                  </Label>
                  <div className="space-y-4">
                    <Slider
                      id="risk-tolerance"
                      value={riskTolerance}
                      onValueChange={setRiskTolerance}
                      min={0}
                      max={100}
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div>Conservative</div>
                      <div>Moderate</div>
                      <div>Aggressive</div>
                    </div>
                    <div className="text-sm">
                      Current setting: <span className="font-medium">
                        {riskTolerance[0] < 30 ? 'Conservative' : 
                         riskTolerance[0] < 70 ? 'Moderate' : 
                         'Aggressive'}
                      </span> ({riskTolerance[0]}/100)
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="time-horizon" className="mb-2 block">
                    Investment Time Horizon
                  </Label>
                  <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                    <SelectTrigger id="time-horizon">
                      <SelectValue placeholder="Select time horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short Term (0-2 years)</SelectItem>
                      <SelectItem value="medium">Medium Term (2-5 years)</SelectItem>
                      <SelectItem value="long">Long Term (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">
                  Investment Goals
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  <Card 
                    className={`cursor-pointer border ${investmentGoals.includes('growth') ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => toggleInvestmentGoal('growth')}
                  >
                    <CardContent className="p-4 flex gap-3 items-center">
                      <TrendingUp className={investmentGoals.includes('growth') ? 'text-primary' : 'text-muted-foreground'} />
                      <div>
                        <h4 className="font-medium text-sm">Capital Growth</h4>
                        <p className="text-xs text-muted-foreground">Focus on appreciation</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer border ${investmentGoals.includes('income') ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => toggleInvestmentGoal('income')}
                  >
                    <CardContent className="p-4 flex gap-3 items-center">
                      <CircleDollarSign className={investmentGoals.includes('income') ? 'text-primary' : 'text-muted-foreground'} />
                      <div>
                        <h4 className="font-medium text-sm">Income Generation</h4>
                        <p className="text-xs text-muted-foreground">Focus on yield</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer border ${investmentGoals.includes('preservation') ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => toggleInvestmentGoal('preservation')}
                  >
                    <CardContent className="p-4 flex gap-3 items-center">
                      <ShieldAlert className={investmentGoals.includes('preservation') ? 'text-primary' : 'text-muted-foreground'} />
                      <div>
                        <h4 className="font-medium text-sm">Capital Preservation</h4>
                        <p className="text-xs text-muted-foreground">Focus on safety</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <Label htmlFor="custom-prompt" className="mb-2 block">
                  Custom Instructions (Optional)
                </Label>
                <Textarea 
                  id="custom-prompt"
                  placeholder="Add any specific preferences, focus areas, or constraints for your investment analysis..."
                  className="min-h-[100px]"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Switch id="include-portfolio" />
                  <Label htmlFor="include-portfolio">Include current portfolio in analysis</Label>
                </div>
                <Button onClick={generateCustomRecommendations}>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Generate Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}