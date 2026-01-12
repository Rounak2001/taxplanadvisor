import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, Clock, CheckCircle2, XCircle, MessageCircle,
  Phone, Mail, Filter, Search, ArrowRight, Star, Calendar, Calculator,
  FileText, IndianRupee, Eye, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock leads data
const mockLeads = [
  {
    id: 1,
    name: 'Rahul Mehta',
    email: 'rahul.mehta@gmail.com',
    phone: '+91 98765 43210',
    source: 'Income Tax Calculator',
    status: 'new',
    estimatedValue: 15000,
    createdAt: '2 hours ago',
    calculatorData: { regime: 'New', income: 1500000, tax: 187500 },
    priority: 'high',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.s@outlook.com',
    phone: '+91 87654 32109',
    source: 'GST Penalty Calculator',
    status: 'contacted',
    estimatedValue: 8000,
    createdAt: '5 hours ago',
    calculatorData: { gstDue: 50000, interest: 4500, penalty: 2500 },
    priority: 'medium',
  },
  {
    id: 3,
    name: 'Amit Industries',
    email: 'accounts@amitind.com',
    phone: '+91 76543 21098',
    source: 'Loan Eligibility Score',
    status: 'qualified',
    estimatedValue: 35000,
    createdAt: '1 day ago',
    calculatorData: { score: 78, eligibleAmount: 5000000 },
    priority: 'high',
  },
  {
    id: 4,
    name: 'Sneha Kapoor',
    email: 'sneha.k@yahoo.com',
    phone: '+91 65432 10987',
    source: 'Income Tax Calculator',
    status: 'new',
    estimatedValue: 5000,
    createdAt: '2 days ago',
    calculatorData: { regime: 'Old', income: 800000, tax: 52500 },
    priority: 'low',
  },
  {
    id: 5,
    name: 'Gupta Traders',
    email: 'info@guptatraders.in',
    phone: '+91 54321 09876',
    source: 'GST Penalty Calculator',
    status: 'converted',
    estimatedValue: 24000,
    createdAt: '3 days ago',
    calculatorData: { gstDue: 120000, interest: 10800, penalty: 6000 },
    priority: 'high',
  },
];

const statusConfig = {
  new: { label: 'New', color: 'bg-info/10 text-info border-info/20' },
  contacted: { label: 'Contacted', color: 'bg-warning/10 text-warning border-warning/20' },
  qualified: { label: 'Qualified', color: 'bg-primary/10 text-primary border-primary/20' },
  converted: { label: 'Converted', color: 'bg-success/10 text-success border-success/20' },
  lost: { label: 'Lost', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const sourceIcons = {
  'Income Tax Calculator': Calculator,
  'GST Penalty Calculator': FileText,
  'Loan Eligibility Score': IndianRupee,
};

function StatCard({ title, value, change, icon: Icon, trend }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                {trend === 'up' ? '↑' : '↓'} {change} from last week
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MarketplaceLeads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || lead.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: mockLeads.length,
    new: mockLeads.filter(l => l.status === 'new').length,
    converted: mockLeads.filter(l => l.status === 'converted').length,
    totalValue: mockLeads.reduce((sum, l) => sum + l.estimatedValue, 0),
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold">Marketplace Leads</h1>
          <p className="text-muted-foreground">Incoming requests from calculator users</p>
        </div>
        <Button className="gap-2">
          <Filter className="w-4 h-4" />
          Export Leads
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats.total} change="12%" trend="up" icon={Users} />
        <StatCard title="New This Week" value={stats.new} change="8%" trend="up" icon={TrendingUp} />
        <StatCard title="Converted" value={stats.converted} icon={CheckCircle2} />
        <StatCard title="Est. Revenue" value={`₹${(stats.totalValue / 1000).toFixed(0)}K`} change="15%" trend="up" icon={IndianRupee} />
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Lead Pipeline</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="contacted">Contacted</TabsTrigger>
              <TabsTrigger value="qualified">Qualified</TabsTrigger>
              <TabsTrigger value="converted">Converted</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredLeads.map((lead, i) => {
                const SourceIcon = sourceIcons[lead.source] || Calculator;
                const status = statusConfig[lead.status];

                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  >
                    {/* Lead Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <SourceIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{lead.name}</h3>
                          {lead.priority === 'high' && (
                            <Star className="w-4 h-4 fill-warning text-warning flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                          <span className="text-xs text-muted-foreground">{lead.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Calculator Data Preview */}
                    <div className="flex-shrink-0 px-4 py-2 rounded-lg bg-muted text-sm">
                      {lead.source === 'Income Tax Calculator' && (
                        <span>Income: ₹{(lead.calculatorData.income / 100000).toFixed(1)}L • Tax: ₹{(lead.calculatorData.tax / 1000).toFixed(0)}K</span>
                      )}
                      {lead.source === 'GST Penalty Calculator' && (
                        <span>GST Due: ₹{lead.calculatorData.gstDue} • Interest: ₹{lead.calculatorData.interest}</span>
                      )}
                      {lead.source === 'Loan Eligibility Score' && (
                        <span>Score: {lead.calculatorData.score} • Eligible: ₹{(lead.calculatorData.eligibleAmount / 100000).toFixed(0)}L</span>
                      )}
                    </div>

                    {/* Status & Value */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                      <div className="text-right">
                        <div className="font-semibold text-primary">₹{lead.estimatedValue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Est. Value</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" className="gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Phone className="w-4 h-4" />
                        <span className="hidden sm:inline">Call</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Meeting
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-success">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark as Converted
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="w-4 h-4 mr-2" />
                            Mark as Lost
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                );
              })}

              {filteredLeads.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No leads found matching your criteria</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
