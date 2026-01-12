import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Star, MapPin, CheckCircle2, ArrowRight, Filter,
  FileCheck, Receipt, Building2, Rocket, Award, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Mock CA profiles
const mockCAs = [
  {
    id: 1,
    name: 'CA Priya Sharma',
    location: 'Mumbai',
    rating: 4.9,
    reviews: 156,
    successRate: 99,
    turnaround: '24hrs',
    badges: ['ITR Specialist', 'Startup Consultant'],
    experience: '12 years',
    avatar: 'PS',
    specialties: ['ITR', 'GST', 'Audit'],
    verified: true,
  },
  {
    id: 2,
    name: 'CA Rajesh Kumar',
    location: 'Delhi NCR',
    rating: 4.8,
    reviews: 234,
    successRate: 98,
    turnaround: '48hrs',
    badges: ['GST Expert', 'CMA Specialist'],
    experience: '15 years',
    avatar: 'RK',
    specialties: ['GST', 'CMA', 'Company Law'],
    verified: true,
  },
  {
    id: 3,
    name: 'CA Anita Desai',
    location: 'Bangalore',
    rating: 4.9,
    reviews: 189,
    successRate: 99,
    turnaround: '24hrs',
    badges: ['Startup Consultant', 'ITR Specialist'],
    experience: '8 years',
    avatar: 'AD',
    specialties: ['Startup', 'ITR', 'ESOP'],
    verified: true,
  },
  {
    id: 4,
    name: 'CA Vikram Singh',
    location: 'Pune',
    rating: 4.7,
    reviews: 98,
    successRate: 97,
    turnaround: '72hrs',
    badges: ['GST Expert'],
    experience: '10 years',
    avatar: 'VS',
    specialties: ['GST', 'TDS', 'Audit'],
    verified: true,
  },
];

const badgeColors = {
  'ITR Specialist': 'bg-primary/10 text-primary border-primary/20',
  'GST Expert': 'bg-info/10 text-info border-info/20',
  'Startup Consultant': 'bg-success/10 text-success border-success/20',
  'CMA Specialist': 'bg-warning/10 text-warning border-warning/20',
};

export function FindAProSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCAs = mockCAs.filter(ca => 
    ca.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ca.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ca.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section id="find-a-pro" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="section-badge mb-4">
            <Award className="w-3 h-3" />
            Trust-Based Directory
          </Badge>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold mb-4">
            Find a <span className="text-primary">Verified CA</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            All CAs are ICAI-verified with proven track records. Filter by specialty, location, and ratings.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, location, or specialty (ITR, GST, Startup...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-14 rounded-2xl text-base border-2 focus:border-primary"
            />
            <Button size="sm" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </motion.div>

        {/* CA Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {filteredCAs.map((ca, i) => (
            <motion.div
              key={ca.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full bento-card border-2 hover:border-primary/50 group">
                <CardContent className="p-6">
                  {/* Avatar & Verified Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl font-serif font-bold text-primary-foreground">
                      {ca.avatar}
                    </div>
                    {ca.verified && (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Shield className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Name & Location */}
                  <h3 className="font-serif text-lg font-bold mb-1">{ca.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    {ca.location} • {ca.experience}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <Star 
                          key={j} 
                          className={`w-4 h-4 ${j < Math.floor(ca.rating) ? 'fill-warning text-warning' : 'text-muted'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{ca.rating}</span>
                    <span className="text-xs text-muted-foreground">({ca.reviews})</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-center p-2 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-primary">{ca.successRate}%</div>
                      <div className="text-xs text-muted-foreground">Success</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-primary">{ca.turnaround}</div>
                      <div className="text-xs text-muted-foreground">Turnaround</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {ca.badges.map((badge, j) => (
                      <Badge 
                        key={j} 
                        variant="outline" 
                        className={`text-xs ${badgeColors[badge] || ''}`}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button className="w-full rounded-xl gap-2" size="sm">
                    View Profile
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Button variant="outline" size="lg" className="rounded-xl gap-2">
            View All 500+ CAs
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
