import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ClientAppShell } from "@/components/layout/ClientAppShell";
import { AuthProvider } from "@/hooks/useAuth.jsx";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ClientLogin from "./pages/ClientLogin";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Vault from "./pages/Vault";
import CMAMaker from "./pages/CMAMaker";
import GSTReco from "./pages/GSTReco";
import AIChat from "./pages/AIChat";
import Pricing from "./pages/Pricing";
import Compliance from "./pages/Compliance";
import Consultations from "./pages/Consultations";
import FinancialInsights from "./pages/FinancialInsights";
import Marketplace from "./pages/Marketplace";
import PrivacyRights from "./pages/PrivacyRights";
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/ClientDashboard";
import ClientDocuments from "./pages/ClientDocuments";
import ClientMessages from "./pages/ClientMessages";
import ClientReports from "./pages/ClientReports";
import ClientBilling from "./pages/ClientBilling";
import ClientMeetings from "./pages/ClientMeetings";
import MarketplaceLeads from "./pages/MarketplaceLeads";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/client-login" element={<ClientLogin />} />

            {/* Consultant Dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Dashboard /></AppShell></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Clients /></AppShell></ProtectedRoute>} />
            <Route path="/vault" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Vault /></AppShell></ProtectedRoute>} />
            <Route path="/cma-maker" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><CMAMaker /></AppShell></ProtectedRoute>} />
            <Route path="/gst-reco" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><GSTReco /></AppShell></ProtectedRoute>} />
            <Route path="/ai-chat" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><AIChat /></AppShell></ProtectedRoute>} />
            <Route path="/pricing" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Pricing /></AppShell></ProtectedRoute>} />
            <Route path="/compliance" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Compliance /></AppShell></ProtectedRoute>} />
            <Route path="/consultations" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Consultations /></AppShell></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><FinancialInsights /></AppShell></ProtectedRoute>} />
            <Route path="/marketplace-leads" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><MarketplaceLeads /></AppShell></ProtectedRoute>} />

            {/* Client Dashboard */}
            <Route path="/client" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientDashboard /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/documents" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientDocuments /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/meetings" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientMeetings /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/messages" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientMessages /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/reports" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientReports /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/billing" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientBilling /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/marketplace" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><Marketplace /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/privacy" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><PrivacyRights /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/insights" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><FinancialInsights /></ClientAppShell></ProtectedRoute>} />


            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
