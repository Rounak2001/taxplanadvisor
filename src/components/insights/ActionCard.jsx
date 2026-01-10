import { motion } from 'framer-motion';
import { AlertCircle, Lightbulb, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const typeConfig = {
  action: {
    icon: AlertCircle,
    iconClass: 'text-warning bg-warning/10',
    badgeVariant: 'secondary',
    badgeText: 'Action Required',
  },
  opportunity: {
    icon: Lightbulb,
    iconClass: 'text-success bg-success/10',
    badgeVariant: 'secondary',
    badgeText: 'Opportunity',
  },
  insight: {
    icon: TrendingUp,
    iconClass: 'text-info bg-info/10',
    badgeVariant: 'secondary',
    badgeText: 'Insight',
  },
};

export function ActionCard({ 
  type = 'insight', 
  title, 
  description, 
  amount,
  onAction,
  actionLabel = 'View Details'
}) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group p-4 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className={cn('p-2.5 rounded-lg shrink-0', config.iconClass)}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={config.badgeVariant} className="text-xs">
              {config.badgeText}
            </Badge>
            {amount && (
              <span className="text-sm font-semibold text-primary">
                {amount}
              </span>
            )}
          </div>
          
          <h4 className="text-sm font-medium text-foreground mb-1 line-clamp-1">
            {title}
          </h4>
          
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onAction}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </motion.div>
  );
}
