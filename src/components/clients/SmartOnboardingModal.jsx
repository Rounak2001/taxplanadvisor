import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, FileCheck, Landmark, CheckSquare, Upload, Scan, 
  CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft,
  Building2, Phone, Mail, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'basic', label: 'Basic Info', icon: User },
  { id: 'kyc', label: 'KYC Verification', icon: FileCheck },
  { id: 'bank', label: 'Bank Integration', icon: Landmark },
  { id: 'documents', label: 'Document Checklist', icon: CheckSquare },
];

const DOCUMENT_CHECKLIST = [
  { id: 'pan', label: 'PAN Card', required: true },
  { id: 'aadhar', label: 'Aadhar Card', required: true },
  { id: 'bank_statement', label: 'Bank Statement (Last 6 months)', required: true },
  { id: 'gst_registration', label: 'GST Registration Certificate', required: false },
  { id: 'incorporation', label: 'Certificate of Incorporation', required: false },
  { id: 'previous_itr', label: 'Previous ITR (if applicable)', required: false },
];

export function SmartOnboardingModal({ open, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [quickStartMode, setQuickStartMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Basic Info
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    // KYC
    pan: '',
    gstin: '',
    panVerified: false,
    gstinVerified: false,
    panError: '',
    gstinError: '',
    // Bank
    bankName: '',
    accountNumber: '',
    ifsc: '',
    bankLinked: false,
    // Documents
    documentsRequested: [],
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuickStartUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    setQuickStartMode(true);
    
    // Simulate AI-OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted data
    setFormData(prev => ({
      ...prev,
      businessName: 'Extracted Business Pvt Ltd',
      contactPerson: 'Vikram Singh',
      pan: 'AABCE1234F',
      gstin: '27AABCE1234F1ZK',
      email: 'contact@extractedbiz.com',
      phone: '+91 98765 00000',
    }));
    
    setIsProcessing(false);
  }, []);

  const validatePAN = async () => {
    setIsProcessing(true);
    updateFormData('panError', '');
    
    // Simulate API validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (panRegex.test(formData.pan)) {
      updateFormData('panVerified', true);
    } else {
      updateFormData('panError', 'Invalid PAN format');
    }
    setIsProcessing(false);
  };

  const validateGSTIN = async () => {
    setIsProcessing(true);
    updateFormData('gstinError', '');
    
    // Simulate API validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gstinRegex.test(formData.gstin)) {
      updateFormData('gstinVerified', true);
    } else if (formData.gstin) {
      updateFormData('gstinError', 'Invalid GSTIN format');
    }
    setIsProcessing(false);
  };

  const linkBankAccount = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateFormData('bankLinked', true);
    setIsProcessing(false);
  };

  const toggleDocument = (docId) => {
    setFormData(prev => {
      const docs = prev.documentsRequested.includes(docId)
        ? prev.documentsRequested.filter(d => d !== docId)
        : [...prev.documentsRequested, docId];
      return { ...prev, documentsRequested: docs };
    });
  };

  const handleComplete = () => {
    onComplete?.(formData);
    onClose();
    // Reset form
    setCurrentStep(0);
    setFormData({
      businessName: '', contactPerson: '', email: '', phone: '', address: '',
      pan: '', gstin: '', panVerified: false, gstinVerified: false, panError: '', gstinError: '',
      bankName: '', accountNumber: '', ifsc: '', bankLinked: false,
      documentsRequested: [],
    });
    setQuickStartMode(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.businessName && formData.contactPerson && formData.email && formData.phone;
      case 1: return formData.pan && formData.panVerified;
      case 2: return true; // Bank integration is optional
      case 3: return true; // Document requests are optional
      default: return true;
    }
  };

  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User size={20} strokeWidth={1.5} className="text-primary" />
            Smart Client Onboarding
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-center gap-1.5 text-xs',
                    isActive && 'text-primary font-medium',
                    isCompleted && 'text-success',
                    !isActive && !isCompleted && 'text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={14} className="text-success" />
                  ) : (
                    <Icon size={14} />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Basic Info */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  {/* Quick Start Option */}
                  <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-3 mb-3">
                      <Scan size={20} className="text-primary" />
                      <div>
                        <h4 className="font-medium">Quick Start with AI-OCR</h4>
                        <p className="text-sm text-muted-foreground">
                          Upload PAN card or invoice to auto-fill 70% of the form
                        </p>
                      </div>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleQuickStartUpload}
                      />
                      <Button variant="outline" size="sm" disabled={isProcessing} asChild>
                        <span>
                          {isProcessing ? (
                            <>
                              <Loader2 size={14} className="mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Upload size={14} className="mr-2" />
                              Upload Document
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                    {quickStartMode && !isProcessing && (
                      <Badge variant="secondary" className="mt-2 bg-success/10 text-success">
                        <CheckCircle2 size={12} className="mr-1" />
                        Form auto-filled from document
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <div className="relative mt-1.5">
                        <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="businessName"
                          value={formData.businessName}
                          onChange={(e) => updateFormData('businessName', e.target.value)}
                          placeholder="Enter business name"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <div className="relative mt-1.5">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => updateFormData('contactPerson', e.target.value)}
                          placeholder="Primary contact"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <div className="relative mt-1.5">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative mt-1.5">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          placeholder="business@example.com"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                        placeholder="Full address"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: KYC Verification */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                    <p className="text-sm text-info">
                      Real-time validation ensures accurate data entry and prevents compliance issues.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pan">PAN Number *</Label>
                      <div className="flex gap-2 mt-1.5">
                        <div className="relative flex-1">
                          <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="pan"
                            value={formData.pan}
                            onChange={(e) => {
                              updateFormData('pan', e.target.value.toUpperCase());
                              updateFormData('panVerified', false);
                              updateFormData('panError', '');
                            }}
                            placeholder="ABCDE1234F"
                            className={cn('pl-9', formData.panVerified && 'border-success')}
                            maxLength={10}
                          />
                        </div>
                        <Button
                          variant="outline"
                          onClick={validatePAN}
                          disabled={isProcessing || !formData.pan || formData.panVerified}
                        >
                          {isProcessing ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : formData.panVerified ? (
                            <CheckCircle2 size={14} className="text-success" />
                          ) : (
                            'Verify'
                          )}
                        </Button>
                      </div>
                      {formData.panError && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {formData.panError}
                        </p>
                      )}
                      {formData.panVerified && (
                        <p className="text-xs text-success mt-1 flex items-center gap-1">
                          <CheckCircle2 size={12} /> PAN verified successfully
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="gstin">GSTIN (Optional)</Label>
                      <div className="flex gap-2 mt-1.5">
                        <div className="relative flex-1">
                          <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="gstin"
                            value={formData.gstin}
                            onChange={(e) => {
                              updateFormData('gstin', e.target.value.toUpperCase());
                              updateFormData('gstinVerified', false);
                              updateFormData('gstinError', '');
                            }}
                            placeholder="27ABCDE1234F1ZK"
                            className={cn('pl-9', formData.gstinVerified && 'border-success')}
                            maxLength={15}
                          />
                        </div>
                        <Button
                          variant="outline"
                          onClick={validateGSTIN}
                          disabled={isProcessing || !formData.gstin || formData.gstinVerified}
                        >
                          {isProcessing ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : formData.gstinVerified ? (
                            <CheckCircle2 size={14} className="text-success" />
                          ) : (
                            'Verify'
                          )}
                        </Button>
                      </div>
                      {formData.gstinError && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {formData.gstinError}
                        </p>
                      )}
                      {formData.gstinVerified && (
                        <p className="text-xs text-success mt-1 flex items-center gap-1">
                          <CheckCircle2 size={12} /> GSTIN verified with GST portal
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Bank Integration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {!formData.bankLinked ? (
                    <>
                      <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                        <p className="text-sm text-warning">
                          Bank integration enables automatic statement reconciliation and faster processing.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={formData.bankName}
                            onChange={(e) => updateFormData('bankName', e.target.value)}
                            placeholder="e.g., HDFC Bank"
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={formData.accountNumber}
                            onChange={(e) => updateFormData('accountNumber', e.target.value)}
                            placeholder="XXXXXXXXXXXX"
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ifsc">IFSC Code</Label>
                          <Input
                            id="ifsc"
                            value={formData.ifsc}
                            onChange={(e) => updateFormData('ifsc', e.target.value.toUpperCase())}
                            placeholder="HDFC0001234"
                            className="mt-1.5"
                            maxLength={11}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={linkBankAccount}
                        disabled={isProcessing || !formData.bankName || !formData.accountNumber}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={14} className="mr-2 animate-spin" />
                            Linking Account...
                          </>
                        ) : (
                          <>
                            <Landmark size={14} className="mr-2" />
                            Link Bank Account
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        You can skip this step and add bank details later
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-success" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Bank Account Linked!</h3>
                      <p className="text-muted-foreground">
                        {formData.bankName} - XXXX{formData.accountNumber.slice(-4)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Document Checklist */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm">
                      Select documents to request from the client. They'll receive a personalized 
                      upload link via WhatsApp/Email.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {DOCUMENT_CHECKLIST.map((doc) => (
                      <label
                        key={doc.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                          formData.documentsRequested.includes(doc.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/50'
                        )}
                      >
                        <Checkbox
                          checked={formData.documentsRequested.includes(doc.id)}
                          onCheckedChange={() => toggleDocument(doc.id)}
                        />
                        <span className="flex-1">{doc.label}</span>
                        {doc.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </label>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const requiredDocs = DOCUMENT_CHECKLIST.filter(d => d.required).map(d => d.id);
                      setFormData(prev => ({ ...prev, documentsRequested: requiredDocs }));
                    }}
                    className="w-full"
                  >
                    Select All Required Documents
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={14} className="mr-2" />
            Back
          </Button>
          
          {currentStep < STEPS.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight size={14} className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              <CheckCircle2 size={14} className="mr-2" />
              Complete Onboarding
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
