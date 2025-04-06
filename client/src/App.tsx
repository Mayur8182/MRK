import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Loader2 } from "lucide-react";
import { AIAssistant } from "@/components/ai-assistant";
import { AuthProvider } from "@/hooks/use-auth";
import { AIAssistantProvider } from "@/hooks/ai-assistant-provider";
import { ProtectedRoute } from "@/lib/protected-route";
import AuthPage from "@/pages/auth-page";

// Lazy load page components
const Analytics = lazy(() => import("@/pages/analytics"));
const Portfolios = lazy(() => import("@/pages/portfolios"));
const Investments = lazy(() => import("@/pages/investments"));
const Reports = lazy(() => import("@/pages/reports"));
const TaxHarvesting = lazy(() => import("@/pages/tax-harvesting"));
const RiskAnalysis = lazy(() => import("@/pages/risk-analysis"));
const InvestmentEdit = lazy(() => import("@/pages/investment-edit"));
const Transactions = lazy(() => import("@/pages/transactions"));
const TransactionEdit = lazy(() => import("@/pages/transaction-edit"));
const PortfolioEdit = lazy(() => import("@/pages/portfolio-edit"));
const Users = lazy(() => import("@/pages/users"));
const ProfileEdit = lazy(() => import("@/pages/profile-edit"));
const Settings = lazy(() => import("@/pages/settings"));
const Recommendations = lazy(() => import("@/pages/recommendations"));
const AIRecommendations = lazy(() => import("@/pages/ai-recommendations"));
const SentimentAnalysis = lazy(() => import("@/pages/sentiment-analysis"));
const GlobalMarkets = lazy(() => import("@/pages/global-markets"));
const RealTimeAnalytics = lazy(() => import("@/pages/real-time-analytics"));
const Alerts = lazy(() => import("@/pages/alerts"));
const Dashboard = lazy(() => import("@/pages/dashboard"));

// Main app layout with sidebar and header
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="responsive-container">
            {children}
          </div>
        </main>
        <div className="block lg:hidden">
          <MobileNav />
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <Switch>
        {/* Auth page - publicly accessible */}
        <Route path="/auth" component={AuthPage} />
        
        {/* Protected routes */}
        <ProtectedRoute path="/" component={() => (
          <AppLayout>
            <Dashboard />
          </AppLayout>
        )} />
        
        {/* Investment routes */}
        <ProtectedRoute path="/investments" component={() => (
          <AppLayout>
            <Investments />
          </AppLayout>
        )} />
        <ProtectedRoute path="/investments/new" component={() => (
          <AppLayout>
            <InvestmentEdit />
          </AppLayout>
        )} />
        <ProtectedRoute path="/investments/:id/edit" component={() => (
          <AppLayout>
            <InvestmentEdit />
          </AppLayout>
        )} />
        
        {/* Transaction routes */}
        <ProtectedRoute path="/transactions" component={() => (
          <AppLayout>
            <Transactions />
          </AppLayout>
        )} />
        <ProtectedRoute path="/transactions/new" component={() => (
          <AppLayout>
            <TransactionEdit />
          </AppLayout>
        )} />
        <ProtectedRoute path="/transactions/:id/edit" component={() => (
          <AppLayout>
            <TransactionEdit />
          </AppLayout>
        )} />
        
        {/* Portfolio routes */}
        <ProtectedRoute path="/portfolios" component={() => (
          <AppLayout>
            <Portfolios />
          </AppLayout>
        )} />
        <ProtectedRoute path="/portfolios/new" component={() => (
          <AppLayout>
            <PortfolioEdit />
          </AppLayout>
        )} />
        <ProtectedRoute path="/portfolios/:id/edit" component={() => (
          <AppLayout>
            <PortfolioEdit />
          </AppLayout>
        )} />
        
        {/* Analytics routes */}
        <ProtectedRoute path="/risk-analysis" component={() => (
          <AppLayout>
            <RiskAnalysis />
          </AppLayout>
        )} />
        <ProtectedRoute path="/analytics" component={() => (
          <AppLayout>
            <Analytics />
          </AppLayout>
        )} />
        <ProtectedRoute path="/recommendations" component={() => (
          <AppLayout>
            <Recommendations />
          </AppLayout>
        )} />
        <ProtectedRoute path="/ai-recommendations" component={() => (
          <AppLayout>
            <AIRecommendations />
          </AppLayout>
        )} />
        <ProtectedRoute path="/sentiment-analysis" component={() => (
          <AppLayout>
            <SentimentAnalysis />
          </AppLayout>
        )} />
        <ProtectedRoute path="/tax-harvesting" component={() => (
          <AppLayout>
            <TaxHarvesting />
          </AppLayout>
        )} />
        <ProtectedRoute path="/global-markets" component={() => (
          <AppLayout>
            <GlobalMarkets />
          </AppLayout>
        )} />
        <ProtectedRoute path="/real-time-analytics" component={() => (
          <AppLayout>
            <RealTimeAnalytics />
          </AppLayout>
        )} />
        <ProtectedRoute path="/alerts" component={() => (
          <AppLayout>
            <Alerts />
          </AppLayout>
        )} />
        <ProtectedRoute path="/reports" component={() => (
          <AppLayout>
            <Reports />
          </AppLayout>
        )} />
        
        {/* User and settings routes */}
        <ProtectedRoute path="/users" component={() => (
          <AppLayout>
            <Users />
          </AppLayout>
        )} />
        <ProtectedRoute path="/profile-edit" component={() => (
          <AppLayout>
            <ProfileEdit />
          </AppLayout>
        )} />
        <ProtectedRoute path="/settings" component={() => (
          <AppLayout>
            <Settings />
          </AppLayout>
        )} />
        
        {/* 404 route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AIAssistantProvider>
          <Router />
          <AIAssistant />
          <Toaster />
        </AIAssistantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
