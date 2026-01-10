import { motion } from 'framer-motion';
import { 
  Store, 
  BadgeCheck, 
  Building2, 
  Shield, 
  Wallet, 
  ArrowRight, 
  MessageSquare,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const featuredOffers = [
  {
    id: 1,
    title: 'Instant Business Loan',
    provider: 'HDFC Bank',
    description: 'Get up to ₹50L with minimal documentation. Quick disbursal within 48 hours.',
    icon: Building2,
    features: ['No collateral required', 'Flexible tenure', 'Competitive rates'],
    interestRate: '10.5% p.a.',
    maxAmount: '₹50 Lakhs',
    preApproved: true,
    rating: 4.8,
    featured: true,
  },
  {
    id: 2,
    title: 'Term Insurance for Founders',
    provider: 'ICICI Prudential',
    description: 'Comprehensive life cover designed for business owners and entrepreneurs.',
    icon: Shield,
    features: ['Key person coverage', 'Business continuity', 'Tax benefits'],
    coverAmount: '₹2 Crore',
    premium: '₹12,000/year',
    preApproved: false,
    rating: 4.6,
    featured: true,
  },
  {
    id: 3,
    title: 'Working Capital Credit Line',
    provider: 'Axis Bank',
    description: 'Revolving credit facility for managing day-to-day business operations.',
    icon: Wallet,
    features: ['Pay interest only on usage', 'Instant withdrawals', 'Auto-renewal'],
    interestRate: '12% p.a.',
    maxAmount: '₹25 Lakhs',
    preApproved: true,
    rating: 4.5,
    featured: true,
  },
];

const additionalOffers = [
  {
    id: 4,
    title: 'Commercial Vehicle Loan',
    provider: 'SBI',
    description: 'Finance your fleet with attractive EMI options.',
    maxAmount: '₹30 Lakhs',
    icon: Building2,
  },
  {
    id: 5,
    title: 'Health Insurance',
    provider: 'Star Health',
    description: 'Group health cover for your employees.',
    coverAmount: '₹10 Lakhs',
    icon: Shield,
  },
  {
    id: 6,
    title: 'Invoice Financing',
    provider: 'Razorpay Capital',
    description: 'Get advance against your pending invoices.',
    maxAmount: '₹20 Lakhs',
    icon: Wallet,
  },
];

function OfferCard({ offer, variant = 'featured' }) {
  const Icon = offer.icon;
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        'h-full overflow-hidden transition-shadow duration-300',
        isFeatured && 'hover:shadow-xl border-2',
        offer.preApproved && isFeatured && 'border-success/30'
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className={cn(
              'p-3 rounded-xl',
              offer.preApproved ? 'bg-success/10' : 'bg-primary/10'
            )}>
              <Icon 
                size={24} 
                className={offer.preApproved ? 'text-success' : 'text-primary'} 
                strokeWidth={1.5} 
              />
            </div>
            
            {offer.preApproved && (
              <Badge className="bg-success/10 text-success hover:bg-success/20 border-0">
                <BadgeCheck size={14} className="mr-1" />
                Pre-Approved
              </Badge>
            )}
          </div>
          
          <div className="mt-3">
            <CardTitle className="text-lg">{offer.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">{offer.provider}</span>
              {offer.rating && (
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-warning text-warning" />
                  <span className="text-xs font-medium">{offer.rating}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {offer.description}
          </p>
          
          {isFeatured && offer.features && (
            <ul className="space-y-1.5">
              {offer.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          )}
          
          <div className="flex items-center gap-4 py-2">
            {offer.interestRate && (
              <div>
                <p className="text-xs text-muted-foreground">Interest Rate</p>
                <p className="text-sm font-semibold text-foreground">{offer.interestRate}</p>
              </div>
            )}
            {offer.maxAmount && (
              <div>
                <p className="text-xs text-muted-foreground">Max Amount</p>
                <p className="text-sm font-semibold text-foreground">{offer.maxAmount}</p>
              </div>
            )}
            {offer.coverAmount && (
              <div>
                <p className="text-xs text-muted-foreground">Cover Amount</p>
                <p className="text-sm font-semibold text-foreground">{offer.coverAmount}</p>
              </div>
            )}
            {offer.premium && (
              <div>
                <p className="text-xs text-muted-foreground">Premium</p>
                <p className="text-sm font-semibold text-foreground">{offer.premium}</p>
              </div>
            )}
          </div>
          
          {offer.preApproved && (
            <div className="p-3 rounded-lg bg-success/5 border border-success/20">
              <p className="text-xs text-success font-medium flex items-center gap-1.5">
                <BadgeCheck size={14} />
                Pre-Approved based on your TaxPlan Profile
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" size="sm">
              Apply Now
              <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare size={16} className="mr-2" />
              Consult CA
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Marketplace() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Store className="text-primary" size={28} strokeWidth={1.5} />
            Financial Services Marketplace
          </h1>
          <p className="text-muted-foreground mt-1">
            Pre-approved offers based on your financial profile
          </p>
        </div>
      </div>

      {/* Profile Summary Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp size={20} className="text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Credit Score</p>
                <p className="text-lg font-bold text-foreground">782</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-border hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Business Age</p>
                <p className="text-lg font-bold text-foreground">5 Years</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-border hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <Clock size={20} className="text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ITR Filing</p>
                <p className="text-lg font-bold text-foreground">On Time</p>
              </div>
            </div>
            
            <div className="ml-auto">
              <Badge variant="secondary" className="text-xs">
                2 Pre-Approved Offers
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Offers */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Featured Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OfferCard offer={offer} variant="featured" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Offers */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">More Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {additionalOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <offer.icon size={20} className="text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground">{offer.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{offer.provider}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {offer.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
