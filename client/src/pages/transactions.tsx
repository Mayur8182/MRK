import { useQuery, useMutation } from "@tanstack/react-query";
import { type Transaction, type InsertTransaction, insertTransactionSchema } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, RefreshCw, DollarSign, Plus, Filter } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Extended schema with additional validation
const transactionFormSchema = insertTransactionSchema.extend({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
});

export default function Transactions() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: investments } = useQuery<Transaction[]>({
    queryKey: ["/api/investments"],
  });

  const { data: portfolios } = useQuery<Transaction[]>({
    queryKey: ["/api/portfolios"],
  });

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      investment_id: 0,
      portfolio_id: 0,
      transaction_type: "",
      amount: "",
      notes: "",
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof transactionFormSchema>) => {
      return apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Transaction created",
        description: "Your transaction has been recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create transaction: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateTransaction = (data: z.infer<typeof transactionFormSchema>) => {
    createTransactionMutation.mutate(data);
  };

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

  const getTransactionBadge = (type: string) => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Transaction History</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Record new transaction</DialogTitle>
                <DialogDescription>
                  Enter the details for your new transaction.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateTransaction)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="portfolio_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a portfolio" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {portfolios?.map((portfolio) => (
                                <SelectItem 
                                  key={portfolio.id} 
                                  value={portfolio.id.toString()}
                                >
                                  {portfolio.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="investment_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an investment" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {investments?.map((investment) => (
                                <SelectItem 
                                  key={investment.id} 
                                  value={investment.id.toString()}
                                >
                                  {investment.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="transaction_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="purchase">Purchase</SelectItem>
                              <SelectItem value="sale">Sale</SelectItem>
                              <SelectItem value="dividend">Dividend</SelectItem>
                              <SelectItem value="deposit">Deposit</SelectItem>
                              <SelectItem value="withdrawal">Withdrawal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Optional notes about this transaction"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createTransactionMutation.isPending}
                    >
                      {createTransactionMutation.isPending ? "Creating..." : "Record Transaction"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      ) : transactions && transactions.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Portfolio</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {transaction.date && format(new Date(transaction.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.transaction_type)}
                        {getTransactionBadge(transaction.transaction_type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {investments?.find(inv => inv.id === transaction.investment_id)?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {portfolios?.find(p => p.id === transaction.portfolio_id)?.name || "Unknown"}
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
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <RefreshCw className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
            <p className="text-muted-foreground text-center mb-6">
              You haven't recorded any transactions yet. Start by adding your first transaction.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Record First Transaction
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
