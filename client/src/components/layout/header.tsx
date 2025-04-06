import { Bell, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

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
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium uppercase">
              JD
            </div>
            <span className="hidden md:inline-block font-medium text-sm">John Doe</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
