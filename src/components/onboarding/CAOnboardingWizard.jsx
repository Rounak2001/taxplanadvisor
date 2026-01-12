import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, CheckCircle2, ArrowRight, ArrowLeft, Loader2,
  FileCheck, Upload, MessageCircle, Shield, Search, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const steps = [
  { id: 1, title: 'Profile Discovery', description: 'Validate PAN/GSTIN', icon: Search },
  { id: 2, title: 'Service Selection', description: 'Choose services needed', icon: FileCheck },
  { id: 3, title: 'AI-OCR Quick Start', description: 'Upload documents', icon: Upload },
  { id: 4, title: 'DPDP Consent', description: 'Generate consent link', icon: Shield },
];

const services = [
  { id: 'gst-monthly', label: 'GST Filing (Monthly)', category: 'GST' },
  { id: 'gst-annual', label: 'GST Annual Return', category: 'GST' },
  { id: 'itr-1', label: 'ITR-1 (Sahaj)', category: 'ITR' },
  { id: 'itr-2', label: 'ITR-2', category: 'ITR' },
  { id: 'itr-3', label: 'ITR-3', category: 'ITR' },
  { id: 'itr-4', label: 'ITR-4 (Sugam)', category: 'ITR' },
  { id: 'itr-5', label: 'ITR-5', category: 'ITR' },
  { id: 'itr-6', label: 'ITR-6', category: 'ITR' },
  { id: 'itr-7', label: 'ITR-7', category: 'ITR' },
  { id: 'cma', label: 'CMA Reports', category: 'Financial' },
  { id: 'bookkeeping', label: 'Bookkeeping', category: 'Financial' },
  { id: 'audit', label: 'Statutory Audit', category: 'Audit' },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function CAOnboardingWizard({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [consentSent, setConsentSent] = useState(false);

  const [formData, setFormData] = useState({
    pan: '',
    gstin: '',
    companyName: '',
    address: '',
    selectedServices: [],
    whatsappNumber: '',
  });

  const handleValidate = async () => {
    setIsValidating(true);
    // Simulate API validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormData(prev => ({
      ...prev,
      companyName: 'Sharma Enterprises Pvt Ltd',
      address: '123 Business Park, Andheri East, Mumbai 400069',
    }));
    setIsValidated(true);
    setIsValidating(false);
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, status: 'processing' }))]);
    
    // Simulate OCR processing
    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'complete' })));
    }, 2000);
  };

  const handleSendConsent = () => {
    setConsentSent(true);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = (currentStep / 4) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 shadow-2xl">
          <CardHeader className="relative pb-2">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-serif text-xl">Add New Client</CardTitle>
                <CardDescription>Smart onboarding with AI validation</CardDescription>
              </div>
            </div>

            {/* Progress */}
            <Progress value={progress} className="h-2 mb-4" />

            {/* Step Indicators */}
            <div className="flex justify-between">
              {steps.map((step) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id;

                return (
                  <div key={step.id} className="flex flex-col items-center text-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isComplete ? 'bg-primary text-primary-foreground' :
                      isActive ? 'bg-primary/20 text-primary border-2 border-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                    </div>
                    <div className={`text-xs font-medium hidden sm:block ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="min-h-[300px]"
              >
                {/* Step 1: Profile Discovery */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold mb-2">Profile Discovery</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Enter PAN or GSTIN to auto-fill client details
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="pan">PAN Number</Label>
                        <div className="flex gap-2 mt-1.5">
                          <Input
                            id="pan"
                            placeholder="ABCPK1234A"
                            value={formData.pan}
                            onChange={(e) => setFormData(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                            maxLength={10}
                            className="uppercase"
                          />
                          <Button 
                            onClick={handleValidate} 
                            disabled={formData.pan.length < 10 || isValidating}
                            className="gap-2"
                          >
                            {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            Validate
                          </Button>
                        </div>
                      </div>

                      <div className="text-center text-sm text-muted-foreground">— or —</div>

                      <div>
                        <Label htmlFor="gstin">GSTIN</Label>
                        <Input
                          id="gstin"
                          placeholder="27ABCPK1234A1Z5"
                          value={formData.gstin}
                          onChange={(e) => setFormData(prev => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                          maxLength={15}
                          className="uppercase mt-1.5"
                        />
                      </div>

                      {isValidated && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-success/10 border border-success/20"
                        >
                          <div className="flex items-center gap-2 text-success mb-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">Validated Successfully</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div><strong>Company:</strong> {formData.companyName}</div>
                            <div><strong>Address:</strong> {formData.address}</div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Service Selection */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold mb-2">Service Selection</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Select the services this client needs
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-2">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                            formData.selectedServices.includes(service.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleServiceToggle(service.id)}
                        >
                          <Checkbox
                            checked={formData.selectedServices.includes(service.id)}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                          />
                          <div>
                            <div className="text-sm font-medium">{service.label}</div>
                            <div className="text-xs text-muted-foreground">{service.category}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {formData.selectedServices.length} service(s) selected
                    </div>
                  </div>
                )}

                {/* Step 3: AI-OCR Quick Start */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold mb-2">AI-OCR Quick Start</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Upload a bank statement or PAN card to auto-populate the client's profile
                      </p>
                    </div>

                    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                      <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                      <span className="text-sm font-medium">Drop files here or click to upload</span>
                      <span className="text-xs text-muted-foreground mt-1">Bank Statement, PAN Card, GST Certificate</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles.map((file, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                            <FileCheck className="w-5 h-5 text-primary" />
                            <span className="text-sm flex-1 truncate">{file.name}</span>
                            {file.status === 'processing' ? (
                              <Badge variant="outline" className="gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Processing
                              </Badge>
                            ) : (
                              <Badge className="bg-success gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Extracted
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: DPDP Consent */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold mb-2">DPDP 2023 Consent</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Generate a WhatsApp consent link for DPDP 2026 legal compliance
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50 border">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-medium">Data Access Authorization</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        The client will receive a secure link to authorize:
                      </p>
                      <ul className="space-y-2 text-sm">
                        {[
                          'Access to PAN-linked financial data',
                          'Document storage in encrypted vault',
                          'Communication via WhatsApp/Email',
                          'Third-party data sharing (banks, IT dept)',
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Label htmlFor="whatsapp">Client's WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        placeholder="+91 98765 43210"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        className="mt-1.5"
                      />
                    </div>

                    {consentSent ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-success/10 border border-success/20"
                      >
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Consent link sent via WhatsApp!</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Client will receive a secure link valid for 48 hours.
                        </p>
                      </motion.div>
                    ) : (
                      <Button 
                        className="w-full gap-2" 
                        onClick={handleSendConsent}
                        disabled={!formData.whatsappNumber}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Send Consent Link via WhatsApp
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < 4 ? (
                <Button onClick={nextStep} className="gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={onClose} 
                  disabled={!consentSent}
                  className="gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Onboarding
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
