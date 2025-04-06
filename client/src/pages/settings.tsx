import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Application settings
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    appearance: {
      theme: "system",
      compactView: false
    },
    privacy: {
      shareData: false,
      analyticsConsent: true
    }
  });

  // Handle switch toggle
  const handleSwitchChange = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  // Handle theme change
  const handleThemeChange = (theme) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme
      }
    }));
  };

  // Save settings
  const mutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest('POST', '/api/settings', data);
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save settings: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    mutation.mutate(settings);
  };

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences and account settings</p>
      </div>
      
      <Tabs defaultValue="account">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Profile Information</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Update your personal information and how others see you on the platform
                </p>
                <Button variant="outline" onClick={() => navigate("/profile-edit")}>
                  Edit Profile
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg mb-2">Account Security</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your password and account security settings
                </p>
                <Button variant="outline" onClick={() => navigate("/profile-edit")}>
                  Change Password
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg mb-2">Connected Accounts</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect third-party accounts for importing financial data
                </p>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="justify-start">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5V7.5L16 12L10 16.5Z" fill="currentColor" />
                    </svg>
                    Connect Bank Account
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 5V19H19V5H7ZM17 17H9V7H17V17Z" fill="currentColor" />
                      <path d="M5 8H3V21H16V19H5V8Z" fill="currentColor" />
                    </svg>
                    Connect Brokerage Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Customize how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive portfolio and investment updates via email</p>
                </div>
                <Switch
                  id="email-notif"
                  checked={settings.notifications.email}
                  onCheckedChange={() => handleSwitchChange('notifications', 'email')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notif">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive real-time alerts in your browser</p>
                </div>
                <Switch
                  id="push-notif"
                  checked={settings.notifications.push}
                  onCheckedChange={() => handleSwitchChange('notifications', 'push')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notif">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive important alerts via text message</p>
                </div>
                <Switch
                  id="sms-notif"
                  checked={settings.notifications.sms}
                  onCheckedChange={() => handleSwitchChange('notifications', 'sms')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the application looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Theme</h3>
                <div className="flex gap-2">
                  <Button 
                    variant={settings.appearance.theme === "light" ? "default" : "outline"}
                    onClick={() => handleThemeChange("light")}
                  >
                    Light
                  </Button>
                  <Button 
                    variant={settings.appearance.theme === "dark" ? "default" : "outline"}
                    onClick={() => handleThemeChange("dark")}
                  >
                    Dark
                  </Button>
                  <Button 
                    variant={settings.appearance.theme === "system" ? "default" : "outline"}
                    onClick={() => handleThemeChange("system")}
                  >
                    System
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-view">Compact View</Label>
                  <p className="text-sm text-muted-foreground">Display more content with reduced spacing</p>
                </div>
                <Switch
                  id="compact-view"
                  checked={settings.appearance.compactView}
                  onCheckedChange={() => handleSwitchChange('appearance', 'compactView')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="share-data">Share Portfolio Data</Label>
                  <p className="text-sm text-muted-foreground">Allow anonymized performance data to be shared for benchmarking</p>
                </div>
                <Switch
                  id="share-data"
                  checked={settings.privacy.shareData}
                  onCheckedChange={() => handleSwitchChange('privacy', 'shareData')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics">Analytics Consent</Label>
                  <p className="text-sm text-muted-foreground">Allow usage data collection to improve the application</p>
                </div>
                <Switch
                  id="analytics"
                  checked={settings.privacy.analyticsConsent}
                  onCheckedChange={() => handleSwitchChange('privacy', 'analyticsConsent')}
                />
              </div>
              
              <Separator />
              
              <div className="pt-4">
                <Button variant="destructive">Delete Account</Button>
                <p className="text-xs text-muted-foreground mt-2">This action cannot be undone. All your data will be permanently deleted.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
        <Button onClick={handleSave} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}