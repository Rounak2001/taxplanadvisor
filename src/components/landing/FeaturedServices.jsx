import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calculator,FileText,Rocket,Search,Award,BarChart3,ArrowRight,UserCheck,Scale,Globe,Briefcase,BookOpen,ShieldCheck,ChevronDown,ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const initialCategories = [
    {
        icon: Calculator,
        title: "TDS Planning",
        description: "Expert consultation for NRI lower TDS certificates (u/s 197) and property transactions.",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        icon: FileText,
        title: "GST Services",
        description: "From registration's to complex reconciliations (GSTR-2B vs Books) and monthly filings.",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
    {
        icon: Rocket,
        title: "Startup Advisory",
        description: "Business structure selection, DPIIT registration, and compliance roadmap for pioneers.",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
    },
    {
        icon: Search,
        title: "Auditing Services",
        description: "Statutory audits, internal reviews, and specialized GST audits for robust compliance.",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
    {
        icon: Award,
        title: "Certifications",
        description: "Net Worth, Turnover, and 15CA/15CB certificates from verified chartered accountants.",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
    {
        icon: BarChart3,
        title: "Project Reports",
        description: "Detailed project reports and feasibility studies for bank loans and investor pitch decks.",
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
    },
    {
        icon: UserCheck,
        title: "Income Tax (ITR)",
        description: "Personalized ITR filing for salaried individuals, freelancers, and business owners.",
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
    },
    {
        icon: Globe,
        title: "NRI Taxation",
        description: "Specialized tax planning for Non-Residents, dealing with DTAA and global income.",
        color: "text-sky-500",
        bgColor: "bg-sky-500/10",
    },
];

const extraCategories = [
    {
        icon: Scale,
        title: "Tax Appeals",
        description: "Representation before tax authorities for assessment appeals and litigation support.",
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
    },
    {
        icon: Briefcase,
        title: "ROC Compliance",
        description: "Annual filings, board resolutions, and statutory secretarial support for private companies.",
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
    },
    {
        icon: BookOpen,
        title: "Accounting",
        description: "Professional bookkeeping, MIS reporting, and preparation of financial statements.",
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
    },
    {
        icon: ShieldCheck,
        title: "Due Diligence",
        description: "In-depth financial and legal due diligence for business acquisitions and investments.",
        color: "text-lime-500",
        bgColor: "bg-lime-500/10",
    },
];

const FeaturedServices = () => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section className="py-24 relative overflow-hidden bg-background" id="featured-services">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl text-left">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl sm:text-5xl font-bold text-foreground mb-4"
                        >
                            Professional <span className="gradient-text">Financial Services</span>
                        </motion.h2>
                        <p className="text-lg text-muted-foreground">
                            Premium tax and compliance solutions delivered by top consultants.
                            Select a category to explore our comprehensive catalog.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {initialCategories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            onClick={() => navigate('/client-login')}
                            className="relative group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="bg-card border border-border/40 p-6 rounded-3xl transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/5 relative h-full flex flex-col">
                                <div className={`w-12 h-12 rounded-2xl ${category.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    <category.icon className={`w-6 h-6 ${category.color}`} />
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {category.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                    {category.description}
                                </p>

                                <div className="flex items-center text-xs font-semibold text-primary group-hover:gap-2 transition-all mt-auto">
                                    <span>Learn More</span>
                                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <AnimatePresence>
                        {isExpanded && extraCategories.map((category, index) => (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                                whileHover={{ y: -5 }}
                                onClick={() => navigate('/client-login')}
                                className="relative group cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="bg-card border border-border/40 p-6 rounded-3xl transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/5 relative h-full flex flex-col">
                                    <div className={`w-12 h-12 rounded-2xl ${category.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                        <category.icon className={`w-6 h-6 ${category.color}`} />
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                        {category.description}
                                    </p>

                                    <div className="flex items-center text-xs font-semibold text-primary group-hover:gap-2 transition-all mt-auto">
                                        <span>Learn More</span>
                                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="group gap-2 border-primary/20 hover:border-primary/50 rounded-full px-8 py-6 h-auto text-lg transition-all duration-300 shadow-lg hover:shadow-primary/10"
                    >
                        {isExpanded ? (
                            <>
                                Show Less Services
                                <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                            </>
                        ) : (
                            <>
                                Explore Full Catalog
                                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedServices;
