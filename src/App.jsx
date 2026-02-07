import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ClientAppShell } from "@/components/layout/ClientAppShell";
import { AuthProvider } from "@/hooks/useAuth.jsx";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navigate } from "react-router-dom";
import { useEffect } from 'react';
import { useGstStore } from '@/stores/useGstStore';
import Landing from "./pages/Landing";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import ClientLogin from "./pages/ClientLogin";
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
import ClientMessages from "./pages/ClientMessages";
import ClientBilling from "./pages/ClientBilling";
import ClientMeetings from "./pages/ClientMeetings";
import MarketplaceLeads from "./pages/MarketplaceLeads";
import ConsultantMessages from "./pages/ConsultantMessages";
import ClientGSTServices from "./pages/ClientGSTServices";
import ClientVault from "./pages/ClientVault";

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

// Calculator Components
import Calculators from "./pages/Calculators";
import DashboardCalculators from "./pages/DashboardCalculators";
import { SIPCalculator } from "@/components/allcalculators/SIPCalculator";
import { RetirementCalculator } from "@/components/allcalculators/RetirementCalculator";
import { FDCalculator } from "@/components/allcalculators/FDCalculator";
import { InflationCalculator } from "@/components/allcalculators/InflationCalculator";
import { CAGRCalculator } from "@/components/allcalculators/CAGRCalculator";
import { EMICalculator } from "@/components/allcalculators/EMICalculator";
import TaxCalculator from "@/components/allcalculators/Taxcalculator";
import { SWPCalculator } from "@/components/allcalculators/SWPCalculator";
import { MFCalculator } from "@/components/allcalculators/MFCalculator";
import { SalaryCalculator } from "@/components/allcalculators/SalaryCalculator";
import { ExistingLoanCalculator } from "@/components/allcalculators/ExistingLoanCalculator";
import FinancialHealthCalculator from "@/components/allcalculators/FinancialHealthCalculator";
import InvestmentCalculator from "@/components/allcalculators/InvestmentCalculator";
import CapitalGainsCal from "@/components/allcalculators/CapitalGains";
import BulkTDSCalculator from "@/components/tdscalculator/BulkTDSCalculator";
import TDSCalculator from "@/components/tdscalculator/TDSCalculator";
import DashboardCalculatorWrapper from "@/components/calculators/DashboardCalculatorWrapper";

const queryClient = new QueryClient();

const GSTInitializer = ({ children }) => {
  const checkSession = useGstStore(state => state.checkSessionStatus);
  useEffect(() => { checkSession(); }, [checkSession]);
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GSTInitializer>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/client-login" element={<ClientLogin />} />

              {/* Public Calculator Routes */}
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/calculators/sip" element={<SIPCalculator />} />
              <Route path="/calculators/retirement" element={<RetirementCalculator />} />
              <Route path="/calculators/fd" element={<FDCalculator />} />
              <Route path="/calculators/inflation" element={<InflationCalculator />} />
              <Route path="/calculators/cagr" element={<CAGRCalculator />} />
              <Route path="/calculators/emi" element={<EMICalculator />} />
              <Route path="/calculators/tax" element={<TaxCalculator />} />
              <Route path="/calculators/capital-gains" element={<CapitalGainsCal />} />
              <Route path="/calculators/tds" element={<BulkTDSCalculator />} />
              <Route path="/calculators/tds-individual" element={<TDSCalculator />} />
              <Route path="/calculators/swp" element={<SWPCalculator />} />
              <Route path="/calculators/mf" element={<MFCalculator />} />
              <Route path="/calculators/salary" element={<SalaryCalculator />} />
              <Route path="/calculators/prepayment" element={<ExistingLoanCalculator />} />
              <Route path="/calculators/financial-health" element={<FinancialHealthCalculator />} />
              <Route path="/calculators/portfolio" element={<InvestmentCalculator />} />

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
              <Route path="/messages" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><ConsultantMessages /></AppShell></ProtectedRoute>} />

              {/* Consultant Calculators - Protected with AppShell */}
              <Route path="/dashboard/calculators" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculators basePath="/dashboard/calculators" /></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/sip" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><SIPCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/retirement" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><RetirementCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/fd" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><FDCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/inflation" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><InflationCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/cagr" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><CAGRCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/emi" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><EMICalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/tax" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><TaxCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/capital-gains" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><CapitalGainsCal /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/tds" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><BulkTDSCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/tds-individual" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><TDSCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/swp" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><SWPCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/mf" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><MFCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/salary" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><SalaryCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/prepayment" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><ExistingLoanCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/financial-health" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><FinancialHealthCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />
              <Route path="/dashboard/calculators/portfolio" element={<ProtectedRoute requiredRole="CONSULTANT"><AppShell><DashboardCalculatorWrapper backPath="/dashboard/calculators"><InvestmentCalculator /></DashboardCalculatorWrapper></AppShell></ProtectedRoute>} />

              {/* Client Dashboard */}
              <Route path="/client" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientDashboard /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/vault" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientVault /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/meetings" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientMeetings /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/messages" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientMessages /></ClientAppShell></ProtectedRoute>} />

              {/* Legacy Redirects */}
              <Route path="/client/documents" element={<ProtectedRoute requiredRole="CLIENT"><Navigate to="/client/vault" replace /></ProtectedRoute>} />
              <Route path="/client/reports" element={<ProtectedRoute requiredRole="CLIENT"><Navigate to="/client/vault" replace /></ProtectedRoute>} />
              <Route path="/client/notices" element={<ProtectedRoute requiredRole="CLIENT"><Navigate to="/client/vault" replace /></ProtectedRoute>} />
              <Route path="/client/billing" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientBilling /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/marketplace" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><Marketplace /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/privacy" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><PrivacyRights /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/insights" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><FinancialInsights /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/gst" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><ClientGSTServices /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/gst/get-1" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><GSTR1ToExcel /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/gst/get-2a" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><Get2a /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/gst/get-2b" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><Get2b /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/gst/get-3b" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><Get3b /></ClientAppShell></ProtectedRoute>} />

              {/* Client Calculators - Protected with ClientAppShell */}
              <Route path="/client/calculators" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculators basePath="/client/calculators" /></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/sip" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><SIPCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/retirement" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><RetirementCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/fd" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><FDCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/inflation" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><InflationCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/cagr" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><CAGRCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/emi" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><EMICalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/tax" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><TaxCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/capital-gains" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><CapitalGainsCal /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/tds" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><BulkTDSCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/tds-individual" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><TDSCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/swp" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><SWPCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/mf" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><MFCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/salary" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><SalaryCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/prepayment" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><ExistingLoanCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/financial-health" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><FinancialHealthCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />
              <Route path="/client/calculators/portfolio" element={<ProtectedRoute requiredRole="CLIENT"><ClientAppShell><DashboardCalculatorWrapper backPath="/client/calculators"><InvestmentCalculator /></DashboardCalculatorWrapper></ClientAppShell></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GSTInitializer>
    </AuthProvider >
  </QueryClientProvider >
);

export default App;
