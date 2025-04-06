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
  Calendar,
  ChevronDown,
  Clock,
  Download,
  FileDown,
  FileText,
  Filter,
  LineChart,
  PieChart,
  Plus,
  Printer,
  RefreshCcw,
  Settings,
  Share2,
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
} from "recharts";

// Sample data
const reportListData = [
  {
    id: 1,
    name: "Portfolio Performance Summary",
    description: "Monthly overview of portfolio performance and returns",
    type: "Performance",
    frequency: "Monthly",
    lastGenerated: "2023-12-15T10:30:00Z",
    status: "completed",
  },
  {
    id: 2,
    name: "Dividend Income Report",
    description: "Summary of dividend income and projections",
    type: "Income",
    frequency: "Quarterly",
    lastGenerated: "2023-12-01T14:15:00Z",
    status: "completed",
  },
  {
    id: 3,
    name: "Asset Allocation Analysis",
    description: "Current allocation compared to targets with recommendations",
    type: "Allocation",
    frequency: "Quarterly",
    lastGenerated: "2023-11-15T09:45:00Z",
    status: "completed",
  },
  {
    id: 4,
    name: "Tax Loss Harvesting Opportunities",
    description: "Potential tax loss harvesting opportunities",
    type: "Tax",
    frequency: "Annual",
    lastGenerated: "2023-10-10T11:20:00Z",
    status: "completed",
  },
  {
    id: 5,
    name: "Risk Assessment Report",
    description: "Detailed analysis of portfolio risk metrics",
    type: "Risk",
    frequency: "Semi-Annual",
    lastGenerated: "2023-09-05T13:30:00Z",
    status: "completed",
  },
  {
    id: 6,
    name: "ESG Impact Report",
    description: "Environmental, social, and governance impact of your investments",
    type: "ESG",
    frequency: "Annual",
    lastGenerated: "2023-08-20T10:15:00Z",
    status: "completed",
  },
  {
    id: 7,
    name: "Fee Analysis",
    description: "Analysis of all fees and expenses for your investments",
    type: "Expense",
    frequency: "Annual",
    lastGenerated: "2023-07-12T16:40:00Z",
    status: "completed",
  },
  {
    id: 8,
    name: "Custom Sector Performance",
    description: "Performance breakdown by custom sectors",
    type: "Performance",
    frequency: "On Demand",
    lastGenerated: null,
    status: "pending",
  },
];

const reportTemplatesData = [
  {
    id: 101,
    name: "Portfolio Performance",
    description: "Track portfolio performance over time",
    type: "Performance",
    sections: ["Overview", "Performance Metrics", "Comparison", "Holdings Breakdown"],
    popularity: "high",
  },
  {
    id: 102,
    name: "Income Report",
    description: "Analyze income from dividends and distributions",
    type: "Income",
    sections: ["Income Summary", "Dividend Calendar", "Income Growth", "Projections"],
    popularity: "medium",
  },
  {
    id: 103,
    name: "Asset Allocation",
    description: "Review and analyze your asset allocation",
    type: "Allocation",
    sections: ["Current Allocation", "Target Comparison", "Drift Analysis", "Rebalancing Plan"],
    popularity: "high",
  },
  {
    id: 104,
    name: "Tax Report",
    description: "Tax-related information for your investments",
    type: "Tax",
    sections: ["Realized Gains/Losses", "Tax Loss Harvesting", "Dividend Tax Impact", "Cost Basis"],
    popularity: "medium",
  },
  {
    id: 105,
    name: "Risk Assessment",
    description: "Detailed risk metrics and analysis",
    type: "Risk",
    sections: ["Risk Metrics", "Stress Tests", "Correlation Matrix", "Volatility Analysis"],
    popularity: "medium",
  },
  {
    id: 106,
    name: "Transaction Summary",
    description: "Summary of all portfolio transactions",
    type: "Transaction",
    sections: ["Buys/Sells", "Dividends", "Fees", "Deposits/Withdrawals"],
    popularity: "low",
  },
];

