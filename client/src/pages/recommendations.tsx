import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  AreaChart,
  ArrowDownRight,
  ArrowUpRight,
  BarChart,
  BarChart3,
  Briefcase,
  Calculator,
  ChevronRight,
  CircleDollarSign,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  Filter,
  Globe,
  Info,
  Lightbulb,
  LineChart,
  LineChart as LineChartIcon,
  PercentCircle,
  PieChart,
  PieChart as PieChartIcon,
  Plus,
  Receipt,
  RefreshCcw,
  RefreshCw,
  Search,
  Shuffle,
  Star,
  ThumbsUp,
  TrendingUp,
  Zap,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface RecommendationCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  metrics: {
    label: string;
    value: string;
  }[];
  action: string;
}

function RecommendationCard({ 
  icon: Icon, 
  iconColor, 
  title, 
  description, 
  metrics, 
  action 
}: RecommendationCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-md ${iconColor} bg-opacity-15`}>
              <Icon className={`h-5 w-5 ${iconColor.replace('bg-', 'text-')}`} />
            </div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">Recommended</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {metrics.map((metric, i) => (
            <div key={i} className="space-y-1">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="font-medium">{metric.value}</p>
            </div>
          ))}
        </div>
        
        <Button variant="outline" size="sm" className="w-full">
          {action}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Sample data for sentiment analysis
const sentimentAnalysisData = [
  {
    asset: "AAPL",
    name: "Apple Inc.",
    overallSentiment: 78, // 0-100 scale
    change: 5.3,
    trend: "up",
    sources: {
      news: 82,
      social: 75,
      blogs: 76,
      forums: 68
    },
    keyTopics: ["iPhone sales", "AI integration", "App Store revenue", "China market"],
    recentHeadlines: [
      "Apple's AI Strategy Impresses Investors and Analysts",
      "New iPhone Production Increases Amid Strong Demand",
      "App Store Revenue Hits Record High in Q3"
    ]
  },
  {
    asset: "MSFT",
    name: "Microsoft Corporation",
    overallSentiment: 83,
    change: 7.2,
    trend: "up",
    sources: {
      news: 86,
      social: 80,
      blogs: 84,
      forums: 78
    },
    keyTopics: ["Cloud growth", "AI investments", "Enterprise adoption", "Azure expansion"],
    recentHeadlines: [
      "Microsoft Azure Growth Exceeds Expectations",
      "Enterprise AI Adoption Accelerates Microsoft Revenue",
      "New Cloud Infrastructure Investments Announced"
    ]
  },
  {
    asset: "AMZN",
    name: "Amazon.com, Inc.",
    overallSentiment: 72,
    change: -2.1,
    trend: "down",
    sources: {
      news: 70,
      social: 74,
      blogs: 68,
      forums: 76
    },
    keyTopics: ["E-commerce trends", "AWS performance", "Logistics costs", "Competitive landscape"],
    recentHeadlines: [
      "Amazon Faces Increasing Competition in E-commerce Space",
      "AWS Remains Strong Despite Cloud Spending Slowdown",
      "New Fulfillment Centers to Improve Delivery Times"
    ]
  },
  {
    asset: "GOOGL",
    name: "Alphabet Inc.",
    overallSentiment: 75,
    change: 3.6,
    trend: "up",
    sources: {
      news: 78,
      social: 72,
      blogs: 74,
      forums: 70
    },
    keyTopics: ["Ad revenue", "AI developments", "Regulatory concerns", "Search market share"],
    recentHeadlines: [
      "Google's AI-Powered Search Drives Engagement",
      "Digital Ad Spending Returns to Growth, Boosting Alphabet",
      "Antitrust Concerns Remain But Impact Appears Limited"
    ]
  },
  {
    asset: "META",
    name: "Meta Platforms, Inc.",
    overallSentiment: 65,
    change: 8.4,
    trend: "up",
    sources: {
      news: 68,
      social: 62,
      blogs: 64,
      forums: 66
    },
    keyTopics: ["Ad targeting", "Metaverse investments", "User engagement", "Threads platform"],
    recentHeadlines: [
      "Meta's Cost Cutting Measures Boost Profitability",
      "Instagram Growth Continues Despite Competition",
      "Threads Sees Increasing User Adoption"
    ]
  }
];

// Global markets data
const globalMarketsData = {
  regions: [
    {
      name: "North America",
      sentiment: 74,
      change: 2.3,
      trend: "up",
      topMarkets: [
        { market: "S&P 500", performance: 3.2, sentiment: 73 },
        { market: "NASDAQ", performance: 4.1, sentiment: 75 },
        { market: "TSX", performance: 1.8, sentiment: 68 }
      ]
    },
    {
      name: "Europe",
      sentiment: 68,
      change: -1.2,
      trend: "down",
      topMarkets: [
        { market: "FTSE 100", performance: -0.8, sentiment: 65 },
        { market: "DAX", performance: -1.5, sentiment: 62 },
        { market: "CAC 40", performance: -1.2, sentiment: 64 }
      ]
    },
    {
      name: "Asia-Pacific",
      sentiment: 71,
      change: 3.7,
      trend: "up",
      topMarkets: [
        { market: "Nikkei 225", performance: 4.2, sentiment: 74 },
        { market: "Hang Seng", performance: 2.8, sentiment: 68 },
        { market: "ASX 200", performance: 1.9, sentiment: 72 }
      ]
    }
  ],
  geopoliticalRisks: [
    {
      region: "Middle East",
      riskLevel: "High",
      impact: "Moderate",
      factors: ["Regional tensions", "Oil supply disruptions"],
      sentiment: 42
    },
    {
      region: "East Asia",
      riskLevel: "Moderate",
      impact: "Low-Moderate",
      factors: ["Trade negotiations", "Technology restrictions"],
      sentiment: 56
    },
    {
      region: "Eastern Europe",
      riskLevel: "Moderate-High",
      impact: "Moderate",
      factors: ["Regional conflicts", "Energy supply concerns"],
      sentiment: 48
    }
  ],
  behavioralInsights: [
    {
      metric: "Market Fear/Greed Index",
      value: 65,
      interpretation: "Mild Greed",
      recommendation: "Consider taking some profits in overextended positions"
    },
    {
      metric: "Investor Sentiment Survey",
      value: 58,
      interpretation: "Moderately Bullish",
      recommendation: "Maintain balanced exposure but be selective with new positions"
    },
    {
      metric: "Retail Trading Volume",
      value: "Elevated",
      interpretation: "Potential froth in certain segments",
      recommendation: "Focus on quality companies with solid fundamentals"
    }
  ]
};

// Tax optimization opportunities
const taxOptimizationData = [
  {
    type: "Tax-Loss Harvesting",
    potential: "High",
    estimatedSavings: "$3,250",
    positions: [
      { symbol: "VZ", name: "Verizon", loss: "$1,840", replacementIdea: "T (AT&T) or TMUS (T-Mobile)" },
      { symbol: "INTC", name: "Intel", loss: "$1,250", replacementIdea: "AMD or NVDA" },
      { symbol: "CVX", name: "Chevron", loss: "$960", replacementIdea: "XOM or BP" }
    ],
    considerations: "30-day wash sale rule applies; consider sector ETFs as alternatives"
  },
  {
    type: "Tax-Efficient Asset Location",
    potential: "Medium",
    estimatedSavings: "$1,850/year",
    recommendations: [
      "Move dividend stocks to tax-advantaged accounts",
      "Keep growth stocks in taxable accounts for long-term capital gains",
      "Consider municipal bonds for taxable accounts"
    ],
    considerations: "Balance tax considerations with overall asset allocation targets"
  },
  {
    type: "Tax-Efficient Withdrawal Strategy",
    potential: "Medium-High",
    estimatedSavings: "$4,200/year (in retirement)",
    recommendations: [
      "Optimize withdrawal sequence across account types",
      "Manage income brackets through selective Roth conversions",
      "Consider charitable giving strategies for appreciated securities"
    ],
    considerations: "Requires coordination with overall retirement planning"
  }
];

// Sample data for AI-powered recommendations
const investmentOpportunitiesData = [
  {
    icon: LineChartIcon,
    iconColor: "bg-green-500",
    title: "Tech Growth ETF",
    description: "Diversified exposure to high-growth technology companies with strong future outlook",
    metrics: [
      { label: "Expected Return", value: "12.5%" },
      { label: "Risk Level", value: "Moderate" },
      { label: "Time Horizon", value: "3-5 Years" },
      { label: "Expense Ratio", value: "0.45%" },
    ],
    action: "View Details",
  },
  {
    icon: PieChartIcon,
    iconColor: "bg-blue-500",
    title: "Dividend Aristocrats",
    description: "Blue-chip companies with solid history of increasing dividend payments",
    metrics: [
      { label: "Expected Return", value: "8.3%" },
      { label: "Risk Level", value: "Low" },
      { label: "Time Horizon", value: "5+ Years" },
      { label: "Dividend Yield", value: "3.8%" },
    ],
    action: "View Details",
  },
  {
    icon: BarChart,
    iconColor: "bg-purple-500",
    title: "Global Infrastructure",
    description: "Investments in essential infrastructure with stable cash flows and inflation protection",
    metrics: [
      { label: "Expected Return", value: "9.5%" },
      { label: "Risk Level", value: "Low-Moderate" },
      { label: "Time Horizon", value: "7-10 Years" },
      { label: "Inflation Hedge", value: "Strong" },
    ],
    action: "View Details",
  },
  {
    icon: CircleDollarSign,
    iconColor: "bg-yellow-500",
    title: "Healthcare Innovation",
    description: "Focuses on companies driving technological breakthroughs in healthcare",
    metrics: [
      { label: "Expected Return", value: "14.2%" },
      { label: "Risk Level", value: "High" },
      { label: "Time Horizon", value: "5-7 Years" },
      { label: "Growth Potential", value: "Significant" },
    ],
    action: "View Details",
  },
  {
    icon: AreaChart,
    iconColor: "bg-red-500",
    title: "Emerging Markets",
    description: "Exposure to high-growth economies with expanding middle class populations",
    metrics: [
      { label: "Expected Return", value: "11.8%" },
      { label: "Risk Level", value: "High" },
      { label: "Time Horizon", value: "7+ Years" },
      { label: "Volatility", value: "High" },
    ],
    action: "View Details",
  },
  {
    icon: Shuffle,
    iconColor: "bg-indigo-500",
    title: "ESG Leaders Fund",
    description: "Companies excelling in environmental, social, and governance practices",
    metrics: [
      { label: "Expected Return", value: "10.1%" },
      { label: "Risk Level", value: "Moderate" },
      { label: "Time Horizon", value: "3-5 Years" },
      { label: "Sustainability", value: "Excellent" },
    ],
    action: "View Details",
  },
];

const portfolioOptimizationsData = [
  {
    icon: RefreshCcw,
    iconColor: "bg-blue-500",
    title: "Rebalance Portfolio",
    description: "Your portfolio has drifted from target allocation. Rebalancing could improve risk-adjusted returns.",
    metrics: [
      { label: "Current Drift", value: "12.3%" },
      { label: "Potential Benefit", value: "+0.8% annually" },
      { label: "Risk Reduction", value: "Moderate" },
      { label: "Transaction Cost", value: "Minimal" },
    ],
    action: "Rebalance Now",
  },
  {
    icon: Zap,
    iconColor: "bg-amber-500",
    title: "Reduce Fees",
    description: "Switch to lower-cost alternatives for several holdings to increase net returns",
    metrics: [
      { label: "Current Avg Fee", value: "0.68%" },
      { label: "Potential Avg Fee", value: "0.32%" },
      { label: "Annual Savings", value: "$1,240" },
      { label: "Impact (30yr)", value: "+$126,400" },
    ],
    action: "See Alternatives",
  },
  {
    icon: PercentCircle,
    iconColor: "bg-green-500",
    title: "Tax-Loss Harvesting",
    description: "Optimize tax efficiency by harvesting losses while maintaining market exposure",
    metrics: [
      { label: "Harvestable Losses", value: "$3,800" },
      { label: "Tax Savings", value: "~$1,140" },
      { label: "Risk Impact", value: "Neutral" },
      { label: "Complexity", value: "Moderate" },
    ],
    action: "View Strategy",
  },
];

const riskAdjustmentsData = [
  {
    icon: Briefcase,
    iconColor: "bg-red-500",
    title: "Reduce Tech Exposure",
    description: "Your portfolio is heavily concentrated in technology stocks, increasing sector risk",
    metrics: [
      { label: "Current Allocation", value: "42%" },
      { label: "Recommended", value: "25%" },
      { label: "Risk Reduction", value: "Significant" },
      { label: "Return Impact", value: "-0.5% (est.)" },
    ],
    action: "View Strategy",
  },
  {
    icon: Clock,
    iconColor: "bg-purple-500",
    title: "Extend Bond Duration",
    description: "Current short-duration bonds aren't optimized for your 10+ year time horizon",
    metrics: [
      { label: "Current Duration", value: "2.3 years" },
      { label: "Recommended", value: "7-10 years" },
      { label: "Yield Increase", value: "+1.2%" },
      { label: "Risk Change", value: "Moderate ↑" },
    ],
    action: "See Options",
  },
  {
    icon: CreditCard,
    iconColor: "bg-indigo-500",
    title: "Increase Int'l Exposure",
    description: "Home country bias is limiting diversification benefits in your portfolio",
    metrics: [
      { label: "Current Int'l", value: "12%" },
      { label: "Recommended", value: "30-40%" },
      { label: "Diversification", value: "Enhanced" },
      { label: "Currency Risk", value: "Moderate" },
    ],
    action: "View Strategy",
  },
];

export default function Recommendations() {
  // Simulate loading recommendation data
  const { data: recommendationsData, isLoading } = useQuery({
    queryKey: ['/api/recommendations'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        investmentOpportunities: investmentOpportunitiesData,
        portfolioOptimizations: portfolioOptimizationsData,
        riskAdjustments: riskAdjustmentsData,
        sentimentAnalysis: sentimentAnalysisData,
        globalMarkets: globalMarketsData,
        taxOptimization: taxOptimizationData,
        riskProfile: {
          score: 68,
          category: "Moderate Growth",
          description: "Balanced approach with focus on long-term growth with some income generation"
        },
        lastUpdated: "2023-12-15T08:30:00Z"
      };
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investment Recommendations</h1>
          <p className="text-muted-foreground">
            Personalized investment suggestions based on your goals and portfolio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Risk Profile Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-4 items-center">
              <div className="p-3 rounded-full bg-primary/20">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Your Risk Profile: {recommendationsData?.riskProfile.category}</h3>
                <p className="text-sm text-muted-foreground max-w-md">{recommendationsData?.riskProfile.description}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="flex justify-between text-sm mb-1 w-full md:w-[200px]">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
              <Progress value={recommendationsData?.riskProfile.score} className="h-2 w-full md:w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Tabs */}
      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="opportunities">Investment Opportunities</TabsTrigger>
          <TabsTrigger value="optimizations">Portfolio Optimizations</TabsTrigger>
          <TabsTrigger value="adjustments">Risk Adjustments</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="global">Global Markets</TabsTrigger>
          <TabsTrigger value="tax">Tax Harvesting</TabsTrigger>
        </TabsList>
        
        {/* Investment Opportunities Tab */}
        <TabsContent value="opportunities">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Recommended Investment Opportunities</h3>
            </div>
            <Button variant="ghost" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Custom
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendationsData?.investmentOpportunities.map((item, index) => (
              <RecommendationCard 
                key={index}
                icon={item.icon}
                iconColor={item.iconColor}
                title={item.title}
                description={item.description}
                metrics={item.metrics}
                action={item.action}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* Portfolio Optimizations Tab */}
        <TabsContent value="optimizations">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Portfolio Optimization Strategies</h3>
            </div>
            <Button variant="ghost" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              View Report
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendationsData?.portfolioOptimizations.map((item, index) => (
              <RecommendationCard 
                key={index}
                icon={item.icon}
                iconColor={item.iconColor}
                title={item.title}
                description={item.description}
                metrics={item.metrics}
                action={item.action}
              />
            ))}
          </div>
          
          <Card className="mt-6 bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Optimization Benefits</h4>
                  <p className="text-sm text-muted-foreground">
                    Implementing the above optimizations could increase your portfolio's long-term performance by approximately 
                    <span className="font-semibold text-primary"> 1.8% annually</span>, 
                    which could result in an additional <span className="font-semibold text-primary">$320,000</span> over 30 years 
                    on a $500,000 portfolio.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Risk Adjustments Tab */}
        <TabsContent value="adjustments">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Risk Management Recommendations</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(recommendationsData?.lastUpdated || "").toLocaleDateString()}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendationsData?.riskAdjustments.map((item, index) => (
              <RecommendationCard 
                key={index}
                icon={item.icon}
                iconColor={item.iconColor}
                title={item.title}
                description={item.description}
                metrics={item.metrics}
                action={item.action}
              />
            ))}
          </div>
          
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800 mb-1">Risk Assessment</h4>
                  <p className="text-sm text-orange-700">
                    Your portfolio's current risk concentration could lead to increased volatility during market downturns.
                    Implementing the suggested risk adjustments could reduce your portfolio's maximum drawdown by approximately 
                    <span className="font-semibold"> 15-20%</span> in severe market corrections while maintaining similar 
                    long-term returns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sentiment Analysis Tab */}
        <TabsContent value="sentiment">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Market Sentiment Analysis</h3>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
          
          {/* Sentiment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Market Sentiment Overview</CardTitle>
                <CardDescription>Overall market sentiment based on news and social media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-1">74</div>
                    <div className="text-sm text-muted-foreground">Overall Sentiment</div>
                    <div className="flex items-center text-green-500 mt-2">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">+3.2 pts</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">News</span>
                      <div className="flex items-center">
                        <Progress value={78} className="h-2 w-[100px] mr-2" />
                        <span className="text-sm font-medium">78</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Social</span>
                      <div className="flex items-center">
                        <Progress value={70} className="h-2 w-[100px] mr-2" />
                        <span className="text-sm font-medium">70</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Blogs</span>
                      <div className="flex items-center">
                        <Progress value={76} className="h-2 w-[100px] mr-2" />
                        <span className="text-sm font-medium">76</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Forums</span>
                      <div className="flex items-center">
                        <Progress value={72} className="h-2 w-[100px] mr-2" />
                        <span className="text-sm font-medium">72</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sentiment Trend</CardTitle>
                <CardDescription>Sentiment evolution over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="w-full h-[180px] bg-muted/50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
                  <span className="ml-2 text-sm text-muted-foreground">Chart: Sentiment trend (30 days)</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Asset Sentiment Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Asset-Specific Sentiment</CardTitle>
              <CardDescription>Sentiment analysis for individual assets in your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>News</TableHead>
                    <TableHead>Social</TableHead>
                    <TableHead>Key Topics</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendationsData?.sentimentAnalysis.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{item.asset}</div>
                        <div className="text-xs text-muted-foreground">{item.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress 
                            value={item.overallSentiment} 
                            className="h-2 w-[80px] mr-2"
                            indicatorClassName={
                              item.overallSentiment >= 70 ? "bg-green-500" :
                              item.overallSentiment >= 50 ? "bg-amber-500" : "bg-red-500"
                            }
                          />
                          <span className="font-medium">{item.overallSentiment}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {item.trend === 'up' ? 
                            <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          }
                          <span>{item.change.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.sources.news}</TableCell>
                      <TableCell>{item.sources.social}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {item.keyTopics.slice(0, 2).map((topic, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                          ))}
                          {item.keyTopics.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{item.keyTopics.length - 2} more</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Global Markets Tab */}
        <TabsContent value="global">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Global Markets Analysis</h3>
            </div>
            <div className="text-sm text-muted-foreground">Last updated: Today, 8:30 AM</div>
          </div>
          
          {/* Regional Sentiment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {recommendationsData?.globalMarkets.regions.map((region, index) => (
              <Card key={index} className={region.trend === "up" ? "border-green-200" : "border-red-200"}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <CardTitle className="text-lg">{region.name}</CardTitle>
                    <div className={`flex items-center ${region.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {region.trend === 'up' ? 
                        <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      }
                      <span>{region.change.toFixed(1)}%</span>
                    </div>
                  </div>
                  <CardDescription>Regional market sentiment: {region.sentiment}/100</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Market</TableHead>
                        <TableHead>Perf.</TableHead>
                        <TableHead>Sentiment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {region.topMarkets.map((market, i) => (
                        <TableRow key={i}>
                          <TableCell>{market.market}</TableCell>
                          <TableCell className={market.performance >= 0 ? "text-green-500" : "text-red-500"}>
                            {market.performance >= 0 ? "+" : ""}{market.performance.toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Progress 
                                value={market.sentiment} 
                                className="h-2 w-[60px] mr-2"
                                indicatorClassName={
                                  market.sentiment >= 70 ? "bg-green-500" :
                                  market.sentiment >= 50 ? "bg-amber-500" : "bg-red-500"
                                }
                              />
                              <span>{market.sentiment}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Geopolitical Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Geopolitical Risk Analysis</CardTitle>
                <CardDescription>Current geopolitical factors affecting markets</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Impact</TableHead>
                      <TableHead>Sentiment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendationsData?.globalMarkets.geopoliticalRisks.map((risk, index) => (
                      <TableRow key={index}>
                        <TableCell>{risk.region}</TableCell>
                        <TableCell>
                          <Badge variant={
                            risk.riskLevel.includes("High") ? "destructive" :
                            risk.riskLevel.includes("Moderate") ? "warning" : "outline"
                          }>
                            {risk.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>{risk.impact}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Progress 
                              value={risk.sentiment} 
                              className="h-2 w-[60px] mr-2"
                              indicatorClassName={
                                risk.sentiment >= 70 ? "bg-green-500" :
                                risk.sentiment >= 50 ? "bg-amber-500" : "bg-red-500"
                              }
                            />
                            <span>{risk.sentiment}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Behavioral Market Insights</CardTitle>
                <CardDescription>Behavioral economics indicators and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendationsData?.globalMarkets.behavioralInsights.map((insight, index) => (
                    <div key={index} className="pb-3 border-b last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">{insight.metric}</div>
                        <div className="font-bold">{insight.value}</div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">{insight.interpretation}</div>
                      <div className="text-xs flex items-center">
                        <Info className="h-3 w-3 text-primary mr-1" />
                        <span>{insight.recommendation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tax Harvesting Tab */}
        <TabsContent value="tax">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Tax Optimization Opportunities</h3>
            </div>
            <Button variant="outline" size="sm">
              <Calculator className="mr-2 h-4 w-4" />
              Run Custom Analysis
            </Button>
          </div>
          
          {/* Tax-Loss Harvesting Card */}
          <Card className="mb-6 border-green-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Tax-Loss Harvesting Opportunities</CardTitle>
                <Badge variant="outline" className="bg-green-50">Estimated savings: {recommendationsData?.taxOptimization[0].estimatedSavings}</Badge>
              </div>
              <CardDescription>Potential for tax-loss harvesting in your taxable accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Unrealized Loss</TableHead>
                    <TableHead>Replacement Ideas</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendationsData?.taxOptimization[0].positions.map((position, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{position.symbol}</TableCell>
                      <TableCell>{position.name}</TableCell>
                      <TableCell className="text-red-500">{position.loss}</TableCell>
                      <TableCell>{position.replacementIdea}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 px-3">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <span className="font-medium">Important:</span> {recommendationsData?.taxOptimization[0].considerations}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Other Tax Optimization Strategies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendationsData?.taxOptimization.slice(1).map((strategy, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{strategy.type}</CardTitle>
                    <Badge variant="outline">Potential: {strategy.potential}</Badge>
                  </div>
                  <CardDescription>Estimated annual savings: {strategy.estimatedSavings}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    {strategy.recommendations?.map((rec, i) => (
                      <li key={i} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                  <div className="p-3 bg-muted/50 rounded-lg text-sm">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{strategy.considerations}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}