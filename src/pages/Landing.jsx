import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  MessageCircle, Play, Shield, ScanText, FolderLock, Phone, FileSpreadsheet,
  Gauge, Calculator, ChevronDown, ChevronRight, CheckCircle2, Star, Lock,
  Menu, X, ArrowRight, Sparkles, Building2, Users, Award, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserTypeToggle } from '@/components/landing/UserTypeToggle';
import { ITRMarketplaceSection } from '@/components/landing/ITRMarketplaceSection';
import { FindAProSection } from '@/components/landing/FindAProSection';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

// Bento Grid Features
const bentoFeatures = [
  {
    id: 'ai-ocr',
    title: 'AI-OCR Extraction',
    description: 'Extract data from invoices, receipts, and documents instantly with 99.5% accuracy.',
    icon: ScanText,
    size: 'large',
    gradient: 'from-primary/20 to-primary/5'
  },
  {
    id: 'vault',
    title: 'Secure Vault',
    description: 'End-to-end encrypted document storage with DPDP 2026 compliance.',
    icon: FolderLock,
    size: 'medium',
    gradient: 'from-secondary/20 to-secondary/5'
  },
  {
    id: 'whatsapp',
    title: 'Direct WhatsApp Calling',
    description: 'Connect with clients instantly via WhatsApp integration.',
    icon: Phone,
    size: 'small',
    gradient: 'from-success/20 to-success/5'
  },
  {
    id: 'cma',
    title: 'Automated CMA Reports',
    description: 'Generate bank-ready CMA reports in minutes, not hours.',
    icon: FileSpreadsheet,
    size: 'medium',
    gradient: 'from-info/20 to-info/5'
  },
  {
    id: 'gauges',
    title: 'Real-time Tax Gauges',
    description: 'Live dashboards showing tax liability, compliance status, and deadlines.',
    icon: Gauge,
    size: 'small',
    gradient: 'from-warning/20 to-warning/5'
  }
];

// Calculator Cards
const calculators = [
  {
    id: 'income-tax',
    title: 'Income Tax 2026',
    description: 'Calculate your tax under old vs new regime with deduction optimizer.',
    icon: Calculator,
    color: 'primary',
    cta: 'Try for Free'
  },
  {
    id: 'gst-penalty',
    title: 'GST Penalty Interest',
    description: 'Compute late filing interest and penalties for GSTR-3B, GSTR-1.',
    icon: FileSpreadsheet,
    color: 'destructive',
    cta: 'Try for Free'
  },
  {
    id: 'loan-eligibility',
    title: 'Loan Eligibility Score',
    description: 'Check your eligibility for term loans and working capital limits.',
    icon: Gauge,
    color: 'success',
    cta: 'Try for Free'
  }
];

const calculatorTheme = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  destructive: { bg: 'bg-destructive/10', text: 'text-destructive' },
  success: { bg: 'bg-success/10', text: 'text-success' },
};

// Trust Logos
const trustLogos = [
  'Deloitte', 'KPMG', 'Grant Thornton', 'BDO India', 'Walker Chandiok',
  'S.R. Batliboi', 'Sharp & Tannan', 'Lodha & Co', 'ASA Associates', 'N.A. Shah'
];

// FAQ Items
const faqItems = [
  {
    question: 'How does TaxPlan ensure data privacy under DPDP 2026?',
    answer: 'TaxPlan Advisor is fully compliant with the Digital Personal Data Protection Act 2026. We implement end-to-end encryption, row-level security (RLS) on our databases, and provide complete data portability. Your documents are encrypted at rest and in transit, with zero-knowledge architecture ensuring even our team cannot access your sensitive data.'
  },
  {
    question: 'What is Row-Level Security (RLS) and why does it matter?',
    answer: 'RLS ensures that each user can only access their own data at the database level. Unlike application-level security, RLS provides an additional layer of protection where data isolation is enforced by the database itself. This means even if there\'s an application vulnerability, your data remains protected.'
  },
  {
    question: 'Are the Chartered Accountants on your platform verified?',
    answer: 'Yes, all CAs on our platform undergo rigorous ICAI verification. We verify membership numbers, check disciplinary records, and conduct background verification. Additionally, our rating system reflects real client feedback, and we maintain a 98%+ satisfaction rate across our CA network.'
  },
  {
    question: 'Can I export my data if I decide to leave?',
    answer: 'Absolutely. Under DPDP 2026, you have the right to data portability. You can export all your documents, transaction history, and reports in standard formats (PDF, Excel, JSON) at any time. We also provide complete account deletion with certified data erasure upon request.'
  },
  {
    question: 'How does the AI Tax Assistant work?',
    answer: 'Our AI is trained on the latest GST rules, ITR guidelines, and tax laws. It provides instant answers in simple language and can help with calculations, compliance guidance, and deadline tracking. All AI responses are reviewed by our expert CA panel for accuracy before being incorporated into the knowledge base.'
  }
];

