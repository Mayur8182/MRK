import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  BarChart,
  BarChart3,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  FileDown,
  Filter,
  LineChart,
  Newspaper,
  PieChart,
  Plus,
  RefreshCcw,
  Search,
  Share2,
  Twitter,
  Link,
  Linkedin,
  Globe,
  TrendingUp,
  TrendingDown,
  BarChartHorizontal
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
  AreaChart as ReAreaChart,
  Area,
  LineChart as ReLineChart,
  Line,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";

// Sample data for sentiment analysis
const marketSentimentData = [
  { date: "2023-12-01", sentiment: 0.65, volume: 5400 },
  { date: "2023-12-02", sentiment: 0.58, volume: 4800 },
  { date: "2023-12-03", sentiment: 0.62, volume: 5200 },
  { date: "2023-12-04", sentiment: 0.71, volume: 6100 },
  { date: "2023-12-05", sentiment: 0.68, volume: 5800 },
  { date: "2023-12-06", sentiment: 0.53, volume: 4300 },
  { date: "2023-12-07", sentiment: 0.48, volume: 4000 },
  { date: "2023-12-08", sentiment: 0.42, volume: 3800 },
  { date: "2023-12-09", sentiment: 0.39, volume: 3500 },
  { date: "2023-12-10", sentiment: 0.45, volume: 4100 },
  { date: "2023-12-11", sentiment: 0.52, volume: 4500 },
  { date: "2023-12-12", sentiment: 0.59, volume: 5000 },
  { date: "2023-12-13", sentiment: 0.64, volume: 5300 },
  { date: "2023-12-14", sentiment: 0.69, volume: 5900 },
  { date: "2023-12-15", sentiment: 0.72, volume: 6200 },
];

const assetSentimentData = [
  { symbol: "AAPL", name: "Apple Inc.", sentiment: 0.78, change: 0.05, mentions: 2340 },
  { symbol: "MSFT", name: "Microsoft Corporation", sentiment: 0.72, change: 0.03, mentions: 1980 },
  { symbol: "GOOGL", name: "Alphabet Inc.", sentiment: 0.65, change: -0.02, mentions: 1650 },
  { symbol: "AMZN", name: "Amazon.com, Inc.", sentiment: 0.61, change: 0.04, mentions: 1820 },
  { symbol: "META", name: "Meta Platforms, Inc.", sentiment: 0.54, change: -0.07, mentions: 1540 },
  { symbol: "TSLA", name: "Tesla, Inc.", sentiment: 0.67, change: 0.09, mentions: 2120 },
  { symbol: "NVDA", name: "NVIDIA Corporation", sentiment: 0.82, change: 0.06, mentions: 1780 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sentiment: 0.58, change: 0.01, mentions: 920 },
  { symbol: "V", name: "Visa Inc.", sentiment: 0.63, change: 0.00, mentions: 780 },
  { symbol: "PG", name: "Procter & Gamble Co.", sentiment: 0.59, change: -0.01, mentions: 620 },
];

const newsSentimentData = [
  {
    id: 1,
    title: "Fed Signals Potential Rate Cuts in 2024",
    source: "Financial Times",
    timestamp: "2023-12-15T10:30:00Z",
    sentiment: 0.75,
    impact: "high",
    summary: "Federal Reserve officials indicated they could cut interest rates by 0.75 percentage points next year, signaling a pivot in monetary policy that sent stocks sharply higher.",
    url: "https://www.ft.com/example",
    relatedAssets: ["SPY", "QQQ", "IWM", "DIA"]
  },
  {
    id: 2,
    title: "Tech Sector Faces Regulatory Scrutiny",
    source: "Wall Street Journal",
    timestamp: "2023-12-14T14:15:00Z",
    sentiment: 0.35,
    impact: "medium",
    summary: "Major tech companies are facing increased regulatory scrutiny as lawmakers propose new antitrust legislation targeting market dominance and competitive practices.",
    url: "https://www.wsj.com/example",
    relatedAssets: ["AAPL", "MSFT", "GOOGL", "AMZN", "META"]
  },
  {
    id: 3,
    title: "Renewable Energy Investments Surge",
    source: "Bloomberg",
    timestamp: "2023-12-13T09:45:00Z",
    sentiment: 0.82,
    impact: "medium",
    summary: "Global investments in renewable energy reached record highs this quarter, driven by favorable government policies and declining costs of solar and wind technologies.",
    url: "https://www.bloomberg.com/example",
    relatedAssets: ["TAN", "FAN", "ICLN", "NEE", "ENPH"]
  },
  {
    id: 4,
    title: "Supply Chain Disruptions Ease",
    source: "Reuters",
    timestamp: "2023-12-12T11:20:00Z",
    sentiment: 0.68,
    impact: "medium",
    summary: "Global supply chain disruptions are showing signs of easing as shipping rates normalize and manufacturing capacity returns to pre-pandemic levels.",
    url: "https://www.reuters.com/example",
    relatedAssets: ["FDX", "UPS", "MAERSK", "SBLK"]
  },
  {
    id: 5,
    title: "AI Chip Demand Outpaces Supply",
    source: "CNBC",
    timestamp: "2023-12-11T13:30:00Z",
    sentiment: 0.71,
    impact: "high",
    summary: "Semiconductor manufacturers are struggling to meet unprecedented demand for AI-specific chips, creating potential bottlenecks for tech companies' AI initiatives.",
    url: "https://www.cnbc.com/example",
    relatedAssets: ["NVDA", "AMD", "INTC", "TSM"]
  },
];

