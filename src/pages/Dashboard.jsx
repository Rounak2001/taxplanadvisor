import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {Users,FileCheck,TrendingUp,AlertTriangle,ArrowUpRight,ArrowDownRight,Calendar, Clock,AlertCircle,CheckCircle2,Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { AssignedClientsCard } from '@/components/consultant/AssignedClientsCard';
import { CallLogsTable } from '@/components/consultant/CallLogsTable';
import { ActivityTimeline } from '@/components/consultant/ActivityTimeline';
import { consultantService } from '@/api/consultantService';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { taxYear, consultantId } = useAppStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Fetch dashboard stats with React Query
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['consultant-dashboard-stats'],
    queryFn: consultantService.getDashboardStats,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch full dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['consultant-dashboard'],
    queryFn: consultantService.getDashboard,
    refetchInterval: 5000,
  });

  const stats = [
    {
      title: 'My Workload',
      value: dashboardStats?.clients
        ? `${dashboardStats.clients.current_clients} / ${dashboardStats.clients.max_capacity}`
        : '0 / 10',
      change: dashboardStats?.clients
        ? `${dashboardStats.clients.utilization_percentage}% utilized`
        : '0% utilized',
      changeType: (dashboardStats?.clients?.utilization_percentage || 0) > 80 ? 'negative' : 'positive',
      icon: Users,
    },
    {
      title: 'Services Offered',
      value: dashboardStats?.services_offered || 0,
      change: `Active services`,
      changeType: 'positive',
      icon: FileCheck,
    },
    {
      title: 'Active Requests',
      value: dashboardStats?.service_requests?.in_progress || 0,
      change: `${dashboardStats?.service_requests?.pending || 0} pending`,
      changeType: (dashboardStats?.service_requests?.pending || 0) > 0 ? 'negative' : 'positive',
      icon: Clock,
    },
    {
      title: 'Completed This Month',
      value: dashboardStats?.monthly_completed || 0,
      change: `${dashboardStats?.service_requests?.completed || 0} total`,
      changeType: 'positive',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.full_name || 'Consultant'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your practice overview and client status.
          </p>
        </div>
      </div>

      {/* Assigned Clients Section */}
      <AssignedClientsCard />

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



      {/* Document Review Alert */}
      {dashboardStats?.documents?.total_pending > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                  <AlertCircle size={24} strokeWidth={1.5} className="text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    Documents Pending Review
                    <Badge variant="destructive" className="animate-pulse">
                      {dashboardStats.documents.total_pending}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {dashboardStats.documents.needs_review} newly uploaded • {dashboardStats.documents.rejected} need re-review
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={() => navigate('/vault')}
              >
                <FileCheck size={16} />
                Review Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Requests Overview */}
      {dashboardData?.assigned_requests && dashboardData.assigned_requests.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} strokeWidth={1.5} />
                  Active Service Requests
                </CardTitle>
                <CardDescription>
                  {dashboardData.assigned_requests.length} requests currently assigned to you
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/services')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.assigned_requests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => navigate(`/services/${request.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        request.status === 'pending' && 'bg-warning',
                        request.status === 'assigned' && 'bg-info',
                        request.status === 'in_progress' && 'bg-primary',
                        request.status === 'completed' && 'bg-success'
                      )}
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {request.client_name || 'Client'} - {request.service?.title || 'Service'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Assigned {new Date(request.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    request.status === 'pending' ? 'secondary' :
                      request.status === 'in_progress' ? 'default' :
                        request.status === 'completed' ? 'success' : 'secondary'
                  }>
                    {request.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <ActivityTimeline />

      {/* Call Logs Section */}
      <CallLogsTable limit={5} />
    </div>
  );
}
