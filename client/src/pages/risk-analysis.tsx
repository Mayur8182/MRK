import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardChart } from "@/components/ui/dashboard-chart";
import { AreaChart, Area, Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertCircle, ArrowDown, ArrowUp, BadgeInfo, BarChart4, ChevronUp, PieChart as PieChartIcon, ShieldAlert, TrendingDown, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Sample data for charts and metrics
const performanceData = [
  { name: "Jan", value: 40000, previousValue: 35000 },
  { name: "Feb", value: 45000, previousValue: 40000 },
  { name: "Mar", value: 43000, previousValue: 45000 },
  { name: "Apr", value: 50000, previousValue: 43000 },
  { name: "May", value: 55000, previousValue: 50000 },
  { name: "Jun", value: 58000, previousValue: 55000 },
  { name: "Jul", value: 62000, previousValue: 58000 },
  { name: "Aug", value: 65000, previousValue: 62000 },
  { name: "Sep", value: 63000, previousValue: 65000 },
  { name: "Oct", value: 68000, previousValue: 63000 },
  { name: "Nov", value: 72000, previousValue: 68000 },
  { name: "Dec", value: 76000, previousValue: 72000 },
];

const riskScoreData = [
  { name: "Volatility", value: 70 },
  { name: "Diversification", value: 45 },
  { name: "Market Correlation", value: 60 },
  { name: "Liquidity", value: 80 },
  { name: "Credit Quality", value: 65 }
];

const assetAllocationData = [
  { name: "Stocks", value: 45, fill: "#10B981" },
  { name: "Bonds", value: 25, fill: "#6366F1" },
  { name: "Cash", value: 10, fill: "#8B5CF6" },
  { name: "Real Estate", value: 15, fill: "#F59E0B" },
  { name: "Commodities", value: 5, fill: "#EC4899" }
];

const portfolioRiskData = [
  { name: "Technology Sector", risk: 85, value: 35, gain: 18.5 },
  { name: "Healthcare", risk: 55, value: 25, gain: 10.2 },
  { name: "Consumer Goods", risk: 35, value: 15, gain: 5.7 },
  { name: "Financial Services", risk: 70, value: 15, gain: 12.3 },
  { name: "Energy", risk: 90, value: 10, gain: -3.5 }
];

const historicalVolatilityData = [
  { date: "2024-01", portfolio: 15, benchmark: 12 },
  { date: "2024-02", portfolio: 17, benchmark: 13 },
  { date: "2024-03", portfolio: 14, benchmark: 14 },
  { date: "2024-04", portfolio: 20, benchmark: 15 },
  { date: "2024-05", portfolio: 16, benchmark: 13 },
  { date: "2024-06", portfolio: 18, benchmark: 14 },
  { date: "2024-07", portfolio: 19, benchmark: 16 },
  { date: "2024-08", portfolio: 22, benchmark: 15 },
  { date: "2024-09", portfolio: 20, benchmark: 16 },
  { date: "2024-10", portfolio: 18, benchmark: 14 },
  { date: "2024-11", portfolio: 17, benchmark: 13 },
  { date: "2024-12", portfolio: 15, benchmark: 11 },
];

// Risk indicators
const riskIndicators = [
  {
    name: "Portfolio Beta",
    value: 1.3,
    description: "Higher than market volatility",
    trend: "up",
    status: "caution",
  },
  {
    name: "Sharpe Ratio",
    value: 1.7,
    description: "Good risk-adjusted return",
    trend: "up",
    status: "good",
  },
  {
    name: "VaR (95%)",
    value: "$4,320",
    description: "Max daily loss potential",
    trend: "down",
    status: "caution",
  },
  {
    name: "Drawdown",
    value: "8.2%",
    description: "From peak to trough",
    trend: "down",
    status: "good",
  },
];

const stressTestScenarios = [
  {
    name: "Market Crash",
    impact: -25.3,
    description: "Severe market correction like 2008",
  },
  {
    name: "Interest Rate Hike",
    impact: -12.7,
    description: "Federal Reserve raises rates 1%",
  },
  {
    name: "Tech Bubble Burst",
    impact: -18.4,
    description: "Tech sector loses 30% value",
  },
  {
    name: "Oil Price Shock",
    impact: -8.5,
    description: "Oil prices double in short period",
  },
];

// Custom tooltip for the asset allocation pie chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-sm">Allocation: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function RiskAnalysis() {
  // Simulate loading portfolio risk data
  const { data: riskData, isLoading } = useQuery({
    queryKey: ['/api/risk-analysis'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        overallRisk: 68, // 0-100 scale
        riskIndicators,
        assetAllocation: assetAllocationData,
        performanceHistory: performanceData,
        portfolioRisks: portfolioRiskData,
        volatilityHistory: historicalVolatilityData,
        stressTests: stressTestScenarios,
        riskScores: riskScoreData
      };
    }
  });

  // Overall risk level description
  const getRiskLevelDescription = (score: number) => {
    if (score < 40) return { text: "Low Risk", color: "bg-green-500", description: "Conservative allocation with focus on capital preservation" };
    if (score < 70) return { text: "Moderate Risk", color: "bg-yellow-500", description: "Balanced allocation with moderate growth potential" };
    return { text: "High Risk", color: "bg-red-500", description: "Aggressive allocation focused on growth" };
  };

  const riskLevel = riskData ? getRiskLevelDescription(riskData.overallRisk) : { text: "Loading...", color: "bg-gray-300", description: "" };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Analysis</h1>
          <p className="text-muted-foreground">
            Analyze your portfolio risk metrics and performance under various scenarios
          </p>
        </div>
        <Button variant="outline" className="shrink-0">
          <BarChart4 className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Overall Risk Level */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Overall Risk Assessment</CardTitle>
          <CardDescription>
            Comprehensive analysis of your portfolio's risk exposure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full">
              <div className="mb-2 flex justify-between items-center">
                <span className="text-sm font-medium">Risk Level</span>
                <Badge variant={riskData?.overallRisk > 65 ? "destructive" : riskData?.overallRisk > 35 ? "default" : "outline"}>
                  {riskLevel.text}
                </Badge>
              </div>
              <Progress value={riskData?.overallRisk || 0} className="h-3 mb-1" />
              <p className="text-sm text-muted-foreground mt-2">{riskLevel.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              {riskData?.riskIndicators.map((indicator, i) => (
                <Card key={i} className="bg-muted/50 border-none">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{indicator.name}</span>
                      {indicator.trend === "up" ? (
                        <TrendingUp className={`w-3 h-3 ${indicator.status === "good" ? "text-green-500" : "text-red-500"}`} />
                      ) : (
                        <TrendingDown className={`w-3 h-3 ${indicator.status === "good" ? "text-green-500" : "text-red-500"}`} />
                      )}
                    </div>
                    <div className="font-bold">{indicator.value}</div>
                    <div className="text-xs text-muted-foreground">{indicator.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis Tabs */}
      <Tabs defaultValue="allocation" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
          <TabsTrigger value="metrics">Risk Metrics</TabsTrigger>
          <TabsTrigger value="volatility">Volatility</TabsTrigger>
          <TabsTrigger value="stress">Stress Tests</TabsTrigger>
        </TabsList>
        
        {/* Asset Allocation Tab */}
        <TabsContent value="allocation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Asset Allocation</CardTitle>
                <CardDescription>
                  Distribution of investments across asset classes
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData?.assetAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskData?.assetAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Risk by Investment Type</CardTitle>
                <CardDescription>
                  Risk contribution by investment category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskData?.portfolioRisks.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={item.risk > 70 ? "destructive" : item.risk > 40 ? "default" : "outline"}
                            className="text-xs"
                          >
                            Risk: {item.risk}
                          </Badge>
                          <span className={`text-xs font-medium ${item.gain >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {item.gain >= 0 ? "+" : ""}{item.gain}%
                          </span>
                        </div>
                      </div>
                      <Progress value={item.risk} className="h-2 mb-1" />
                      <div className="text-xs text-muted-foreground">{item.value}% of portfolio</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Metrics Tab */}
        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Risk Score Breakdown</CardTitle>
                <CardDescription>
                  Analysis of individual risk factors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskData?.riskScores}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10B981">
                        {riskData?.riskScores.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.value > 70 ? "#EF4444" : entry.value > 40 ? "#F59E0B" : "#10B981"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Portfolio Performance</CardTitle>
                <CardDescription>
                  Return relative to risk taken
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <DashboardChart
                    title="Historical Performance"
                    data={riskData?.performanceHistory || []}
                    type="area"
                    colors={{ primary: "#10B981" }}
                    height={300}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Volatility Tab */}
        <TabsContent value="volatility">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Historical Volatility</CardTitle>
              <CardDescription>
                Portfolio volatility comparison vs market benchmark
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={riskData?.volatilityHistory}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="portfolio" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Your Portfolio" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      stroke="#6366F1" 
                      strokeWidth={2}
                      name="Market Benchmark" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Volatility Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Your portfolio shows higher volatility than the market benchmark, indicating potentially higher risk. 
                      Consider adding more stable assets to reduce overall volatility if your risk tolerance is moderate.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stress Tests Tab */}
        <TabsContent value="stress">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Stress Test Scenarios</CardTitle>
              <CardDescription>
                Projected portfolio impact under various adverse market conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskData?.stressTests} layout="vertical">
                      <XAxis type="number" domain={[-30, 0]} />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Portfolio Impact']}
                      />
                      <Bar dataKey="impact" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {riskData?.stressTests.map((scenario, index) => (
                    <Card key={index} className="bg-muted/50 border-none">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{scenario.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {scenario.description}
                            </p>
                          </div>
                          <Badge variant="destructive" className="ml-2">
                            {scenario.impact}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Risk Mitigation Recommendation</h4>
                      <p className="text-sm text-yellow-800">
                        Your portfolio shows significant vulnerability to market crashes and tech sector downturns.
                        Consider diversifying into more defensive sectors and increasing cash reserves to reduce potential losses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}