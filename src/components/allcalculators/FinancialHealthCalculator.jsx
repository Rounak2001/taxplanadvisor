import React, { useState } from 'react';
import {
    TrendingUp,
    Wallet,
    Shield,
    PiggyBank,
    CreditCard,
    LineChart,
    Calculator,
    AlertCircle,
    Info,
    CheckCircle
} from 'lucide-react';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';

const FinancialHealthCalculator = ({ isDashboard = false, backPath }) => {
    const [formData, setFormData] = useState({
        monthlyIncome: '',
        incomeSource: 'Salaried',
        incomeStability: 5,
        monthlyExpenses: '',
        emergencyFund: '',
        monthlyEMIs: '',
        investments: {
            fd: false,
            mf: false,
            shares: false,
            pf: false,
            ppf: false,
            others: false,
        },
        regularInvestments: 'No',
        healthInsurance: 'No',
        lifeInsurance: 'No',
    });

    const [scores, setScores] = useState({
        incomeStability: 0,
        expenseManagement: 0,
        emergencyFund: 0,
        debtManagement: 0,
        investments: 0,
        insurance: 0,
    });

    const [showResults, setShowResults] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('investment-')) {
            const investmentKey = name.replace('investment-', '');
            setFormData({
                ...formData,
                investments: {
                    ...formData.investments,
                    [investmentKey]: checked,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const calculateScores = () => {
        const income = parseFloat(formData.monthlyIncome) || 0;
        const expenses = parseFloat(formData.monthlyExpenses) || 0;
        const emergencyFund = parseFloat(formData.emergencyFund) || 0;
        const emis = parseFloat(formData.monthlyEMIs) || 0;

        const newScores = { ...scores };

        // 1. Income Stability Score
        newScores.incomeStability = parseInt(formData.incomeStability);

        // 2. Expense Management Score
        const savings = income - expenses;
        const savingsRatio = income > 0 ? (savings / income) * 100 : 0;

        if (savingsRatio >= 30) newScores.expenseManagement = 5;
        else if (savingsRatio >= 20) newScores.expenseManagement = 4;
        else if (savingsRatio >= 10) newScores.expenseManagement = 3;
        else if (savingsRatio >= 1) newScores.expenseManagement = 2;
        else newScores.expenseManagement = 1;

        // 3. Emergency Fund Score
        const emergencyCover = expenses > 0 ? emergencyFund / expenses : 0;

        if (emergencyCover >= 6) newScores.emergencyFund = 5;
        else if (emergencyCover >= 4) newScores.emergencyFund = 4;
        else if (emergencyCover >= 3) newScores.emergencyFund = 3;
        else if (emergencyCover >= 1) newScores.emergencyFund = 2;
        else newScores.emergencyFund = 1;

        // 4. Debt Management Score
        const debtRatio = income > 0 ? (emis / income) * 100 : 0;

        if (debtRatio <= 20) newScores.debtManagement = 5;
        else if (debtRatio <= 30) newScores.debtManagement = 4;
        else if (debtRatio <= 40) newScores.debtManagement = 3;
        else if (debtRatio <= 50) newScores.debtManagement = 2;
        else newScores.debtManagement = 1;

        // 5. Investment Score
        const activeInvestments = Object.values(formData.investments).filter(Boolean).length;
        const isRegular = formData.regularInvestments === 'Yes';

        if (activeInvestments >= 3 && isRegular) newScores.investments = 5;
        else if (activeInvestments >= 2 && isRegular) newScores.investments = 4;
        else if (activeInvestments >= 1) newScores.investments = 3;
        else if (formData.investments.fd) newScores.investments = 2;
        else newScores.investments = 1;

        // 6. Insurance Score
        const hasHealth = formData.healthInsurance === 'Yes';
        const hasLife = formData.lifeInsurance === 'Yes';

        if (hasHealth && hasLife) newScores.insurance = 5;
        else if (hasHealth || hasLife) newScores.insurance = 3;
        else newScores.insurance = 1;

        setScores(newScores);
        setShowResults(true);
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const getHealthStatus = () => {
        if (totalScore >= 26) return { label: 'Excellent', color: '#10b981', emoji: '🟢' };
        if (totalScore >= 21) return { label: 'Good', color: '#f59e0b', emoji: '🟡' };
        if (totalScore >= 15) return { label: 'Average', color: '#f97316', emoji: '🟠' };
        return { label: 'Needs Attention', color: '#ef4444', emoji: '🔴' };
    };

    const getInterpretation = () => {
        if (totalScore >= 26) return 'Excellent Financial Health';
        if (totalScore >= 21) return 'Good, scope for optimization';
        if (totalScore >= 15) return 'Average, needs improvement';
        return 'Financial stress zone';
    };

    const resetCalculator = () => {
        setFormData({
            monthlyIncome: '',
            incomeSource: 'Salaried',
            incomeStability: 5,
            monthlyExpenses: '',
            emergencyFund: '',
            monthlyEMIs: '',
            investments: {
                fd: false,
                mf: false,
                shares: false,
                pf: false,
                ppf: false,
                others: false,
            },
            regularInvestments: 'No',
            healthInsurance: 'No',
            lifeInsurance: 'No',
        });
        setScores({
            incomeStability: 0,
            expenseManagement: 0,
            emergencyFund: 0,
            debtManagement: 0,
            investments: 0,
            insurance: 0,
        });
        setShowResults(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const SCORE_ITEMS = [
        { key: 'incomeStability', label: 'Income Stability', icon: TrendingUp },
        { key: 'expenseManagement', label: 'Expense Management', icon: Wallet },
        { key: 'emergencyFund', label: 'Emergency Fund', icon: Shield },
        { key: 'debtManagement', label: 'Debt Management', icon: CreditCard },
        { key: 'investments', label: 'Investments', icon: LineChart },
        { key: 'insurance', label: 'Insurance Protection', icon: PiggyBank },
    ];

    return (
        <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
                            <Calculator className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Financial Health Calculator</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Assess your overall financial wellness with our comprehensive 6-point evaluation
                    </p>
                </div>

                {/* Info Card */}
                <div className="glass-card shadow-card rounded-2xl p-6 mb-6">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <div className="flex items-start">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">What We Evaluate:</p>
                                <ul className="space-y-1">
                                    <li>• Income stability and reliability</li>
                                    <li>• Savings rate and expense management</li>
                                    <li>• Emergency fund adequacy</li>
                                    <li>• Debt-to-income ratio</li>
                                    <li>• Investment diversification</li>
                                    <li>• Insurance coverage</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 1: Income Stability */}
                <div className="glass-card shadow-card rounded-2xl p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Income Stability</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Net Income (₹)</label>
                            <input
                                type="number"
                                name="monthlyIncome"
                                value={formData.monthlyIncome}
                                onChange={handleChange}
                                placeholder="Enter your monthly income"
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Income Source</label>
                            <select
                                name="incomeSource"
                                value={formData.incomeSource}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            >
                                <option value="Salaried">Salaried</option>
                                <option value="Business">Business</option>
                                <option value="Mixed">Mixed</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Income Stability (1-5)</label>
                        <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, incomeStability: rating })}
                                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${formData.incomeStability === rating
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {rating}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            5 = Very stable (fixed salary) | 3 = Variable but consistent | 1 = Highly irregular
                        </p>
                    </div>
                </div>

                {/* Section 2: Expense Management */}
                <div className="glass-card shadow-card rounded-2xl p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Expense Management (Excluding EMIs)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Expenses (₹)</label>
                            <input
                                type="number"
                                name="monthlyExpenses"
                                value={formData.monthlyExpenses}
                                onChange={handleChange}
                                placeholder="Enter your monthly expenses"
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>

                        {formData.monthlyIncome && formData.monthlyExpenses && (
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Monthly Savings:</span>
                                        <span className="font-semibold text-green-700">
                                            {formatCurrency(parseFloat(formData.monthlyIncome) - parseFloat(formData.monthlyExpenses))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Savings Ratio:</span>
                                        <span className="font-semibold text-green-700">
                                            {(((parseFloat(formData.monthlyIncome) - parseFloat(formData.monthlyExpenses)) / parseFloat(formData.monthlyIncome)) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 3: Emergency Fund */}
                <div className="glass-card shadow-card rounded-2xl p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Emergency Fund</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Fund Available (₹)</label>
                            <input
                                type="number"
                                name="emergencyFund"
                                value={formData.emergencyFund}
                                onChange={handleChange}
                                placeholder="Enter your emergency fund amount"
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>

                        {formData.emergencyFund && formData.monthlyExpenses && (
                            <div className="bg-orange-50 rounded-lg p-4 flex items-center">
                                <div>
                                    <span className="text-sm text-gray-600 block">Emergency Cover:</span>
                                    <span className="text-2xl font-bold text-orange-700">
                                        {(parseFloat(formData.emergencyFund) / parseFloat(formData.monthlyExpenses)).toFixed(1)} months
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 4: Debt Management */}
                <div className="glass-card shadow-card rounded-2xl p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Debt Management</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Monthly EMIs (₹)</label>
                            <input
                                type="number"
                                name="monthlyEMIs"
                                value={formData.monthlyEMIs}
                                onChange={handleChange}
                                placeholder="Enter total monthly EMI payments"
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>

                        {formData.monthlyEMIs && formData.monthlyIncome && (
                            <div className="bg-purple-50 rounded-lg p-4 flex items-center">
                                <div>
                                    <span className="text-sm text-gray-600 block">Debt-to-Income Ratio:</span>
                                    <span className="text-2xl font-bold text-purple-700">
                                        {((parseFloat(formData.monthlyEMIs) / parseFloat(formData.monthlyIncome)) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 5: Investments */}
                <div className="glass-card shadow-card rounded-2xl p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                            <LineChart className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Investment & Wealth Building</h2>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Active Investments</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                { key: 'fd', label: 'Fixed Deposit' },
                                { key: 'mf', label: 'Mutual Funds' },
                                { key: 'shares', label: 'Shares/Stocks' },
                                { key: 'pf', label: 'PF/EPF' },
                                { key: 'ppf', label: 'PPF' },
                                { key: 'others', label: 'Others' },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
                                    <input
                                        type="checkbox"
                                        name={`investment-${key}`}
                                        checked={formData.investments[key]}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Regular Monthly Investments?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="regularInvestments"
                                    value="Yes"
                                    checked={formData.regularInvestments === 'Yes'}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600"
                                />
                                <span className="text-sm font-medium text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="regularInvestments"
                                    value="No"
                                    checked={formData.regularInvestments === 'No'}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600"
                                />
                                <span className="text-sm font-medium text-gray-700">No</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Section 6: Insurance */}
                <div className="glass-card shadow-card rounded-2xl p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                            <PiggyBank className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Insurance Protection</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Health Insurance</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="healthInsurance"
                                        value="Yes"
                                        checked={formData.healthInsurance === 'Yes'}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="healthInsurance"
                                        value="No"
                                        checked={formData.healthInsurance === 'No'}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">No</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Life Insurance</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="lifeInsurance"
                                        value="Yes"
                                        checked={formData.lifeInsurance === 'Yes'}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="lifeInsurance"
                                        value="No"
                                        checked={formData.lifeInsurance === 'No'}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">No</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={calculateScores}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                        Calculate Financial Health
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
                {showResults && (
                    <>
                        {/* Overall Score */}
                        <div className="glass-card shadow-elevated rounded-2xl p-8 mb-6">
                            <h2 className="text-2xl font-bold text-foreground text-center mb-6">Your Financial Health Score</h2>
                            <div className="flex justify-center mb-6">
                                <div className="text-center px-12 py-8 rounded-2xl" style={{ backgroundColor: getHealthStatus().color + '20' }}>
                                    <div className="text-6xl mb-2">{getHealthStatus().emoji}</div>
                                    <div className="text-5xl font-bold mb-2" style={{ color: getHealthStatus().color }}>
                                        {totalScore}<span className="text-3xl text-gray-400">/30</span>
                                    </div>
                                    <div className="text-xl font-semibold" style={{ color: getHealthStatus().color }}>
                                        {getHealthStatus().label}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2">
                                        {getInterpretation()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="glass-card shadow-card rounded-2xl p-8 mb-6">
                            <h3 className="text-xl font-bold text-foreground mb-6">Score Breakdown</h3>
                            <div className="space-y-4">
                                {SCORE_ITEMS.map(({ key, label, icon: Icon }) => (
                                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Icon size={20} className="text-gray-600" />
                                                <span className="font-semibold text-gray-700">{label}</span>
                                            </div>
                                            <span className="text-lg font-bold text-gray-800">
                                                {scores[key]}/5
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="h-3 rounded-full transition-all"
                                                style={{
                                                    width: `${(scores[key] / 5) * 100}%`,
                                                    backgroundColor: scores[key] >= 4 ? '#10b981' : scores[key] >= 3 ? '#f59e0b' : '#ef4444'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Advisory */}
                        <div className="glass-card shadow-card border-l-4 border-accent p-6 rounded-lg">
                            <div className="flex items-start">
                                <AlertCircle className="w-6 h-6 text-accent mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="text-lg font-semibold text-foreground mb-2">📌 Advisory Note</h4>
                                    <p className="text-sm text-muted-foreground">
                                        This calculator provides an indicative overview of your financial health.
                                        Detailed financial planning should consider tax efficiency, risk profile, age,
                                        life goals, and other personal circumstances. Consult a certified financial
                                        advisor for personalized recommendations.
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

export default FinancialHealthCalculator;