// Navigation Component
function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <nav className="container mx-auto flex h-16 lg:h-20 items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-serif font-bold text-xl">
            T
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-serif font-bold leading-tight">TaxPlan</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Advisor</span>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#calculators" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Calculators
          </a>
          <a href="#for-cas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            For CAs
          </a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/dashboard">Login</Link>
          </Button>
          <Button className="gap-2 rounded-xl" asChild>
            <Link to="/dashboard">
              <MessageCircle className="w-4 h-4" />
              WhatsApp Magic Link
            </Link>
          </Button>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t bg-background"
        >
          <div className="container py-4 space-y-4">
            <a href="#features" className="block py-2 text-sm font-medium">Features</a>
            <a href="#calculators" className="block py-2 text-sm font-medium">Calculators</a>
            <a href="#for-cas" className="block py-2 text-sm font-medium">For CAs</a>
            <a href="#faq" className="block py-2 text-sm font-medium">FAQ</a>
            <div className="pt-4 border-t space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard">Login</Link>
              </Button>
              <Button className="w-full gap-2" asChild>
                <Link to="/dashboard">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Magic Link
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}

// Dual-Path Hero Section
function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge className="section-badge mb-6">
              <Sparkles className="w-3 h-3" />
              India's #1 Tax-Tech Platform
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Your Financial{' '}
            <span className="bg-gradient-to-r from-primary to-emerald-dark bg-clip-text text-transparent">
              Sanctuary
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            AI-powered tax filing, GST compliance, and financial planning—
            all in one secure, intelligent platform.
          </motion.p>
        </motion.div>

        {/* Dual-Path Cards */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Tax Professionals Path */}
          <motion.div variants={scaleIn}>
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 h-full group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="relative p-8 lg:p-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold mb-3">
                  For Tax Professionals
                </h2>
                <p className="text-muted-foreground mb-6">
                  Scale your firm with AI. Automate repetitive tasks, manage clients seamlessly, and grow your practice digitally.
                </p>
                <ul className="space-y-3 mb-8">
                  {['AI-powered document extraction', 'Automated compliance workflows', 'Client portal with WhatsApp'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-xl gap-2" size="lg">
                  Automate My Practice
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* SME Business Owners Path */}
          <motion.div variants={scaleIn}>
            <Card className="relative overflow-hidden border-2 hover:border-secondary/50 transition-all duration-300 h-full group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="relative p-8 lg:p-10">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-secondary" />
                </div>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold mb-3">
                  For SME Business Owners
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your financial sanctuary. Secure document storage, expert CA matching, and real-time compliance tracking.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Secure encrypted vault', 'ICAI-verified CA matching', 'Real-time filing status'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" className="w-full rounded-xl gap-2" size="lg">
                  Secure My Documents
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* CTAs */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Button size="lg" className="rounded-xl gap-2 h-14 px-8 text-base">
            <MessageCircle className="w-5 h-5" />
            WhatsApp Magic Link
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl gap-2 h-14 px-8 text-base">
            <Play className="w-5 h-5" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            { value: '500+', label: 'Verified CAs' },
            { value: '5,000+', label: 'Filings Completed' },
            { value: '99.5%', label: 'Accuracy Rate' },
            { value: '4.8/5', label: 'User Rating' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4">
              <div className="font-serif text-3xl lg:text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Bento Grid Section
function BentoGridSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="section-badge mb-4">
            <Zap className="w-3 h-3" />
            Feature Showcase
          </Badge>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold mb-4">
            Everything You Need, <br className="hidden md:block" />
            <span className="text-primary">Intelligently Organized</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A complete ecosystem for tax professionals and businesses. From AI extraction to secure vaults.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {/* Large Card - AI-OCR */}
          <motion.div 
            className="md:col-span-2 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full bento-card overflow-hidden border-2">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 lg:p-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                      <ScanText className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold mb-3">AI-OCR Extraction</h3>
                    <p className="text-muted-foreground mb-6">
                      Upload any invoice, receipt, or document. Our AI extracts all relevant data with 99.5% accuracy—ready for filing in seconds.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Invoices</Badge>
                      <Badge variant="secondary">Receipts</Badge>
                      <Badge variant="secondary">Bank Statements</Badge>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-48 h-64 bg-card rounded-xl shadow-lg border-2 border-primary/20 p-4">
                        <div className="h-3 w-20 bg-primary/30 rounded mb-2" />
                        <div className="h-2 w-full bg-muted rounded mb-1" />
                        <div className="h-2 w-3/4 bg-muted rounded mb-4" />
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="h-8 bg-primary/10 rounded" />
                          <div className="h-8 bg-primary/10 rounded" />
                        </div>
                        <div className="h-2 w-full bg-muted rounded mb-1" />
                        <div className="h-2 w-2/3 bg-muted rounded" />
                      </div>
                      <motion.div 
                        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-lg"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <CheckCircle2 className="w-4 h-4 inline mr-2" />
                        Extracted!
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Secure Vault */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full bento-card border-2">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-6">
                  <FolderLock className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Secure Vault</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  End-to-end encrypted storage with DPDP 2026 compliance. Your documents, forever safe.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>256-bit AES Encryption</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* WhatsApp Calling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full bento-card border-2">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mb-6">
                  <Phone className="w-7 h-7 text-success" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Direct WhatsApp</h3>
                <p className="text-muted-foreground text-sm">
                  Connect with clients instantly via integrated WhatsApp calling and messaging.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* CMA Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full bento-card border-2">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-info/20 to-info/5 flex items-center justify-center mb-6">
                  <FileSpreadsheet className="w-7 h-7 text-info" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Automated CMA</h3>
                <p className="text-muted-foreground text-sm">
                  Generate bank-ready CMA reports in minutes. Auto-calculated ratios and projections.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tax Gauges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full bento-card border-2">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center mb-6">
                  <Gauge className="w-7 h-7 text-warning" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Real-time Gauges</h3>
                <p className="text-muted-foreground text-sm">
                  Live dashboards showing tax liability, compliance status, and upcoming deadlines.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Calculator Cards Section
function CalculatorSection() {
  return (
    <section id="calculators" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="section-badge mb-4">
            <Calculator className="w-3 h-3" />
            Lead Magnet Tools
          </Badge>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold mb-4">
            Free Tax Calculators
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            High-intent lead magnets. Calculate taxes, penalties, and eligibility—get PDF reports via WhatsApp.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {calculators.map((calc, i) => {
            const theme = calculatorTheme[calc.color] ?? calculatorTheme.primary;

            return (
              <motion.div
                key={calc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full bento-card border-2 group hover:border-primary/50">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl ${theme.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <calc.icon className={`w-8 h-8 ${theme.text}`} />
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-3">{calc.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{calc.description}</p>
                    <Button className="w-full rounded-xl gap-2">
                      {calc.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Trust Engine Section
function TrustSection() {
  return (
    <section className="py-16 lg:py-20 bg-secondary text-secondary-foreground overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 mb-12">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-2xl lg:text-3xl font-bold mb-2">
            Trusted by 500+ Chartered Accountants
          </h2>
          <p className="text-secondary-foreground/70">
            Firms across India rely on TaxPlan Advisor for their practice
          </p>
        </motion.div>
      </div>

      {/* Ticker */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary to-transparent z-10" />
        
        <div className="flex animate-ticker">
          {[...trustLogos, ...trustLogos].map((logo, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 mx-8 lg:mx-12 py-4 px-6 rounded-xl bg-secondary-foreground/10 text-secondary-foreground/80 font-medium"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>

      {/* Security Badges */}
      <div className="container mx-auto px-4 lg:px-8 mt-12">
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-6 lg:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary-foreground/10">
            <Shield className="w-6 h-6 text-primary" />
            <div className="text-left">
              <div className="text-sm font-semibold">DPDP 2026</div>
              <div className="text-xs text-secondary-foreground/70">Compliant</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary-foreground/10">
            <Award className="w-6 h-6 text-primary" />
            <div className="text-left">
              <div className="text-sm font-semibold">ISO 27001</div>
              <div className="text-xs text-secondary-foreground/70">Certified</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary-foreground/10">
            <Lock className="w-6 h-6 text-primary" />
            <div className="text-left">
              <div className="text-sm font-semibold">256-bit AES</div>
              <div className="text-xs text-secondary-foreground/70">Encryption</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// For CAs Section
function ForCAsSection() {
  return (
    <section id="for-cas" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="section-badge mb-6">
              <Building2 className="w-3 h-3" />
              For Chartered Accountants
            </Badge>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-6">
              Grow Your Practice <span className="text-primary">Digitally</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join India's largest network of verified CAs. Get matched with clients, 
              streamline your workflow, and build your brand on our platform.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { title: 'Expand Client Base', desc: 'Access thousands of assessees' },
                { title: 'Build Reputation', desc: 'Earn ratings & reviews' },
                { title: 'Save 60% Time', desc: 'Auto-filing tools & forms' },
                { title: 'Host Webinars', desc: 'Attract leads via content' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl bg-muted/50">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="rounded-xl gap-2">
              Register as CA
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl blur-3xl" />
            <Card className="relative border-2 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-serif font-bold text-primary-foreground">
                    CA
                  </div>
                  <div>
                    <div className="font-serif text-xl font-bold">Top Rated CA</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">4.9</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <div className="text-2xl font-bold text-primary">250+</div>
                    <div className="text-xs text-muted-foreground">Returns</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-xs text-muted-foreground">Success</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-xs text-muted-foreground">Years</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge>ITR</Badge>
                  <Badge>GST</Badge>
                  <Badge>Audit</Badge>
                  <Badge variant="secondary">+3 more</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  return (
    <section id="faq" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="section-badge mb-4">
            <Shield className="w-3 h-3" />
            Security & Privacy
          </Badge>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to know about data privacy, security, and compliance.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="bg-card border-2 rounded-2xl px-6 data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-serif font-semibold text-lg py-6 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="relative max-w-4xl mx-auto text-center p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-primary to-emerald-dark overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Tax Practice?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Join 500+ CAs and thousands of SMEs who trust TaxPlan Advisor for their financial compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="rounded-xl gap-2 h-14 px-8 text-base">
                <MessageCircle className="w-5 h-5" />
                Get WhatsApp Magic Link
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl gap-2 h-14 px-8 text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Schedule Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 lg:py-16 border-t bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-serif font-bold text-xl">
                T
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-serif font-bold leading-tight">TaxPlan</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Advisor</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              India's leading tax-tech platform connecting people with verified Chartered Accountants and AI-powered financial tools.
            </p>
            <div className="flex gap-3">
              <Badge variant="outline" className="text-xs">🔒 Secure</Badge>
              <Badge variant="outline" className="text-xs">🤖 AI Powered</Badge>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">GST Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">GSTR-3B vs R1 & 2B</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">GSTR-3B vs Books</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">GSTR-2B vs Books</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Get GSTR-2B Data</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Calculators</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Income Tax 2026</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">GST Penalty Calculator</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Loan Eligibility</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">EMI Calculator</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 TaxPlan Advisors Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page Component
export default function Landing() {
  return (
    <>
      <Helmet>
        <title>TaxPlan Advisor | India's #1 AI-Powered Tax & GST Platform</title>
        <meta name="description" content="Connect with ICAI-verified Chartered Accountants, file taxes with AI assistance, and manage GST compliance. 500+ verified CAs, 5000+ filings, 99.5% accuracy." />
        <meta name="keywords" content="tax filing, GST compliance, chartered accountant, CA services, ITR filing, GSTR-3B, tax consultant, AI tax assistant, online tax filing India" />
        <meta property="og:title" content="TaxPlan Advisor | India's #1 AI-Powered Tax & GST Platform" />
        <meta property="og:description" content="Connect with ICAI-verified Chartered Accountants, file taxes with AI assistance, and manage GST compliance." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TaxPlan Advisor | India's #1 AI-Powered Tax & GST Platform" />
        <link rel="canonical" href="https://taxplanadvisor.com/" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
          <BentoGridSection />
          <CalculatorSection />
          <TrustSection />
          <ForCAsSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}