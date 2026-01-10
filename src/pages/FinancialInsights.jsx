import { motion } from 'framer-motion';
import { Brain, RefreshCw, Download, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadialGauge } from '@/components/insights/RadialGauge';
import { ActionCard } from '@/components/insights/ActionCard';
import { ScenarioBuilder } from '@/components/insights/ScenarioBuilder';

const mockInsights = [
  {
    type: 'action',
    title: 'GST Input Credit Pending',
    description: 'March ITC of ₹12,450 not claimed. Claim before quarterly filing deadline.',
    amount: '₹12,450',
  },
  {
    type: 'opportunity',
    title: 'Section 80C Optimization',
    description: 'You could save ₹40,000 by restructuring investments under Section 80C.',
    amount: '₹40,000',
  },
  {
    type: 'action',
    title: 'TDS Credit Mismatch',
    description: 'Form 26AS shows ₹8,200 more TDS than your records. Verify and claim.',
    amount: '₹8,200',
  },
  {
    type: 'insight',
    title: 'Revenue Growth Trend',
    description: 'Your quarterly revenue increased 15% YoY. Consider advance tax adjustments.',
  },
  {
    type: 'opportunity',
    title: 'Depreciation Benefits',
    description: 'New asset purchases qualify for additional depreciation under Section 32.',
    amount: '₹28,000',
  },
  {
    type: 'action',
    title: 'Audit Risk: High Cash Transactions',
    description: 'Cash transactions above ₹2L flagged. Ensure proper documentation.',
  },
];

export default function FinancialInsights() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Brain className="text-primary" size={28} strokeWidth={1.5} />
            Financial Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered tax savings and risk analysis
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw size={16} className="mr-2" />
            Refresh Analysis
          </Button>
          <Button size="sm">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Health Gauges */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Financial Health Overview</CardTitle>
          <CardDescription>Real-time analysis based on your CMA and GST data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <RadialGauge 
                value={87} 
                label="Compliance Score" 
                sublabel="/ 100"
                color="success" 
              />
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle size={14} className="text-success" />
                <span className="text-xs text-success font-medium">Excellent</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <RadialGauge 
                value={68} 
                label="Tax Savings Potential" 
                sublabel="₹ Lakhs"
                color="primary" 
              />
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={14} className="text-primary" />
                <span className="text-xs text-primary font-medium">₹68,000 recoverable</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <RadialGauge 
                value={23} 
                label="Audit Risk Level" 
                sublabel="/ 100"
                color="warning" 
              />
              <div className="flex items-center gap-1 mt-2">
                <AlertTriangle size={14} className="text-warning" />
                <span className="text-xs text-warning font-medium">Low Risk</span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Action Cards */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">AI Recommendations</CardTitle>
                <CardDescription>Actionable insights from your financial data</CardDescription>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                {mockInsights.length} items
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
            {mockInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ActionCard
                  type={insight.type}
                  title={insight.title}
                  description={insight.description}
                  amount={insight.amount}
                  onAction={() => console.log('View details:', insight.title)}
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Scenario Builder */}
        <ScenarioBuilder baseTaxLiability={850000} />
      </div>
    </div>
  );
}
