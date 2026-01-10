import { motion } from 'framer-motion';
import { FileCheck, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const statusConfig = {
  'filed': {
    label: 'Filed',
    icon: FileCheck,
    bgClass: 'bg-success/10',
    textClass: 'text-success',
    borderClass: 'border-success/20',
  },
  'in-review': {
    label: 'In Review',
    icon: Clock,
    bgClass: 'bg-warning/10',
    textClass: 'text-warning',
    borderClass: 'border-warning/20',
  },
  'pending': {
    label: 'Pending',
    icon: AlertCircle,
    bgClass: 'bg-muted',
    textClass: 'text-muted-foreground',
    borderClass: 'border-border',
  },
};

export function TaxStatusCard({ status = 'in-review' }) {
  const config = statusConfig[status] || statusConfig['pending'];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <Card className="glass overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Tax Status</span>
            <span className="text-xs text-muted-foreground">AY 2025-26</span>
          </div>
          
          <div className={cn(
            'inline-flex items-center gap-3 px-5 py-3 rounded-xl border',
            config.bgClass,
            config.borderClass
          )}>
            <Icon className={cn('h-6 w-6', config.textClass)} strokeWidth={1.5} />
            <span className={cn('text-xl font-semibold', config.textClass)}>
              {config.label}
            </span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Your tax return is currently being reviewed by your CA.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
