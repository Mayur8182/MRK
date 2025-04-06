import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Globe,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Clock,
  ChevronDown,
  Download,
  Filter,
  Share2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Info,
  AlertTriangle,
  LucideIcon
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
  LineChart,
  Line,
  Area,
  AreaChart,
  Cell,
  PieChart as RePieChart,
  Pie
} from "recharts";

// Types
interface MarketIndex {
  id: string;
  name: string;
  region: string;
  country: string;
  value: number;
  change: number;
  changePercent: number;
  currency: string;
  lastUpdated: string;
}

interface MarketPerformance {
  region: string;
  color: string;
  ytd: number;
  month1: number;
  month3: number;
  month6: number;
  year1: number;
  year5: number;
}

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
}

interface GlobalMarketData {
  majorMarkets: MarketIndex[];
  globalIndices: MarketIndex[];
  regionPerformance: MarketPerformance[];
  sectorPerformance: {
    sector: string;
    value: number;
    ytdChange: number;
  }[];
  currencies: CurrencyRate[];
  globalEvents: {
    id: number;
    date: string;
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    regions: string[];
    type: string;
  }[];
  marketHours: {
    market: string;
    region: string;
    status: "open" | "closed" | "pre-market" | "after-hours";
    openTime?: string;
    closeTime?: string;
    localTime: string;
    timeZone: string;
  }[];
  lastUpdated: string;
}

