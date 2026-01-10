import { motion } from 'framer-motion';
import { MessageSquare, Bell, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const notifications = [
  {
    id: 1,
    type: 'message',
    title: 'New message from Suresh Kumar',
    description: 'Please upload your bank statement for April-December 2025.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'document',
    title: 'Document request',
    description: 'Your CA has requested 3 additional documents.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Payment reminder',
    description: 'GST payment of ₹45,000 is due on Jan 20, 2026.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 4,
    type: 'update',
    title: 'Status update',
    description: 'Your tax return has moved to "CA Review" stage.',
    time: '3 days ago',
    read: true,
  },
];

const iconMap = {
  message: MessageSquare,
  document: FileText,
  reminder: Calendar,
  update: Bell,
};

export default function ClientMessages() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">Message Center</h1>
        <p className="text-muted-foreground mt-1">
          Stay updated with notifications and messages from your CA
        </p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon = iconMap[notification.type];
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer hover:bg-muted/50',
                    !notification.read && 'bg-primary/5 border border-primary/10'
                  )}
                >
                  <div className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
                    !notification.read ? 'bg-primary/10' : 'bg-muted'
                  )}>
                    <Icon className={cn(
                      'h-5 w-5',
                      !notification.read ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        'font-medium',
                        !notification.read && 'text-foreground'
                      )}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground text-center">
        Use the chat bubble in the bottom right to message your CA directly
      </p>
    </motion.div>
  );
}
