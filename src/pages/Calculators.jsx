import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calculator, TrendingUp, Wallet, Clock, PiggyBank,
    CreditCard, Percent, DollarSign, BarChart3, Target,
    ArrowRight, Sparkles, Building2, CircleDollarSign,
    Activity, Landmark
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.05 } }
};

// Calculator categories and items
const calculatorCategories = [
    {
        id: 'tax',
        title: 'Tax Calculators',
        description: 'Calculate your income tax, capital gains, and more',
        icon: Landmark,
        color: 'primary',
        calculators: [
            {
                id: 'tax',
                title: 'Income Tax Calculator',
                description: 'Calculate tax under Old vs New regime with deductions for FY 2025-26',
                icon: Calculator,
                path: '/calculators/tax',
                badge: 'FY 2025-26'
            },
            {
                id: 'salary',
                title: 'Salary Calculator',
                description: 'Break down your CTC into take-home salary components',
                icon: DollarSign,
                path: '/calculators/salary'
            }
        ]
    },
    {
        id: 'investment',
        title: 'Investment Calculators',
        description: 'Plan your investments and maximize returns',
        icon: PiggyBank,
        color: 'success',
        calculators: [
            {
                id: 'sip',
                title: 'SIP Calculator',
                description: 'Calculate returns on SIP, Step-up SIP, and Lumpsum investments',
                icon: TrendingUp,
                path: '/calculators/sip',
                badge: 'Popular'
            },
            {
                id: 'mf',
                title: 'Mutual Fund Calculator',
                description: 'Compare mutual fund returns and growth projections',
                icon: BarChart3,
                path: '/calculators/mf'
            },
            {
                id: 'fd',
                title: 'FD Calculator',
                description: 'Calculate fixed deposit returns with compounding',
                icon: Landmark,
                path: '/calculators/fd'
            },
            {
                id: 'cagr',
                title: 'CAGR Calculator',
                description: 'Calculate Compound Annual Growth Rate of investments',
                icon: Percent,
                path: '/calculators/cagr'
            },
            {
                id: 'swp',
                title: 'SWP Calculator',
                description: 'Plan systematic withdrawals from your investment corpus',
                icon: Wallet,
                path: '/calculators/swp'
            },
            {
                id: 'portfolio',
                title: 'Portfolio Analyzer',
                description: 'Analyze your investment portfolio allocation and risk profile',
                icon: Target,
                path: '/calculators/portfolio'
            }
        ]
    },
    {
        id: 'loan',
        title: 'Loan Calculators',
        description: 'Calculate EMIs and plan your loan repayments',
        icon: CreditCard,
        color: 'destructive',
        calculators: [
            {
                id: 'emi',
                title: 'EMI Calculator',
                description: 'Calculate loan EMI, amortization schedule, and prepayment benefits',
                icon: CreditCard,
                path: '/calculators/emi',
                badge: 'Popular'
            },
            {
                id: 'prepayment',
                title: 'Prepayment Analyzer',
                description: 'Analyze prepayment benefits and optimize your loan strategy',
                icon: CircleDollarSign,
                path: '/calculators/prepayment'
            }
        ]
    },
    {
        id: 'planning',
        title: 'Financial Planning',
        description: 'Plan for your future financial goals',
        icon: Target,
        color: 'info',
        calculators: [
            {
                id: 'retirement',
                title: 'Retirement Calculator',
                description: 'Plan your retirement corpus and monthly SIP needed',
                icon: Clock,
                path: '/calculators/retirement'
            },
            {
                id: 'inflation',
                title: 'Inflation Calculator',
                description: 'Understand the impact of inflation on your money',
                icon: Percent,
                path: '/calculators/inflation'
            },
            {
                id: 'financial-health',
                title: 'Financial Health Score',
                description: 'Assess your overall financial health with key metrics',
                icon: Activity,
                path: '/calculators/financial-health'
            }
        ]
    }
];

const colorClasses = {
    primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
    success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
    destructive: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
    info: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/20' }
};

// Inline components replaced with imports

export default function Calculators() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 text-foreground font-sans selection:bg-primary/20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-16 lg:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
                <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

                <div className="container relative mx-auto px-4 lg:px-8">
                    <motion.div
                        className="text-center max-w-3xl mx-auto"
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge className="mb-6 px-4 py-1.5">
                                <Sparkles className="w-3 h-3 mr-2" />
                                14 Free Financial Calculators
                            </Badge>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                        >
                            Financial{' '}
                            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                                Calculators
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-lg lg:text-xl text-muted-foreground"
                        >
                            Free tools to help you plan taxes, investments, loans, and retirement.
                            No signup required. Get instant results.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Calculator Categories */}
            <section className="pb-20 lg:pb-28">
                <div className="container mx-auto px-4 lg:px-8">
                    {calculatorCategories.map((category, categoryIndex) => {
                        const colors = colorClasses[category.color] || colorClasses.primary;
                        const CategoryIcon = category.icon;

                        return (
                            <motion.div
                                key={category.id}
                                className="mb-16 last:mb-0"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: categoryIndex * 0.1 }}
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center`}>
                                        <CategoryIcon className={`w-6 h-6 ${colors.text}`} />
                                    </div>
                                    <div>
                                        <h2 className="font-serif text-2xl lg:text-3xl font-bold">{category.title}</h2>
                                        <p className="text-muted-foreground">{category.description}</p>
                                    </div>
                                </div>

                                {/* Calculator Cards Grid */}
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                    {category.calculators.map((calc, calcIndex) => {
                                        const CalcIcon = calc.icon;

                                        return (
                                            <motion.div
                                                key={calc.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: calcIndex * 0.05 }}
                                            >
                                                <Link to={calc.path}>
                                                    <Card className={`h-full border-2 hover:${colors.border} hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
                                                        <CardContent className="p-6">
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                                    <CalcIcon className={`w-6 h-6 ${colors.text}`} />
                                                                </div>
                                                                {calc.badge && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {calc.badge}
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                                                {calc.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground mb-4">
                                                                {calc.description}
                                                            </p>

                                                            <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                                Try Calculator
                                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 lg:px-8">
                    <motion.div
                        className="text-center max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4">
                            Need Professional Help?
                        </h2>
                        <p className="text-primary-foreground/80 text-lg mb-8">
                            Connect with Verified Consultants for personalized financial planning and filing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="rounded-xl" asChild>
                                <Link to="/login">
                                    <Building2 className="w-5 h-5 mr-2" />
                                    Find a CA
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-xl bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                                <Link to="/">
                                    Learn More
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
