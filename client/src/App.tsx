import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Investments from "@/pages/investments";
import Transactions from "@/pages/transactions";
import Portfolios from "@/pages/portfolios";
import Users from "@/pages/users";
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
            <Route path="/investments" component={Investments} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/portfolios" component={Portfolios} />
            <Route path="/users" component={Users} />
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
