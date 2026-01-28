import { useState } from 'react';
import { FileText, Download, TrendingUp, CheckCircle, Settings, ArrowRight, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const gstServices = [
  {
    id: 'gstr2b-download',
    title: 'GSTR-2B Download',
    description: 'Download GSTR-2B data directly from GST portal',
    icon: Download,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    href: '/gst/download-2b',
    features: ['Direct portal access', 'Excel format', 'Monthly/Quarterly']
  },
  {
    id: 'gstr2b-reconciliation',
    title: 'GSTR-2B vs Books',
    description: 'Reconcile purchase data with your accounting books',
    icon: TrendingUp,
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
    href: '/gst/2b-reconciliation',
    features: ['Auto-matching', 'Mismatch detection', 'Detailed reports']
  },
  {
    id: 'gstr3b-reconciliation',
    title: 'GSTR-3B vs Books',
    description: 'Match GSTR-3B returns with accounting records',
    icon: CheckCircle,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    href: '/gst/3b-reconciliation',
    features: ['Summary matching', 'Tax liability check', 'Variance analysis']
  },
  {
    id: 'comprehensive-reco',
    title: 'Comprehensive Reconciliation',
    description: 'Three-way reconciliation: GSTR-1 vs 3B vs 2B',
    icon: Settings,
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    href: '/gst/comprehensive',
    features: ['Multi-return analysis', 'Complete overview', 'Advanced insights']
  }
];

const recentActivities = [
  { type: 'download', description: 'GSTR-2B downloaded for March 2024', time: '2 hours ago' },
  { type: 'reconciliation', description: '2B vs Books reconciliation completed', time: '1 day ago' },
  { type: 'session', description: 'GST session authenticated', time: '3 days ago' }
];

export default function GSTServices() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">GST Services</h1>
          <p className="text-muted-foreground mt-1">
            Automate GST reconciliation and compliance tasks
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Secure Portal Integration
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reconciliations</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-xl font-bold">98.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <p className="text-xl font-bold">45h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gstServices.map((service) => (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center`}>
                      <service.icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {service.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      onClick={() => navigate(service.href)}
                      className="w-full"
                      variant="outline"
                    >
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Your latest GST service usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                Secure GST Portal Integration
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                All GST data is fetched directly from the official GST portal using secure authentication. 
                Your credentials are never stored and sessions expire automatically for security.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  End-to-end encryption
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Auto session expiry
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Official portal data
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}