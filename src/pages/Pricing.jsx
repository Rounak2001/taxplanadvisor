import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Building2, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individual practitioners',
    monthlyPrice: 1999,
    yearlyPrice: 19990,
    icon: Users,
    features: [
      'Up to 25 clients',
      'Smart Vault (50 documents/month)',
      'Basic GST Reconciliation',
      'WhatsApp Integration (100 messages)',
      'Email Support',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing CA practices',
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    icon: Zap,
    features: [
      'Up to 100 clients',
      'Smart Vault (Unlimited documents)',
      'Advanced GST Reconciliation',
      'CMA Maker with auto-ratios',
      'WhatsApp Integration (Unlimited)',
      'AI-powered document extraction',
      'Priority Support',
      'Team collaboration (3 users)',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large firms and corporates',
    monthlyPrice: 14999,
    yearlyPrice: 149990,
    icon: Building2,
    features: [
      'Unlimited clients',
      'Everything in Pro',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee (99.9% uptime)',
      'Advanced analytics & reporting',
      'White-label option',
      'Unlimited team members',
      'On-premise deployment option',
    ],
    popular: false,
  },
];

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const yearlySavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.yearlyPrice;
    return Math.round((savings / monthlyCost) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="px-4 py-1">
          <Sparkles size={14} strokeWidth={1.5} className="mr-1" />
          Special Launch Pricing
        </Badge>
        <h1 className="text-4xl font-bold text-foreground">
          Choose the perfect plan for your practice
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start free for 14 days. No credit card required. Cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <span className={cn('text-sm', !isYearly && 'font-medium')}>Monthly</span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-primary"
          />
          <span className={cn('text-sm', isYearly && 'font-medium')}>
            Yearly
            <Badge variant="secondary" className="ml-2 text-xs">
              Save up to 17%
            </Badge>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const price = isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'relative h-full flex flex-col',
                  plan.popular && 'border-primary shadow-lg ring-2 ring-primary/20'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4">
                      Recommended
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon size={24} strokeWidth={1.5} className="text-primary" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{formatPrice(Math.round(price))}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPrice(plan.yearlyPrice)} billed yearly
                        <Badge variant="outline" className="ml-2 text-success border-success">
                          Save {yearlySavings(plan)}%
                        </Badge>
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check size={18} strokeWidth={1.5} className="text-success shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ROI Section */}
      <Card className="bg-muted/50">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">See the ROI in your practice</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              <div>
                <p className="text-4xl font-bold text-primary">20+</p>
                <p className="text-muted-foreground">Hours saved per month</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">10x</p>
                <p className="text-muted-foreground">Faster document processing</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">99.9%</p>
                <p className="text-muted-foreground">Accuracy in reconciliation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ or Contact */}
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Have questions? <Button variant="link" className="px-1">Contact our team</Button>
          or check our <Button variant="link" className="px-1">FAQ</Button>
        </p>
      </div>
    </div>
  );
}
