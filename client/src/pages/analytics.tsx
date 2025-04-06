import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardChart } from "@/components/ui/dashboard-chart";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Treemap,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  BarChart4,
  CandlestickChart,
  CircleDollarSign,
  Download,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for charts
const monthlyPerformanceData = [
  { name: "Jan", return: 2.3, benchmark: 1.8 },
  { name: "Feb", return: -0.5, benchmark: -1.2 },
  { name: "Mar", return: 3.2, benchmark: 2.7 },
  { name: "Apr", return: 1.8, benchmark: 2.2 },
  { name: "May", return: -1.4, benchmark: -0.8 },
  { name: "Jun", return: 4.5, benchmark: 3.9 },
  { name: "Jul", return: 2.9, benchmark: 2.5 },
  { name: "Aug", return: 0.3, benchmark: 0.1 },
  { name: "Sep", return: -2.1, benchmark: -2.6 },
  { name: "Oct", return: 5.1, benchmark: 4.3 },
  { name: "Nov", return: 3.7, benchmark: 3.2 },
  { name: "Dec", return: 2.2, benchmark: 1.9 },
];

const quarterlyReturnsData = [
  { name: "Q1", return: 5.0, benchmark: 3.3 },
  { name: "Q2", return: 4.9, benchmark: 5.3 },
  { name: "Q3", return: 1.1, benchmark: 0.0 },
  { name: "Q4", return: 11.0, benchmark: 9.4 },
];

const assetAllocationData = [
  { name: "Stocks", value: 45, fill: "#10B981" },
  { name: "Bonds", value: 25, fill: "#6366F1" },
  { name: "Cash", value: 10, fill: "#8B5CF6" },
  { name: "Real Estate", value: 15, fill: "#F59E0B" },
  { name: "Commodities", value: 5, fill: "#EC4899" },
];

const sectorExposureData = [
  { name: "Technology", value: 28 },
  { name: "Healthcare", value: 15 },
  { name: "Consumer", value: 12 },
  { name: "Financial", value: 18 },
  { name: "Energy", value: 7 },
  { name: "Utilities", value: 5 },
  { name: "Industrial", value: 8 },
  { name: "Real Estate", value: 7 },
];

const topHoldingsData = [
  { name: "AAPL", value: 15, gain: 22.4 },
  { name: "MSFT", value: 12, gain: 15.7 },
  { name: "AMZN", value: 10, gain: 8.2 },
  { name: "GOOGL", value: 9, gain: 10.5 },
  { name: "FB", value: 8, gain: -3.2 },
  { name: "TSLA", value: 7, gain: 32.1 },
  { name: "BRK.B", value: 6, gain: 7.8 },
  { name: "JNJ", value: 5, gain: 2.3 },
  { name: "JPM", value: 4, gain: 5.9 },
  { name: "V", value: 3, gain: 9.1 },
];

const riskReturnData = [
  { name: "Your Portfolio", risk: 12, return: 14, size: 10 },
  { name: "S&P 500", risk: 15, return: 12, size: 8 },
  { name: "Small Cap", risk: 22, return: 16, size: 6 },
  { name: "Bonds", risk: 5, return: 4, size: 8 },
  { name: "Gold", risk: 10, return: 6, size: 7 },
  { name: "International", risk: 18, return: 10, size: 7 },
];

const performanceMetricsData = [
  {
    name: "Alpha",
    value: 2.4,
    description: "Excess return relative to benchmark",
    trend: "up",
    status: "positive",
  },
  {
    name: "Beta",
    value: 0.85,
    description: "Portfolio volatility vs market",
    trend: "down",
    status: "positive",
  },
  {
    name: "Sharpe Ratio",
    value: 1.7,
    description: "Risk-adjusted return",
    trend: "up",
    status: "positive",
  },
  {
    name: "Sortino Ratio",
    value: 2.1,
    description: "Downside risk-adjusted return",
    trend: "up",
    status: "positive",
  },
  {
    name: "Max Drawdown",
    value: "-8.2%",
    description: "Largest portfolio decline",
    trend: "down",
    status: "neutral",
  },
  {
    name: "Tracking Error",
    value: 3.5,
    description: "Deviation from benchmark",
    trend: "up",
    status: "neutral",
  },
];

const investmentGrowthData = [
  { year: "2018", value: 100000 },
  { year: "2019", value: 112000 },
  { year: "2020", value: 125000 },
  { year: "2021", value: 145000 },
  { year: "2022", value: 138000 },
  { year: "2023", value: 162000 },
  { year: "2024 (YTD)", value: 175000 },
];

