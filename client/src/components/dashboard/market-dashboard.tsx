import { useWebSocket } from '@/hooks/use-websocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowUpRight, ArrowDownRight, Activity, LineChart, BarChart, Percent } from 'lucide-react';
import { format } from 'date-fns';

export function MarketDashboard() {
  const { isConnected, marketData, lastUpdate } = useWebSocket();

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Market Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"} className="h-6">
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            {lastUpdate && (
              <span className="text-xs text-muted-foreground">
                Last updated: {format(lastUpdate, 'h:mm:ss a')}
              </span>
            )}
          </div>
        </div>
        <CardDescription>Real-time market insights and analytics</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="market">
        <div className="px-6 pt-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="market">Indices</TabsTrigger>
            <TabsTrigger value="movers">Top Movers</TabsTrigger>
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
          </TabsList>
        </div>
      
        <CardContent className="pt-4">
          <TabsContent value="market" className="mt-0">
            {marketData?.indices ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(marketData.indices).map(([name, data]) => (
                  <div key={name} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h4 className="font-medium text-sm">{name}</h4>
                      <p className="text-2xl font-bold">{data.value.toLocaleString()}</p>
                    </div>
                    <div className={`flex items-center ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <span className="text-lg font-semibold">{data.change >= 0 ? '+' : ''}{data.change}%</span>
                      {data.change >= 0 ? (
                        <ArrowUpRight className="ml-1 h-5 w-5" />
                      ) : (
                        <ArrowDownRight className="ml-1 h-5 w-5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32">
                <Activity className="h-10 w-10 text-muted-foreground animate-pulse" />
                <p className="mt-2 text-muted-foreground">Loading market data...</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="movers" className="mt-0">
            {marketData?.topMovers ? (
              <div className="space-y-4">
                {marketData.topMovers.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-md mr-3">
                        <LineChart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{stock.symbol}</h4>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold">${stock.price.toFixed(2)}</span>
                      <span className={`text-sm flex items-center ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                        )}
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32">
                <Activity className="h-10 w-10 text-muted-foreground animate-pulse" />
                <p className="mt-2 text-muted-foreground">Loading top movers...</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sectors" className="mt-0">
            {marketData?.sectorPerformance ? (
              <div className="space-y-4">
                {marketData.sectorPerformance.map((sector) => (
                  <div key={sector.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-md mr-3">
                        <BarChart className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-medium">{sector.name}</h4>
                    </div>
                    <span className={`font-semibold flex items-center ${sector.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {sector.change >= 0 ? (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      )}
                      {sector.change >= 0 ? '+' : ''}{sector.change}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32">
                <Percent className="h-10 w-10 text-muted-foreground animate-pulse" />
                <p className="mt-2 text-muted-foreground">Loading sector data...</p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}