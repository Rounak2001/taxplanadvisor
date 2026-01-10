import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CMABasicInfo } from '@/components/financial/CMABasicInfo';
import { CMABalanceSheet } from '@/components/financial/CMABalanceSheet';
import { CMAProfitLoss } from '@/components/financial/CMAProfitLoss';
import { CMARatios } from '@/components/financial/CMARatios';
import { CMASummary } from '@/components/financial/CMASummary';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'basic', label: 'Basic Info', description: 'Company and period details' },
  { id: 'balance', label: 'Balance Sheet', description: 'Assets and liabilities' },
  { id: 'pnl', label: 'Profit & Loss', description: 'Revenue and expenses' },
  { id: 'ratios', label: 'Ratios', description: 'Financial ratios' },
  { id: 'summary', label: 'Summary', description: 'Review and submit' },
];

const initialFormData = {
  basicInfo: {
    businessName: '',
    financialYear: 'FY 2024-25',
    industry: '',
    constitutionType: '',
    dateOfIncorporation: '',
    panNumber: '',
    gstin: '',
    bankName: '',
    facilityType: '',
    facilityAmount: '',
  },
  balanceSheet: {
    shareCapital: '',
    reservesAndSurplus: '',
    longTermBorrowings: '',
    shortTermBorrowings: '',
    tradepayables: '',
    otherCurrentLiabilities: '',
    fixedAssets: '',
    investments: '',
    inventory: '',
    tradeReceivables: '',
    cashAndBank: '',
    otherCurrentAssets: '',
  },
  profitLoss: {
    revenue: '',
    otherIncome: '',
    costOfMaterials: '',
    employeeCost: '',
    financeCost: '',
    depreciation: '',
    otherExpenses: '',
    taxExpense: '',
  },
  ratios: {},
};

export default function CMAMaker() {
  const { consultantId } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate save to localStorage
    localStorage.setItem('cma_draft', JSON.stringify({ consultantId, formData }));
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleSubmit = () => {
    console.log('Submitting CMA:', formData);
    // In production, this would submit via API
  };

  const renderStepContent = () => {
    const stepComponents = {
      basic: (
        <CMABasicInfo
          data={formData.basicInfo}
          onChange={(data) => updateFormData('basicInfo', data)}
          consultantId={consultantId}
        />
      ),
      balance: (
        <CMABalanceSheet
          data={formData.balanceSheet}
          onChange={(data) => updateFormData('balanceSheet', data)}
          consultantId={consultantId}
        />
      ),
      pnl: (
        <CMAProfitLoss
          data={formData.profitLoss}
          onChange={(data) => updateFormData('profitLoss', data)}
          consultantId={consultantId}
        />
      ),
      ratios: (
        <CMARatios
          balanceSheet={formData.balanceSheet}
          profitLoss={formData.profitLoss}
          consultantId={consultantId}
        />
      ),
      summary: (
        <CMASummary
          formData={formData}
          onSubmit={handleSubmit}
          consultantId={consultantId}
        />
      ),
    };

    return stepComponents[steps[currentStep].id];
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">CMA Maker</h1>
          <p className="text-muted-foreground">
            Credit Monitoring Arrangement Report Generator
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
            <Save size={16} strokeWidth={1.5} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button variant="outline">
            <Download size={16} strokeWidth={1.5} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {steps[currentStep].description}
              </p>
            </div>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />

          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  'flex flex-col items-center gap-2 transition-colors',
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <div
                  className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors',
                    index < currentStep && 'bg-primary border-primary text-primary-foreground',
                    index === currentStep && 'border-primary text-primary',
                    index > currentStep && 'border-muted-foreground'
                  )}
                >
                  {index < currentStep ? (
                    <CheckCircle size={20} strokeWidth={1.5} />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs font-medium hidden md:block">{step.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].label}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={16} strokeWidth={1.5} className="mr-2" />
          Previous
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button onClick={handleSubmit}>
            <CheckCircle size={16} strokeWidth={1.5} className="mr-2" />
            Generate Report
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ChevronRight size={16} strokeWidth={1.5} className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
