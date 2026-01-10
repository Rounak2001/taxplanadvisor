import { motion } from 'framer-motion';
import { Flame, Trophy, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function ComplianceStreak({ 
  streakDays = 45, 
  currentProgress = 80,
  pendingItem = 'Bank Statement',
  monthlyStreak = 3
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-warning/10 to-transparent">
        <CardTitle className="text-lg flex items-center gap-2">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity, 
              repeatDelay: 2 
            }}
          >
            <Flame size={24} className="text-warning" />
          </motion.div>
          Compliance Streak
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Streak Counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                className="text-4xl font-bold text-warning"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {monthlyStreak}
              </motion.div>
              <Flame 
                size={16} 
                className="absolute -top-1 -right-3 text-warning fill-warning" 
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Month Streak</p>
              <p className="text-xs text-muted-foreground">Filed on time</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star 
                  size={20} 
                  className={cn(
                    'transition-colors',
                    i < monthlyStreak 
                      ? 'text-warning fill-warning' 
                      : 'text-muted-foreground/30'
                  )} 
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Current Month Progress */}
        <div className="p-4 rounded-xl bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              March Filing Progress
            </span>
            <span className="text-sm font-semibold text-primary">
              {currentProgress}%
            </span>
          </div>
          
          <Progress value={currentProgress} className="h-3" />
          
          {currentProgress < 100 && (
            <motion.p 
              className="text-xs text-muted-foreground mt-2 flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TrendingUp size={12} className="text-primary" />
              Upload <span className="font-medium text-foreground">{pendingItem}</span> to reach 100%!
            </motion.p>
          )}
        </div>
        
        {/* Achievement Badge */}
        {monthlyStreak >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-success/10 to-success/5 border border-success/20"
          >
            <div className="p-2 rounded-lg bg-success/10">
              <Trophy size={18} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Early Bird Achievement! 🎉
              </p>
              <p className="text-xs text-muted-foreground">
                3+ months of on-time filings
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
