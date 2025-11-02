import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import StateDetail from "@/pages/StateDetail";
import AllNotices from "@/pages/AllNotices";
import Analytics from "@/pages/Analytics";
import CompanyDetail from "@/pages/CompanyDetail";
import AdminImport from "@/pages/AdminImport";
import Subscribe from "@/pages/Subscribe";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

function Router() {
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/state/:state" component={StateDetail} />
      <Route path="/notices" component={AllNotices} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/company/:companyName" component={CompanyDetail} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/about" component={About} />
      <Route path="/admin/import" component={AdminImport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
