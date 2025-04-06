import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { BackButton } from "@/components/ui/back-button";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowDownUp,
  Calculator,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CopyCheck,
  Download,
  FileDown,
  Filter,
  HelpCircle,
  Info,
  LineChart,
  PlaySquare,
  RefreshCcw,
  Settings2,
  Slash,
  TrendingDown,
  ArrowRight,
  DollarSign,
  Banknote,
  Repeat,
  BarChart3,
  PiggyBank
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
  LineChart as ReLineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Sample data for tax-loss harvesting
const taxLossOpportunities = [
  {
    id: 1,
    ticker: "AAPL",
    name: "Apple Inc.",
    purchaseDate: "2023-01-15",
    purchasePrice: 135.25,
    currentPrice: 120.60,
    quantity: 50,
    unrealizedLoss: 730.00,
    taxSavings: 175.20,
    holdingPeriod: "Long-term",
    recommendation: "Harvest",
    confidence: 92,
    alternative: {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      correlation: 0.82,
      performance30d: 3.5,
      performance90d: -2.1
    }
  },
  {
    id: 2,
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    purchaseDate: "2023-04-10",
    purchasePrice: 102.30,
    currentPrice: 96.85,
    quantity: 40,
    unrealizedLoss: 218.00,
    taxSavings: 52.32,
    holdingPeriod: "Short-term",
    recommendation: "Hold",
    confidence: 65,
    alternative: {
      ticker: "GOOG",
      name: "Alphabet Inc.",
      correlation: 0.78,
      performance30d: 1.2,
      performance90d: -0.8
    }
  },
  {
    id: 3,
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    purchaseDate: "2022-11-22",
    purchasePrice: 320.50,
    currentPrice: 280.30,
    quantity: 30,
    unrealizedLoss: 1206.00,
    taxSavings: 289.44,
    holdingPeriod: "Long-term",
    recommendation: "Harvest",
    confidence: 88,
    alternative: {
      ticker: "AMD",
      name: "Advanced Micro Devices, Inc.",
      correlation: 0.91,
      performance30d: 2.7,
      performance90d: -3.5
    }
  },
  {
    id: 4,
    ticker: "JPM",
    name: "JPMorgan Chase & Co.",
    purchaseDate: "2023-03-05",
    purchasePrice: 145.80,
    currentPrice: 138.25,
    quantity: 65,
    unrealizedLoss: 490.75,
    taxSavings: 117.78,
    holdingPeriod: "Short-term",
    recommendation: "Harvest",
    confidence: 85,
    alternative: {
      ticker: "BAC",
      name: "Bank of America Corporation",
      correlation: 0.88,
      performance30d: -1.2,
      performance90d: -4.5
    }
  },
  {
    id: 5,
    ticker: "DIS",
    name: "The Walt Disney Company",
    purchaseDate: "2023-02-08",
    purchasePrice: 110.25,
    currentPrice: 102.60,
    quantity: 80,
    unrealizedLoss: 612.00,
    taxSavings: 146.88,
    holdingPeriod: "Short-term",
    recommendation: "Hold",
    confidence: 72,
    alternative: {
      ticker: "NFLX",
      name: "Netflix, Inc.",
      correlation: 0.65,
      performance30d: 5.2,
      performance90d: 8.7
    }
  },
];

const portfolioTaxSummary = {
  totalUnrealizedGains: 15820.50,
  totalUnrealizedLosses: 8490.25,
  netTaxableGain: 7330.25,
  estimatedTaxLiability: 1759.26,
  potentialTaxSavings: 2037.66,
  yearToDateRealizedGains: 5230.75,
  yearToDateRealizedLosses: 1850.20,
  carryForwardLosses: 0,
  harvestableLosses: 8490.25,
  harvestRecommendations: 3,
  lastUpdated: "2023-12-15T10:30:00Z"
};

