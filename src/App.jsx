import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ClientAppShell } from "@/components/layout/ClientAppShell";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navigate } from "react-router-dom";
import { useEffect } from 'react';
import { useGstStore } from '@/stores/useGstStore';
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Vault from "./pages/Vault";
import CMAMaker from "./pages/CMAMaker";
import GSTServices from "./pages/GSTServices";
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
import ClientGSTServices from "./pages/ClientGSTServices";

// GST Service Components
import GSTServicesHub from "@/components/gstr/GSTServicesHub";
import GstrReconciliation from "@/components/gstr/GstrReconciliation";
import GSTR3BvsBooks from "@/components/gstr/GSTR3BvsBooks";
import Get2b from "@/components/gstr/Get2B";
import GSTR1ToExcel from "@/components/gstr/GSTR1ToExcel";
import GSTR1vsBook from "@/components/gstr/GSTR1vsBook";
import Get2a from "@/components/gstr/Get2A";
import Get3b from "@/components/gstr/Get3B";
import ManualReco from "@/components/gstr/Temp2breco";

const queryClient = new QueryClient();

const GSTInitializer = ({ children }) => {
  const checkSession = useGstStore(state => state.checkSessionStatus);
  useEffect(() => { checkSession(); }, [checkSession]);
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GSTInitializer>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* Consultant Dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Dashboard /></AppShell></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Clients /></AppShell></ProtectedRoute>} />
            <Route path="/vault" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Vault /></AppShell></ProtectedRoute>} />
            <Route path="/cma-maker" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><CMAMaker /></AppShell></ProtectedRoute>} />

            {/* GST Services - Protected with AppShell */}
            <Route path="/gst" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><GSTServicesHub /></AppShell></ProtectedRoute>} />
            <Route path="/gst/comprehensive" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><GstrReconciliation /></AppShell></ProtectedRoute>} />
            <Route path="/gst/3b-books" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><GSTR3BvsBooks /></AppShell></ProtectedRoute>} />
            <Route path="/gst/2b-books" element={<Navigate to="/gst/2b-manual" replace />} />
            <Route path="/gst/get-2b" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Get2b /></AppShell></ProtectedRoute>} />
            <Route path="/gst/get-1" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><GSTR1ToExcel /></AppShell></ProtectedRoute>} />
            <Route path="/gst/get-2a" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Get2a /></AppShell></ProtectedRoute>} />
            <Route path="/gst/1-books" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><GSTR1vsBook /></AppShell></ProtectedRoute>} />
            <Route path="/gst/2b-manual" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><ManualReco /></AppShell></ProtectedRoute>} />
            <Route path="/gst/get-3b" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><Get3b /></AppShell></ProtectedRoute>} />

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
            <Route path="/client/gst" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientGSTServices /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/gst/get-1" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><GSTR1ToExcel /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/gst/get-2a" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><Get2a /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/gst/get-2b" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><Get2b /></ClientAppShell></ProtectedRoute>} />
            <Route path="/client/gst/get-3b" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><Get3b /></ClientAppShell></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GSTInitializer>
  </QueryClientProvider>
);

export default App;
