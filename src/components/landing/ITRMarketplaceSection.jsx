import { motion } from 'framer-motion';
import { 
  FileCheck, Shield, TrendingUp, Clock, CheckCircle2, ArrowRight,
  Calculator, Receipt, Briefcase, Users, IndianRupee, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    id: 'itr-salaried',
    title: 'Salaried ITR Filing',
    description: 'Quick filing for Form 16 holders. Get max deductions under 80C, 80D, HRA.',
    icon: FileCheck,
    price: '₹499',
    originalPrice: '₹999',
    features: ['Form 16 upload', '80C/80D optimization', '48hr turnaround'],
    badge: 'Most Popular',
  },
  {
    id: 'itr-freelance',
    title: 'Freelancer ITR',
    description: 'For consultants, gig workers & self-employed. Includes presumptive taxation.',
    icon: Briefcase,
    price: '₹1,499',
    originalPrice: '₹2,999',
    features: ['44ADA benefits', 'Expense tracking', 'TDS reconciliation'],
    badge: null,
  },
  {
    id: 'audit-protection',
    title: 'Audit Protection',
    description: 'Complete peace of mind. We handle all IT notices and queries for 3 years.',
    icon: Shield,
    price: '₹2,999',
    originalPrice: '₹5,999',
    features: ['Notice handling', '3-year coverage', 'Dedicated CA'],
    badge: 'Premium',
  },
];

const guarantees = [
  { icon: IndianRupee, title: 'Max Refund Guarantee', desc: 'Or we pay the difference' },
  { icon: Clock, title: '48-Hour Filing', desc: 'Express processing' },
  { icon: Shield, title: 'Audit Protection', desc: 'Free notice handling' },
  { icon: Users, title: 'ICAI-Verified CAs', desc: '500+ experts' },
];

export function ITRMarketplaceSection() {
  return (
    <section id="itr-marketplace" className="py-20 lg:py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="section-badge mb-4">
            <Calculator className="w-3 h-3" />
            For Individual Taxpayers
          </Badge>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold mb-4">
            File Your ITR with <span className="text-primary">Expert CAs</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Salaried, freelancer, or business owner—get your taxes filed accurately with maximum refunds, guaranteed.
          </p>
        </motion.div>

        {/* Guarantees Strip */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {guarantees.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`h-full bento-card border-2 relative ${service.badge === 'Most Popular' ? 'border-primary' : ''}`}>
                {service.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className={service.badge === 'Most Popular' ? 'bg-primary' : 'bg-secondary'}>
                      <Sparkles className="w-3 h-3 mr-1" />
                      {service.badge}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold text-primary">{service.price}</span>
                    <span className="text-sm text-muted-foreground line-through">{service.originalPrice}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full rounded-xl gap-2" variant={service.badge === 'Most Popular' ? 'default' : 'outline'}>
                    Start Filing
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Process Steps */}
        <motion.div 
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-serif text-2xl font-bold text-center mb-8">How It Works</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Upload Docs', desc: 'Form 16, PAN, Aadhaar' },
              { step: '2', title: 'Get Matched', desc: 'With verified CA' },
              { step: '3', title: 'Review & Sign', desc: 'Approve your return' },
              { step: '4', title: 'Get Refund', desc: 'Track in real-time' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4">
                <div className="w-10 h-10 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                  {item.step}
                </div>
                <div className="font-semibold text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
