import { cn } from "@/lib/utils";
import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  LineChart,
  BriefcaseBusiness,
  History,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}

function SidebarItem({ icon, label, path, isActive }: SidebarItemProps) {
  return (
    <Link href={path}>
      <a className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}>
        {icon}
        <span>{label}</span>
      </a>
    </Link>
  );
}

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: <BriefcaseBusiness size={18} />,
      label: "Portfolios",
      path: "/portfolios",
    },
    {
      icon: <LineChart size={18} />,
      label: "Investments",
      path: "/investments",
    },
    {
      icon: <History size={18} />,
      label: "Transactions",
      path: "/transactions",
    },
    {
      icon: <Users size={18} />,
      label: "Users",
      path: "/users",
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 border-r bg-background flex-col fixed inset-y-0">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <BriefcaseBusiness className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-semibold text-lg">PortfolioManager</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem
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
        </nav>
      </div>

      <div className="p-4 border-t mt-auto">
        <div className="space-y-1">
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" size="sm">
              <Settings size={18} className="mr-3" />
              Settings
            </Button>
          </Link>
          <Link href="/profile-edit">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" size="sm">
              <Users size={18} className="mr-3" />
              Profile
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" size="sm">
            <HelpCircle size={18} className="mr-3" />
            Help & Support
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" size="sm">
            <LogOut size={18} className="mr-3" />
            Log Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
