import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Define portfolio and investment interfaces
interface Portfolio {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string | null;
}

interface Investment {
  id: number;
  name: string;
  symbol?: string;
  type?: string;
  amount: number;
  current_value: number;
  portfolio_id: number;
  created_at?: string;
  updated_at?: string | null;
}

interface Transaction {
  id: number;
  transactionType: string;
  amount: number;
  date: string;
  notes?: string;
  portfolioId: number;
  investmentId: number | null;
}

export default function TransactionEdit() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    transactionType: "",
    amount: "",
    notes: "",
    portfolioId: "",
    investmentId: ""
  });

  // Fetch portfolios for dropdown
  const { data: portfolios = [] } = useQuery<Portfolio[]>({
    queryKey: ['/api/portfolios'],
    staleTime: 60000
  });

  // Fetch investments for the selected portfolio
  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ['/api/investments', formData.portfolioId ? { portfolioId: formData.portfolioId } : null],
    enabled: !!formData.portfolioId,
    staleTime: 30000
  });

  // Fetch transaction data if editing existing transaction
  const { data: transaction, isLoading } = useQuery<Transaction>({
    queryKey: ['/api/transactions', id],
    enabled: !!id,
    staleTime: 30000
  });

  // Set form data when transaction data is loaded
  useEffect(() => {
    if (transaction) {
      setFormData({
        transactionType: transaction.transactionType,
        amount: transaction.amount.toString(),
        notes: transaction.notes || "",
        portfolioId: transaction.portfolioId.toString(),
        investmentId: transaction.investmentId ? transaction.investmentId.toString() : ""
      });
    }
  }, [transaction]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    if (name === "portfolioId" && value !== formData.portfolioId) {
      // Reset investment selection when portfolio changes
      setFormData(prev => ({ ...prev, [name]: value, investmentId: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Define transaction payload type
  interface TransactionPayload {
    transactionType: string;
    amount: number;
    notes: string;
    portfolioId: number;
    investmentId: number | null;
  }

  // Create or update transaction
  const mutation = useMutation({
    mutationFn: async (data: TransactionPayload) => {
      if (id) {
        return apiRequest('PATCH', `/api/transactions/${id}`, data);
      } else {
        return apiRequest('POST', '/api/transactions', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: `Transaction ${id ? "updated" : "created"} successfully`,
        description: "Your changes have been saved."
      });
      navigate("/transactions");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to ${id ? "update" : "create"} transaction: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: TransactionPayload = {
      transactionType: formData.transactionType,
      amount: parseFloat(formData.amount),
      notes: formData.notes,
      portfolioId: parseInt(formData.portfolioId),
      investmentId: formData.investmentId ? parseInt(formData.investmentId) : null
    };
    mutation.mutate(payload);
  };

  if (isLoading && id) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading transaction data...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit Transaction" : "Record New Transaction"}</CardTitle>
          <CardDescription>
            {id ? "Update transaction details" : "Add a new transaction to your portfolio"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select
                value={formData.transactionType}
                onValueChange={(value) => handleSelectChange("transactionType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="dividend">Dividend</SelectItem>
                  <SelectItem value="interest">Interest</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolioId">Portfolio</Label>
              <Select
                value={formData.portfolioId}
                onValueChange={(value) => handleSelectChange("portfolioId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {portfolios.map((portfolio: Portfolio) => (
                    <SelectItem key={portfolio.id} value={portfolio.id.toString()}>
                      {portfolio.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="investmentId">Investment (Optional)</Label>
              <Select
                value={formData.investmentId}
                onValueChange={(value) => handleSelectChange("investmentId", value)}
                disabled={!formData.portfolioId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.portfolioId ? "Select investment" : "Select a portfolio first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None (Portfolio-level transaction)</SelectItem>
                  {investments.map((investment: Investment) => (
                    <SelectItem key={investment.id} value={investment.id.toString()}>
                      {investment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add additional details about this transaction"
                rows={3}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/transactions")}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : (id ? "Update Transaction" : "Record Transaction")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}