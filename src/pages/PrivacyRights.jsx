import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  User,
  Calendar,
  ChevronRight,
  Lock,
  Unlock,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const consentItems = [
  {
    id: 'pan',
    label: 'PAN Card',
    description: 'Used for ITR filing and identity verification',
    grantedDate: '2024-01-15',
    purpose: 'Tax Filing & Compliance',
    active: true,
    sensitive: true,
  },
  {
    id: 'bank',
    label: 'Bank Statements',
    description: 'Used for income verification and GST reconciliation',
    grantedDate: '2024-02-01',
    purpose: 'Financial Analysis',
    active: true,
    sensitive: true,
  },
  {
    id: 'gst',
    label: 'GST Data',
    description: 'Used for GST filing and input credit matching',
    grantedDate: '2024-01-20',
    purpose: 'GST Compliance',
    active: true,
    sensitive: false,
  },
  {
    id: 'contact',
    label: 'Contact Information',
    description: 'Email and phone for communication',
    grantedDate: '2024-01-10',
    purpose: 'Communication',
    active: true,
    sensitive: false,
  },
  {
    id: 'business',
    label: 'Business Financials',
    description: 'P&L, Balance Sheet for CMA reports',
    grantedDate: '2024-03-01',
    purpose: 'Credit Assessment',
    active: false,
    sensitive: true,
  },
];

const accessLogs = [
  {
    id: 1,
    action: 'Viewed',
    dataType: 'PAN Card',
    accessor: 'CA Rajesh Kumar',
    purpose: 'GST Filing Verification',
    timestamp: '2024-03-10 14:30',
    icon: Eye,
  },
  {
    id: 2,
    action: 'Downloaded',
    dataType: 'Bank Statement (Feb 2024)',
    accessor: 'CA Rajesh Kumar',
    purpose: 'Income Verification',
    timestamp: '2024-03-08 11:15',
    icon: Download,
  },
  {
    id: 3,
    action: 'Accessed',
    dataType: 'GST Returns Data',
    accessor: 'System (Auto-Sync)',
    purpose: 'GST Reconciliation',
    timestamp: '2024-03-07 09:00',
    icon: Eye,
  },
  {
    id: 4,
    action: 'Viewed',
    dataType: 'Business Financials',
    accessor: 'CA Rajesh Kumar',
    purpose: 'CMA Report Generation',
    timestamp: '2024-03-05 16:45',
    icon: Eye,
  },
  {
    id: 5,
    action: 'Exported',
    dataType: 'Tax Computation Sheet',
    accessor: 'CA Rajesh Kumar',
    purpose: 'ITR Filing',
    timestamp: '2024-03-01 10:30',
    icon: Download,
  },
];

export default function PrivacyRights() {
  const [consents, setConsents] = useState(consentItems);
  const [showLogs, setShowLogs] = useState(true);

  const handleConsentToggle = (id) => {
    setConsents(prev => prev.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
    
    const item = consents.find(c => c.id === id);
    if (item?.active) {
      toast.success(`Consent withdrawn for ${item.label}`);
    } else {
      toast.success(`Consent granted for ${item?.label}`);
    }
  };

  const handleDownloadData = () => {
    toast.success('Your data export has been initiated. You will receive an email shortly.');
  };

  const handleEraseRequest = () => {
    toast.info('Erasure request submitted. Your consultant will be notified.');
  };

  const handleGenerateCertificate = () => {
    toast.success('DPDP Compliance Certificate generated successfully!');
  };

  const activeConsents = consents.filter(c => c.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Shield className="text-primary" size={28} strokeWidth={1.5} />
            Privacy & Data Rights
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your data under DPDP Act 2023
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadData}>
            <Download size={16} className="mr-2" />
            Export My Data
          </Button>
          <Button variant="outline" size="sm" onClick={handleEraseRequest}>
            <Trash2 size={16} className="mr-2" />
            Request Erasure
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <CheckCircle size={24} className="text-success" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeConsents}</p>
                <p className="text-sm text-muted-foreground">Active Consents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/10">
                <Clock size={24} className="text-info" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{accessLogs.length}</p>
                <p className="text-sm text-muted-foreground">Access Events (30 days)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Lock size={24} className="text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Compliant</p>
                <p className="text-sm text-muted-foreground">DPDP Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consent Manager */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User size={20} className="text-primary" />
              Consent Manager
            </CardTitle>
            <CardDescription>
              Control which data your consultant can access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {consents.map((item) => (
              <motion.div
                key={item.id}
                layout
                className={cn(
                  'p-4 rounded-xl border transition-all duration-200',
                  item.active 
                    ? 'border-border bg-card' 
                    : 'border-border/50 bg-muted/30'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-2 rounded-lg mt-0.5',
                      item.active ? 'bg-success/10' : 'bg-muted'
                    )}>
                      {item.active ? (
                        <Unlock size={16} className="text-success" />
                      ) : (
                        <Lock size={16} className="text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {item.label}
                        </p>
                        {item.sensitive && (
                          <Badge variant="outline" className="text-xs py-0">
                            Sensitive
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Purpose: {item.purpose}
                      </p>
                    </div>
                  </div>
                  
                  <Switch
                    checked={item.active}
                    onCheckedChange={() => handleConsentToggle(item.id)}
                  />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Access Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  Data Access Logs
                </CardTitle>
                <CardDescription>
                  Every access to your data is recorded
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowLogs(!showLogs)}>
                {showLogs ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          
          <AnimatePresence>
            {showLogs && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                  {accessLogs.map((log, index) => {
                    const Icon = log.icon;
                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-1.5 rounded bg-primary/10 mt-0.5">
                          <Icon size={14} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {log.action}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {log.dataType}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            By: {log.accessor}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Purpose: {log.purpose}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {log.timestamp}
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* DPDP Certificate */}
      <Card className="bg-gradient-to-r from-primary/5 via-transparent to-success/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Award size={28} className="text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  DPDP Compliance Certificate
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generate a certificate proving secure data handling practices
                </p>
              </div>
            </div>
            
            <Button onClick={handleGenerateCertificate}>
              <FileText size={16} className="mr-2" />
              Generate Certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
