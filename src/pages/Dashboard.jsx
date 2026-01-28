import { useNavigate } from 'react-router-dom';
import {
  Users,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { mockClients, mockDocuments, mockActivities } from '@/lib/mockData';
import { AssignedClientsCard } from '@/components/consultant/AssignedClientsCard';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { taxYear, consultantId } = useAppStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'My Workload',
      value: `${user?.stats?.current_load || 0} / ${user?.stats?.max_capacity || 10}`,
      change: `${user?.stats?.current_load || 0} clients`,
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Services Offered',
      value: user?.stats?.services?.length || 0,
      change: user?.stats?.services?.join(', ') || 'N/A',
      changeType: 'positive',
      icon: FileCheck,
    },
    {
      title: 'GST Filings Due',
      value: '8',
      change: '+2',
      changeType: 'negative',
      icon: Calendar,
    },
    {
      title: 'Revenue This Month',
      value: '₹2.4L',
      change: '+18%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  const upcomingDeadlines = [
    { client: 'Rajesh Kumar Industries', task: 'GST Filing', date: 'Jan 20', priority: 'high' },
    { client: 'Sharma Textiles Pvt Ltd', task: 'TDS Return', date: 'Jan 25', priority: 'medium' },
    { client: 'Singh Pharmaceuticals', task: 'Advance Tax', date: 'Jan 31', priority: 'high' },
    { client: 'Patel Electronics', task: 'ITR Filing', date: 'Feb 15', priority: 'low' },
  ];

  const activeClients = mockClients.filter(
    (c) => c.consultantId === consultantId && c.status === 'active'
  );

  const pendingDocs = mockDocuments.filter(
    (d) => d.consultantId === consultantId && d.status !== 'approved'
  );

  const recentActivities = mockActivities.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.full_name || 'Consultant'}! Here's your practice status.</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {taxYear}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-semibold">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon size={24} strokeWidth={1.5} className="text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight size={16} className="text-success" />
                  ) : (
                    <ArrowDownRight size={16} className="text-destructive" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                    )}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} strokeWidth={1.5} />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Tasks due in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        deadline.priority === 'high' && 'bg-destructive',
                        deadline.priority === 'medium' && 'bg-warning',
                        deadline.priority === 'low' && 'bg-success'
                      )}
                    />
                    <div>
                      <p className="font-medium text-sm">{deadline.client}</p>
                      <p className="text-xs text-muted-foreground">{deadline.task}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{deadline.date}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} strokeWidth={1.5} />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates across your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const client = mockClients.find((c) => c.id === activity.clientId);
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div
                      className={cn(
                        'mt-1 h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium',
                        activity.type === 'whatsapp' && 'bg-success/20 text-success',
                        activity.type === 'call' && 'bg-info/20 text-info',
                        activity.type === 'document' && 'bg-warning/20 text-warning',
                        activity.type === 'system' && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {activity.type.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {client?.name} • {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(activity.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Users size={24} strokeWidth={1.5} className="text-primary" />
              <span>Add Client</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <FileCheck size={24} strokeWidth={1.5} className="text-primary" />
              <span>Upload Document</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Calendar size={24} strokeWidth={1.5} className="text-primary" />
              <span>New CMA Report</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate('/gst')}>
              <TrendingUp size={24} strokeWidth={1.5} className="text-primary" />
              <span>GST Reconciliation</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Clients Section */}
      <AssignedClientsCard />
    </div>
  );
}
