import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function PortfolioEdit() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true
  });

  // Fetch portfolio data if editing existing portfolio
  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['/api/portfolios', id],
    enabled: !!id,
    staleTime: 30000
  });

  // Set form data when portfolio data is loaded
  useEffect(() => {
    if (portfolio) {
      setFormData({
        name: portfolio.name,
        description: portfolio.description || "",
        isActive: portfolio.isActive
      });
    }
  }, [portfolio]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Create or update portfolio
  const mutation = useMutation({
    mutationFn: async (data) => {
      if (id) {
        return apiRequest('PUT', `/api/portfolios/${id}`, data);
      } else {
        return apiRequest('POST', '/api/portfolios', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios'] });
      toast({
        title: `Portfolio ${id ? "updated" : "created"} successfully`,
        description: "Your changes have been saved."
      });
      navigate("/portfolios");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${id ? "update" : "create"} portfolio: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add user_id if creating a new portfolio
    const payload = {
      ...formData,
      // For a real app, you'd get this from auth context/state
      userId: 1
    };
    
    mutation.mutate(payload);
  };

  if (isLoading && id) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading portfolio data...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit Portfolio" : "Create New Portfolio"}</CardTitle>
          <CardDescription>
            {id ? "Update your portfolio details" : "Create a new portfolio to organize your investments"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Portfolio Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter portfolio name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a brief description of this portfolio"
                rows={4}
              />
            </div>
            
            {id && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isActive" className="text-sm font-normal">
                  Active Portfolio
                </Label>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/portfolios")}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : (id ? "Update Portfolio" : "Create Portfolio")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}