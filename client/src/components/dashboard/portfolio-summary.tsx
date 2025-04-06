import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardChart } from "@/components/ui/dashboard-chart";
import { useQuery } from "@tanstack/react-query";
import { type Portfolio } from "@shared/schema";

interface PortfolioSummaryProps {
  portfolioId?: number;
}

export default function PortfolioSummary({ portfolioId }: PortfolioSummaryProps) {
  const { data: portfolios, isLoading: isLoadingPortfolios } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
  });

  const { data: performanceData, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ["/api/performance", portfolioId],
    enabled: !!portfolioId,
  });

  // Mock performance data for chart (will be replaced with real data)
  const chartData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
    { name: "Jul", value: 3490 },
  ];

  if (isLoadingPortfolios) {
    return <div className="text-center py-8">Loading portfolio data...</div>;
  }

  const totalValue = portfolios?.reduce((sum, portfolio) => sum + Number(portfolio.total_value), 0) || 0;
  const activePortfolios = portfolios?.filter(p => p.is_active).length || 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Total Value</CardTitle>
            <CardDescription>All portfolios combined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="text-green-500">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Portfolios</CardTitle>
            <CardDescription>Active investment portfolios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activePortfolios}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {portfolios?.length} total portfolios
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Performance</CardTitle>
            <CardDescription>Average return rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">+8.3%</div>
            <p className="text-sm text-muted-foreground mt-1">
              Year-to-date performance
            </p>
          </CardContent>
        </Card>
      </div>

      <DashboardChart 
        title="Portfolio Performance" 
        data={chartData} 
        type="area" 
        height={300}
      />
    </div>
  );
}
