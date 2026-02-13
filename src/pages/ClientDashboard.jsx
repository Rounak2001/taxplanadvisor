import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useAuthStore
} from '@/stores/useAuthStore';
import {
  Clock,
  User,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle2,
  Circle,
  ChevronRight,
  TrendingUp,
  FileText,
  Calendar,
  IndianRupee,
  ArrowUpRight,
  Loader2,
  ClipboardList,
  Search,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import api from '@/api/axios';

// Status workflow stages
const WORKFLOW_STAGES = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'assigned', label: 'TC Assigned', icon: User },
  { key: 'doc_pending', label: 'Doc Upload', icon: FileText },
  { key: 'wip', label: 'WIP', icon: ClipboardList },
  { key: 'review', label: 'Review', icon: Search },
  { key: 'completed', label: 'Complete', icon: CheckCircle2 },
];

// Status Progress Bar Component
function StatusProgressBar({ currentStatus }) {
  const getStageIndex = (status) => {
    const statusMap = {
      'pending': 0,
      'assigned': 2,
      'doc_pending': 2,
      'under_review': 2,
      'wip': 3,
      'under_query': 2,
      'final_review': 4,
      'filed': 4,
      'revision_pending': 4,
      'completed': 5,
      'cancelled': -1
    };
    return statusMap[status] ?? 0;
  };

  const currentStageIndex = getStageIndex(currentStatus);

  if (currentStageIndex === -1) return null;

  return (
    <div className="w-full py-6">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted/30 rounded-full" />
        <div
          className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStageIndex / (WORKFLOW_STAGES.length - 1)) * 100}%` }}
        />

        {/* Stages */}
        <div className="relative flex justify-between">
          {WORKFLOW_STAGES.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex flex-col items-center gap-2 relative">
                {/* Stage Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10",
                    isCompleted && "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20",
                    isCurrent && "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-background border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </motion.div>

                {/* Stage Label */}
                <div className="text-center">
                  <p className={cn(
                    "text-xs font-medium whitespace-nowrap transition-colors",
                    (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {stage.label}
                  </p>
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1"
                    >
                      <Badge variant="default" className="text-[10px] h-4 px-1.5">
                        Current
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/consultants/requests/');
      setServiceRequests(response.data);
      if (response.data.length > 0) {
        setSelectedService(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'assigned':
      case 'wip':
      case 'under_review':
      case 'final_review':
        return 'default';
      case 'filed':
        return 'success';
      case 'doc_pending':
      case 'under_query':
      case 'revision_pending':
        return 'destructive';
      case 'completed':
        return 'success';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending Assignment',
      'assigned': 'Expert Assigned',
      'doc_pending': 'Action Required',
      'under_review': 'Under Review',
      'wip': 'Processing',
      'under_query': 'Clarification Needed',
      'final_review': 'Final Review',
      'filed': 'Work Filed/Submitted',
      'revision_pending': 'Revision Requested',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  };

  const handleConfirm = async (id) => {
    try {
      const clientService = (await import('@/api/clientService')).default;
      await clientService.confirmService(id);
      import('sonner').then(m => m.toast.success('Service confirmed and completed!'));
      fetchServiceRequests();
    } catch (err) {
      import('sonner').then(m => m.toast.error('Failed to confirm service.'));
    }
  };

  const handleRevise = async (id) => {
    try {
      const clientService = (await import('@/api/clientService')).default;
      await clientService.requestRevision(id);
      import('sonner').then(m => m.toast.success('Revision request sent to consultant.'));
      fetchServiceRequests();
    } catch (err) {
      import('sonner').then(m => m.toast.error('Failed to request revision.'));
    }
  };

  const activeServices = serviceRequests.filter(r => !['completed', 'cancelled'].includes(r.status));
  const completedServices = serviceRequests.filter(r => r.status === 'completed');

  const stats = [
    { title: 'Active Services', value: activeServices.length.toString(), icon: FileText, trend: 'Ongoing requests' },
    { title: 'Assigned', value: activeServices.filter(r => r.assigned_consultant).length.toString(), icon: CheckCircle2, trend: 'Experts working' },
    { title: 'Pending', value: activeServices.filter(r => !r.assigned_consultant).length.toString(), icon: Clock, trend: 'Awaiting assignment' },
    { title: 'Completed', value: completedServices.length.toString(), icon: TrendingUp, trend: 'Finished' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (serviceRequests.length === 0) {
    return (
      <div className="space-y-8 p-1">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.full_name || user?.username || 'Client'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your ongoing services and manage your tax compliance.
          </p>
        </div>
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Active Services</h3>
          <p className="text-muted-foreground mb-6">
            You haven't purchased any services yet. Browse our services to get started.
          </p>
          <Button onClick={() => navigate('/client/services')}>Browse Services</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.full_name || user?.username || 'Client'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your ongoing services and manage your tax compliance.
          </p>
        </div>
        {/* <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Tax Calendar
          </Button>
          <Button className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Tax Savings Report
          </Button>
        </div> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group hover:shadow-lg transition-all border-none bg-muted/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                <ArrowUpRight className="h-3 w-3" />
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Services List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold">Active Services</h2>
            <Badge variant="secondary">{activeServices.length}</Badge>
          </div>
          <div className="space-y-3">
            {activeServices.map((request) => (
              <Card
                key={request.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  selectedService?.id === request.id ? "border-primary bg-primary/5 shadow-md" : "border-border"
                )}
                onClick={() => setSelectedService(request)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    {request.status !== 'revision_pending' && (
                      <Badge variant={getStatusBadgeVariant(request.status)} className="text-[10px]">
                        {getStatusLabel(request.status)}
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm line-clamp-1">{request.service?.title || 'Service'}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{request.service?.category?.name || 'General'}</p>
                  {request.assigned_consultant && !['completed', 'cancelled'].includes(request.status) && (
                    <div className="mt-3 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px]">
                          {request.assigned_consultant.full_name?.charAt(0) || 'TC'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-muted-foreground">
                        {request.assigned_consultant.full_name}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {activeServices.length === 0 && (
              <div className="text-center p-4 text-muted-foreground text-sm border border-dashed rounded-lg">
                No active services
              </div>
            )}
          </div>

          {/* Completed Services List */}
          {completedServices.length > 0 && (
            <>
              <div className="flex items-center justify-between px-2 pt-4">
                <h2 className="text-lg font-semibold text-muted-foreground">Completed</h2>
                <Badge variant="outline">{completedServices.length}</Badge>
              </div>
              <div className="space-y-3 opacity-75">
                {completedServices.map((request) => (
                  <Card
                    key={request.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      selectedService?.id === request.id ? "border-primary bg-primary/5 shadow-md" : "border-border"
                    )}
                    onClick={() => setSelectedService(request)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-800 hover:bg-green-200">
                          Completed
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm line-clamp-1">{request.service?.title || 'Service'}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{request.service?.category?.name || 'General'}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Detailed Service View */}
        <div className="lg:col-span-2 space-y-6">
          {selectedService && (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedService.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-6">
                  {/* Status and TC Card */}
                  <Card className="border-none bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent shadow-sm">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-2xl">{selectedService.service?.title || 'Service'}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <span className="font-medium text-foreground">{selectedService.service?.category?.name || 'General'}</span>
                            •
                            <span>Requested on {new Date(selectedService.created_at).toLocaleDateString()}</span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeVariant(selectedService.status)}>
                            {getStatusLabel(selectedService.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Consultant Information - Moved to Top */}
                      {selectedService.assigned_consultant && !['completed', 'cancelled'].includes(selectedService.status) ? (
                        <div className="flex flex-col md:flex-row items-center gap-8 py-2 mb-6">
                          <div className="flex items-center gap-6">
                            <div className="relative">
                              <Avatar className="h-16 w-16 border-2 border-primary/20">
                                <AvatarFallback>
                                  {selectedService.assigned_consultant.full_name?.split(' ').map(n => n[0]).join('') || 'TC'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="absolute bottom-0 right-0 h-4 w-4 bg-success border-2 border-background rounded-full" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground font-medium">Assigned Consultant</p>
                              <h4 className="text-lg font-bold">{selectedService.assigned_consultant.full_name}</h4>
                              <p className="text-xs text-primary/80 font-medium">{selectedService.assigned_consultant.qualification || 'Tax Consultant'}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <Button variant="primary" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm">
                              <MessageSquare className="h-4 w-4" /> Chat
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="gap-2 bg-background/50 backdrop-blur-sm"
                              onClick={() => window.location.href = `tel:${selectedService.assigned_consultant.phone}`}
                            >
                              <Phone className="h-4 w-4" /> {selectedService.assigned_consultant.phone}
                            </Button>
                            {/* <Button
                              variant="primary"
                              size="sm"
                              className="gap-2 bg-background/50 backdrop-blur-sm"
                              onClick={() => window.location.href = `mailto:${selectedService.assigned_consultant.email}`}
                            >
                              <Mail className="h-4 w-4" /> Email
                            </Button> */}
                          </div>

                          <div className="flex-1 md:block hidden" />

                          {/* <div className="text-right">
                            {selectedService.notes && (
                              <>
                                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary mb-1">
                                  Notes
                                </Badge>
                                <p className="font-semibold text-sm">{selectedService.notes}</p>
                              </>
                            )}
                          </div> */}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-xl border border-dashed border-muted-foreground/20 mb-6">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <h4 className="font-semibold">Assigning Your Expert</h4>
                          <p className="text-sm text-muted-foreground max-w-xs mt-1">
                            We are matching your request with the best tax consultant for this specific service.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Service Details Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Service Details</CardTitle>
                      <CardDescription>Information about your service request</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Workflow Status Bar */}
                      <div>
                        <h4 className="text-sm font-semibold mb-4 text-foreground">Workflow Progress</h4>
                        <StatusProgressBar currentStatus={selectedService.status} />
                      </div>

                      <Separator className="opacity-30" />

                      {/* Service Information */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* <div>
                          <p className="text-sm text-muted-foreground">Request ID</p>
                          <p className="font-semibold">#{selectedService.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Priority</p>
                          <Badge variant="outline">{selectedService.priority || 'Normal'}</Badge>
                        </div> */}
                        <div>
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p className="font-semibold">{new Date(selectedService.created_at).toLocaleString()}</p>
                        </div>
                        {selectedService.assigned_at && (
                          <div>
                            <p className="text-sm text-muted-foreground">Assigned</p>
                            <p className="font-semibold">{new Date(selectedService.assigned_at).toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div >
  );
}
