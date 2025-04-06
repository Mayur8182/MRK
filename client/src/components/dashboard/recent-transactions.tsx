import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { type Transaction } from "@shared/schema";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, DollarSign } from "lucide-react";

export default function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Loading transaction history...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const recentTransactions = transactions?.slice(0, 5) || [];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <ArrowDownCircle className="h-4 w-4 text-green-500" />;
      case "sale":
        return <ArrowUpCircle className="h-4 w-4 text-red-500" />;
      case "dividend":
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const getTransactionStatus = (type: string) => {
    switch (type) {
      case "purchase":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Purchase</Badge>;
      case "sale":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Sale</Badge>;
      case "dividend":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Dividend</Badge>;
      case "deposit":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Deposit</Badge>;
      case "withdrawal":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Withdrawal</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest investment activities</CardDescription>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No recent transactions</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {transaction.date && format(new Date(transaction.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.transaction_type)}
                      {getTransactionStatus(transaction.transaction_type)}
                    </div>
                  </TableCell>
                  <TableCell 
                    className={
                      transaction.transaction_type === "sale" || transaction.transaction_type === "withdrawal"
                        ? "text-red-600 font-medium"
                        : "text-green-600 font-medium"
                    }
                  >
                    {transaction.transaction_type === "sale" || transaction.transaction_type === "withdrawal" 
                      ? `-$${Number(transaction.amount).toLocaleString()}`
                      : `+$${Number(transaction.amount).toLocaleString()}`
                    }
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {transaction.notes || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
