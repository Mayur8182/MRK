import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  LineChart,
  BriefcaseBusiness,
  History,
  Menu,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}

function MobileNavItem({ icon, label, path, isActive }: MobileNavItemProps) {
  return (
    <Link href={path} className={cn(
      "flex flex-col items-center justify-center text-xs",
      isActive ? "text-primary" : "text-muted-foreground"
    )}>
      {icon}
      <span className="mt-1">{label}</span>
    </Link>
  );
}

export default function MobileNav() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { logoutMutation } = useAuth();

  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: <BriefcaseBusiness size={20} />,
      label: "Portfolios",
      path: "/portfolios",
    },
    {
      icon: <LineChart size={20} />,
      label: "Investments",
      path: "/investments",
    },
    {
      icon: <History size={20} />,
      label: "History",
      path: "/transactions",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <MobileNavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={
              item.path === "/" 
                ? location === "/" 
                : location.startsWith(item.path)
            }
          />
        ))}
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex flex-col items-center justify-center text-xs text-muted-foreground"
            >
              <Menu size={20} />
              <span className="mt-1">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="py-4">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>
              <nav className="space-y-2">
                <Link href="/users" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  Users
                </Link>
                <Link href="/real-time-analytics" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Activity size={18} className="mr-2" />
                  Real-Time Analytics
                </Link>
                <Link href="/profile-edit" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  Profile
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  Settings
                </Link>
                <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  Help & Support
                </button>
                <button 
                  onClick={() => {
                    logoutMutation.mutate();
                    setIsOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {logoutMutation.isPending ? "Logging out..." : "Log Out"}
                </button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
