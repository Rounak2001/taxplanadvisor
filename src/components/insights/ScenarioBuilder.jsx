import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Car, Building2, Briefcase, Heart, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const scenarios = [
  {
    id: 'vehicle',
    label: 'Buy Company Vehicle',
    icon: Car,
    impact: -45000,
    description: 'Depreciation benefit under Section 32',
  },
  {
    id: 'property',
    label: 'Commercial Property Investment',
    icon: Building2,
    impact: -120000,
    description: 'Interest deduction under Section 24',
  },
  {
    id: 'startup',
    label: 'Invest in Eligible Startup',
    icon: Briefcase,
    impact: -50000,
    description: 'Tax benefit under Section 80-IAC',
  },
  {
    id: 'health',
    label: 'Premium Health Insurance',
    icon: Heart,
    impact: -25000,
    description: 'Deduction under Section 80D',
  },
];

export function ScenarioBuilder({ baseTaxLiability = 850000 }) {
  const [activeScenarios, setActiveScenarios] = useState({});
  const [section80C, setSection80C] = useState([150000]);

  const toggleScenario = (id) => {
    setActiveScenarios(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalImpact = Object.entries(activeScenarios)
    .filter(([_, active]) => active)
    .reduce((sum, [id]) => {
      const scenario = scenarios.find(s => s.id === id);
      return sum + (scenario?.impact || 0);
    }, 0);

  const section80CImpact = Math.min(section80C[0], 150000) * -0.3; // 30% tax bracket
  const finalLiability = baseTaxLiability + totalImpact + section80CImpact;
  const totalSavings = baseTaxLiability - finalLiability;

  const formatCurrency = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 100000) {
      return `₹${(absValue / 100000).toFixed(1)}L`;
    }
    return `₹${absValue.toLocaleString('en-IN')}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calculator size={20} className="text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <CardTitle className="text-lg">What-If Scenario Builder</CardTitle>
            <CardDescription>Toggle scenarios to see instant tax impact</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Section 80C Slider */}
        <div className="p-4 rounded-xl bg-secondary/50 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Section 80C Investment</Label>
            <span className="text-sm font-semibold text-primary">
              {formatCurrency(section80C[0])}
            </span>
          </div>
          <Slider
            value={section80C}
            onValueChange={setSection80C}
            max={150000}
            step={10000}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Tax saving: {formatCurrency(Math.abs(section80CImpact))}
          </p>
        </div>

        {/* Scenario Toggles */}
        <div className="space-y-3">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            const isActive = activeScenarios[scenario.id];
            
            return (
              <motion.div
                key={scenario.id}
                layout
                className={cn(
                  'p-4 rounded-xl border transition-all duration-200',
                  isActive 
                    ? 'border-primary/50 bg-primary/5' 
                    : 'border-border bg-card hover:border-border/80'
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-lg transition-colors',
                      isActive ? 'bg-primary/10' : 'bg-muted'
                    )}>
                      <Icon 
                        size={18} 
                        className={cn(
                          'transition-colors',
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        )} 
                        strokeWidth={1.5} 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {scenario.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {scenario.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="text-sm font-semibold text-success"
                        >
                          {formatCurrency(scenario.impact)}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => toggleScenario(scenario.id)}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Impact Summary */}
        <motion.div 
          layout
          className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Current Tax Liability</span>
            <span className="text-sm font-medium text-foreground">
              {formatCurrency(baseTaxLiability)}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">After Optimization</span>
            <motion.span 
              key={finalLiability}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-foreground"
            >
              {formatCurrency(finalLiability)}
            </motion.span>
          </div>
          
          <div className="h-px bg-border my-3" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Total Savings</span>
            <div className="flex items-center gap-2">
              {totalSavings > 0 ? (
                <TrendingDown size={16} className="text-success" />
              ) : (
                <TrendingUp size={16} className="text-destructive" />
              )}
              <motion.span
                key={totalSavings}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className={cn(
                  'text-lg font-bold',
                  totalSavings > 0 ? 'text-success' : 'text-destructive'
                )}
              >
                {formatCurrency(totalSavings)}
              </motion.span>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
