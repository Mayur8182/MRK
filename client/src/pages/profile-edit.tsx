import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Define User type
interface User {
  id: number;
  username: string;
  name?: string;
  email: string;
  profile_image?: string | null;
  notifications_enabled?: boolean;
  preferences?: string | null;
  role?: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  last_login?: Date | null;
}

export default function ProfileEdit() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Fetch current user data
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
    staleTime: 60000
  });

  // Set form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: ""
      });
    }
  }, [user]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Define payload type
  type UserProfilePayload = {
    username: string;
    name: string;
    email: string;
    password?: string;
  };

  // Update user profile
  const mutation = useMutation<any, Error, UserProfilePayload>({
    mutationFn: async (data) => {
      const response = await apiRequest("PUT", "/api/user/profile", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check if passwords match if password is being changed
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Password error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    // Only include password if it's being changed
    const payload = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      ...(formData.password ? { password: formData.password } : {})
    };
    
    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading profile data...</p>
      </div>
    );
  }

  // Generate initials for avatar
  const getInitials = () => {
    if (!formData.name) return "U";
    return formData.name
      .split(" ")
      .map(part => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Change Password</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Leave blank if you don't want to change your password
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}