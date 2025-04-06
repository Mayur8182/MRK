import { Bell, Search, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Get page title based on current location
  const getPageTitle = () => {
    switch (true) {
      case location === "/":
        return "Dashboard";
      case location.startsWith("/portfolios"):
        return "Portfolios";
      case location.startsWith("/investments"):
        return "Investments";
      case location.startsWith("/transactions"):
        return "Transaction History";
      case location.startsWith("/users"):
        return "User Management";
      case location.startsWith("/profile-edit"):
        return "Edit Profile";
      case location.startsWith("/settings"):
        return "Settings";
      default:
        return "Portfolio Manager";
    }
  };

  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold hidden md:block">{getPageTitle()}</h1>
          <h1 className="text-lg font-semibold md:hidden">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <form className="hidden md:block relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-8 bg-background"
            />
          </form>
          
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium uppercase">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                </div>
                <span className="hidden md:inline-block font-medium text-sm">
                  {user?.name || user?.username || 'User'}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/profile-edit")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
