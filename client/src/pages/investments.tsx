import { useQuery, useMutation } from "@tanstack/react-query";
import { type Investment, type InsertInvestment, insertInvestmentSchema } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { BackButton } from "@/components/ui/back-button";
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
import { X, Pencil, Trash, Plus, PackagePlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InvestmentCard from "@/components/dashboard/investment-card";
import { useLocation } from "wouter";

// Extended schema with additional validation
const investmentFormSchema = insertInvestmentSchema.extend({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  current_value: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Current value must be a non-negative number",
  }),
});

export default function Investments() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

  const { data: investments, isLoading } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const { data: portfolios } = useQuery<Investment[]>({
    queryKey: ["/api/portfolios"],
  });

  const form = useForm<z.infer<typeof investmentFormSchema>>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: {
      name: "",
      description: "",
      amount: "",
      current_value: "",
      type: "",
      risk_level: "",
      portfolio_id: 0,
      is_active: true,
    },
  });

  const createInvestmentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof investmentFormSchema>) => {
      return apiRequest("POST", "/api/investments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Investment created",
        description: "Your investment has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create investment: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleViewDetails = (id: number) => {
    const investment = investments?.find(inv => inv.id === id);
    if (investment) {
      setSelectedInvestment(investment);
    }
  };

  const handleCreateInvestment = (data: z.infer<typeof investmentFormSchema>) => {
    createInvestmentMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h2 className="text-2xl font-bold tracking-tight">Investments</h2>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add new investment</DialogTitle>
              <DialogDescription>
                Enter the details for your new investment.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateInvestment)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
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
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Investment name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
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
                            <SelectItem value="Stock">Stock</SelectItem>
                            <SelectItem value="Bond">Bond</SelectItem>
                            <SelectItem value="ETF">ETF</SelectItem>
                            <SelectItem value="Mutual Fund">Mutual Fund</SelectItem>
                            <SelectItem value="Real Estate">Real Estate</SelectItem>
                            <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
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
                        <FormDescription>Initial investment amount</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="current_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Value</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="risk_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select risk level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Description of the investment"
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
                    disabled={createInvestmentMutation.isPending}
                  >
                    {createInvestmentMutation.isPending ? "Creating..." : "Create Investment"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading investments...</p>
        </div>
      ) : investments && investments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map((investment) => (
            <InvestmentCard
              key={investment.id}
              investment={investment}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <PackagePlus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No investments found</h3>
            <p className="text-muted-foreground text-center mb-6">
              You haven't added any investments yet. Get started by creating your first investment.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Investment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Investment Details Dialog */}
      {selectedInvestment && (
        <Dialog open={!!selectedInvestment} onOpenChange={() => setSelectedInvestment(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedInvestment.name}</DialogTitle>
              <DialogDescription>
                {selectedInvestment.type} - {selectedInvestment.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Initial Investment</h4>
                  <p className="text-2xl font-bold">${Number(selectedInvestment.amount).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Current Value</h4>
                  <p className="text-2xl font-bold">${Number(selectedInvestment.current_value).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Type</h4>
                  <p>{selectedInvestment.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Risk Level</h4>
                  <p>{selectedInvestment.risk_level || "Not specified"}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Purchase Date</h4>
                <p>{new Date(selectedInvestment.purchase_date).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Performance</h4>
                <div className="flex items-center gap-2 mt-1">
                  {Number(selectedInvestment.current_value) >= Number(selectedInvestment.amount) ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Profit: ${(Number(selectedInvestment.current_value) - Number(selectedInvestment.amount)).toLocaleString()}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Loss: ${(Number(selectedInvestment.amount) - Number(selectedInvestment.current_value)).toLocaleString()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedInvestment(null)}>
                Close
              </Button>
              <Button 
                variant="default"
                onClick={() => {
                  setSelectedInvestment(null);
                  // Navigate to transaction creation with pre-filled investment
                  navigate(`/transactions/new?investmentId=${selectedInvestment.id}`);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
