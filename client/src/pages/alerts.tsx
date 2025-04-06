import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowUp,
  ArrowDown,
  BarChart,
  Bell,
  CircleDollarSign,
  Clock,
  Download,
  Filter,
  LineChart,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  Trash2,
} from "lucide-react";

// Sample data for alerts
const priceAlertsData = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 182.63,
    targetPrice: 195.00,
    direction: "above",
    difference: 6.77,
    createdAt: "2023-12-10T14:30:00Z",
    active: true,
  },
  {
    id: 2,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    currentPrice: 135.60,
    targetPrice: 120.00,
    direction: "below",
    difference: -11.51,
    createdAt: "2023-12-08T09:15:00Z",
    active: true,
  },
  {
    id: 3,
    symbol: "TSLA",
    name: "Tesla, Inc.",
    currentPrice: 258.73,
    targetPrice: 300.00,
    direction: "above",
    difference: 15.95,
    createdAt: "2023-12-05T11:45:00Z",
    active: true,
  },
  {
    id: 4,
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    currentPrice: 147.42,
    targetPrice: 140.00,
    direction: "below",
    difference: -5.03,
    createdAt: "2023-12-01T16:20:00Z",
    active: false,
  },
  {
    id: 5,
    symbol: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: 373.26,
    targetPrice: 400.00,
    direction: "above",
    difference: 7.16,
    createdAt: "2023-11-28T10:10:00Z",
    active: true,
  },
];

const portfolioAlertsData = [
  {
    id: 101,
    name: "Main Portfolio",
    condition: "performance",
    threshold: -5,
    timeframe: "day",
    currentValue: -1.2,
    status: "normal",
    createdAt: "2023-12-12T08:30:00Z",
    active: true,
  },
  {
    id: 102,
    name: "Retirement Fund",
    condition: "performance",
    threshold: -10,
    timeframe: "week",
    currentValue: -2.3,
    status: "normal",
    createdAt: "2023-11-20T14:15:00Z",
    active: true,
  },
  {
    id: 103,
    name: "Tech Investments",
    condition: "volatility",
    threshold: 25,
    timeframe: "month",
    currentValue: 18.7,
    status: "warning",
    createdAt: "2023-12-05T09:45:00Z",
    active: true,
  },
  {
    id: 104,
    name: "Dividend Portfolio",
    condition: "rebalance",
    threshold: 15,
    timeframe: "any",
    currentValue: 16.2,
    status: "triggered",
    createdAt: "2023-12-01T11:30:00Z",
    active: true,
  },
];

const newsAlertsData = [
  {
    id: 201,
    category: "Earnings",
    keywords: ["quarterly results", "earnings beat", "earnings miss"],
    companies: ["AAPL", "MSFT", "AMZN"],
    importance: "high",
    createdAt: "2023-12-10T15:45:00Z",
    active: true,
  },
  {
    id: 202,
    category: "Market News",
    keywords: ["fed", "interest rates", "inflation"],
    companies: [],
    importance: "high",
    createdAt: "2023-12-08T10:15:00Z",
    active: true,
  },
  {
    id: 203,
    category: "Analyst Ratings",
    keywords: ["upgrade", "downgrade", "price target"],
    companies: ["TSLA", "NVDA", "GOOGL"],
    importance: "medium",
    createdAt: "2023-12-05T09:30:00Z",
    active: false,
  },
  {
    id: 204,
    category: "Dividend Announcements",
    keywords: ["dividend increase", "special dividend"],
    companies: ["JNJ", "PG", "KO"],
    importance: "medium",
    createdAt: "2023-11-30T14:00:00Z",
    active: true,
  },
];