const treemapData = [
  {
    name: "Stocks",
    children: [
      { name: "Technology", size: 28, value: 28 },
      { name: "Healthcare", size: 15, value: 15 },
      { name: "Consumer", size: 12, value: 12 },
      { name: "Financial", size: 18, value: 18 },
      { name: "Industrial", size: 8, value: 8 },
    ],
  },
  {
    name: "Bonds",
    children: [
      { name: "Treasury", size: 15, value: 15 },
      { name: "Corporate", size: 10, value: 10 },
    ],
  },
  {
    name: "Alternatives",
    children: [
      { name: "Real Estate", size: 15, value: 15 },
      { name: "Commodities", size: 5, value: 5 },
    ],
  },
  {
    name: "Cash",
    children: [
      { name: "Cash", size: 10, value: 10 },
    ],
  },
];

// Custom formatting
const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
const formatPercent = (value: number) => `${value}%`;

// Custom pie chart tooltip
const CustomPieTooltip = ({ active, payload }: any) => {
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

// Transform data for treemap
const processTreemapData = (data: any) => {
  const result: any[] = [];
  
  if (!data || !Array.isArray(data)) {
    return result;
  }
  
  data.forEach((category: any) => {
    if (category && category.children && Array.isArray(category.children)) {
      category.children.forEach((item: any) => {
        result.push({
          name: item.name,
          size: item.size,
          value: item.value,
          fill: category.name === "Stocks" 
            ? "#10B981" 
            : category.name === "Bonds" 
              ? "#6366F1" 
              : category.name === "Alternatives" 
                ? "#F59E0B" 
                : "#8B5CF6"
        });
      });
    }
  });
  
  return result;
};

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("1Y");
  
  // Simulate loading analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['/api/analytics'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        monthlyReturns: monthlyPerformanceData,
        quarterlyReturns: quarterlyReturnsData,
        assetAllocation: assetAllocationData,
        sectorExposure: sectorExposureData,
        topHoldings: topHoldingsData,
        riskReturn: riskReturnData,
        performanceMetrics: performanceMetricsData,
        investmentGrowth: investmentGrowthData,
        portfolioBreakdown: treemapData,
        totalReturn: 14.3,
        yearToDateReturn: 7.8,
        benchmarkReturn: 12.1,
        benchmarkYTDReturn: 6.5
      };
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Analytics</h1>
          <p className="text-muted-foreground">
            Analyze your investment performance and portfolio metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
              <SelectItem value="3Y">3 Years</SelectItem>
              <SelectItem value="5Y">5 Years</SelectItem>
              <SelectItem value="MAX">Max</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="shrink-0">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{analyticsData?.totalReturn}%</div>
              <Badge 
                variant={
                  analyticsData?.totalReturn > analyticsData?.benchmarkReturn 
                    ? "default" 
                    : "secondary"
                }
                className="flex items-center gap-1"
              >
                {analyticsData?.totalReturn > analyticsData?.benchmarkReturn ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5" />
                )}
                {Math.abs(analyticsData?.totalReturn - analyticsData?.benchmarkReturn).toFixed(1)}% vs Benchmark
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">YTD Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{analyticsData?.yearToDateReturn}%</div>
              <Badge 
                variant={
                  analyticsData?.yearToDateReturn > analyticsData?.benchmarkYTDReturn 
                    ? "default" 
                    : "secondary"
                }
                className="flex items-center gap-1"
              >
                {analyticsData?.yearToDateReturn > analyticsData?.benchmarkYTDReturn ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5" />
                )}
                {Math.abs(analyticsData?.yearToDateReturn - analyticsData?.benchmarkYTDReturn).toFixed(1)}% vs Benchmark
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">${(analyticsData?.investmentGrowth?.[analyticsData?.investmentGrowth.length - 1]?.value || 0).toLocaleString()}</div>
              <Badge 
                variant="outline"
                className="flex items-center gap-1"
              >
                <LineChartIcon className="h-3.5 w-3.5" />
                {timeframe}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Asset Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{analyticsData?.assetAllocation?.length || 0}</div>
              <Badge 
                variant="outline"
                className="flex items-center gap-1"
              >
                <PieChartIcon className="h-3.5 w-3.5" />
                Diversified
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
        </TabsList>
        
        {/* Performance Tab */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Monthly Returns</CardTitle>
                <CardDescription>
                  Performance comparison with benchmark
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.monthlyReturns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Return']} 
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="return" name="Your Portfolio" fill="#10B981" />
                      <Bar dataKey="benchmark" name="Benchmark" fill="#6366F1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Growth of Investment</CardTitle>
                <CardDescription>
                  Portfolio value over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData?.investmentGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} 
                        labelFormatter={(label) => `Year: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        name="Portfolio Value" 
                        stroke="#10B981" 
                        fill="#10B98133"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Asset Allocation</CardTitle>
                <CardDescription>
                  Distribution of investments across asset classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData?.assetAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData?.assetAllocation?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Sector Exposure</CardTitle>
                <CardDescription>
                  Portfolio breakdown by market sectors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={analyticsData?.sectorExposure}
                      margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                      <Bar dataKey="value" fill="#6366F1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Portfolio Composition</CardTitle>
              <CardDescription>
                Hierarchical view of your investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={processTreemapData(analyticsData?.portfolioBreakdown)}
                    dataKey="value"
                    nameKey="name"
                    ratio={4/3}
                    stroke="#fff"
                    content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
                      return (
                        <g>
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            style={{
                              fill: (depth < 2) ? "#8884d8" : "rgba(136, 132, 216, 0.6)",
                              stroke: '#fff',
                              strokeWidth: 2 / (depth + 1e-10),
                              strokeOpacity: 1 / (depth + 1e-10),
                            }}
                          />
                          {
                            (depth === 1 || root.children.length === 0) ?
                              <text
                                x={x + width / 2}
                                y={y + height / 2 + 7}
                                textAnchor="middle"
                                fill="#fff"
                                fontSize={14}
                              >
                                {name}
                              </text>
                              : null
                          }
                          {
                            depth === 1 ?
                              <text
                                x={x + 4}
                                y={y + 18}
                                fill="#fff"
                                fontSize={11}
                                fillOpacity={0.9}
                              >
                                {index + 1}
                              </text>
                              : null
                          }
                        </g>
                      );
                    }}
                  />
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Risk vs. Return Analysis</CardTitle>
                <CardDescription>
                  Performance comparison of different asset classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis 
                        type="number" 
                        dataKey="risk" 
                        name="Risk" 
                        label={{ value: 'Risk (Volatility)', position: 'bottom', offset: 0 }}
                        domain={[0, 25]}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="return" 
                        name="Return" 
                        label={{ value: 'Return (%)', angle: -90, position: 'left' }}
                        domain={[0, 20]}
                      />
                      <ZAxis 
                        type="number" 
                        dataKey="size" 
                        range={[50, 500]} 
                        name="Size" 
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name) => {
                          return [`${value}${name === 'Risk' ? '' : '%'}`, name];
                        }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded shadow-sm">
                                <p className="font-semibold">{data.name}</p>
                                <p className="text-sm">Risk: {data.risk}</p>
                                <p className="text-sm">Return: {data.return}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter 
                        name="Risk/Return" 
                        data={analyticsData?.riskReturn} 
                        fill="#8884d8"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analyticsData?.performanceMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{metric.name}</p>
                        <div className="text-2xl font-bold">{metric.value}</div>
                      </div>
                      <Badge 
                        variant={
                          metric.status === "positive" 
                            ? "default" 
                            : metric.status === "negative" 
                              ? "destructive" 
                              : "outline"
                        }
                        className="flex items-center gap-1"
                      >
                        {metric.trend === "up" ? (
                          <TrendingUp className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5" />
                        )}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Holdings Tab */}
        <TabsContent value="holdings">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Top Holdings</CardTitle>
              <CardDescription>
                Your highest-value investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.topHoldings.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${value}%`} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "value") return [`${value}%`, "Allocation"];
                          return [`${value}%`, "Gain/Loss"];
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="value" name="Allocation" fill="#6366F1" />
                      <Bar yAxisId="right" dataKey="gain" name="Gain/Loss" fill={(data) => data.gain >= 0 ? "#10B981" : "#EF4444"} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="border rounded-md">
                  <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground p-3 border-b">
                    <div>Security</div>
                    <div className="text-right">Allocation</div>
                    <div className="text-right">Performance</div>
                    <div className="text-right">Action</div>
                  </div>
                  <div className="divide-y">
                    {analyticsData?.topHoldings.map((holding, i) => (
                      <div key={i} className="grid grid-cols-4 p-3 items-center">
                        <div className="font-medium">{holding.name}</div>
                        <div className="text-right">{holding.value}%</div>
                        <div className={`text-right ${holding.gain >= 0 ? "text-green-500" : "text-red-500"} font-medium`}>
                          {holding.gain >= 0 ? "+" : ""}{holding.gain}%
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <BarChart3 className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </div>
                      </div>
                    ))}
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