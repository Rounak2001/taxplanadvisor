import { motion } from 'framer-motion';
import { Trophy, Medal, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const mockClients = [
  { id: 1, name: 'Sharma Industries', streak: 12, status: 'compliant', pendingDocs: 0, lastFiling: '2024-03-01' },
  { id: 2, name: 'Tech Solutions Pvt Ltd', streak: 8, status: 'compliant', pendingDocs: 0, lastFiling: '2024-03-02' },
  { id: 3, name: 'Green Ventures', streak: 6, status: 'compliant', pendingDocs: 1, lastFiling: '2024-02-28' },
  { id: 4, name: 'Metro Traders', streak: 4, status: 'pending', pendingDocs: 2, lastFiling: '2024-02-15' },
  { id: 5, name: 'Sunrise Exports', streak: 3, status: 'pending', pendingDocs: 3, lastFiling: '2024-02-10' },
  { id: 6, name: 'City Retailers', streak: 1, status: 'action', pendingDocs: 5, lastFiling: '2024-01-20' },
  { id: 7, name: 'Alpha Manufacturing', streak: 0, status: 'action', pendingDocs: 7, lastFiling: '2024-01-05' },
];

const statusConfig = {
  compliant: { label: 'Top Compliant', color: 'text-success', bgColor: 'bg-success/10', icon: CheckCircle },
  pending: { label: 'Pending', color: 'text-warning', bgColor: 'bg-warning/10', icon: Clock },
  action: { label: 'Action Required', color: 'text-destructive', bgColor: 'bg-destructive/10', icon: AlertCircle },
};

export function ClientLeaderboard() {
  const topClients = mockClients.filter(c => c.status === 'compliant').slice(0, 3);
  const actionClients = mockClients.filter(c => c.status === 'action' || c.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy size={20} className="text-warning" />
            Top Compliant Clients
          </CardTitle>
          <CardDescription>Clients with the best filing streaks</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {topClients.map((client, index) => {
              const rank = index + 1;
              const medalColors = ['text-warning', 'text-muted-foreground', 'text-orange-400'];
              
              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <Medal 
                        size={16} 
                        className={cn(
                          'absolute -top-1 -right-1',
                          medalColors[index] || 'text-muted-foreground'
                        )} 
                      />
                    </div>
                    <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {client.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last filed: {client.lastFiling}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10">
                      <TrendingUp size={14} className="text-warning" />
                      <span className="text-sm font-semibold text-warning">
                        {client.streak} mo
                      </span>
                    </div>
                    <Badge variant="outline" className="text-success border-success/30">
                      <CheckCircle size={12} className="mr-1" />
                      Compliant
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Required */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle size={20} className="text-destructive" />
            Needs Attention
          </CardTitle>
          <CardDescription>Clients requiring follow-up</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            {actionClients.map((client, index) => {
              const config = statusConfig[client.status];
              const StatusIcon = config.icon;
              
              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-border/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={cn('text-xs', config.bgColor, config.color)}>
                        {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {client.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {client.pendingDocs} documents pending
                      </p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', config.color)}
                  >
                    <StatusIcon size={12} className="mr-1" />
                    {config.label}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
