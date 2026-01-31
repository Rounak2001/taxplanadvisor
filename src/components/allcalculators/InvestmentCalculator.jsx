import React, { useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { jsPDF } from 'jspdf';
import {
    TrendingUp,
    PieChart,
    ArrowUp,
    ArrowDown,
    AlertCircle,
    CheckCircle,
    Briefcase,
    Building2,
    Coins,
    Banknote,
    Wallet,
    Download,
    Info
} from 'lucide-react';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Ideal allocation based on general investment principles
const IDEAL_ALLOCATION = {
    equity: 50,
    debt: 27.5,
    gold: 7.5,
    reit: 7.5,
    cash: 5,
};

const IDEAL_RANGES = {
    equity: { min: 40, max: 60, label: '40-60%' },
    debt: { min: 20, max: 35, label: '20-35%' },
    gold: { min: 5, max: 10, label: '5-10%' },
    reit: { min: 5, max: 10, label: '5-10%' },
    cash: { min: 5, max: 5, label: '5%' },
};

const ASSET_INFO = {
    equity: { label: 'Equities (Stocks/Mutual Funds)', icon: TrendingUp, color: '#6366f1', purpose: 'Growth & beating inflation' },
    debt: { label: 'Debt (Bonds/FD/PF)', icon: Banknote, color: '#ec4899', purpose: 'Stability & income' },
    gold: { label: 'Gold/Precious Metals', icon: Coins, color: '#f59e0b', purpose: 'Hedge against inflation & crisis' },
    reit: { label: 'Real Estate/REITs', icon: Building2, color: '#14b8a6', purpose: 'Long-term wealth & income' },
    cash: { label: 'Cash & Cash Equivalents', icon: Wallet, color: '#8b5cf6', purpose: 'Liquidity for emergencies' },
};

const InvestmentCalculator = ({ isDashboard = false, backPath }) => {
    const [investments, setInvestments] = useState({
        equity: '',
        debt: '',
        gold: '',
        reit: '',
        cash: '',
    });
    const [showResults, setShowResults] = useState(false);

    const handleInvestmentChange = (key, value) => {
        setInvestments(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const calculateResults = () => {
        setShowResults(true);
    };

    const resetCalculator = () => {
        setInvestments({
            equity: '',
            debt: '',
            gold: '',
            reit: '',
            cash: '',
        });
        setShowResults(false);
    };

    // Calculate total portfolio from sum of all investments
    const totalPortfolio = useMemo(() => {
        return Object.values(investments).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    }, [investments]);

    // Calculate user's allocation percentages
    const userAllocations = useMemo(() => {
        if (totalPortfolio === 0) return { equity: 0, debt: 0, gold: 0, reit: 0, cash: 0 };

        return {
            equity: ((parseFloat(investments.equity) || 0) / totalPortfolio) * 100,
            debt: ((parseFloat(investments.debt) || 0) / totalPortfolio) * 100,
            gold: ((parseFloat(investments.gold) || 0) / totalPortfolio) * 100,
            reit: ((parseFloat(investments.reit) || 0) / totalPortfolio) * 100,
            cash: ((parseFloat(investments.cash) || 0) / totalPortfolio) * 100,
        };
    }, [totalPortfolio, investments]);

    // Determine risk type based on user's equity allocation
    const determineRiskType = useMemo(() => {
        const equityPercent = userAllocations.equity;

        if (equityPercent >= 55) return 'aggressive';
        if (equityPercent >= 40) return 'moderate';
        return 'conservative';
    }, [userAllocations]);

    const getRiskLabel = () => {
        const labels = {
            conservative: { text: 'Conservative', color: '#10b981', emoji: '🛡️' },
            moderate: { text: 'Moderate', color: '#f59e0b', emoji: '⚖️' },
            aggressive: { text: 'Aggressive', color: '#ef4444', emoji: '🚀' },
        };
        return labels[determineRiskType];
    };

    // Calculate surplus/deficit compared to ideal allocation
    const getSurplusDeficit = useMemo(() => {
        const results = {};

        Object.keys(IDEAL_ALLOCATION).forEach(key => {
            const diff = userAllocations[key] - IDEAL_ALLOCATION[key];
            results[key] = {
                ideal: IDEAL_ALLOCATION[key],
                actual: userAllocations[key],
                difference: diff,
                status: diff > 2 ? 'surplus' : diff < -2 ? 'deficit' : 'balanced',
                amount: totalPortfolio * (diff / 100),
                range: IDEAL_RANGES[key],
            };
        });

        return results;
    }, [userAllocations, totalPortfolio]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };



    // Chart data for user's portfolio
    const userChartData = {
        labels: Object.values(ASSET_INFO).map(a => a.label.split('(')[0].trim()),
        datasets: [
            {
                data: Object.keys(ASSET_INFO).map(key => parseFloat(investments[key]) || 0),
                backgroundColor: Object.values(ASSET_INFO).map(a => a.color),
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverOffset: 10,
            },
        ],
    };

    // Chart data for ideal portfolio
    const idealChartData = {
        labels: Object.values(ASSET_INFO).map(a => a.label.split('(')[0].trim()),
        datasets: [
            {
                data: Object.values(IDEAL_ALLOCATION),
                backgroundColor: Object.values(ASSET_INFO).map(a => a.color),
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverOffset: 10,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 0.65,
        layout: {
            padding: {
                top: 80,
                bottom: 80,
                left: 80,
                right: 80,
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        family: 'system-ui',
                        size: 12,
                        weight: '500',
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: {
                    family: 'system-ui',
                    size: 14,
                    weight: '600',
                },
                bodyFont: {
                    family: 'system-ui',
                    size: 13,
                },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `₹${value.toLocaleString()} (${percentage}%)`;
                    },
                },
            },
            datalabels: {
                color: function (context) {
                    // Use the segment color for better contrast
                    return context.dataset.backgroundColor[context.dataIndex];
                },
                font: {
                    family: 'system-ui',
                    size: 12,
                    weight: '700',
                },
                formatter: (value, context) => {
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    if (total === 0 || value === 0) return '';
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${percentage}%`;
                },
                anchor: 'end',
                align: 'end',
                offset: 10,
                clip: false,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: function (context) {
                    return context.dataset.backgroundColor[context.dataIndex];
                },
                padding: {
                    top: 4,
                    bottom: 4,
                    left: 6,
                    right: 6,
                },
            },
        },
    };

    const idealChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 0.65,
        layout: {
            padding: {
                top: 80,
                bottom: 80,
                left: 80,
                right: 80,
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        family: 'system-ui',
                        size: 12,
                        weight: '500',
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: {
                    family: 'system-ui',
                    size: 14,
                    weight: '600',
                },
                bodyFont: {
                    family: 'system-ui',
                    size: 13,
                },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        return `${context.parsed}%`;
                    },
                },
            },
            datalabels: {
                color: function (context) {
                    // Use the segment color for better contrast
                    return context.dataset.backgroundColor[context.dataIndex];
                },
                font: {
                    family: 'system-ui',
                    size: 12,
                    weight: '700',
                },
                formatter: (value) => {
                    return value > 0 ? `${value}%` : '';
                },
                anchor: 'end',
                align: 'end',
                offset: 10,
                clip: false,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: function (context) {
                    return context.dataset.backgroundColor[context.dataIndex];
                },
                padding: {
                    top: 4,
                    bottom: 4,
                    left: 6,
                    right: 6,
                },
            },
        },
    };

    const isPortfolioValid = totalPortfolio > 0;

    return (
        <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
                            <PieChart className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Wealth Portfolio Analyzer</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Analyze your portfolio allocation, discover your risk profile, and get personalized recommendations
                    </p>
                </div>

                {/* Info Card */}
                <div className="glass-card shadow-card rounded-2xl p-6 mb-6">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <div className="flex items-start">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Portfolio Allocation Guide:</p>
                                <ul className="space-y-1">
                                    <li>• <strong>Equity:</strong> {IDEAL_RANGES.equity.label} - Growth & wealth creation</li>
                                    <li>• <strong>Debt:</strong> {IDEAL_RANGES.debt.label} - Stability & regular income</li>
                                    <li>• <strong>Gold:</strong> {IDEAL_RANGES.gold.label} - Inflation hedge</li>
                                    <li>• <strong>Real Estate:</strong> {IDEAL_RANGES.reit.label} - Long-term appreciation</li>
                                    <li>• <strong>Cash:</strong> {IDEAL_RANGES.cash.label} - Emergency liquidity</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input Sections */}
                <div className="space-y-6 mb-6">
                    {Object.entries(ASSET_INFO).map(([key, info]) => {
                        const Icon = info.icon;
                        return (
                            <div key={key} className="glass-card shadow-card rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: info.color + '20' }}>
                                        <Icon className="w-5 h-5" style={{ color: info.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-foreground">{info.label}</h3>
                                        <p className="text-sm text-muted-foreground">{info.purpose}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Amount (₹)</label>
                                        <input
                                            type="number"
                                            value={investments[key]}
                                            onChange={(e) => handleInvestmentChange(key, e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        />
                                    </div>
                                    {totalPortfolio > 0 && investments[key] && (
                                        <div className="flex items-end">
                                            <div className="w-full px-4 py-3 rounded-lg" style={{ backgroundColor: info.color + '20' }}>
                                                <span className="text-sm font-semibold" style={{ color: info.color }}>
                                                    {((parseFloat(investments[key]) / totalPortfolio) * 100).toFixed(1)}% of portfolio
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Portfolio Summary */}
                {totalPortfolio > 0 && (
                    <div className="glass-card shadow-card rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-primary" />
                            <div>
                                <span className="block text-sm text-muted-foreground">Total Portfolio Value</span>
                                <span className="block text-3xl font-bold text-foreground">{formatCurrency(totalPortfolio)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={calculateResults}
                        disabled={!isPortfolioValid}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Analyze My Portfolio
                    </button>
                    {showResults && (
                        <button
                            onClick={resetCalculator}
                            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Results Section */}
                {showResults && isPortfolioValid && (
                    <>
                        {/* Risk Profile */}
                        <div className="glass-card shadow-elevated rounded-2xl p-8 mb-6">
                            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground mb-2">Your Risk Profile</h2>
                                    <div className="flex items-center gap-3">
                                        <div className="px-6 py-3 rounded-lg font-bold text-white text-xl" style={{ backgroundColor: getRiskLabel().color }}>
                                            <span className="mr-2">{getRiskLabel().emoji}</span>
                                            {getRiskLabel().text} Investor
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-3">
                                        Based on your equity allocation of {userAllocations.equity.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="glass-card shadow-card rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-foreground mb-4 text-center">Your Current Portfolio</h3>
                                <div className="chart-box">
                                    <Pie data={userChartData} options={chartOptions} />
                                </div>
                            </div>
                            <div className="glass-card shadow-card rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-foreground mb-4 text-center">Ideal Portfolio</h3>
                                <div className="chart-box">
                                    <Pie data={idealChartData} options={idealChartOptions} />
                                </div>
                            </div>
                        </div>

                        {/* Analysis Section */}
                        <div className="glass-card shadow-elevated rounded-2xl p-8 mb-6">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Portfolio Analysis & Recommendations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(getSurplusDeficit).map(([key, data]) => {
                                    const info = ASSET_INFO[key];
                                    const Icon = info.icon;
                                    return (
                                        <div key={key} className="border-2 rounded-xl p-6" style={{
                                            borderColor: data.status === 'balanced' ? '#10b981' : data.status === 'surplus' ? '#f59e0b' : '#ef4444',
                                            backgroundColor: data.status === 'balanced' ? '#f0fdf4' : data.status === 'surplus' ? '#fffbeb' : '#fef2f2'
                                        }}>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Icon className="w-5 h-5" style={{ color: info.color }} />
                                                <h4 className="font-bold text-gray-800">{info.label.split('(')[0].trim()}</h4>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-800 font-medium">Your Allocation:</span>
                                                    <span className="font-bold text-gray-900">{data.actual.toFixed(1)}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-800 font-medium">Ideal Allocation:</span>
                                                    <span className="font-bold text-gray-900">{data.ideal}%</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                                                    <span className="text-gray-800 font-medium">Difference:</span>
                                                    <span className="font-bold flex items-center gap-1 text-gray-900">
                                                        {data.difference > 0 ? '+' : ''}{data.difference.toFixed(1)}%
                                                        {data.status === 'surplus' && <ArrowUp size={16} className="text-orange-600" />}
                                                        {data.status === 'deficit' && <ArrowDown size={16} className="text-red-600" />}
                                                        {data.status === 'balanced' && <CheckCircle size={16} className="text-green-600" />}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t">
                                                {data.status === 'surplus' && (
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-xs text-orange-800">
                                                            Over-invested by {formatCurrency(Math.abs(data.amount))}
                                                        </span>
                                                    </div>
                                                )}
                                                {data.status === 'deficit' && (
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-xs text-red-800">
                                                            Under-invested by {formatCurrency(Math.abs(data.amount))}
                                                        </span>
                                                    </div>
                                                )}
                                                {data.status === 'balanced' && (
                                                    <div className="flex items-start gap-2">
                                                        <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-xs text-green-800">
                                                            Well balanced allocation
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="glass-card shadow-card rounded-2xl p-6 mb-6">
                            <h3 className="text-xl font-bold text-foreground mb-4">📌 Key Recommendations</h3>
                            <ul className="space-y-3">
                                {Object.entries(getSurplusDeficit).map(([key, data]) => {
                                    if (data.status === 'balanced') return null;
                                    const info = ASSET_INFO[key];
                                    return (
                                        <li key={key} className="flex items-start gap-3 p-4 rounded-lg" style={{
                                            backgroundColor: data.status === 'surplus' ? '#fffbeb' : '#fef2f2'
                                        }}>
                                            <span className="text-2xl">{data.status === 'surplus' ? '⬇️' : '⬆️'}</span>
                                            <span className="text-sm text-gray-700">
                                                {data.status === 'surplus' ? 'Consider reducing' : 'Consider increasing'}{' '}
                                                <strong>{info.label.split('(')[0].trim()}</strong> by{' '}
                                                <span className="font-bold" style={{ color: info.color }}>
                                                    {formatCurrency(Math.abs(data.amount))} ({Math.abs(data.difference).toFixed(1)}%)
                                                </span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Disclaimer */}
                        <div className="glass-card shadow-card border-l-4 border-accent p-6 rounded-lg">
                            <div className="flex items-start">
                                <AlertCircle className="w-6 h-6 text-accent mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="text-lg font-semibold text-foreground mb-2">📌 Important Disclaimer</h4>
                                    <p className="text-sm text-muted-foreground">
                                        This analysis is based on general investment principles and your stated portfolio.
                                        Actual investment decisions should consider your age, financial goals, risk tolerance,
                                        tax situation, and other personal factors. Please consult a certified financial advisor
                                        before making any investment decisions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </CalculatorLayout>
    );
};

export default InvestmentCalculator;