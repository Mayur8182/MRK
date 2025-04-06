import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Investment } from "@shared/schema";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface InvestmentCardProps {
  investment: Investment;
  onViewDetails: (id: number) => void;
}

export default function InvestmentCard({ investment, onViewDetails }: InvestmentCardProps) {
  // Calculate performance metrics
  const initialAmount = Number(investment.amount);
  const currentValue = Number(investment.current_value);
  const percentChange = ((currentValue - initialAmount) / initialAmount) * 100;
  const isPositive = percentChange >= 0;

  // Determine risk level color
  const getRiskLevelColor = (level: string | null | undefined) => {
    switch (level?.toLowerCase()) {
      case "high": return "text-red-500";
      case "medium": return "text-orange-500";
      case "low": return "text-green-500";
      default: return "text-blue-500";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{investment.name}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              {investment.type}
            </div>
          </div>
          <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1">
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {percentChange.toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium mb-1">Current Value</div>
            <div className="text-2xl font-bold">${Number(investment.current_value).toLocaleString()}</div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Initial Investment</span>
              <span className={getRiskLevelColor(investment.risk_level)}>
                {investment.risk_level || "Unknown"} Risk
              </span>
            </div>
            <Progress 
              value={Math.min(100, (currentValue / initialAmount) * 100)} 
              className={isPositive ? "bg-muted" : "bg-red-100"}
              // Use className for the indicator style in Progress component
            />
            <div className="text-right text-sm text-muted-foreground mt-1">
              ${Number(investment.amount).toLocaleString()} initial
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => onViewDetails(investment.id)}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
