import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, Shield, Zap, Users, FileText, Calculator, Brain, Video, Bell, 
  BarChart3, HeartPulse, Smartphone, CheckCircle2, Star, ArrowRight,
  Play, Calendar, Lock, Clock, Award, TrendingUp, MessageSquare,
  ChevronRight, Mail, Phone, MapPin, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function Landing() {
  const [chatInput, setChatInput] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              T
            </div>
            <span className="text-xl font-bold">TaxPlan</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              GST Services
            </Link>
            <Link to="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              AI Tools
            </Link>
            <Link to="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Tools
            </Link>
            <Link to="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="container relative mx-auto px-4">
            <motion.div 
              className="mx-auto max-w-4xl text-center"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="secondary" className="mb-4">
                  India's #1 Tax-Tech Platform
                </Badge>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                TaxPlan Advisor.{' '}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  AI That Simplifies.
                </span>
                <br />
                Taxes, GST & Business Finance
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Connect with ICAI-verified Chartered Accountants, file taxes with AI-powered assistance, 
                and manage all compliance from one intelligent platform.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="gap-2">
                  Book a Demo
                  <ArrowRight size={16} />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Play size={16} />
                  Watch Video
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                variants={fadeInUp}
                className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
              >
                {[
                  { value: '500+', label: 'Verified CAs' },
                  { value: '5K+', label: 'Filings Completed' },
                  { value: '99.5%', label: 'Accuracy Rate' },
                  { value: '4.8/5', label: 'User Rating' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* AI Assistant Section */}
        <section className="py-20 bg-muted/30" id="ai-assistant">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="mb-4">AI ASSISTANT</Badge>
                <h2 className="text-3xl font-bold mb-4">AI Finance Copilot</h2>
                <p className="text-muted-foreground mb-8">
                  Your personal AI assistant for all tax and finance questions. Get instant answers about 
                  GST, ITR, investments, and compliance — in simple, easy-to-understand language.
                </p>
                
                <div className="space-y-4">
                  {[
                    { icon: Brain, title: 'Trained on Tax Data', desc: 'Latest GST rules, ITR guidelines, and tax laws built-in.' },
                    { icon: Zap, title: 'Real-Time Updates', desc: 'Web search enabled for latest circulars and notifications.' },
                    { icon: MessageSquare, title: 'Simple Explanations', desc: 'Complex tax concepts explained in everyday language.' },
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Chat Demo */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="border-2">
                  <CardContent className="p-0">
                    <div className="p-4 border-b bg-muted/50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold">TaxPlan AI</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          Online • Trained on latest tax laws
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-auto text-xs">AI-assisted. Expert-verified.</Badge>
                    </div>
                    
                    <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                      {/* User message */}
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                          What is the due date for GSTR-3B this month?
                        </div>
                      </div>
                      
                      {/* AI response */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                          The GSTR-3B for December 2024 is due on January 20, 2025 for taxpayers with turnover above ₹5 crore. For QRMP taxpayers, it's January 22-24, 2025 based on your state.
                        </div>
                      </div>

                      {/* User message */}
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                          Can I claim ITC on a hotel stay?
                        </div>
                      </div>
                      
                      {/* AI response */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                          Yes, you can claim ITC on hotel stays if used for business purposes and if the invoice contains your GSTIN. The hotel must be registered under GST, and you must have a valid tax invoice.
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Ask about GST, ITR, or any tax query..." 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="icon">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* GST Tools Section */}
        <section className="py-20" id="gst-tools">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">GST TOOLS</Badge>
              <h2 className="text-3xl font-bold mb-4">GST Reconciliation</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Automate GST reconciliation and identify mismatches instantly
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'GSTR-2B vs Books', desc: 'Reconcile purchase data with your books', icon: FileText },
                { title: 'GSTR-3B vs R1 & 2B', desc: 'Compare returns for mismatches', icon: BarChart3 },
                { title: 'GSTR-3B vs Books', desc: 'Match 3B with your accounting data', icon: Calculator },
                { title: 'Download GSTR Data', desc: 'Fetch 2B, R1 & 3B from portal', icon: ArrowRight },
              ].map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <tool.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{tool.desc}</p>
                      <Button variant="outline" size="sm" className="gap-2">
                        Try Now
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CA Consultation Section */}
        <section className="py-20 bg-muted/30" id="consultation">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="mb-4">EXPERT SUPPORT</Badge>
                <h2 className="text-3xl font-bold mb-4">CA-Verified Consultation</h2>
                <p className="text-muted-foreground mb-8">
                  Get expert advice from ICAI-verified Chartered Accountants for complex tax matters, 
                  compliance issues, or financial planning.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    { icon: Video, title: '1-on-1 Video Call', desc: 'Connect with verified CAs for personalized advice.' },
                    { icon: Lock, title: 'Secure Sharing', desc: 'End-to-end encrypted document sharing.' },
                    { icon: Calendar, title: 'Flexible Scheduling', desc: 'Book at your convenience, anytime.' },
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="gap-2">
                  Book a CA Consultation
                  <ArrowRight size={16} />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
                <Card className="relative border-2">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                        CA
                      </div>
                      <div>
                        <div className="font-semibold text-lg">Expert CA</div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                          <span className="text-sm font-medium">4.9</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">250+</div>
                        <div className="text-xs text-muted-foreground">Returns Filed</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">98%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">12</div>
                        <div className="text-xs text-muted-foreground">Years Exp</div>
                      </div>
                      <div className="flex flex-wrap gap-1 p-3 bg-muted rounded-lg items-center justify-center">
                        {['ITR', 'GST', 'Audit'].map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                        <Badge variant="outline" className="text-xs">+3</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Project Report Maker Section */}
        <section className="py-20" id="project-report">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {[
                        { icon: CheckCircle2, text: 'Bank-ready format', color: 'text-green-500' },
                        { icon: CheckCircle2, text: 'Industry templates', color: 'text-green-500' },
                        { icon: CheckCircle2, text: 'Auto ratio calculations', color: 'text-green-500' },
                        { icon: CheckCircle2, text: 'Editable projections', color: 'text-green-500' },
                        { icon: CheckCircle2, text: 'PDF & Excel export', color: 'text-green-500' },
                        { icon: CheckCircle2, text: 'CA review available', color: 'text-green-500' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <Badge variant="outline" className="mb-4">FOR BUSINESS OWNERS</Badge>
                <h2 className="text-3xl font-bold mb-4">Automated Project Report Maker</h2>
                <p className="text-muted-foreground mb-8">
                  Generate professional project reports for bank loans in minutes. 
                  Enter your business details — we handle projections and formatting.
                </p>

                <div className="space-y-4">
                  {[
                    { title: 'Term Loan Reports', desc: 'Bank-ready project reports with projected financials and market analysis.' },
                    { title: 'CMA Reports', desc: 'Fund flow, ratio analysis, and working capital assessment for banks.' },
                    { title: 'Auto-Generated Financials', desc: 'P&L, Balance Sheets, and Cash Flow auto-generated from your inputs.' },
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-20 bg-muted/30" id="features">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Features</Badge>
              <h2 className="text-3xl font-bold mb-4">Everything You Need for Tax Compliance</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A complete ecosystem for assessees and Chartered Accountants. From filing to planning, we've got you covered.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                { icon: Users, title: 'CA Marketplace', desc: 'Connect with ICAI-verified Chartered Accountants. Browse profiles, ratings, and specializations.' },
                { icon: Brain, title: 'AI-Powered Matching', desc: 'Smart algorithm matches you with the perfect CA based on complexity, deadlines, and expertise.' },
                { icon: FileText, title: 'End-to-End Compliance', desc: 'ITR, GST, TDS, PT filing - complete tax compliance workflows in one unified platform.' },
                { icon: Shield, title: 'Maker-Checker QA', desc: 'Every filing goes through dual CA verification for accuracy and accountability.' },
                { icon: FileText, title: 'Free Invoicing', desc: 'GST-compliant invoice generator with daybook, ledger, and real-time P&L overview.' },
                { icon: Calculator, title: 'Tax Calculators', desc: 'Old vs new regime comparison, deduction optimizer, and year-end planning tools.' },
                { icon: Brain, title: 'AI Tax Planning', desc: 'Personalized savings suggestions based on your profile and investment patterns.' },
                { icon: Video, title: 'Live Consultancy', desc: 'Schedule video sessions with CAs. AI-powered video explainers for quick queries.' },
                { icon: Bell, title: 'Smart Notifications', desc: 'Auto-alerts for deadlines, government updates, and tax law changes.' },
                { icon: BarChart3, title: 'Real-Time Dashboards', desc: 'Track filing status, document uploads, and compliance progress live.' },
                { icon: HeartPulse, title: 'Financial Health Check', desc: 'Diagnostic tool highlighting risk areas and generating health reports.' },
                { icon: Smartphone, title: 'Mobile App', desc: 'Full platform access on mobile. Upload docs, chat with CA, track status anywhere.', badge: 'Coming Soon' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{feature.title}</h3>
                        {feature.badge && (
                          <Badge variant="secondary" className="text-xs">{feature.badge}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20" id="how-it-works">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">How It Works</Badge>
              <h2 className="text-3xl font-bold mb-4">Filing Taxes Made Effortless</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Four simple steps to complete peace of mind. From signup to successful filing in minutes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Sign Up', desc: 'Create your account in seconds. Individuals, businesses, or CAs - everyone\'s welcome.' },
                { step: '02', title: 'Get Matched', desc: 'Our AI analyzes your profile and matches you with the ideal CA for your specific needs.' },
                { step: '03', title: 'Upload & File', desc: 'Securely upload documents. Your CA prepares and files with maker-checker verification.' },
                { step: '04', title: 'Track & Relax', desc: 'Real-time status updates. Get notified at every step until successful filing.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* For CAs Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5" id="for-cas">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Coming Soon</Badge>
              <Badge variant="secondary" className="mb-4 ml-2">For Chartered Accountants</Badge>
              <h2 className="text-3xl font-bold mb-4">Grow Your Practice Digitally</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join India's largest network of verified CAs. Get matched with clients, streamline your workflow, 
                and build your brand on our platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                { icon: TrendingUp, title: 'Expand Client Base', desc: 'Access thousands of assessees looking for verified CA services.' },
                { icon: Award, title: 'Build Reputation', desc: 'Earn ratings, reviews, and showcase your expertise through webinars.' },
                { icon: Star, title: 'Performance Rewards', desc: 'High-rated CAs automatically receive more incoming job matches.' },
                { icon: Clock, title: 'Save Time', desc: 'Auto-filing tools and pre-filled forms reduce manual work by 60%.' },
                { icon: Video, title: 'Host Webinars', desc: 'Conduct educational sessions and attract leads through content.' },
                { icon: BarChart3, title: 'Transparent Earnings', desc: 'Track payments, manage invoices, and grow your practice digitally.' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" className="gap-2">
                Register as CA
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Ready to simplify your taxes?</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses and individuals who trust TaxPlan Advisor for their tax compliance needs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get Started Free
                  <ArrowRight size={16} />
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Talk to Sales
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  T
                </div>
                <span className="text-xl font-bold">TaxPlan</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                India's leading tax-tech platform connecting people with verified Chartered Accountants and AI-powered financial tools.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  taxplanadvisor@gmail.com
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +91 788 789 1234
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Mumbai, India
                </div>
              </div>
            </div>

            {/* GST Services */}
            <div>
              <h3 className="font-semibold mb-4">GST Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">GSTR-3B vs R1 & 2B</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">GSTR-3B vs Books</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">GSTR-2B vs Books</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Get GSTR-2B Data</Link></li>
              </ul>
            </div>

            {/* AI Tools */}
            <div>
              <h3 className="font-semibold mb-4">AI Tools</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">AI Tax Assistant</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Investment Advisory</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Dubai Investment</Link></li>
              </ul>
              <h3 className="font-semibold mb-4 mt-6">Calculators</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">All Calculators</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">EMI Calculator</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">SIP Calculator</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">FD Calculator</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 TaxPlan Advisors Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                Secure Platform
              </span>
              <span className="flex items-center gap-1">
                <Bot className="w-4 h-4" />
                AI Powered
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
