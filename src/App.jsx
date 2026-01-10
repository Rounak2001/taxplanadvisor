import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Vault from "./pages/Vault";
import CMAMaker from "./pages/CMAMaker";
import GSTReco from "./pages/GSTReco";
import AIChat from "./pages/AIChat";
import Pricing from "./pages/Pricing";
import Compliance from "./pages/Compliance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/cma-maker" element={<CMAMaker />} />
            <Route path="/gst-reco" element={<GSTReco />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