const alertNotificationsData = [
  {
    id: 301,
    title: "Portfolio Rebalance Needed",
    description: "Your Dividend Portfolio has drifted 16.2% from target allocation",
    type: "portfolio",
    priority: "high",
    relatedId: 104,
    timestamp: "2023-12-15T09:12:00Z",
    read: false,
  },
  {
    id: 302,
    title: "Tech Investments Volatility Warning",
    description: "30-day volatility approaching threshold (18.7%)",
    type: "portfolio",
    priority: "medium",
    relatedId: 103,
    timestamp: "2023-12-14T14:25:00Z",
    read: true,
  },
  {
    id: 303,
    title: "Earnings Announcement: AAPL",
    description: "Apple Inc. reported quarterly earnings beat by $0.15 per share",
    type: "news",
    priority: "high",
    relatedId: 201,
    timestamp: "2023-12-10T16:30:00Z",
    read: true,
  },
  {
    id: 304,
    title: "Price Alert: MSFT",
    description: "Microsoft approaching your target price of $400 (currently $373.26)",
    type: "price",
    priority: "medium",
    relatedId: 5,
    timestamp: "2023-12-08T11:10:00Z",
    read: false,
  },
  {
    id: 305,
    title: "Fed Announces Rate Decision",
    description: "Federal Reserve maintains current interest rates, signals future cuts",
    type: "news",
    priority: "high",
    relatedId: 202,
    timestamp: "2023-12-05T15:45:00Z",
    read: true,
  },
  {
    id: 306,
    title: "Price Alert: GOOGL",
    description: "Alphabet Inc. approaching your downside target of $120 (currently $135.60)",
    type: "price",
    priority: "medium",
    relatedId: 2,
    timestamp: "2023-12-03T10:20:00Z",
    read: true,
  },
];