const socialMediaTrendsData = [
  { platform: "Twitter", positive: 32, neutral: 45, negative: 23 },
  { platform: "Reddit", positive: 28, neutral: 47, negative: 25 },
  { platform: "StockTwits", positive: 36, neutral: 41, negative: 23 },
  { platform: "LinkedIn", positive: 41, neutral: 48, negative: 11 },
  { platform: "YouTube", positive: 35, neutral: 44, negative: 21 },
];

const keywordSentimentData = [
  { keyword: "inflation", sentiment: 0.35, volume: 12500, change: -0.08 },
  { keyword: "recession", sentiment: 0.28, volume: 9800, change: -0.05 },
  { keyword: "interest rates", sentiment: 0.42, volume: 8700, change: 0.12 },
  { keyword: "AI", sentiment: 0.82, volume: 15600, change: 0.06 },
  { keyword: "crypto", sentiment: 0.61, volume: 7300, change: 0.15 },
  { keyword: "earnings", sentiment: 0.59, volume: 6200, change: 0.03 },
  { keyword: "layoffs", sentiment: 0.22, volume: 5400, change: -0.11 },
  { keyword: "dividends", sentiment: 0.71, volume: 4100, change: 0.02 },
  { keyword: "buybacks", sentiment: 0.65, volume: 3800, change: 0.04 },
  { keyword: "IPO", sentiment: 0.58, volume: 5200, change: 0.09 },
];

// Get sentiment color based on score
const getSentimentColor = (sentiment: number) => {
  if (sentiment >= 0.7) return "text-green-500";
  if (sentiment >= 0.5) return "text-green-400";
  if (sentiment >= 0.4) return "text-yellow-500";
  if (sentiment >= 0.3) return "text-orange-500";
  return "text-red-500";
};

// Get sentiment label based on score
const getSentimentLabel = (sentiment: number) => {
  if (sentiment >= 0.7) return "Very Positive";
  if (sentiment >= 0.5) return "Positive";
  if (sentiment >= 0.4) return "Neutral";
  if (sentiment >= 0.3) return "Negative";
  return "Very Negative";
};

// Get sentiment badge variant based on score
const getSentimentBadgeVariant = (sentiment: number): "default" | "secondary" | "destructive" | "outline" => {
  if (sentiment >= 0.7) return "default";
  if (sentiment >= 0.5) return "secondary";
  if (sentiment >= 0.4) return "outline";
  return "destructive";
};

