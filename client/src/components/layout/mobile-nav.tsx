import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  LineChart,
  BriefcaseBusiness,
  History,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}

function MobileNavItem({ icon, label, path, isActive }: MobileNavItemProps) {
  return (
    <Link href={path}>
      <a className={cn(
        "flex flex-col items-center justify-center text-xs",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>
        {icon}
        <span className="mt-1">{label}</span>
      </a>
    </Link>
  );
}

export default function MobileNav() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
                <Link href="/users">
                  <a className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                    Users
                  </a>
                </Link>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  Settings
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  Help & Support
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  Log Out
                </a>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
