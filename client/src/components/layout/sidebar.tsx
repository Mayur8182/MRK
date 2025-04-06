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
  Shield,
  BarChart4,
  Lightbulb,
  Bell,
  FileText,
  User,
  CreditCard,
  Activity,
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
      <div className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}>
        {icon}
        <span>{label}</span>
      </div>
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
      icon: <LineChart size={18} />,
      label: "Investments",
      path: "/investments",
    },
    {
      icon: <Shield size={18} />,
      label: "Risk Analysis",
      path: "/risk-analysis",
    },
    {
      icon: <Settings size={18} />,
      label: "Settings",
      path: "/settings",
    },
    {
      icon: <BriefcaseBusiness size={18} />,
      label: "Portfolio",
      path: "/portfolios",
    },
    {
      icon: <CreditCard size={18} />,
      label: "Transactions",
      path: "/transactions",
    },
    {
      icon: <BarChart4 size={18} />,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: <Activity size={18} />,
      label: "Real-Time Analytics",
      path: "/real-time-analytics",
    },
    {
      icon: <Lightbulb size={18} />,
      label: "Recommendations",
      path: "/recommendations",
    },
    {
      icon: <Bell size={18} />,
      label: "Alerts",
      path: "/alerts",
    },
    {
      icon: <FileText size={18} />,
      label: "Reports",
      path: "/reports",
    },
    {
      icon: <User size={18} />,
      label: "Profile",
      path: "/profile-edit",
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
