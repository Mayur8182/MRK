import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Investments from "@/pages/investments";
import InvestmentEdit from "@/pages/investment-edit";
import Transactions from "@/pages/transactions";
import TransactionEdit from "@/pages/transaction-edit";
import Portfolios from "@/pages/portfolios";
import PortfolioEdit from "@/pages/portfolio-edit";
import Users from "@/pages/users";
import ProfileEdit from "@/pages/profile-edit";
import Settings from "@/pages/settings";
import RiskAnalysis from "@/pages/risk-analysis";
import Analytics from "@/pages/analytics";
import Recommendations from "@/pages/recommendations";
import Alerts from "@/pages/alerts";
import Reports from "@/pages/reports";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import AuthPage from "@/pages/auth-page";
import AIRecommendations from "@/pages/ai-recommendations";
import TaxHarvesting from "@/pages/tax-harvesting";
import SentimentAnalysis from "@/pages/sentiment-analysis";
import GlobalMarkets from "@/pages/global-markets";

// Main app layout with sidebar and header
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

function Router() {
  return (
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
