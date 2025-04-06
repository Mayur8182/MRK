import { useQuery, useMutation } from "@tanstack/react-query";
import { type Portfolio, type InsertPortfolio, insertPortfolioSchema } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Briefcase, 
  BarChart3, 
  PieChart
} from "lucide-react";
import { useLocation } from "wouter";

// Extended schema with additional validation
const portfolioFormSchema = insertPortfolioSchema.extend({
  name: z.string().min(3, {
    message: "Portfolio name must be at least 3 characters.",
  }),
});

export default function Portfolios() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: portfolios, isLoading } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
  });

  const form = useForm<z.infer<typeof portfolioFormSchema>>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      name: "",
      description: "",
      user_id: 1,  // Assuming a default user for demo
      is_active: true,
    },
  });

  const createPortfolioMutation = useMutation({
    mutationFn: async (data: z.infer<typeof portfolioFormSchema>) => {
      return apiRequest("POST", "/api/portfolios", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Portfolio created",
        description: "Your portfolio has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create portfolio: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreatePortfolio = (data: z.infer<typeof portfolioFormSchema>) => {
    createPortfolioMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Investment Portfolios</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create new portfolio</DialogTitle>
              <DialogDescription>
                Set up a new investment portfolio to organize your investments.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreatePortfolio)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portfolio Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Investment Portfolio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A brief description of this portfolio's purpose"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          Mark this portfolio as active for tracking
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
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
                    disabled={createPortfolioMutation.isPending}
                  >
                    {createPortfolioMutation.isPending ? "Creating..." : "Create Portfolio"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading portfolios...</p>
        </div>
      ) : portfolios && portfolios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {portfolio.name}
                    </CardTitle>
                    <CardDescription>
                      Created {new Date(portfolio.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {portfolio.is_active ? (
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium mb-1">Total Value</div>
                    <div className="text-2xl font-bold">${Number(portfolio.total_value).toLocaleString()}</div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {portfolio.description || "No description provided"}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate(`/investments?portfolioId=${portfolio.id}`)}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Investments
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate(`/portfolios/${portfolio.id}`)}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No portfolios found</h3>
            <p className="text-muted-foreground text-center mb-6">
              You haven't created any investment portfolios yet. Get started by creating your first portfolio.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Portfolio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