// Sample data
const globalMarketData: GlobalMarketData = {
  majorMarkets: [
    { id: "sp500", name: "S&P 500", region: "North America", country: "United States", value: 4783.45, change: 37.64, changePercent: 0.79, currency: "USD", lastUpdated: "2023-12-15T16:00:00Z" },
    { id: "nasdaq", name: "NASDAQ Composite", region: "North America", country: "United States", value: 15230.20, change: 156.33, changePercent: 1.03, currency: "USD", lastUpdated: "2023-12-15T16:00:00Z" },
    { id: "djia", name: "Dow Jones Industrial", region: "North America", country: "United States", value: 36954.77, change: 128.15, changePercent: 0.35, currency: "USD", lastUpdated: "2023-12-15T16:00:00Z" },
    { id: "ftse100", name: "FTSE 100", region: "Europe", country: "United Kingdom", value: 7602.15, change: -12.40, changePercent: -0.16, currency: "GBP", lastUpdated: "2023-12-15T16:30:00Z" },
    { id: "nikkei225", name: "Nikkei 225", region: "Asia", country: "Japan", value: 32307.86, change: 289.38, changePercent: 0.90, currency: "JPY", lastUpdated: "2023-12-15T06:00:00Z" },
    { id: "shcomp", name: "Shanghai Composite", region: "Asia", country: "China", value: 3023.08, change: -8.97, changePercent: -0.30, currency: "CNY", lastUpdated: "2023-12-15T07:00:00Z" },
  ],
  globalIndices: [
    { id: "dax", name: "DAX", region: "Europe", country: "Germany", value: 16752.23, change: 56.88, changePercent: 0.34, currency: "EUR", lastUpdated: "2023-12-15T16:30:00Z" },
    { id: "cac40", name: "CAC 40", region: "Europe", country: "France", value: 7596.52, change: 38.97, changePercent: 0.52, currency: "EUR", lastUpdated: "2023-12-15T16:30:00Z" },
    { id: "ibex35", name: "IBEX 35", region: "Europe", country: "Spain", value: 10237.80, change: 28.30, changePercent: 0.28, currency: "EUR", lastUpdated: "2023-12-15T16:30:00Z" },
    { id: "ftsemib", name: "FTSE MIB", region: "Europe", country: "Italy", value: 30350.15, change: 102.48, changePercent: 0.34, currency: "EUR", lastUpdated: "2023-12-15T16:30:00Z" },
    { id: "asx200", name: "ASX 200", region: "Asia-Pacific", country: "Australia", value: 7421.20, change: 35.80, changePercent: 0.48, currency: "AUD", lastUpdated: "2023-12-15T06:00:00Z" },
    { id: "kospi", name: "KOSPI", region: "Asia", country: "South Korea", value: 2563.56, change: 3.47, changePercent: 0.14, currency: "KRW", lastUpdated: "2023-12-15T06:00:00Z" },
    { id: "sensex", name: "BSE SENSEX", region: "Asia", country: "India", value: 71483.75, change: 969.55, changePercent: 1.37, currency: "INR", lastUpdated: "2023-12-15T10:00:00Z" },
    { id: "hangseng", name: "Hang Seng", region: "Asia", country: "Hong Kong", value: 16345.02, change: -87.80, changePercent: -0.53, currency: "HKD", lastUpdated: "2023-12-15T08:00:00Z" },
    { id: "bovespa", name: "Bovespa", region: "South America", country: "Brazil", value: 131249.80, change: 1054.34, changePercent: 0.81, currency: "BRL", lastUpdated: "2023-12-15T19:00:00Z" },
    { id: "ipc", name: "IPC", region: "North America", country: "Mexico", value: 55785.14, change: 278.45, changePercent: 0.50, currency: "MXN", lastUpdated: "2023-12-15T21:00:00Z" },
  ],
  regionPerformance: [
    { region: "North America", color: "#4f46e5", ytd: 22.3, month1: 3.8, month3: 5.4, month6: 8.7, year1: 19.5, year5: 84.2 },
    { region: "Europe", color: "#10b981", ytd: 15.1, month1: 2.1, month3: 1.8, month6: 5.3, year1: 12.8, year5: 48.5 },
    { region: "Asia", color: "#f59e0b", ytd: 7.8, month1: -0.5, month3: -2.1, month6: 0.5, year1: 5.4, year5: 32.1 },
    { region: "Asia-Pacific", color: "#ec4899", ytd: 12.5, month1: 1.7, month3: 0.9, month6: 3.7, year1: 9.2, year5: 42.3 },
    { region: "South America", color: "#8b5cf6", ytd: 18.2, month1: 3.2, month3: 2.5, month6: 6.8, year1: 15.7, year5: 51.9 },
  ],
  sectorPerformance: [
    { sector: "Technology", value: 28.7, ytdChange: 54.2 },
    { sector: "Healthcare", value: 12.5, ytdChange: 8.7 },
    { sector: "Financials", value: 15.8, ytdChange: 18.5 },
    { sector: "Consumer Discretionary", value: 14.2, ytdChange: 29.8 },
    { sector: "Communication Services", value: 10.3, ytdChange: 43.7 },
    { sector: "Industrials", value: 9.5, ytdChange: 14.2 },
    { sector: "Consumer Staples", value: 5.8, ytdChange: 3.4 },
    { sector: "Energy", value: 3.2, ytdChange: -8.5 },
    { sector: "Utilities", value: 2.6, ytdChange: -2.3 },
    { sector: "Materials", value: 4.7, ytdChange: 5.8 },
    { sector: "Real Estate", value: 2.9, ytdChange: 6.9 },
  ],
  currencies: [
    { code: "EUR/USD", name: "Euro / US Dollar", rate: 1.0912, change: 0.0048, changePercent: 0.44 },
    { code: "USD/JPY", name: "US Dollar / Japanese Yen", rate: 142.21, change: -0.38, changePercent: -0.27 },
    { code: "GBP/USD", name: "British Pound / US Dollar", rate: 1.2688, change: 0.0070, changePercent: 0.55 },
    { code: "USD/CHF", name: "US Dollar / Swiss Franc", rate: 0.8705, change: -0.0032, changePercent: -0.37 },
    { code: "USD/CAD", name: "US Dollar / Canadian Dollar", rate: 1.3428, change: -0.0035, changePercent: -0.26 },
    { code: "AUD/USD", name: "Australian Dollar / US Dollar", rate: 0.6720, change: 0.0035, changePercent: 0.52 },
    { code: "USD/CNY", name: "US Dollar / Chinese Yuan", rate: 7.1205, change: 0.0085, changePercent: 0.12 },
    { code: "USD/INR", name: "US Dollar / Indian Rupee", rate: 83.04, change: -0.12, changePercent: -0.14 },
    { code: "USD/BRL", name: "US Dollar / Brazilian Real", rate: 4.9236, change: -0.0323, changePercent: -0.65 },
    { code: "USD/MXN", name: "US Dollar / Mexican Peso", rate: 17.2051, change: -0.0689, changePercent: -0.40 },
  ],
  globalEvents: [
    {
      id: 1,
      date: "2023-12-13",
      title: "Fed Signals Interest Rate Cuts in 2024",
      description: "The Federal Reserve kept interest rates steady but signaled three potential rate cuts in 2024 as inflation shows signs of cooling.",
      impact: "high",
      regions: ["North America", "Global"],
      type: "monetary policy"
    },
    {
      id: 2,
      date: "2023-12-14",
      title: "ECB Maintains Current Rate Policy",
      description: "The European Central Bank kept interest rates unchanged, but hinted at possible easing in the coming months if inflation continues to moderate.",
      impact: "medium",
      regions: ["Europe"],
      type: "monetary policy"
    },
    {
      id: 3,
      date: "2023-12-10",
      title: "China Announces Economic Stimulus Package",
      description: "China announced a new economic stimulus package focused on infrastructure and consumption to boost its slowing economy.",
      impact: "high",
      regions: ["Asia", "Global"],
      type: "economic policy"
    },
    {
      id: 4,
      date: "2023-12-12",
      title: "OPEC+ Extends Production Cuts",
      description: "OPEC+ countries agreed to extend oil production cuts through Q1 2024, impacting global energy markets.",
      impact: "medium",
      regions: ["Global"],
      type: "commodities"
    },
    {
      id: 5,
      date: "2023-12-15",
      title: "Japan's Economy Contracts in Q3",
      description: "Japan's economy contracted more than expected in the third quarter, raising concerns about global growth.",
      impact: "medium",
      regions: ["Asia", "Asia-Pacific"],
      type: "economic data"
    },
  ],
  marketHours: [
    { market: "New York Stock Exchange", region: "North America", status: "open", openTime: "09:30", closeTime: "16:00", localTime: "10:45", timeZone: "EST" },
    { market: "NASDAQ", region: "North America", status: "open", openTime: "09:30", closeTime: "16:00", localTime: "10:45", timeZone: "EST" },
    { market: "London Stock Exchange", region: "Europe", status: "open", openTime: "08:00", closeTime: "16:30", localTime: "15:45", timeZone: "GMT" },
    { market: "Tokyo Stock Exchange", region: "Asia", status: "closed", openTime: "09:00", closeTime: "15:00", localTime: "00:45", timeZone: "JST" },
    { market: "Shanghai Stock Exchange", region: "Asia", status: "closed", openTime: "09:30", closeTime: "15:00", localTime: "23:45", timeZone: "CST" },
    { market: "Hong Kong Stock Exchange", region: "Asia", status: "closed", openTime: "09:30", closeTime: "16:00", localTime: "23:45", timeZone: "HKT" },
    { market: "Euronext Paris", region: "Europe", status: "open", openTime: "09:00", closeTime: "17:30", localTime: "16:45", timeZone: "CET" },
    { market: "Frankfurt Stock Exchange", region: "Europe", status: "open", openTime: "09:00", closeTime: "17:30", localTime: "16:45", timeZone: "CET" },
    { market: "Bombay Stock Exchange", region: "Asia", status: "closed", openTime: "09:15", closeTime: "15:30", localTime: "21:15", timeZone: "IST" },
    { market: "Australian Securities Exchange", region: "Asia-Pacific", status: "closed", openTime: "10:00", closeTime: "16:00", localTime: "02:45", timeZone: "AEST" },
    { market: "B3 (Brazil)", region: "South America", status: "closed", openTime: "10:00", closeTime: "17:00", localTime: "12:45", timeZone: "BRT" },
    { market: "Mexican Stock Exchange", region: "North America", status: "open", openTime: "08:30", closeTime: "15:00", localTime: "09:45", timeZone: "CST" },
  ],
  lastUpdated: "2023-12-15T16:45:00Z"
};