// Sample report data for the first report
const performanceReportData = {
  summary: {
    startDate: "2023-01-01",
    endDate: "2023-11-30",
    startingValue: 100000,
    endingValue: 112540,
    totalReturn: 12.54,
    benchmarkReturn: 10.75,
    riskAdjustedReturn: 1.8,
  },
  monthlyReturns: [
    { month: "Jan", return: 3.2, benchmark: 2.8 },
    { month: "Feb", return: -1.1, benchmark: -0.5 },
    { month: "Mar", return: 2.4, benchmark: 1.9 },
    { month: "Apr", return: 1.5, benchmark: 2.2 },
    { month: "May", return: -0.8, benchmark: -1.2 },
    { month: "Jun", return: 2.7, benchmark: 2.1 },
    { month: "Jul", return: 1.9, benchmark: 1.6 },
    { month: "Aug", return: 0.6, benchmark: 0.3 },
    { month: "Sep", return: -1.2, benchmark: -1.8 },
    { month: "Oct", return: 3.5, benchmark: 2.9 },
    { month: "Nov", return: 1.4, benchmark: 1.2 },
  ],
  assetPerformance: [
    { name: "Stocks", return: 15.2, allocation: 55 },
    { name: "Bonds", return: 3.6, allocation: 25 },
    { name: "Real Estate", return: 9.8, allocation: 10 },
    { name: "Alternatives", return: 7.5, allocation: 5 },
    { name: "Cash", return: 1.2, allocation: 5 },
  ],
  topPerformers: [
    { name: "AAPL", return: 28.4, weight: 5.2 },
    { name: "MSFT", return: 24.7, weight: 4.8 },
    { name: "NVDA", return: 35.2, weight: 3.1 },
    { name: "GOOGL", return: 18.3, weight: 4.1 },
    { name: "AMZN", return: 22.1, weight: 3.7 },
  ],
  bottomPerformers: [
    { name: "IBM", return: -5.3, weight: 1.2 },
    { name: "VZ", return: -8.7, weight: 1.5 },
    { name: "T", return: -11.2, weight: 0.8 },
    { name: "CVX", return: -3.1, weight: 1.3 },
    { name: "XOM", return: -2.5, weight: 1.4 },
  ],
};

