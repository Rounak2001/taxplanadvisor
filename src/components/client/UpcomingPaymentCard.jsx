import { motion } from 'framer-motion';
import { IndianRupee, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function UpcomingPaymentCard({ 
  type = 'GST', 
  amount = 45000, 
  dueDate = '2026-01-20' 
}) {
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  const formattedDate = new Date(dueDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <Card className="glass overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Upcoming Payment</span>
            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
              {type}
            </span>
          </div>
          
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-foreground">{formattedAmount}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>Due: {formattedDate}</span>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90">
            <IndianRupee className="mr-1 h-4 w-4" />
            Pay Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