export default function Alerts() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Simulate loading alerts data
  const { data: alertsData, isLoading } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        priceAlerts: priceAlertsData,
        portfolioAlerts: portfolioAlertsData,
        newsAlerts: newsAlertsData,
        notifications: alertNotificationsData,
        alertSummary: {
          totalAlerts: priceAlertsData.length + portfolioAlertsData.length + newsAlertsData.length,
          activeAlerts: priceAlertsData.filter(a => a.active).length + 
                        portfolioAlertsData.filter(a => a.active).length + 
                        newsAlertsData.filter(a => a.active).length,
          triggeredAlerts: 2,
          unreedNotifications: alertNotificationsData.filter(n => !n.read).length
        }
      };
    }
  });

  // Filter notifications
  const filteredNotifications = alertsData?.notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  }).filter(notification => {
    if (!searchTerm) return true;
    return notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           notification.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleAlertActive = (alertType: string, id: number) => {
    console.log(`Toggling alert ${id} in ${alertType}`);
    // In a real app, this would call an API to update the alert status
  };

  const deleteAlert = (alertType: string, id: number) => {
    console.log(`Deleting alert ${id} from ${alertType}`);
    // In a real app, this would call an API to delete the alert
  };

  const markAsRead = (id: number) => {
    console.log(`Marking notification ${id} as read`);
    // In a real app, this would call an API to mark the notification as read
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
          <p className="text-muted-foreground">
            Manage your custom alerts and view important notifications
          </p>
        </div>
        <Button className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Create New Alert
        </Button>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertsData?.alertSummary.totalAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {alertsData?.alertSummary.activeAlerts} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Triggered Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertsData?.alertSummary.triggeredAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In the last 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertsData?.alertSummary.unreedNotifications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Click to view
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alert Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Notifications</span>
              </div>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="price">Price Alerts</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Alerts</TabsTrigger>
          <TabsTrigger value="news">News Alerts</TabsTrigger>
        </TabsList>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="mb-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-1 w-full md:w-auto items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search notifications..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                  <SelectItem value="price">Price Alerts</SelectItem>
                  <SelectItem value="portfolio">Portfolio Alerts</SelectItem>
                  <SelectItem value="news">News Alerts</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="shrink-0">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {filteredNotifications?.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg mb-1">No notifications found</h3>
                <p className="text-muted-foreground text-sm">
                  {searchTerm 
                    ? "Try a different search term or filter" 
                    : "You're all caught up! No notifications match your current filters."}
                </p>
              </div>
            ) : (
              filteredNotifications?.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:bg-accent/5 ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
                >
                  <CardContent className="p-4 flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className={`shrink-0 p-2 rounded-full mt-1 
                        ${notification.type === 'price' 
                          ? 'bg-blue-50 text-blue-500' 
                          : notification.type === 'portfolio' 
                            ? 'bg-green-50 text-green-500'
                            : 'bg-amber-50 text-amber-500'}`}
                      >
                        {notification.type === 'price' && <CircleDollarSign className="h-4 w-4" />}
                        {notification.type === 'portfolio' && <BarChart className="h-4 w-4" />}
                        {notification.type === 'news' && <AlertCircle className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {notification.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">High Priority</Badge>
                          )}
                          {!notification.read && (
                            <Badge variant="outline" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{notification.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(notification.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => markAsRead(notification.id)}
                        >
                          <span className="sr-only">Mark as read</span>
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Price Alerts Tab */}
        <TabsContent value="price">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-medium">Price Alerts</h3>
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
          
          <div className="rounded-md border">
            <div className="grid grid-cols-7 text-xs font-medium text-muted-foreground bg-muted p-3">
              <div>Symbol</div>
              <div>Current Price</div>
              <div>Target Price</div>
              <div>Direction</div>
              <div>Difference</div>
              <div className="text-center">Status</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y">
              {alertsData?.priceAlerts.map((alert) => (
                <div key={alert.id} className="grid grid-cols-7 p-3 items-center text-sm">
                  <div className="font-medium">
                    {alert.symbol}
                    <div className="text-xs text-muted-foreground">{alert.name}</div>
                  </div>
                  <div>${alert.currentPrice.toFixed(2)}</div>
                  <div>${alert.targetPrice.toFixed(2)}</div>
                  <div className="flex items-center">
                    {alert.direction === "above" ? (
                      <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    {alert.direction}
                  </div>
                  <div className={alert.difference > 0 ? "text-green-500" : "text-red-500"}>
                    {alert.difference > 0 ? "+" : ""}{alert.difference.toFixed(2)}%
                  </div>
                  <div className="text-center">
                    <Switch 
                      checked={alert.active} 
                      onCheckedChange={() => toggleAlertActive("price", alert.id)} 
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteAlert("price", alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Portfolio Alerts Tab */}
        <TabsContent value="portfolio">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-medium">Portfolio Alerts</h3>
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
          
          <div className="rounded-md border">
            <div className="grid grid-cols-7 text-xs font-medium text-muted-foreground bg-muted p-3">
              <div>Portfolio</div>
              <div>Condition</div>
              <div>Threshold</div>
              <div>Timeframe</div>
              <div>Current Value</div>
              <div className="text-center">Status</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y">
              {alertsData?.portfolioAlerts.map((alert) => (
                <div key={alert.id} className="grid grid-cols-7 p-3 items-center text-sm">
                  <div className="font-medium">{alert.name}</div>
                  <div className="capitalize">{alert.condition}</div>
                  <div>
                    {alert.condition === "rebalance" ? `${alert.threshold}% drift` : `${alert.threshold}%`}
                  </div>
                  <div className="capitalize">{alert.timeframe}</div>
                  <div className={
                    alert.status === "triggered" 
                      ? "text-red-500 font-medium"
                      : alert.status === "warning"
                        ? "text-amber-500"
                        : "text-muted-foreground"
                  }>
                    {alert.currentValue}%
                  </div>
                  <div className="text-center">
                    <Switch 
                      checked={alert.active} 
                      onCheckedChange={() => toggleAlertActive("portfolio", alert.id)} 
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteAlert("portfolio", alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* News Alerts Tab */}
        <TabsContent value="news">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-medium">News & Event Alerts</h3>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alertsData?.newsAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">{alert.category}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        alert.importance === "high" ? "default" : "secondary"
                      }>
                        {alert.importance} priority
                      </Badge>
                      <Switch 
                        checked={alert.active} 
                        onCheckedChange={() => toggleAlertActive("news", alert.id)} 
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>
                  <CardDescription>
                    Created on {new Date(alert.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Keywords</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {alert.keywords.map((keyword, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {alert.companies.length > 0 && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Companies</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {alert.companies.map((company, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => deleteAlert("news", alert.id)}
                      >
                        Delete
                      </Button>
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