export default function Reports() {
  const [timeframe, setTimeframe] = useState("ytd");
  const [selectedReportType, setSelectedReportType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<number | null>(1);
  
  // Simulate loading reports data
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['/api/reports'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        reports: reportListData,
        templates: reportTemplatesData,
        reportData: performanceReportData,
      };
    }
  });

  // Filter reports based on search and type filter
  const filteredReports = reportsData?.reports.filter(report => {
    const matchesSearch = searchTerm === "" || 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedReportType === "all" || report.type === selectedReportType;
    
    return matchesSearch && matchesType;
  });

  // Select the first report from our filtered list if none is selected
  const currentReport = selectedReport 
    ? reportsData?.reports.find(r => r.id === selectedReport) 
    : filteredReports?.[0];

  // Generate date format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate, view, and download detailed investment reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="my-reports" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        {/* My Reports Tab */}
        <TabsContent value="my-reports" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input 
                placeholder="Search reports..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Allocation">Allocation</SelectItem>
                  <SelectItem value="Tax">Tax</SelectItem>
                  <SelectItem value="Risk">Risk</SelectItem>
                  <SelectItem value="ESG">ESG</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ytd">YTD</SelectItem>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="shrink-0">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
          
          {/* Split view - Report list and details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reports list */}
            <div className="md:col-span-1 border rounded-lg overflow-hidden">
              <div className="bg-muted p-3 border-b flex justify-between items-center">
                <h3 className="font-medium text-sm">Available Reports</h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {filteredReports?.length || 0} reports
                </Badge>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredReports?.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium text-lg mb-1">No reports found</h3>
                    <p className="text-muted-foreground text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : (
                  filteredReports?.map(report => (
                    <div 
                      key={report.id}
                      className={`p-3 cursor-pointer transition-colors hover:bg-muted/50
                        ${selectedReport === report.id ? 'bg-muted/50 border-l-4 border-l-primary' : ''}`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{report.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {report.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {report.lastGenerated 
                            ? `Generated ${formatDate(report.lastGenerated)}` 
                            : 'Not yet generated'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Report details */}
            <div className="md:col-span-2">
              {currentReport ? (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{currentReport.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {currentReport.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (!currentReport) return;
                            const portfolioId = 1; // Change this to dynamic portfolio ID when available
                            const url = `/api/reports/download/csv/${portfolioId}?timeframe=${timeframe}`;
                            window.open(url, '_blank');
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download CSV
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="secondary">
                        Type: {currentReport.type}
                      </Badge>
                      <Badge variant="secondary">
                        Frequency: {currentReport.frequency}
                      </Badge>
                      <Badge variant={currentReport.status === "completed" ? "default" : "outline"}>
                        Status: {currentReport.status === "completed" ? "Complete" : "Pending"}
                      </Badge>
                      <Badge variant="outline">
                        Generated: {formatDate(currentReport.lastGenerated)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    {currentReport.id === 1 && (
                      <div className="space-y-6">
                        {/* Performance summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Card className="bg-muted/50 border-none">
                            <CardContent className="p-3">
                              <p className="text-xs text-muted-foreground mb-1">Total Return</p>
                              <div className="text-xl font-bold text-green-500">
                                +{reportsData?.reportData.summary.totalReturn}%
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="bg-muted/50 border-none">
                            <CardContent className="p-3">
                              <p className="text-xs text-muted-foreground mb-1">vs Benchmark</p>
                              <div className="text-xl font-bold text-green-500">
                                +{(reportsData?.reportData.summary.totalReturn - reportsData?.reportData.summary.benchmarkReturn).toFixed(2)}%
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="bg-muted/50 border-none">
                            <CardContent className="p-3">
                              <p className="text-xs text-muted-foreground mb-1">Starting Value</p>
                              <div className="text-xl font-bold">
                                ${reportsData?.reportData.summary.startingValue.toLocaleString()}
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="bg-muted/50 border-none">
                            <CardContent className="p-3">
                              <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                              <div className="text-xl font-bold">
                                ${reportsData?.reportData.summary.endingValue.toLocaleString()}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Monthly Performance Chart */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Monthly Performance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="w-full h-[300px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <ReBarChart data={reportsData?.reportData.monthlyReturns}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="month" />
                                  <YAxis tickFormatter={(value) => `${value}%`} />
                                  <Tooltip 
                                    formatter={(value) => [`${value}%`, 'Return']} 
                                    labelFormatter={(label) => `Month: ${label}`}
                                  />
                                  <Legend />
                                  <Bar dataKey="return" name="Your Portfolio" fill="#10B981" />
                                  <Bar dataKey="benchmark" name="Benchmark" fill="#6366F1" />
                                </ReBarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Asset Performance */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Asset Class Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="w-full h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RePieChart>
                                    <Pie
                                      data={reportsData?.reportData.assetPerformance}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      fill="#8884d8"
                                      paddingAngle={2}
                                      dataKey="allocation"
                                      nameKey="name"
                                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                      <Cell fill="#10B981" />
                                      <Cell fill="#6366F1" />
                                      <Cell fill="#F59E0B" />
                                      <Cell fill="#EC4899" />
                                      <Cell fill="#8B5CF6" />
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value}%`} />
                                  </RePieChart>
                                </ResponsiveContainer>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Top & Bottom Performers</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Top Performers</h4>
                                  <div className="space-y-2">
                                    {reportsData?.reportData.topPerformers.slice(0, 3).map((item, i) => (
                                      <div key={i} className="flex justify-between items-center">
                                        <div className="text-sm">{item.name}</div>
                                        <div className="text-sm font-medium text-green-500">+{item.return}%</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Bottom Performers</h4>
                                  <div className="space-y-2">
                                    {reportsData?.reportData.bottomPerformers.slice(0, 3).map((item, i) => (
                                      <div key={i} className="flex justify-between items-center">
                                        <div className="text-sm">{item.name}</div>
                                        <div className="text-sm font-medium text-red-500">{item.return}%</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Report Actions */}
                        <div className="flex flex-wrap gap-2 justify-end">
                          <Button variant="outline" size="sm">
                            <Printer className="mr-2 h-4 w-4" />
                            Print Report
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const portfolioId = 1; // Change this to dynamic portfolio ID when available
                              const url = `/api/reports/download/pdf/${portfolioId}?timeframe=${timeframe}`;
                              window.open(url, '_blank');
                            }}
                          >
                            <FileDown className="mr-2 h-4 w-4" />
                            Download PDF
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {currentReport.id !== 1 && (
                      <div className="min-h-[400px] flex flex-col items-center justify-center">
                        <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-1">Report Preview</h3>
                        <p className="text-muted-foreground text-center max-w-md mb-6">
                          {currentReport.status === "completed" 
                            ? "Click the Download button to view the full report." 
                            : "This report hasn't been generated yet. Click Generate to create it."}
                        </p>
                        {currentReport.status !== "completed" && (
                          <Button>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Generate Report
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-10 border rounded-lg">
                  <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Report Selected</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Select a report from the list to view details or create a new report.
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Report
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Report Templates Tab */}
        <TabsContent value="templates">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-medium">Available Report Templates</h3>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Custom Template
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportsData?.templates.map(template => (
              <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant={
                      template.popularity === "high" 
                        ? "default" 
                        : template.popularity === "medium" 
                          ? "secondary" 
                          : "outline"
                    }>
                      {template.popularity === "high" ? "Popular" : template.popularity === "medium" ? "Standard" : "Specialized"}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Report Sections</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.sections.map((section, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled">
          <div className="flex items-center justify-center p-10 border rounded-lg">
            <div className="text-center max-w-md">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Schedule Automatic Reports</h3>
              <p className="text-muted-foreground mb-6">
                Set up recurring reports to be automatically generated on your preferred schedule and delivered to your email.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Set Up Scheduled Report
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}