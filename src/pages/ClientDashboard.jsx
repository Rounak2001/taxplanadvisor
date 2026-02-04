import { useState } from 'react';
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
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mock Data for Active Services
const mockActiveServices = [
  {
    id: 'SRV-001',
    title: 'GSTR-1 & 3B Monthly Filing',
    category: 'GST Compliance',
    status: 'In Progress',
    purchasedAt: '2026-01-25',
    progress: 65,
    assignedTC: {
      name: 'CA Rajesh Sharma',
      role: 'Senior Tax Consultant',
      phone: '+91 98765 43210',
      email: 'rajesh.sharma@taxplanadv.com',
      avatar: '/avatars/tc-1.png'
    },
    timeline: [
      { step: 'Service Assigned', status: 'completed', date: 'Jan 25, 2026', description: 'Assigned to CA Rajesh Sharma' },
      { step: 'Documents Uploaded', status: 'completed', date: 'Jan 26, 2026', description: 'Monthly purchase & sales registers uploaded' },
      { step: 'Data Verification', status: 'completed', date: 'Jan 28, 2026', description: 'AI processing and manual review completed' },
      { step: 'Draft Preparation', status: 'current', date: 'In Progress', description: 'Return draft is being prepared for approval' },
      { step: 'Final Filing', status: 'pending', date: 'Upcoming', description: 'Submission to GST Portal' },
    ]
  },
  {
    id: 'SRV-002',
    title: 'TDS Planning for NRIs',
    category: 'TDS Planning',
    status: 'Pending Assignment',
    purchasedAt: '2026-02-04',
    progress: 10,
    assignedTC: null,
    timeline: [
      { step: 'Payment Received', status: 'completed', date: 'Feb 04, 2026', description: 'Payment of ₹4,999 verified' },
      { step: 'TC Assignment', status: 'current', date: 'Pending', description: 'System is finding best suited consultant' },
      { step: 'Initial Call', status: 'pending', date: 'Upcoming', description: 'Strategic consultation call' },
    ]
  }
];

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const [selectedService, setSelectedService] = useState(mockActiveServices[0]);

  const stats = [
    { title: 'Active Services', value: '2', icon: FileText, trend: '+1 this month' },
    { title: 'Processing Time', value: '4.2 Days', icon: Clock, trend: '-15% vs avg' },
    { title: 'Documents Status', value: '12 / 15', icon: CheckCircle2, trend: '3 pending' },
    { title: 'Refunds Pending', value: '₹54,200', icon: IndianRupee, trend: 'AY 2025-26' },
  ];

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.first_name || user?.username || 'Client'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your ongoing services and manage your tax compliance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Tax Calendar
          </Button>
          <Button className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Tax Savings Report
          </Button>
        </div>
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Services List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold">Active Services</h2>
            <Badge variant="secondary">{mockActiveServices.length}</Badge>
          </div>
          <div className="space-y-3">
            {mockActiveServices.map((service) => (
              <Card
                key={service.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  selectedService.id === service.id ? "border-primary bg-primary/5 shadow-md" : "border-border"
                )}
                onClick={() => setSelectedService(service)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={service.status === 'In Progress' ? 'default' : 'outline'} className="text-[10px]">
                      {service.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{service.id}</span>
                  </div>
                  <h4 className="font-semibold text-sm line-clamp-1">{service.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{service.category}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground font-medium">Progress</span>
                      <span className="text-primary font-bold">{service.progress}%</span>
                    </div>
                    <Progress value={service.progress} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Service View */}
        <div className="lg:col-span-2 space-y-6">
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
                        <CardTitle className="text-2xl">{selectedService.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span className="font-medium text-foreground">{selectedService.category}</span>
                          •
                          <span>Purchased on {selectedService.purchasedAt}</span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Documentation</Button>
                        <Button size="sm">Download Draft</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-6 opacity-30" />

                    {selectedService.assignedTC ? (
                      <div className="flex flex-col md:flex-row items-center gap-8 py-2">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-16 w-16 border-2 border-primary/20">
                              <AvatarImage src={selectedService.assignedTC.avatar} />
                              <AvatarFallback><User className="h-8 w-8" /></AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 h-4 w-4 bg-success border-2 border-background rounded-full" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground font-medium">Assigned TC</p>
                            <h4 className="text-lg font-bold">{selectedService.assignedTC.name}</h4>
                            <p className="text-xs text-primary/80 font-medium">{selectedService.assignedTC.role}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Button variant="secondary" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm">
                            <MessageSquare className="h-4 w-4" /> Chat
                          </Button>
                          <Button variant="secondary" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm">
                            <Phone className="h-4 w-4" /> Call
                          </Button>
                          <Button variant="secondary" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm">
                            <Mail className="h-4 w-4" /> Email
                          </Button>
                        </div>

                        <div className="flex-1 md:block hidden" />

                        <div className="text-right">
                          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary mb-1">
                            Current Task
                          </Badge>
                          <p className="font-semibold text-sm">Preparing Draft Return</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-xl border border-dashed border-muted-foreground/20">
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

                {/* Timeline Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Timeline</CardTitle>
                    <CardDescription>Visual tracker of your service progress</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="relative space-y-8">
                      {selectedService.timeline.map((item, idx) => (
                        <div key={idx} className="flex gap-4 group">
                          <div className="relative flex flex-col items-center">
                            <div className={cn(
                              "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                              item.status === 'completed' && "bg-success border-success text-success-foreground",
                              item.status === 'current' && "bg-primary border-primary text-primary-foreground animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]",
                              item.status === 'pending' && "bg-background border-border text-muted-foreground"
                            )}>
                              {item.status === 'completed' ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-current" />
                              )}
                            </div>
                            {idx !== selectedService.timeline.length - 1 && (
                              <div className={cn(
                                "absolute top-8 left-1/2 w-[2px] h-[calc(100%+32px)] -translate-x-1/2",
                                item.status === 'completed' ? "bg-success" : "bg-border"
                              )} />
                            )}
                          </div>

                          <div className="flex-1 pt-0.5">
                            <div className="flex items-center justify-between">
                              <h4 className={cn(
                                "font-bold text-sm",
                                item.status === 'pending' && "text-muted-foreground"
                              )}>{item.step}</h4>
                              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {item.date}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
