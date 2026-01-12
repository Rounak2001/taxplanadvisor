import { motion } from 'framer-motion';
import { 
  IndianRupee, Shield, TrendingUp, ArrowRight, Sparkles, CheckCircle2,
  Building2, Heart, Car
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const offers = [
  {
    id: 1,
    type: 'loan',
    title: 'Business Term Loan',
    provider: 'HDFC Bank',
    amount: '₹25 Lakhs',
    rate: '10.5% p.a.',
    status: 'Pre-Approved',
    icon: Building2,
    color: 'primary',
    tagline: 'Based on your CMA health score',
  },
  {
    id: 2,
    type: 'insurance',
    title: 'Term Life Insurance',
    provider: 'ICICI Prudential',
    coverage: '₹1 Crore',
    premium: '₹8,500/year',
    status: 'Recommended',
    icon: Heart,
    color: 'success',
    tagline: 'Tax saving under 80C',
  },
  {
    id: 3,
    type: 'loan',
    title: 'Vehicle Loan',
    provider: 'Axis Bank',
    amount: '₹8 Lakhs',
    rate: '8.9% p.a.',
    status: 'Eligible',
    icon: Car,
    color: 'info',
    tagline: 'Based on ITR compliance',
  },
];

const statusColors = {
  'Pre-Approved': 'bg-primary text-primary-foreground',
  'Recommended': 'bg-success text-success-foreground',
  'Eligible': 'bg-info text-info-foreground',
};

export function EmbeddedOffersCard() {
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Recommended for You
          </CardTitle>
          <Badge variant="outline" className="text-xs">AI-Matched</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {offers.map((offer, i) => {
          const Icon = offer.icon;
          
          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${offer.color}/10 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 text-${offer.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{offer.title}</h4>
                    <Badge className={`text-xs ${statusColors[offer.status]}`}>
                      {offer.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{offer.provider}</p>
                  
                  <div className="flex items-center gap-3 text-sm">
                    {offer.amount && (
                      <span className="font-semibold text-primary">{offer.amount}</span>
                    )}
                    {offer.coverage && (
                      <span className="font-semibold text-success">{offer.coverage}</span>
                    )}
                    {offer.rate && (
                      <span className="text-muted-foreground">@ {offer.rate}</span>
                    )}
                    {offer.premium && (
                      <span className="text-muted-foreground">{offer.premium}</span>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    {offer.tagline}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          );
        })}

        <Button variant="outline" className="w-full gap-2 mt-2">
          View All Offers
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
