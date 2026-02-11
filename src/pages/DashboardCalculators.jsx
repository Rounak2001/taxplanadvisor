import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calculator, TrendingUp, Wallet, Clock, PiggyBank,
    CreditCard, Percent, DollarSign, BarChart3, Target,
    ArrowUp, Activity, Landmark, FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// All calculators in a flat list - Tax first, with badges
const allCalculators = [
    {
        id: 'tax',
        title: 'Tax Calculator',
        description: 'Calculate your income tax liability for FY 2025-26',
        icon: Calculator,
        path: 'tax',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        badge: 'FY 2025-26'
    },
    {
        id: 'capital-gains',
        title: 'Capital Gains',
        description: 'Calculate Capital Gains tax on investments',
        icon: TrendingUp,
        path: 'capital-gains',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        badge: 'New'
    },
    {
        id: 'tds',
        title: 'TDS (Bulk) Calculator',
        description: 'Bulk TDS calculation with Excel upload support',
        icon: Calculator,
        path: 'tds',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        badge: 'Professional'
    },
    {
        id: 'tds-individual',
        title: 'TDS (Individual)',
        description: 'Calculate TDS for single or multiple manual entries',
        icon: Calculator,
        path: 'tds-individual',
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10'
    },
    {
        id: 'emi',
        title: 'EMI Calculator',
        description: 'Calculate your monthly loan EMI with interest breakdown',
        icon: CreditCard,
        path: 'emi',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        badge: 'Popular'
    },
    {
        id: 'sip',
        title: 'SIP Calculator',
        description: 'Plan your Systematic Investment for wealth...',
        icon: TrendingUp,
        path: 'sip',
        color: 'text-success',
        bgColor: 'bg-success/10',
        badge: 'Popular'
    },
    {
        id: 'prepayment',
        title: 'Prepayment Calculator',
        description: 'See how prepayment reduces your loan tenure...',
        icon: TrendingUp,
        path: 'prepayment',
        color: 'text-primary',
        bgColor: 'bg-primary/10'
    },
    {
        id: 'lumpsum',
        title: 'Lumpsum Calculator',
        description: 'Calculate returns on one-time investment',
        icon: Target,
        path: 'sip',
        color: 'text-success',
        bgColor: 'bg-success/10'
    },
    {
        id: 'stepup-sip',
        title: 'Step-up SIP',
        description: 'SIP with yearly increment for higher returns',
        icon: ArrowUp,
        path: 'sip',
        color: 'text-success',
        bgColor: 'bg-success/10'
    },
    {
        id: 'swp',
        title: 'SWP Calculator',
        description: 'Plan systematic withdrawals from your corpus',
        icon: Wallet,
        path: 'swp',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10'
    },
    {
        id: 'cagr',
        title: 'CAGR Calculator',
        description: 'Calculate Compound Annual Growth Rate',
        icon: BarChart3,
        path: 'cagr',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10'
    },
    {
        id: 'mf',
        title: 'MF Returns',
        description: 'Analyze mutual fund returns and performance',
        icon: Percent,
        path: 'mf',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10'
    },
    {
        id: 'inflation',
        title: 'Inflation Calculator',
        description: 'Understand future value adjusted for inflation',
        icon: TrendingUp,
        path: 'inflation',
        color: 'text-info',
        bgColor: 'bg-info/10'
    },
    {
        id: 'retirement',
        title: 'Retirement Calculator',
        description: 'Plan your retirement corpus requirement',
        icon: Clock,
        path: 'retirement',
        color: 'text-info',
        bgColor: 'bg-info/10'
    },
    {
        id: 'salary',
        title: 'Salary Calculator',
        description: 'Convert CTC to in-hand salary with tax breakdown',
        icon: FileSpreadsheet,
        path: 'salary',
        color: 'text-info',
        bgColor: 'bg-info/10'
    },
    {
        id: 'fd',
        title: 'FD Calculator',
        description: 'Calculate Fixed Deposit maturity and interest',
        icon: Landmark,
        path: 'fd',
        color: 'text-info',
        bgColor: 'bg-info/10'
    },
    {
        id: 'financial-health',
        title: 'Financial Health',
        description: 'Assess your financial wellness score',
        icon: Activity,
        path: 'financial-health',
        color: 'text-success',
        bgColor: 'bg-success/10'
    },
    {
        id: 'portfolio',
        title: 'Portfolio Analyzer',
        description: 'Analyze your investment allocation',
        icon: PiggyBank,
        path: 'portfolio',
        color: 'text-primary',
        bgColor: 'bg-primary/10'
    },
    {
        id: 'partnership',
        title: 'Partnership Calculator',
        description: 'Calculate interest on capital & partner remuneration (40b)',
        icon: Landmark,
        path: 'partnership',
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-50/50',
        badge: 'New'
    }
];

// Dashboard-specific calculators page - flat grid, no categories
export default function DashboardCalculators({ basePath = '/calculators' }) {
    return (
        <div className="p-6">
            {/* Header */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                    <Calculator className="w-3 h-3 mr-1" />
                    Financial Tools
                </Badge>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    Financial <span className="text-primary">Calculators</span>
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Comprehensive suite of financial planning tools to help you make informed decisions
                </p>
            </motion.div>

            {/* Flat Grid of All Calculators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allCalculators.map((calc, index) => {
                    const Icon = calc.icon;

                    return (
                        <motion.div
                            key={calc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <Link to={`${basePath}/${calc.path}`}>
                                <Card className="h-full border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer bg-card">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-12 h-12 rounded-xl ${calc.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <Icon className={`w-6 h-6 ${calc.color}`} />
                                            </div>
                                            {calc.badge && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {calc.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                            {calc.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {calc.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