// Helper functions
const formatPercentage = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const formatCurrency = (value: number, currency: string = "USD") => {
  // Map of currency codes to symbols
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    JPY: '¥',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '¥',
    HKD: 'HK$',
    INR: '₹',
    KRW: '₩',
    BRL: 'R$',
    MXN: 'MX$'
  };

  const symbol = currencySymbols[currency] || currency;
  
  // Format based on currency
  if (currency === 'JPY' || currency === 'KRW') {
    return `${symbol}${Math.round(value).toLocaleString()}`;
  }
  
  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getChangeColor = (change: number) => {
  if (change > 0) return "text-green-600";
  if (change < 0) return "text-red-600";
  return "text-gray-600";
};

const getChangeBackgroundColor = (change: number) => {
  if (change > 0) return "bg-green-100 text-green-800";
  if (change < 0) return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

const getChangeIcon = (change: number) => {
  if (change > 0) return <TrendingUp className="h-4 w-4" />;
  if (change < 0) return <TrendingDown className="h-4 w-4" />;
  return null;
};

export default function GlobalMarkets() {
  const [timeframe, setTimeframe] = useState("ytd");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Simulate loading global market data
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['/api/global-markets'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return globalMarketData;
    }
  });

  // Filter indices based on search and region
  const filteredIndices = React.useMemo(() => {
    if (!marketData) return [];
    
    const allIndices = [...marketData.majorMarkets, ...marketData.globalIndices];
    
    return allIndices.filter(index => {
      const matchesSearch = 
        searchTerm === '' || 
        index.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        index.country.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesRegion = 
        selectedRegion === 'all' || 
        index.region === selectedRegion;
        
      return matchesSearch && matchesRegion;
    });
  }, [marketData, searchTerm, selectedRegion]);

  // Get performance data for the selected timeframe
  const getPerformanceData = (timeframe: string) => {
    if (!marketData) return [];
    
    return marketData.regionPerformance.map(region => ({
      region: region.region,
      performance: region[timeframe as keyof typeof region] || 0,
      color: region.color
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Markets</h1>
          <p className="text-muted-foreground">
            Real-time data and analysis from markets around the world
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month1">1 Month</SelectItem>
              <SelectItem value="month3">3 Months</SelectItem>
              <SelectItem value="month6">6 Months</SelectItem>
              <SelectItem value="year1">1 Year</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="year5">5 Years</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="shrink-0">
            <Clock className="mr-2 h-4 w-4" />
            Market Hours
          </Button>
          <Button variant="outline" className="shrink-0">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Major Indices Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketData?.majorMarkets.slice(0, 6).map(market => (
          <Card key={market.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-medium">{market.name}</h3>
                  <p className="text-xs text-muted-foreground">{market.country}</p>
                </div>
                <Badge variant="outline">{market.region}</Badge>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-2xl font-bold">
                  {formatCurrency(market.value, market.currency)}
                </div>
                <div className="flex flex-col items-end">
                  <div className={`flex items-center gap-1 font-medium ${getChangeColor(market.changePercent)}`}>
                    {getChangeIcon(market.changePercent)}
                    {formatPercentage(market.changePercent)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(market.change, market.currency)}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Updated: {new Date(market.lastUpdated).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="global-indices" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="global-indices">Global Indices</TabsTrigger>
          <TabsTrigger value="performance">Regional Performance</TabsTrigger>
          <TabsTrigger value="currencies">Foreign Exchange</TabsTrigger>
          <TabsTrigger value="events">Global Events</TabsTrigger>
        </TabsList>
        
        {/* Global Indices Tab */}
        <TabsContent value="global-indices" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input 
                placeholder="Search indices, countries..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="North America">North America</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
                <SelectItem value="Asia">Asia</SelectItem>
                <SelectItem value="Asia-Pacific">Asia-Pacific</SelectItem>
                <SelectItem value="South America">South America</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Global Market Indices</CardTitle>
              <CardDescription>
                Performance of major stock indices around the world
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left font-medium">Index</th>
                      <th className="h-12 px-4 text-left font-medium">Region/Country</th>
                      <th className="h-12 px-4 text-left font-medium">Last Price</th>
                      <th className="h-12 px-4 text-left font-medium">Change</th>
                      <th className="h-12 px-4 text-left font-medium">% Change</th>
                      <th className="h-12 px-4 text-left font-medium">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIndices.map(index => (
                      <tr key={index.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 align-middle font-medium">
                          {index.name}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{index.country}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {index.region}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4 align-middle font-medium">
                          {formatCurrency(index.value, index.currency)}
                        </td>
                        <td className={`p-4 align-middle ${getChangeColor(index.change)}`}>
                          {index.change >= 0 ? "+" : ""}{formatCurrency(index.change, index.currency)}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge className={getChangeBackgroundColor(index.changePercent)}>
                            {index.changePercent >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {formatPercentage(index.changePercent)}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle text-muted-foreground text-xs">
                          {new Date(index.lastUpdated).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Regional Market Performance</CardTitle>
                <CardDescription>
                  {timeframe === 'ytd' ? 'Year-to-date' : 
                   timeframe === 'month1' ? '1-month' :
                   timeframe === 'month3' ? '3-month' :
                   timeframe === 'month6' ? '6-month' :
                   timeframe === 'year1' ? '1-year' : '5-year'} performance by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={getPerformanceData(timeframe)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                      <Bar 
                        dataKey="performance" 
                        name="Performance" 
                        fill={(entry) => entry.color || "#4f46e5"}
                      />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Global Sector Performance</CardTitle>
                <CardDescription>
                  Year-to-date performance by sector across global markets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketData?.sectorPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sector" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, 'YTD Change']} />
                      <Area 
                        type="monotone" 
                        dataKey="ytdChange" 
                        name="YTD Performance" 
                        stroke="#8884d8" 
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Regional Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Regional Market Performance</h3>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {marketData?.regionPerformance.map((region) => (
              <Card key={region.region} className={`border-l-4`} style={{ borderLeftColor: region.color }}>
                <CardContent className="p-4">
                  <h4 className="font-medium">{region.region}</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>YTD:</span>
                      <span className={getChangeColor(region.ytd)}>
                        {formatPercentage(region.ytd)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>1M:</span>
                      <span className={getChangeColor(region.month1)}>
                        {formatPercentage(region.month1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>3M:</span>
                      <span className={getChangeColor(region.month3)}>
                        {formatPercentage(region.month3)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>1Y:</span>
                      <span className={getChangeColor(region.year1)}>
                        {formatPercentage(region.year1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Performance Across Time Periods</CardTitle>
                <CardDescription>
                  Compare regional performance across different timeframes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        type="category"
                        allowDuplicatedCategory={false}
                        data={['1M', '3M', '6M', '1Y', 'YTD', '5Y']}
                      />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                      <Legend />
                      {marketData?.regionPerformance.map((region) => (
                        <Line
                          key={region.region}
                          name={region.region}
                          data={[
                            { period: '1M', value: region.month1 },
                            { period: '3M', value: region.month3 },
                            { period: '6M', value: region.month6 },
                            { period: '1Y', value: region.year1 },
                            { period: 'YTD', value: region.ytd },
                            { period: '5Y', value: region.year5 },
                          ]}
                          dataKey="value"
                          stroke={region.color}
                          activeDot={{ r: 8 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Sector Leadership</CardTitle>
                <CardDescription>
                  Top performing sectors across global markets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  {marketData?.sectorPerformance
                    .sort((a, b) => b.ytdChange - a.ytdChange)
                    .slice(0, 5)
                    .map((sector, index) => (
                      <div key={sector.sector} className="flex items-center gap-3">
                        <div className="flex-none w-6 text-muted-foreground text-sm">{index + 1}</div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h5 className="font-medium">{sector.sector}</h5>
                            <span className={getChangeColor(sector.ytdChange)}>
                              {formatPercentage(sector.ytdChange)}
                            </span>
                          </div>
                          <Progress value={sector.ytdChange} className="h-2" />
                        </div>
                      </div>
                    ))
                  }
                </div>
                
                <div className="space-y-4">
                  <h5 className="font-medium text-sm mb-2">Lagging Sectors</h5>
                  {marketData?.sectorPerformance
                    .sort((a, b) => a.ytdChange - b.ytdChange)
                    .slice(0, 3)
                    .map((sector) => (
                      <div key={sector.sector} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <TrendingDown className={`h-4 w-4 ${getChangeColor(sector.ytdChange)}`} />
                          <span>{sector.sector}</span>
                        </div>
                        <span className={getChangeColor(sector.ytdChange)}>
                          {formatPercentage(sector.ytdChange)}
                        </span>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Market Hours</CardTitle>
              <CardDescription>
                Current trading status of global markets
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium">Market</th>
                      <th className="h-10 px-4 text-left font-medium">Region</th>
                      <th className="h-10 px-4 text-left font-medium">Status</th>
                      <th className="h-10 px-4 text-left font-medium">Hours (Local)</th>
                      <th className="h-10 px-4 text-left font-medium">Local Time</th>
                      <th className="h-10 px-4 text-left font-medium">Time Zone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData?.marketHours.map((market) => (
                      <tr key={market.market} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-2 px-4 align-middle font-medium">
                          {market.market}
                        </td>
                        <td className="p-2 px-4 align-middle">
                          {market.region}
                        </td>
                        <td className="p-2 px-4 align-middle">
                          <Badge variant={
                            market.status === 'open' ? 'default' :
                            market.status === 'closed' ? 'secondary' :
                            market.status === 'pre-market' ? 'outline' : 'outline'
                          }>
                            {market.status === 'open' && <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />}
                            {market.status.charAt(0).toUpperCase() + market.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-2 px-4 align-middle">
                          {market.openTime} - {market.closeTime}
                        </td>
                        <td className="p-2 px-4 align-middle">
                          {market.localTime}
                        </td>
                        <td className="p-2 px-4 align-middle">
                          {market.timeZone}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Currencies Tab */}
        <TabsContent value="currencies" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Foreign Exchange Rates</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData?.currencies.slice(0, 6).map((currency) => (
              <Card key={currency.code} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-medium">{currency.code}</h3>
                      <p className="text-xs text-muted-foreground">{currency.name}</p>
                    </div>
                    <Badge variant={currency.changePercent >= 0 ? 'default' : 'destructive'}>
                      {currency.changePercent >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {formatPercentage(currency.changePercent)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-2xl font-bold">
                      {currency.rate.toFixed(4)}
                    </div>
                    <div className={`text-sm ${getChangeColor(currency.change)}`}>
                      {currency.change >= 0 ? "+" : ""}{currency.change.toFixed(4)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">All Currency Pairs</CardTitle>
              <CardDescription>
                Performance of major global currency pairs
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium">Currency Pair</th>
                      <th className="h-10 px-4 text-left font-medium">Description</th>
                      <th className="h-10 px-4 text-left font-medium">Rate</th>
                      <th className="h-10 px-4 text-left font-medium">Daily Change</th>
                      <th className="h-10 px-4 text-left font-medium">% Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData?.currencies.map((currency) => (
                      <tr key={currency.code} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-3 px-4 align-middle font-medium">
                          {currency.code}
                        </td>
                        <td className="p-3 px-4 align-middle">
                          {currency.name}
                        </td>
                        <td className="p-3 px-4 align-middle font-medium">
                          {currency.rate.toFixed(4)}
                        </td>
                        <td className={`p-3 px-4 align-middle ${getChangeColor(currency.change)}`}>
                          {currency.change >= 0 ? "+" : ""}{currency.change.toFixed(4)}
                        </td>
                        <td className="p-3 px-4 align-middle">
                          <Badge className={getChangeBackgroundColor(currency.changePercent)}>
                            {currency.changePercent >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {formatPercentage(currency.changePercent)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Major Currencies vs USD</CardTitle>
                <CardDescription>
                  Performance of major currencies against the US dollar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart 
                      data={marketData?.currencies
                        .filter(c => c.code.includes('/USD') || c.code.includes('USD/'))
                        .map(c => ({
                          currency: c.code,
                          change: c.changePercent
                        }))
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="currency" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Change']} />
                      <Bar 
                        dataKey="change" 
                        name="% Change" 
                        fill={(entry) => entry.change >= 0 ? "#10b981" : "#ef4444"}
                      />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Currency Strength Map</CardTitle>
                <CardDescription>
                  Relative strength of global currencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={
                          marketData?.currencies
                            .filter(c => c.code.indexOf('/') === 3)
                            .map(c => ({
                              name: c.code.slice(0, 3),
                              value: Math.abs(c.changePercent) * 10 + 5,
                              isPositive: c.changePercent > 0
                            }))
                        }
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={1}
                        dataKey="value"
                      >
                        {marketData?.currencies
                          .filter(c => c.code.indexOf('/') === 3)
                          .map((c, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={c.changePercent > 0 ? "#10b981" : "#ef4444"} 
                            />
                          ))
                        }
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          props.payload.isPositive ? 'Strengthening' : 'Weakening', 
                          props.payload.name
                        ]} 
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Global Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recent Global Events</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Region
              </Button>
              <Button variant="outline" size="sm">
                <Clock className="mr-2 h-4 w-4" />
                Economic Calendar
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {marketData?.globalEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 p-3 rounded-md mt-1 
                      ${event.impact === 'high' 
                        ? 'bg-red-50 text-red-600' 
                        : event.impact === 'medium'
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {event.impact === 'high' ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : event.impact === 'medium' ? (
                        <Info className="h-5 w-5" />
                      ) : (
                        <Info className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={
                            event.impact === 'high' ? 'destructive' : 
                            event.impact === 'medium' ? 'secondary' : 'outline'
                          }>
                            {event.impact.toUpperCase()} IMPACT
                          </Badge>
                          <Badge variant="outline">
                            {event.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          {event.regions.map((region, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {region}
                            </Badge>
                          ))}
                          <Button variant="outline" size="sm">
                            Analysis
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Upcoming Economic Events</CardTitle>
              <CardDescription>
                Key economic events that may impact global markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="font-medium text-sm text-center w-16">
                    <div className="text-muted-foreground">Dec</div>
                    <div className="text-xl">18</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">EU Consumer Price Index (CPI)</h4>
                    <p className="text-sm text-muted-foreground">Expected: 2.2% YoY</p>
                  </div>
                  <Badge>High Impact</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="font-medium text-sm text-center w-16">
                    <div className="text-muted-foreground">Dec</div>
                    <div className="text-xl">20</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Bank of Japan Interest Rate Decision</h4>
                    <p className="text-sm text-muted-foreground">Expected: No change</p>
                  </div>
                  <Badge>High Impact</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="font-medium text-sm text-center w-16">
                    <div className="text-muted-foreground">Dec</div>
                    <div className="text-xl">22</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">US GDP Growth Rate (Q3 Final)</h4>
                    <p className="text-sm text-muted-foreground">Expected: 4.9% QoQ</p>
                  </div>
                  <Badge variant="secondary">Medium Impact</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="font-medium text-sm text-center w-16">
                    <div className="text-muted-foreground">Dec</div>
                    <div className="text-xl">28</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">China Manufacturing PMI</h4>
                    <p className="text-sm text-muted-foreground">Expected: 49.7</p>
                  </div>
                  <Badge variant="secondary">Medium Impact</Badge>
                </div>
                
                <div className="flex justify-center mt-2">
                  <Button variant="outline">
                    View Full Calendar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}