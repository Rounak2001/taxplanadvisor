import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-muted/30 border-t">
            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src="/TAX plan Advisor.ico"
                                alt="TaxPlan Advisor"
                                className="h-10 w-10"
                            />
                            <div className="flex flex-col">
                                <span className="text-lg font-serif font-bold leading-tight">TaxPlan</span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Advisor</span>
                            </div>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            India's #1 AI-powered financial marketplace. Connecting businesses with verified experts for tax, audit, and compliance.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-lg bg-background border hover:border-primary/50 transition-colors">
                                <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-background border hover:border-primary/50 transition-colors">
                                <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-background border hover:border-primary/50 transition-colors">
                                <Instagram className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-background border hover:border-primary/50 transition-colors">
                                <Facebook className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link to="/calculators" className="hover:text-foreground transition-colors">Financial Calculators</Link></li>
                            <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                            {/* <li><Link to="/consultant-onboard" className="hover:text-foreground transition-colors">Join as Consultant</Link></li> */}
                            <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
                            <li><Link to="/login" className="hover:text-foreground transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold mb-6">Services</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground transition-colors">Income Tax Filing</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">GST Compliance</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Project Reports (CMA)</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Virtual CFO</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Startup Registration</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold mb-6">Contact</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span>Mumbai, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>+91 788 789 1234</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>developers@taxplanadvisor.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© 2026 TaxPlan Advisor. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                        <Link to="/security" className="hover:text-foreground transition-colors">Security</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
