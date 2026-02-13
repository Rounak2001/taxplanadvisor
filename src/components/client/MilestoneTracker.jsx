import { motion } from 'framer-motion';
import { Check, FileText, Cpu, UserCheck, FileCheck, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function MilestoneTracker({ status = 'pending' }) {
  // Map granular backend statuses to milestone indices (0-5)
  const statusToMilestoneIndex = {
    'pending': 0,
    'assigned': 2,
    'doc_pending': 2,
    'under_review': 2,
    'wip': 3,
    'under_query': 2,
    'final_review': 4,
    'filed': 4,            // Filed means work is done, waiting for client confirmation
    'revision_pending': 4, // Revision requested usually happens at the review stage
    'completed': 5,        // Final terminal state
    'cancelled': -1
  };

  const currentIndex = statusToMilestoneIndex[status] ?? 0;

  const milestones = [
    {
      id: 1,
      title: 'Pending',
      description: status === 'pending' ? 'Request received and in queue' : 'Your request has been registered',
      icon: Clock,
      status: currentIndex > 0 ? 'completed' : (currentIndex === 0 ? 'current' : 'pending'),
    },
    {
      id: 2,
      title: 'TC Assigned',
      description: status === 'assigned' ? 'A tax consultant has been assigned to your request' : 'Expert is ready to assist',
      icon: UserCheck,
      status: currentIndex > 1 ? 'completed' : (currentIndex === 1 ? 'current' : 'pending'),
    },
    {
      id: 3,
      title: 'Doc Upload',
      description: status === 'doc_pending' ? 'Please upload the required documents in vault' : 'Documents received and verified',
      icon: FileText,
      status: currentIndex > 2 ? 'completed' : (currentIndex === 2 ? 'current' : 'pending'),
    },
    {
      id: 4,
      title: 'WIP',
      description: status === 'under_query' ? 'Expert requested clarifications' : 'Expert is computing your tax liability',
      icon: Cpu,
      status: currentIndex > 3 ? 'completed' : (currentIndex === 3 ? 'current' : 'pending'),
    },
    {
      id: 5,
      title: 'Review',
      description: ['filed', 'final_review'].includes(status) ? 'Final report uploaded! Please review and confirm.' : 'Final quality check in progress',
      icon: Search,
      status: currentIndex > 4 ? 'completed' : (currentIndex === 4 ? 'current' : 'pending'),
    },
    {
      id: 6,
      title: 'Complete',
      description: status === 'completed' ? 'Your service is successfully completed' : 'Finalizing all records',
      icon: FileCheck,
      status: currentIndex > 5 ? 'completed' : (currentIndex === 5 ? 'current' : 'pending'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Tax Filing Progress</CardTitle>
          <p className="text-sm text-muted-foreground">Real-time update from your consultant</p>
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
                        'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-500',
                        milestone.status === 'completed' && 'bg-green-500 border-green-500',
                        milestone.status === 'current' && 'bg-primary border-primary animate-pulse',
                        milestone.status === 'pending' && 'bg-muted border-border'
                      )}
                    >
                      {milestone.status === 'completed' ? (
                        <Check className="h-5 w-5 text-white" />
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
                          'absolute top-10 left-1/2 w-0.5 -translate-x-1/2 transition-colors duration-500',
                          milestone.status === 'completed' ? 'bg-green-500' : 'bg-border'
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
                      'font-medium transition-colors duration-500',
                      milestone.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                    )}>
                      {milestone.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {milestone.description}
                    </p>
                    {milestone.status === 'current' && (
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full animate-pulse">
                        In Progress
                      </span>
                    )}
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
