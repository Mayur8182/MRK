import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  Briefcase,
  ChevronRight,
  CircleDollarSign,
  Clock,
  CreditCard,
  FileText,
  Filter,
  Info,
  Lightbulb,
  LineChart as LineChartIcon,
  PercentCircle,
  PieChart as PieChartIcon,
  Plus,
  RefreshCcw,
  Search,
  Shuffle,
  Star,
  ThumbsUp,
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

// Sample data for recommendations
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
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="opportunities">Investment Opportunities</TabsTrigger>
          <TabsTrigger value="optimizations">Portfolio Optimizations</TabsTrigger>
          <TabsTrigger value="adjustments">Risk Adjustments</TabsTrigger>
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
      </Tabs>
    </div>
  );
}