const taxRateSettings = {
  shortTermRate: 24,
  longTermRate: 15,
  stateRate: 5,
  adjustForWashSale: true,
  minimumLossThreshold: 250,
  minimumDaysSinceLastHarvest: 45,
  autoPairWithAlternatives: true,
  harvestStrategy: "aggressive", // conservative, moderate, aggressive
};

const historicalHarvests = [
  {
    id: 1,
    date: "2023-10-12",
    ticker: "TSLA",
    realizedLoss: 1480.50,
    taxSavings: 355.32,
    alternativePurchased: "LCID",
    status: "completed"
  },
  {
    id: 2,
    date: "2023-09-28",
    ticker: "META",
    realizedLoss: 920.25,
    taxSavings: 220.86,
    alternativePurchased: "SNAP",
    status: "completed"
  },
  {
    id: 3,
    date: "2023-08-15",
    ticker: "PYPL",
    realizedLoss: 610.80,
    taxSavings: 146.59,
    alternativePurchased: "SQ",
    status: "completed"
  },
  {
    id: 4,
    date: "2023-11-05",
    ticker: "INTC",
    realizedLoss: 385.40,
    taxSavings: 92.50,
    alternativePurchased: "MU",
    status: "scheduled"
  },
];

const monthlyTaxSavingsData = [
  { month: "Jan", savings: 0 },
  { month: "Feb", savings: 0 },
  { month: "Mar", savings: 0 },
  { month: "Apr", savings: 180.25 },
  { month: "May", savings: 0 },
  { month: "Jun", savings: 95.60 },
  { month: "Jul", savings: 240.30 },
  { month: "Aug", savings: 146.59 },
  { month: "Sep", savings: 220.86 },
  { month: "Oct", savings: 355.32 },
  { month: "Nov", savings: 92.50 },
  { month: "Dec", savings: 706.24 },
];

// Get recommendation badge color
const getRecommendationColor = (recommendation: string) => {
  if (recommendation === 'Harvest') return 'bg-green-100 text-green-800';
  if (recommendation === 'Hold') return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800'; // Avoid
};

// Get recommendation badge variant
const getRecommendationVariant = (recommendation: string): "default" | "secondary" | "destructive" | "outline" => {
  if (recommendation === 'Harvest') return "default";
  if (recommendation === 'Hold') return "outline";
  return "destructive"; // Avoid
};

