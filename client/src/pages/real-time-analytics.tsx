import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWebSocket } from '@/hooks/use-websocket';
import { MarketDashboard } from '@/components/dashboard/market-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart3, DollarSign, Percent, TrendingUp, Activity } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
import { format } from 'date-fns';

export default function RealTimeAnalyticsPage() {
  const { isConnected, lastUpdate } = useWebSocket();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Get user portfolios for portfolio-specific analytics
  const { data: portfolios = [], isLoading: isLoadingPortfolios } = useQuery<any[]>({ 
    queryKey: ['/api/portfolios'] 
  });

  // Update current time every second for the market status indicator
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Mock function to determine if markets are open (replace with actual logic)
  const isMarketOpen = () => {
    const now = currentTime;
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Mock market hours: Monday-Friday, 9:30 AM - 4:00 PM
    return day >= 1 && day <= 5 && 
          ((hours === 9 && minutes >= 30) || (hours > 9 && hours < 16));
  };

  const marketStatus = isMarketOpen() ? 'open' : 'closed';

  return (
    <>
      
      <div className="container py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Real-Time Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Live market data and portfolio performance tracking
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-1.5 font-medium ${
              marketStatus === 'open' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                marketStatus === 'open' ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400' 
              }`}></span>
              Markets {marketStatus}
            </div>
            
            <div className="text-sm text-muted-foreground">
              {format(currentTime, 'EEEE, MMMM d, yyyy • h:mm:ss a')}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
                {lastUpdate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Last update: {format(lastUpdate, 'h:mm:ss a')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                Trading Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">S&P 500</span>
                  <span className="text-green-500 flex items-center text-sm font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" /> +0.68%
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-muted-foreground text-sm">Volume</span>
                  <span className="text-sm font-medium">4.2B</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-muted-foreground text-sm">Volatility</span>
                  <span className="text-yellow-500 text-sm font-medium">Moderate</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Percent className="mr-2 h-5 w-5 text-primary" />
                Your Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPortfolios ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : portfolios && portfolios.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Main Portfolio</span>
                    <span className="text-green-500 text-sm font-medium">+2.4% today</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-muted-foreground text-sm">Active Positions</span>
                    <span className="text-sm font-medium">{portfolios[0].investments?.length || 0}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No portfolio data available</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <MarketDashboard />
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Track your investments against market benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="portfolio">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="portfolio">Portfolio Performance</TabsTrigger>
                  <TabsTrigger value="investments">Investment Breakdown</TabsTrigger>
                  <TabsTrigger value="correlation">Market Correlation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="portfolio">
                  <div className="flex items-center justify-center h-60 border rounded-lg">
                    <div className="flex flex-col items-center text-center">
                      <LineChart className="h-12 w-12 text-muted-foreground mb-2 opacity-80" />
                      <p className="text-muted-foreground max-w-sm">
                        Real-time portfolio performance chart will appear here when more data is available
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="investments">
                  <div className="flex items-center justify-center h-60 border rounded-lg">
                    <div className="flex flex-col items-center text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mb-2 opacity-80" />
                      <p className="text-muted-foreground max-w-sm">
                        Investment breakdown chart will appear here when you add investments to your portfolio
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="correlation">
                  <div className="flex items-center justify-center h-60 border rounded-lg">
                    <div className="flex flex-col items-center text-center">
                      <Activity className="h-12 w-12 text-muted-foreground mb-2 opacity-80" />
                      <p className="text-muted-foreground max-w-sm">
                        Market correlation analysis will appear here when more market data is available
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}