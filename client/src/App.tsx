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
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { useState } from "react";

function Router() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            {/* Investment routes */}
            <Route path="/investments" component={Investments} />
            <Route path="/investments/new" component={InvestmentEdit} />
            <Route path="/investments/:id/edit" component={InvestmentEdit} />
            
            {/* Transaction routes */}
            <Route path="/transactions" component={Transactions} />
            <Route path="/transactions/new" component={TransactionEdit} />
            <Route path="/transactions/:id/edit" component={TransactionEdit} />
            
            {/* Portfolio routes */}
            <Route path="/portfolios" component={Portfolios} />
            <Route path="/portfolios/new" component={PortfolioEdit} />
            <Route path="/portfolios/:id/edit" component={PortfolioEdit} />
            
            {/* User and settings routes */}
            <Route path="/users" component={Users} />
            <Route path="/profile-edit" component={ProfileEdit} />
            <Route path="/settings" component={Settings} />
            
            {/* 404 route */}
            <Route component={NotFound} />
          </Switch>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
