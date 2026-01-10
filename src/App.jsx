import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ClientAppShell } from "@/components/layout/ClientAppShell";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Vault from "./pages/Vault";
import CMAMaker from "./pages/CMAMaker";
import GSTReco from "./pages/GSTReco";
import AIChat from "./pages/AIChat";
import Pricing from "./pages/Pricing";
import Compliance from "./pages/Compliance";
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/ClientDashboard";
import ClientDocuments from "./pages/ClientDocuments";
import ClientMessages from "./pages/ClientMessages";
import ClientReports from "./pages/ClientReports";
import ClientBilling from "./pages/ClientBilling";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Consultant Dashboard */}
          <Route path="/" element={<AppShell><Dashboard /></AppShell>} />
          <Route path="/clients" element={<AppShell><Clients /></AppShell>} />
          <Route path="/vault" element={<AppShell><Vault /></AppShell>} />
          <Route path="/cma-maker" element={<AppShell><CMAMaker /></AppShell>} />
          <Route path="/gst-reco" element={<AppShell><GSTReco /></AppShell>} />
          <Route path="/ai-chat" element={<AppShell><AIChat /></AppShell>} />
          <Route path="/pricing" element={<AppShell><Pricing /></AppShell>} />
          <Route path="/compliance" element={<AppShell><Compliance /></AppShell>} />
          
          {/* Client Dashboard */}
          <Route path="/client" element={<ClientAppShell><ClientDashboard /></ClientAppShell>} />
          <Route path="/client/documents" element={<ClientAppShell><ClientDocuments /></ClientAppShell>} />
          <Route path="/client/messages" element={<ClientAppShell><ClientMessages /></ClientAppShell>} />
          <Route path="/client/reports" element={<ClientAppShell><ClientReports /></ClientAppShell>} />
          <Route path="/client/billing" element={<ClientAppShell><ClientBilling /></ClientAppShell>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