// Format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export default function SentimentAnalysis() {
  const [timeframe, setTimeframe] = useState("1w");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<string | null>("AAPL");
  
  // Simulate loading sentiment data
  const { data: sentimentData, isLoading } = useQuery({
    queryKey: ['/api/sentiment-analysis'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        marketSentiment: marketSentimentData,
        assetSentiment: assetSentimentData,
        newsSentiment: newsSentimentData,
        socialMediaTrends: socialMediaTrendsData,
        keywordSentiment: keywordSentimentData,
        overallMarketSentiment: 0.62,
        overallSentimentChange: 0.04,
        analysisSummary: "Market sentiment is moderately positive, with technology and energy sectors showing the strongest positive signals. Recent Federal Reserve comments about potential rate cuts have improved investor confidence. Social media discussion around AI continues to show highly positive sentiment.",
        lastUpdated: "2023-12-15T16:30:00Z"
      };
    }
  });

  // Filter assets based on search
  const filteredAssets = sentimentData?.assetSentiment.filter(asset => {
    if (!searchTerm) return true;
    return asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
           asset.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get current selected asset data
  const selectedAssetData = sentimentData?.assetSentiment.find(asset => 
    asset.symbol === selectedAsset
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News & Social Media Sentiment</h1>
          <p className="text-muted-foreground">
            AI-powered sentiment analysis from news, social media, and market data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="1w">1 Week</SelectItem>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="shrink-0">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="shrink-0">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Sentiment Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`text-xl font-bold ${getSentimentColor(sentimentData?.overallMarketSentiment || 0.5)}`}>
                  Market Sentiment: {((sentimentData?.overallMarketSentiment || 0) * 100).toFixed(0)}% 
                  {sentimentData?.overallSentimentChange && sentimentData.overallSentimentChange > 0 ? (
                    <span className="text-green-500 ml-2 text-sm">
                      <TrendingUp className="inline h-4 w-4 mr-1" />
                      +{(sentimentData.overallSentimentChange * 100).toFixed(0)}%
                    </span>
                  ) : (
                    <span className="text-red-500 ml-2 text-sm">
                      <TrendingDown className="inline h-4 w-4 mr-1" />
                      {(sentimentData?.overallSentimentChange * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <Badge variant={getSentimentBadgeVariant(sentimentData?.overallMarketSentiment || 0.5)}>
                  {getSentimentLabel(sentimentData?.overallMarketSentiment || 0.5)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {sentimentData?.analysisSummary}
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                Last updated: {sentimentData?.lastUpdated ? new Date(sentimentData.lastUpdated).toLocaleString() : ""}
              </div>
            </div>
            <div className="w-full md:w-[300px] h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentData?.marketSentiment.slice(-7)}>
                  <YAxis domain={[0, 1]} hide />
                  <Line 
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip 
                    formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, 'Sentiment']}
                    labelFormatter={(label) => `Date: ${label}`} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="market" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="market">Market Sentiment</TabsTrigger>
          <TabsTrigger value="assets">Assets Sentiment</TabsTrigger>
          <TabsTrigger value="news">News Analysis</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>
        
        {/* Market Sentiment Tab */}
        <TabsContent value="market">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Market Sentiment Trend</CardTitle>
                <CardDescription>
                  Sentiment analysis of market discourse over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReAreaChart data={sentimentData?.marketSentiment}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis 
                        domain={[0, 1]} 
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                        label={{ value: 'Sentiment', angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip 
                        formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, 'Sentiment']}
                        labelFormatter={(label) => `Date: ${label}`} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sentiment" 
                        stroke="#10B981" 
                        fill="#10B98133" 
                        name="Sentiment Score"
                      />
                    </ReAreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Keyword Sentiment</CardTitle>
                <CardDescription>
                  Sentiment analysis of key market terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart 
                      data={sentimentData?.keywordSentiment.slice(0, 6)} 
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        domain={[0, 1]} 
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} 
                      />
                      <YAxis 
                        dataKey="keyword" 
                        type="category" 
                        width={100} 
                      />
                      <Tooltip 
                        formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, 'Sentiment']}
                      />
                      <Bar 
                        dataKey="sentiment" 
                        name="Sentiment" 
                        fill={(entry) => {
                          const sentiment = entry.sentiment;
                          if (sentiment >= 0.7) return "#10B981";
                          if (sentiment >= 0.5) return "#22C55E";
                          if (sentiment >= 0.4) return "#F59E0B";
                          if (sentiment >= 0.3) return "#F97316";
                          return "#EF4444";
                        }}
                      />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Keyword Trends</CardTitle>
                <CardDescription>
                  Commonly mentioned keywords and their sentiment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-6 text-xs font-medium text-muted-foreground bg-muted p-3">
                    <div>Keyword</div>
                    <div className="col-span-2">Sentiment</div>
                    <div>Volume</div>
                    <div>Change</div>
                    <div>Action</div>
                  </div>
                  <div className="divide-y">
                    {sentimentData?.keywordSentiment.map((keyword, i) => (
                      <div key={i} className="grid grid-cols-6 p-3 items-center text-sm">
                        <div className="font-medium">{keyword.keyword}</div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <div className={`font-medium ${getSentimentColor(keyword.sentiment)}`}>
                              {(keyword.sentiment * 100).toFixed(0)}%
                            </div>
                            <Badge variant={getSentimentBadgeVariant(keyword.sentiment)}>
                              {getSentimentLabel(keyword.sentiment)}
                            </Badge>
                          </div>
                        </div>
                        <div>{keyword.volume.toLocaleString()}</div>
                        <div className={keyword.change >= 0 ? "text-green-500" : "text-red-500"}>
                          {keyword.change >= 0 ? "+" : ""}{(keyword.change * 100).toFixed(0)}%
                        </div>
                        <div>
                          <Button variant="outline" size="sm">Explore</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Assets Sentiment Tab */}
        <TabsContent value="assets">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Assets Sentiment</CardTitle>
                  <CardDescription>
                    Sentiment analysis by asset
                  </CardDescription>
                  <div className="mt-2">
                    <Input 
                      placeholder="Search assets..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y max-h-[500px] overflow-y-auto">
                    {filteredAssets?.map((asset, i) => (
                      <div 
                        key={i}
                        className={`p-3 cursor-pointer transition-colors hover:bg-muted/50
                          ${selectedAsset === asset.symbol ? 'bg-muted/50 border-l-4 border-l-primary' : ''}`}
                        onClick={() => setSelectedAsset(asset.symbol)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-medium text-sm">{asset.symbol}</h4>
                            <p className="text-xs text-muted-foreground">{asset.name}</p>
                          </div>
                          <Badge variant={getSentimentBadgeVariant(asset.sentiment)}>
                            {(asset.sentiment * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs mt-2">
                          <div className={asset.change >= 0 ? "text-green-500" : "text-red-500"}>
                            {asset.change >= 0 ? (
                              <TrendingUp className="inline h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="inline h-3 w-3 mr-1" />
                            )}
                            {asset.change >= 0 ? "+" : ""}{(asset.change * 100).toFixed(0)}%
                          </div>
                          <div className="text-muted-foreground">
                            {asset.mentions.toLocaleString()} mentions
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {selectedAssetData ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedAssetData.symbol}</CardTitle>
                        <CardDescription className="mt-1">
                          {selectedAssetData.name}
                        </CardDescription>
                      </div>
                      <Badge variant={getSentimentBadgeVariant(selectedAssetData.sentiment)}>
                        Sentiment: {(selectedAssetData.sentiment * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sentiment Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Sentiment Score</p>
                          <div className={`text-xl font-bold ${getSentimentColor(selectedAssetData.sentiment)}`}>
                            {(selectedAssetData.sentiment * 100).toFixed(0)}%
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {getSentimentLabel(selectedAssetData.sentiment)}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Sentiment Change</p>
                          <div className={`text-xl font-bold ${selectedAssetData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {selectedAssetData.change >= 0 ? "+" : ""}{(selectedAssetData.change * 100).toFixed(0)}%
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Past 24 hours
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Social Mentions</p>
                          <div className="text-xl font-bold">
                            {selectedAssetData.mentions.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Across all platforms
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Placeholder charts - in a real app these would show asset-specific sentiment data */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Sentiment History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <ReAreaChart data={sentimentData?.marketSentiment}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                              <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, 'Sentiment']} />
                              <Area 
                                type="monotone" 
                                dataKey="sentiment" 
                                stroke="#6366F1" 
                                fill="#6366F133" 
                                name="Sentiment"
                              />
                            </ReAreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Related News */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Related News</h3>
                      <div className="space-y-3">
                        {sentimentData?.newsSentiment.slice(0, 3).map((news, i) => (
                          <Card key={i} className="bg-muted/30">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full 
                                  ${getSentimentBadgeVariant(news.sentiment) === 'default' 
                                    ? 'bg-green-100 text-green-600' 
                                    : getSentimentBadgeVariant(news.sentiment) === 'secondary'
                                      ? 'bg-green-50 text-green-500'
                                      : getSentimentBadgeVariant(news.sentiment) === 'outline'
                                        ? 'bg-yellow-50 text-yellow-500'
                                        : 'bg-red-50 text-red-500'
                                  }`}
                                >
                                  <Newspaper className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-sm">{news.title}</h4>
                                    <Badge variant={getSentimentBadgeVariant(news.sentiment)} className="ml-2">
                                      {(news.sentiment * 100).toFixed(0)}%
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {news.source} • {formatRelativeTime(news.timestamp)}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-10 border rounded-lg">
                  <Search className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Asset Selected</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Select an asset from the list to view detailed sentiment analysis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* News Analysis Tab */}
        <TabsContent value="news">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-medium">Recent News Sentiment Analysis</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {sentimentData?.newsSentiment.map((news, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 p-3 rounded-md mt-1 
                      ${getSentimentBadgeVariant(news.sentiment) === 'default' 
                        ? 'bg-green-100 text-green-600' 
                        : getSentimentBadgeVariant(news.sentiment) === 'secondary'
                          ? 'bg-green-50 text-green-500'
                          : getSentimentBadgeVariant(news.sentiment) === 'outline'
                            ? 'bg-yellow-50 text-yellow-500'
                            : 'bg-red-50 text-red-500'
                      }`}
                    >
                      <Newspaper className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <h4 className="font-medium">{news.title}</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={getSentimentBadgeVariant(news.sentiment)}>
                            {getSentimentLabel(news.sentiment)}
                          </Badge>
                          <Badge variant="outline">
                            {news.impact.toUpperCase()} IMPACT
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{news.summary}</p>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-medium">{news.source}</span>
                          <span>•</span>
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatRelativeTime(news.timestamp)}</span>
                        </div>
                        <div className="flex gap-2">
                          {news.relatedAssets.map((asset, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {asset}
                            </Badge>
                          ))}
                          <Button variant="outline" size="sm" asChild>
                            <a href={news.url} target="_blank" rel="noopener noreferrer">
                              <Link className="mr-2 h-4 w-4" />
                              Read
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button>
              Load More News
            </Button>
          </div>
        </TabsContent>
        
        {/* Social Media Tab */}
        <TabsContent value="social">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Social Media Sentiment</CardTitle>
                <CardDescription>
                  Sentiment breakdown by social platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={sentimentData?.socialMediaTrends} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="platform" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="positive" name="Positive" stackId="a" fill="#10B981" />
                      <Bar dataKey="neutral" name="Neutral" stackId="a" fill="#6B7280" />
                      <Bar dataKey="negative" name="Negative" stackId="a" fill="#EF4444" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Sentiment vs. Mentions</CardTitle>
                <CardDescription>
                  Relationship between sentiment and discussion volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis 
                        type="number" 
                        dataKey="sentiment" 
                        name="Sentiment" 
                        domain={[0, 1]}
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="mentions" 
                        name="Mentions" 
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "Sentiment") return [`${(Number(value) * 100).toFixed(0)}%`, name];
                          return [value, name];
                        }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded shadow-sm">
                                <p className="font-semibold">{data.symbol}</p>
                                <p className="text-sm">Sentiment: {(data.sentiment * 100).toFixed(0)}%</p>
                                <p className="text-sm">Mentions: {data.mentions.toLocaleString()}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter 
                        name="Assets" 
                        data={sentimentData?.assetSentiment} 
                        fill={(entry) => {
                          const sentiment = entry.sentiment;
                          if (sentiment >= 0.7) return "#10B981";
                          if (sentiment >= 0.5) return "#22C55E";
                          if (sentiment >= 0.4) return "#F59E0B";
                          if (sentiment >= 0.3) return "#F97316";
                          return "#EF4444";
                        }}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-base">Twitter/X</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sentiment Score</span>
                    <span className="font-medium text-green-500">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Mentions</span>
                    <span className="font-medium">12,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trending Topics</span>
                    <span className="font-medium">AI, Tech Stocks</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BarChartHorizontal className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-base">Reddit</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sentiment Score</span>
                    <span className="font-medium text-yellow-500">54%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Mentions</span>
                    <span className="font-medium">9,780</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trending Topics</span>
                    <span className="font-medium">Crypto, Meme Stocks</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base">LinkedIn</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sentiment Score</span>
                    <span className="font-medium text-green-500">75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Mentions</span>
                    <span className="font-medium">6,320</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trending Topics</span>
                    <span className="font-medium">Finance, Banking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}