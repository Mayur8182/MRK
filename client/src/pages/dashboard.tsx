import { useQuery } from "@tanstack/react-query";
import { type Portfolio, type Investment } from "@shared/schema";
import PortfolioSummary from "@/components/dashboard/portfolio-summary";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import InvestmentCard from "@/components/dashboard/investment-card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: investments, isLoading: isLoadingInvestments } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const handleViewDetails = (id: number) => {
    navigate(`/investments/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/portfolios/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Portfolio
          </Button>
          <Button 
            size="sm"
            onClick={() => navigate("/investments/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Investment
          </Button>
        </div>
      </div>

      <PortfolioSummary />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecentTransactions />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Top Investments</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary" 
              onClick={() => navigate("/investments")}
            >
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {isLoadingInvestments ? (
            <div className="text-center py-8 text-muted-foreground">Loading investments...</div>
          ) : investments && investments.length > 0 ? (
            <div className="space-y-4">
              {investments
                .sort((a, b) => Number(b.current_value) - Number(a.current_value))
                .slice(0, 3)
                .map((investment) => (
                  <InvestmentCard 
                    key={investment.id} 
                    investment={investment} 
                    onViewDetails={handleViewDetails}
                  />
                ))
              }
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg bg-background">
              <p className="text-muted-foreground mb-4">No investments found</p>
              <Button 
                onClick={() => navigate("/investments/new")}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Investment
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
