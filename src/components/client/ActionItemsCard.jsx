import { motion } from 'framer-motion';
import { Upload, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function ActionItemsCard({ pendingCount = 3 }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <Card className="glass overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Action Items</span>
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-destructive" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-foreground">{pendingCount}</span>
            <span className="text-lg text-muted-foreground">Pending Uploads</span>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Your CA has requested additional documents
          </p>

          <Button 
            variant="outline" 
            className="w-full group"
            onClick={() => navigate('/client/documents')}
          >
            View Requests
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
