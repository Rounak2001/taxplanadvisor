import { motion } from 'framer-motion';
import { Check, FileText, Cpu, UserCheck, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const milestones = [
  {
    id: 1,
    title: 'Documents Received',
    description: 'All required documents uploaded',
    icon: FileText,
    status: 'completed',
    date: 'Dec 28, 2025',
  },
  {
    id: 2,
    title: 'AI Processing',
    description: 'Automated data extraction & validation',
    icon: Cpu,
    status: 'completed',
    date: 'Dec 30, 2025',
  },
  {
    id: 3,
    title: 'CA Review',
    description: 'Expert review in progress',
    icon: UserCheck,
    status: 'current',
    date: 'In Progress',
  },
  {
    id: 4,
    title: 'Filed',
    description: 'Tax return filed with IT Department',
    icon: FileCheck,
    status: 'pending',
    date: 'Pending',
  },
];

export function MilestoneTracker() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Tax Filing Progress</CardTitle>
          <p className="text-sm text-muted-foreground">Assessment Year 2025-26</p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isLast = index === milestones.length - 1;
              
              return (
                <div key={milestone.id} className="flex gap-4 pb-6 last:pb-0">
                  {/* Timeline line and dot */}
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      className={cn(
                        'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2',
                        milestone.status === 'completed' && 'bg-success border-success',
                        milestone.status === 'current' && 'bg-primary border-primary animate-pulse',
                        milestone.status === 'pending' && 'bg-muted border-border'
                      )}
                    >
                      {milestone.status === 'completed' ? (
                        <Check className="h-5 w-5 text-success-foreground" />
                      ) : (
                        <Icon 
                          className={cn(
                            'h-5 w-5',
                            milestone.status === 'current' ? 'text-primary-foreground' : 'text-muted-foreground'
                          )} 
                          strokeWidth={1.5} 
                        />
                      )}
                    </motion.div>
                    
                    {!isLast && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                        className={cn(
                          'absolute top-10 left-1/2 w-0.5 -translate-x-1/2',
                          milestone.status === 'completed' ? 'bg-success' : 'bg-border'
                        )}
                        style={{ height: 'calc(100% - 2.5rem)' }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                    className="flex-1 pt-1"
                  >
                    <h4 className={cn(
                      'font-medium',
                      milestone.status === 'pending' && 'text-muted-foreground'
                    )}>
                      {milestone.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {milestone.description}
                    </p>
                    <span className={cn(
                      'inline-block mt-2 text-xs px-2 py-1 rounded-full',
                      milestone.status === 'completed' && 'bg-success/10 text-success',
                      milestone.status === 'current' && 'bg-primary/10 text-primary',
                      milestone.status === 'pending' && 'bg-muted text-muted-foreground'
                    )}>
                      {milestone.date}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