// Get confidence level text and color
const getConfidenceLevel = (score: number) => {
  if (score >= 85) return { text: 'Very High', color: 'text-green-600' };
  if (score >= 70) return { text: 'High', color: 'text-green-500' };
  if (score >= 50) return { text: 'Moderate', color: 'text-yellow-500' };
  if (score >= 30) return { text: 'Low', color: 'text-orange-500' };
  return { text: 'Very Low', color: 'text-red-500' };
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// Format percentages
const formatPercentage = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export default function TaxHarvesting() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(1);
  const [selectedHarvests, setSelectedHarvests] = useState<number[]>([]);
  const [autoHarvestEnabled, setAutoHarvestEnabled] = useState(false);
  const [harvestStrategy, setHarvestStrategy] = useState(taxRateSettings.harvestStrategy);
  
  // Simulate loading tax-loss harvesting data
  const { data: taxHarvestingData, isLoading } = useQuery({
    queryKey: ['/api/tax-harvesting'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        opportunities: taxLossOpportunities,
        portfolioTaxSummary,
        taxRateSettings,
        historicalHarvests,
        monthlyTaxSavingsData,
        lastUpdated: "2023-12-15T10:30:00Z",
      };
    }
  });

  // Get current selected opportunity
  const currentOpportunity = selectedOpportunity 
    ? taxHarvestingData?.opportunities.find(opp => opp.id === selectedOpportunity)
    : taxHarvestingData?.opportunities[0];

  // Toggle harvest selection
  const toggleHarvestSelection = (id: number) => {
    if (selectedHarvests.includes(id)) {
      setSelectedHarvests(selectedHarvests.filter(h => h !== id));
    } else {
      setSelectedHarvests([...selectedHarvests, id]);
    }
  };

  // Execute selected harvests
  const executeSelectedHarvests = () => {
    console.log('Executing tax-loss harvesting for:', selectedHarvests);
    // In a real app, this would call a backend API to execute the trades
  };

  // Calculate total potential tax savings from selected harvests
  const calculateSelectedSavings = () => {
    if (!taxHarvestingData) return 0;
    
    return taxHarvestingData.opportunities
      .filter(opp => selectedHarvests.includes(opp.id))
      .reduce((total, opp) => total + opp.taxSavings, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-3xl font-bold tracking-tight">Tax-Loss Harvesting</h1>
            <Badge variant="secondary" className="ml-2">
              <Calculator className="mr-1 h-3.5 w-3.5" />
              Automated
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Optimize your tax efficiency with automated loss harvesting strategies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="shrink-0">
            <Download className="mr-2 h-4 w-4" />
            Export Tax Report
          </Button>
          <Button className="shrink-0">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* Tax Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                Current Tax Position Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Net Taxable Gain/Loss:</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(portfolioTaxSummary.netTaxableGain)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Est. Tax Liability:</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(portfolioTaxSummary.estimatedTaxLiability)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Harvestable Losses:</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(portfolioTaxSummary.harvestableLosses)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Potential Tax Savings:</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(portfolioTaxSummary.potentialTaxSavings)}
                  </p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                Last updated: {portfolioTaxSummary.lastUpdated 
                  ? new Date(portfolioTaxSummary.lastUpdated).toLocaleString() 
                  : ""}
              </div>
            </div>
            <div className="w-full md:w-[300px] h-[140px]">
              <h4 className="text-sm font-medium mb-2">Year-to-Date Tax Savings</h4>
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={monthlyTaxSavingsData}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis width={40} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Tax Savings']}
                    labelFormatter={(label) => `${label}`} 
                  />
                  <Bar dataKey="savings" fill="#10B981" name="Tax Savings" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="opportunities">Harvest Opportunities</TabsTrigger>
          <TabsTrigger value="historical">Historical Harvests</TabsTrigger>
          <TabsTrigger value="settings">Harvesting Settings</TabsTrigger>
          <TabsTrigger value="analytics">Tax Analytics</TabsTrigger>
        </TabsList>
        
        {/* Harvest Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          {/* Auto-Harvest Settings */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-harvest" 
                      checked={autoHarvestEnabled}
                      onCheckedChange={setAutoHarvestEnabled}
                    />
                    <Label htmlFor="auto-harvest" className="font-medium">
                      Auto Tax-Loss Harvesting
                    </Label>
                  </div>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={harvestStrategy} onValueChange={setHarvestStrategy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Harvesting strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm">
                    <Settings2 className="mr-2 h-4 w-4" />
                    Strategy Details
                  </Button>
                </div>
              </div>

              {autoHarvestEnabled && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Automatic Tax-Loss Harvesting is currently enabled
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        The system will automatically execute tax-loss harvesting trades when
                        opportunities meet your criteria. You're using the {' '}
                        <span className="font-medium">{harvestStrategy.charAt(0).toUpperCase() + harvestStrategy.slice(1)}</span> strategy
                        which {
                          harvestStrategy === 'conservative' 
                            ? 'prioritizes avoiding wash sales and only harvests significant losses.' 
                            : harvestStrategy === 'moderate'
                              ? 'balances tax efficiency with maintaining overall investment strategy.' 
                              : 'maximizes tax savings by aggressively harvesting all eligible losses.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Split view - Opportunities list and details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Opportunities list */}
            <div className="md:col-span-1 border rounded-lg overflow-hidden">
              <div className="bg-muted p-3 border-b flex justify-between items-center">
                <h3 className="font-medium text-sm">Available Harvesting Opportunities</h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {taxLossOpportunities.length} opportunities
                </Badge>
              </div>
              
              <div className="p-3 border-b">
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Search opportunities..." 
                    className="text-sm"
                  />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {taxLossOpportunities.map((opportunity) => (
                  <div 
                    key={opportunity.id}
                    className={`p-3 cursor-pointer transition-colors hover:bg-muted/50
                      ${selectedOpportunity === opportunity.id ? 'bg-muted/50 border-l-4 border-l-primary' : ''}`}
                    onClick={() => setSelectedOpportunity(opportunity.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          checked={selectedHarvests.includes(opportunity.id)}
                          onCheckedChange={() => toggleHarvestSelection(opportunity.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <h4 className="font-medium text-sm">{opportunity.ticker}</h4>
                          <p className="text-xs text-muted-foreground">{opportunity.name}</p>
                        </div>
                      </div>
                      <Badge variant={getRecommendationVariant(opportunity.recommendation)}>
                        {opportunity.recommendation}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <div className="text-red-500 font-medium">
                        {formatCurrency(opportunity.unrealizedLoss)}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Save:</span>
                        <span className="text-green-600 font-medium">
                          {formatCurrency(opportunity.taxSavings)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedHarvests.length > 0 && (
                <div className="p-3 border-t bg-muted">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <div>
                      <span className="font-medium">{selectedHarvests.length}</span> selected
                    </div>
                    <div className="text-green-600 font-medium">
                      {formatCurrency(calculateSelectedSavings())}
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={executeSelectedHarvests}
                  >
                    <CopyCheck className="mr-2 h-4 w-4" />
                    Execute Selected Harvests
                  </Button>
                </div>
              )}
            </div>
            
            {/* Opportunity details */}
            <div className="md:col-span-2">
              {currentOpportunity ? (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle>{currentOpportunity.ticker}</CardTitle>
                          <Badge variant={getRecommendationVariant(currentOpportunity.recommendation)}>
                            {currentOpportunity.recommendation}
                          </Badge>
                        </div>
                        <CardDescription className="mt-1">
                          {currentOpportunity.name} • Purchased on {new Date(currentOpportunity.purchaseDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <PlaySquare className="mr-2 h-4 w-4" />
                          Simulate Harvest
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => toggleHarvestSelection(currentOpportunity.id)}
                        >
                          {selectedHarvests.includes(currentOpportunity.id) ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Selected
                            </>
                          ) : (
                            <>
                              <Calculator className="mr-2 h-4 w-4" />
                              Select for Harvest
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Purchase Price</p>
                          <div className="text-sm font-bold">
                            {formatCurrency(currentOpportunity.purchasePrice)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                          <div className="text-sm font-bold">
                            {formatCurrency(currentOpportunity.currentPrice)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                          <div className="text-sm font-bold">
                            {currentOpportunity.quantity} shares
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-red-50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Unrealized Loss</p>
                          <div className="text-sm font-bold text-red-600">
                            {formatCurrency(currentOpportunity.unrealizedLoss)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Potential Tax Savings</p>
                          <div className="text-sm font-bold text-green-600">
                            {formatCurrency(currentOpportunity.taxSavings)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50 border-none">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">Holding Period</p>
                          <div className="text-sm font-bold">
                            {currentOpportunity.holdingPeriod}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Confidence and Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Analysis Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>AI Confidence Level:</span>
                                <span className={getConfidenceLevel(currentOpportunity.confidence).color}>
                                  {currentOpportunity.confidence}% ({getConfidenceLevel(currentOpportunity.confidence).text})
                                </span>
                              </div>
                              <Progress value={currentOpportunity.confidence} className="h-2" />
                            </div>
                            
                            <div className="pt-2 space-y-2">
                              <div className="flex items-start gap-2">
                                {currentOpportunity.recommendation === 'Harvest' ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                )}
                                <div className="text-sm">
                                  <span className="font-medium">
                                    {currentOpportunity.recommendation === 'Harvest'
                                      ? 'Recommended for harvest'
                                      : 'Holding recommended at this time'}
                                  </span>
                                  <p className="text-muted-foreground text-xs mt-0.5">
                                    {currentOpportunity.recommendation === 'Harvest'
                                      ? `Harvesting this position could save ${formatCurrency(currentOpportunity.taxSavings)} in taxes.`
                                      : 'The potential tax savings don\'t outweigh the transaction costs and market timing risks.'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-2">
                                <CalendarClock className="h-4 w-4 text-blue-500 mt-0.5" />
                                <div className="text-sm">
                                  <span className="font-medium">
                                    {currentOpportunity.holdingPeriod} capital loss
                                  </span>
                                  <p className="text-muted-foreground text-xs mt-0.5">
                                    {currentOpportunity.holdingPeriod === 'Long-term'
                                      ? 'Held for more than 1 year, subject to long-term capital gains tax rate.'
                                      : 'Held for less than 1 year, subject to short-term capital gains tax rate.'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                <div className="text-sm">
                                  <span className="font-medium">
                                    Wash sale considerations
                                  </span>
                                  <p className="text-muted-foreground text-xs mt-0.5">
                                    Ensure you don't purchase substantially identical securities
                                    within 30 days before or after the sale to avoid wash sale rules.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Recommended Alternative</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <div className="font-medium">
                                {currentOpportunity.alternative.ticker}
                                <span className="text-muted-foreground font-normal ml-2 text-sm">
                                  {currentOpportunity.alternative.name}
                                </span>
                              </div>
                              <Badge variant="outline">
                                {(currentOpportunity.alternative.correlation * 100).toFixed(0)}% Correlation
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              This alternative security has similar characteristics to {currentOpportunity.ticker}
                              but is not considered "substantially identical" for wash sale purposes.
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">30-Day Performance</p>
                              <p className={`text-sm font-medium ${
                                currentOpportunity.alternative.performance30d >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatPercentage(currentOpportunity.alternative.performance30d)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">90-Day Performance</p>
                              <p className={`text-sm font-medium ${
                                currentOpportunity.alternative.performance90d >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatPercentage(currentOpportunity.alternative.performance90d)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2 bg-blue-50 p-2 rounded-md text-xs text-blue-700">
                            <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                            <div>
                              Purchasing this alternative immediately after selling {currentOpportunity.ticker}
                              allows you to maintain similar market exposure while capturing tax losses.
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Button variant="outline" size="sm" className="w-full">
                              View Detailed Comparison
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Tax Implications */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tax Implications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium mb-3">Current Position</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Cost Basis:</span>
                                <span className="font-medium">
                                  {formatCurrency(currentOpportunity.purchasePrice * currentOpportunity.quantity)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Current Value:</span>
                                <span className="font-medium">
                                  {formatCurrency(currentOpportunity.currentPrice * currentOpportunity.quantity)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Unrealized Loss:</span>
                                <span className="font-medium text-red-600">
                                  {formatCurrency(currentOpportunity.unrealizedLoss)}
                                </span>
                              </div>
                              <div className="pt-2 border-t mt-2">
                                <div className="flex justify-between text-sm">
                                  <span>Applicable Tax Rate:</span>
                                  <span className="font-medium">
                                    {currentOpportunity.holdingPeriod === 'Long-term' 
                                      ? `${taxRateSettings.longTermRate}%` 
                                      : `${taxRateSettings.shortTermRate}%`}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>State Tax Rate:</span>
                                  <span className="font-medium">
                                    {taxRateSettings.stateRate}%
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm font-medium mt-2">
                                  <span>Potential Tax Savings:</span>
                                  <span className="text-green-600">
                                    {formatCurrency(currentOpportunity.taxSavings)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-3">Portfolio Impact</h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <ArrowDownUp className="h-4 w-4 text-blue-500" />
                                <span>
                                  This harvest represents <span className="font-medium">
                                    {((currentOpportunity.unrealizedLoss / portfolioTaxSummary.totalUnrealizedLosses) * 100).toFixed(1)}%
                                  </span> of your total harvestable losses.
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <Banknote className="h-4 w-4 text-green-500" />
                                <span>
                                  Harvesting will reduce your estimated tax liability by <span className="font-medium">
                                    {((currentOpportunity.taxSavings / portfolioTaxSummary.estimatedTaxLiability) * 100).toFixed(1)}%
                                  </span>.
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <Repeat className="h-4 w-4 text-purple-500" />
                                <span>
                                  You can repurchase this security after <span className="font-medium">
                                    {new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}
                                  </span> to avoid wash sale rules.
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <BarChart3 className="h-4 w-4 text-orange-500" />
                                <span>
                                  Your YTD realized losses would increase to <span className="font-medium">
                                    {formatCurrency(portfolioTaxSummary.yearToDateRealizedLosses + currentOpportunity.unrealizedLoss)}
                                  </span>.
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-3 border-t">
                              <Button 
                                variant={selectedHarvests.includes(currentOpportunity.id) ? "secondary" : "default"}
                                className="w-full"
                                onClick={() => toggleHarvestSelection(currentOpportunity.id)}
                              >
                                {selectedHarvests.includes(currentOpportunity.id) ? (
                                  <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Selected for Harvesting
                                  </>
                                ) : (
                                  <>
                                    <PiggyBank className="mr-2 h-4 w-4" />
                                    Select for Harvesting
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-10 border rounded-lg">
                  <Calculator className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Opportunity Selected</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Select a tax-loss harvesting opportunity from the list to view detailed analysis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Historical Harvests Tab */}
        <TabsContent value="historical">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-medium">Historical Tax-Loss Harvests</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export History
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left font-medium">Date</th>
                      <th className="h-12 px-4 text-left font-medium">Security</th>
                      <th className="h-12 px-4 text-left font-medium">Realized Loss</th>
                      <th className="h-12 px-4 text-left font-medium">Tax Savings</th>
                      <th className="h-12 px-4 text-left font-medium">Alternative</th>
                      <th className="h-12 px-4 text-left font-medium">Status</th>
                      <th className="h-12 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalHarvests.map(harvest => (
                      <tr key={harvest.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 align-middle">
                          {new Date(harvest.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle font-medium">
                          {harvest.ticker}
                        </td>
                        <td className="p-4 align-middle text-red-600">
                          {formatCurrency(harvest.realizedLoss)}
                        </td>
                        <td className="p-4 align-middle text-green-600">
                          {formatCurrency(harvest.taxSavings)}
                        </td>
                        <td className="p-4 align-middle">
                          {harvest.alternativePurchased}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={harvest.status === 'completed' ? 'default' : 'secondary'}>
                            {harvest.status === 'completed' ? (
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                            ) : (
                              <CalendarClock className="mr-1 h-3 w-3" />
                            )}
                            {harvest.status.charAt(0).toUpperCase() + harvest.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Year-to-Date Tax Saving Summary</CardTitle>
                <CardDescription>
                  Overview of tax savings from harvest transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={monthlyTaxSavingsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Tax Savings']} />
                        <Line 
                          type="monotone" 
                          dataKey="savings" 
                          stroke="#059669" 
                          fill="#059669"
                          activeDot={{ r: 8 }}
                        />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium mb-1">Total Realized Losses</h4>
                          <p className="text-xl font-bold text-red-600">
                            {formatCurrency(portfolioTaxSummary.yearToDateRealizedLosses)}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium mb-1">Total Tax Savings</h4>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(
                              historicalHarvests
                                .filter(h => h.status === 'completed')
                                .reduce((sum, h) => sum + h.taxSavings, 0)
                            )}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium mb-1">Completed Harvests</h4>
                          <p className="text-xl font-bold">
                            {historicalHarvests.filter(h => h.status === 'completed').length}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium mb-1">Pending Harvests</h4>
                          <p className="text-xl font-bold">
                            {historicalHarvests.filter(h => h.status === 'scheduled').length}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-4 p-4 border rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Tax-Loss Harvesting Efficiency</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Harvest Opportunity Capture Rate</span>
                            <span>85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Tax Savings vs. Total Portfolio Value</span>
                            <span>2.3%</span>
                          </div>
                          <Progress value={23} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Tax Savings vs. Potential Maximum</span>
                            <span>76%</span>
                          </div>
                          <Progress value={76} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Harvesting Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Tax Harvesting Preferences</CardTitle>
                  <CardDescription>
                    Configure your tax-loss harvesting strategy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-harvest-toggle">Automatic Harvesting</Label>
                      <Switch 
                        id="auto-harvest-toggle"
                        checked={autoHarvestEnabled}
                        onCheckedChange={setAutoHarvestEnabled}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      When enabled, the system will automatically execute tax-loss harvesting trades
                      according to your strategy settings.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Harvesting Strategy</Label>
                    <Select value={harvestStrategy} onValueChange={setHarvestStrategy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {harvestStrategy === 'conservative' 
                        ? 'Conservative: Only harvest significant losses, prioritize avoiding wash sales.' 
                        : harvestStrategy === 'moderate'
                          ? 'Moderate: Balance tax efficiency with maintaining investment exposure.' 
                          : 'Aggressive: Maximize tax savings by harvesting all eligible losses.'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="wash-sale-toggle">Wash Sale Protection</Label>
                      <Switch 
                        id="wash-sale-toggle"
                        checked={taxRateSettings.adjustForWashSale}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Prevent trades that could trigger wash sale rules by enforcing a 30-day waiting period.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-alternatives-toggle">Automatic Alternatives</Label>
                      <Switch 
                        id="auto-alternatives-toggle"
                        checked={taxRateSettings.autoPairWithAlternatives}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automatically suggest and purchase similar (but not identical) securities
                      to maintain market exposure.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full">
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Detailed Tax Settings</CardTitle>
                  <CardDescription>
                    Configure tax rates and thresholds for optimal harvesting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="short-term-rate">Short-Term Capital Gains Rate (%)</Label>
                        <Input 
                          id="short-term-rate"
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={taxRateSettings.shortTermRate}
                        />
                        <p className="text-xs text-muted-foreground">
                          The tax rate applied to investments held for less than one year.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="long-term-rate">Long-Term Capital Gains Rate (%)</Label>
                        <Input 
                          id="long-term-rate"
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={taxRateSettings.longTermRate}
                        />
                        <p className="text-xs text-muted-foreground">
                          The tax rate applied to investments held for more than one year.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state-rate">State Tax Rate (%)</Label>
                        <Input 
                          id="state-rate"
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={taxRateSettings.stateRate}
                        />
                        <p className="text-xs text-muted-foreground">
                          Your state's tax rate on capital gains.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-loss-threshold">Minimum Loss Threshold ($)</Label>
                        <Input 
                          id="min-loss-threshold"
                          type="number"
                          min="0"
                          defaultValue={taxRateSettings.minimumLossThreshold}
                        />
                        <p className="text-xs text-muted-foreground">
                          Only consider harvesting losses above this dollar amount.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="min-days">Minimum Days Between Harvests</Label>
                        <Input 
                          id="min-days"
                          type="number"
                          min="0"
                          defaultValue={taxRateSettings.minimumDaysSinceLastHarvest}
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum time between harvesting the same security.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="correlation-threshold">Correlation Threshold</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="correlation-threshold"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="75"
                          />
                          <span>%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Minimum correlation required for suggested alternative securities.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button variant="outline">
                        Reset to Defaults
                      </Button>
                      <Button>
                        Save Tax Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Advanced Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notification Preferences</Label>
                        <p className="text-sm text-muted-foreground">
                          Configure when you receive tax-loss harvesting alerts
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Tax-Loss Harvesting Schedule</Label>
                        <p className="text-sm text-muted-foreground">
                          Set custom scheduling for automated harvesting
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Custom Exclusion List</Label>
                        <p className="text-sm text-muted-foreground">
                          Exclude specific securities from harvesting
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Tax Document Integration</Label>
                        <p className="text-sm text-muted-foreground">
                          Connect with tax preparation software
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Tax Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Tax Savings Distribution</CardTitle>
                <CardDescription>
                  Distribution of tax savings by month and security type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={monthlyTaxSavingsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Tax Savings']} />
                      <Bar dataKey="savings" fill="#0F766E" name="Tax Savings" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Tax-Loss Sources</CardTitle>
                <CardDescription>
                  Sources of realized tax losses by sector
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Technology", value: 3800 },
                          { name: "Financial", value: 1650 },
                          { name: "Healthcare", value: 950 },
                          { name: "Consumer", value: 1250 },
                          { name: "Energy", value: 840 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#3B82F6" />
                        <Cell fill="#10B981" />
                        <Cell fill="#F59E0B" />
                        <Cell fill="#6366F1" />
                        <Cell fill="#EC4899" />
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Tax Loss']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Year-to-Date Tax Analysis</CardTitle>
              <CardDescription>
                Comprehensive analysis of your tax position and harvesting efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Tax Position Summary</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-muted/30">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">YTD Realized Gains</p>
                          <p className="font-medium text-green-600">
                            {formatCurrency(portfolioTaxSummary.yearToDateRealizedGains)}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">YTD Realized Losses</p>
                          <p className="font-medium text-red-600">
                            {formatCurrency(portfolioTaxSummary.yearToDateRealizedLosses)}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">YTD Net Taxable</p>
                          <p className="font-medium">
                            {formatCurrency(
                              portfolioTaxSummary.yearToDateRealizedGains - 
                              portfolioTaxSummary.yearToDateRealizedLosses
                            )}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/30">
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">YTD Tax Savings</p>
                          <p className="font-medium text-green-600">
                            {formatCurrency(
                              historicalHarvests
                                .filter(h => h.status === 'completed')
                                .reduce((sum, h) => sum + h.taxSavings, 0)
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Unrealized Position</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Unrealized Gains</span>
                            <span className="text-green-600">
                              {formatCurrency(portfolioTaxSummary.totalUnrealizedGains)}
                            </span>
                          </div>
                          <Progress value={(portfolioTaxSummary.totalUnrealizedGains / 
                            (portfolioTaxSummary.totalUnrealizedGains + 
                              portfolioTaxSummary.totalUnrealizedLosses)) * 100} 
                            className="h-2 bg-red-100"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Unrealized Losses</span>
                            <span className="text-red-600">
                              {formatCurrency(portfolioTaxSummary.totalUnrealizedLosses)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Harvesting Opportunity</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Harvested Losses</span>
                            <span>
                              {formatCurrency(portfolioTaxSummary.yearToDateRealizedLosses)}
                            </span>
                          </div>
                          <Progress value={(portfolioTaxSummary.yearToDateRealizedLosses / 
                            (portfolioTaxSummary.yearToDateRealizedLosses + 
                              portfolioTaxSummary.harvestableLosses)) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Remaining Opportunity</span>
                            <span className="text-blue-600">
                              {formatCurrency(portfolioTaxSummary.harvestableLosses)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Harvesting Performance</h3>
                  <div className="space-y-4">
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 text-green-700 rounded-full">
                            <Calculator className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800 mb-1">Tax Efficiency Score: 82/100</h4>
                            <p className="text-sm text-green-700">
                              Your tax-loss harvesting strategy is performing well. You've captured 82% of the
                              available tax-saving opportunities this year.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Effective Tax Rate (No Harvesting)</p>
                        <p className="font-medium text-red-600">24.2%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Effective Tax Rate (With Harvesting)</p>
                        <p className="font-medium text-green-600">18.7%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Tax Rate Reduction</p>
                        <p className="font-medium text-green-600">5.5%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Return Enhancement</p>
                        <p className="font-medium text-green-600">1.8%</p>
                      </div>
                    </div>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                            <p className="text-sm">Consider harvesting additional technology sector losses to offset recent gains.</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                            <p className="text-sm">Review your portfolio for legacy positions with losses to improve tax efficiency.</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                            <p className="text-sm">Increase frequency of tax-loss harvesting checks during high volatility periods.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="pt-2">
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Full Tax Analysis Report
                      </Button>
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