import { motion } from 'framer-motion';
import { CreditCard, Receipt, Download, CheckCircle, Clock, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const invoices = [
  {
    id: 1,
    number: 'INV-2026-001',
    description: 'Tax Filing Service - AY 2025-26',
    amount: 15000,
    status: 'pending',
    dueDate: '2026-01-25',
  },
  {
    id: 2,
    number: 'INV-2025-089',
    description: 'GST Filing Service - Q4 2025',
    amount: 5000,
    status: 'paid',
    paidAt: '2025-12-15',
  },
  {
    id: 3,
    number: 'INV-2025-056',
    description: 'Tax Filing Service - AY 2024-25',
    amount: 12000,
    status: 'paid',
    paidAt: '2025-03-20',
  },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ClientBilling() {
  const pendingAmount = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground mt-1">
          Manage your invoices and payment history
        </p>
      </div>

      {/* Outstanding Balance */}
      {pendingAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {formatCurrency(pendingAmount)}
                  </p>
                </div>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <IndianRupee className="mr-1 h-4 w-4" />
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Invoices */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center',
                    invoice.status === 'paid' ? 'bg-success/10' : 'bg-warning/10'
                  )}>
                    {invoice.status === 'paid' ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <Clock className="h-5 w-5 text-warning" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{invoice.number}</p>
                      <Badge 
                        variant={invoice.status === 'paid' ? 'secondary' : 'destructive'}
                        className="text-xs capitalize"
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {invoice.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {invoice.status === 'paid' 
                        ? `Paid on ${new Date(invoice.paidAt).toLocaleDateString('en-IN')}`
                        : `Due by ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-lg">
                    {formatCurrency(invoice.amount)}
                  </p>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">HDFC Bank •••• 4523</p>
                <p className="text-sm text-muted-foreground">Expires 08/27</p>
              </div>
            </div>
            <Badge variant="secondary">Default</Badge>
          </div>
          <Button variant="outline" className="w-full mt-4">
            Add Payment Method
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
