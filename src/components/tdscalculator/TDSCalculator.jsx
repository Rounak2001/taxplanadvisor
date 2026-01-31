import { useState, useEffect } from "react";
import {
    Calculator,
    Building2,
    User,
    FileText,
    ArrowRight,
    ArrowLeft,
    Download,
    CreditCard,
    CheckCircle,
    AlertCircle,
    Search,
    Plus,
    X,
    Edit3,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { tdsApi } from "@/api/tdsService";

// PAN category mapping
const PAN_CATEGORY_MAP = {
    'P': 'Individual / HUF',
    'H': 'Individual / HUF',
    'C': 'Company / Firm / Co-operative Society / Local Authority',
    'F': 'Company / Firm / Co-operative Society / Local Authority',
    'G': 'Company / Firm / Co-operative Society / Local Authority',
    'L': 'Company / Firm / Co-operative Society / Local Authority',
    'J': 'Company / Firm / Co-operative Society / Local Authority',
    'A': 'Company / Firm / Co-operative Society / Local Authority',
    'B': 'Company / Firm / Co-operative Society / Local Authority',
    'T': 'Company / Firm / Co-operative Society / Local Authority',
};

const PAN_TYPE_LABELS = {
    'P': 'Individual',
    'H': 'HUF',
    'C': 'Company',
    'F': 'Firm',
    'G': 'Government',
    'L': 'Local Authority',
    'J': 'Artificial Judicial Person',
    'A': 'Association of Persons',
    'B': 'Body of Individuals',
    'T': 'Trust',
};

const getDefaultTransaction = () => ({
    deductee_name: '',
    deductee_pan: '',
    no_pan_available: false,
    section_code: '',
    amount: 0,
    category: 'Company / Firm / Co-operative Society / Local Authority',
    pan_available: true,
    deduction_date: new Date().toISOString().split('T')[0],
    payment_date: new Date().toISOString().split('T')[0],
    threshold_type: '',
    annual_threshold_exceeded: false,
    selected_slab: '',
    selected_condition: '',
    threshold_exceeded_before: false,
});

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(amount);
};

const TDSCalculator = ({ isDashboard = false, backPath }) => {
    const [step, setStep] = useState(1);
    const [deductor, setDeductor] = useState(null);
    const [mode, setMode] = useState('single');
    const [transactions, setTransactions] = useState([getDefaultTransaction()]);
    const [currentTransactionIndex, setCurrentTransactionIndex] = useState(0);
    const [sections, setSections] = useState([]);
    const [results, setResults] = useState(null);
    const [transactionResults, setTransactionResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editTransactionIndex, setEditTransactionIndex] = useState(null);

    // Deductor form state
    const [deductorName, setDeductorName] = useState('');
    const [tanNumber, setTanNumber] = useState('');
    const [entityName, setEntityName] = useState('');

    // Transaction form state
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [panError, setPanError] = useState('');

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const data = await tdsApi.getSections();
                setSections(data);
            } catch (err) {
                setError('Failed to load TDS sections. Make sure the backend server is running.');
                console.error(err);
            }
        };
        fetchSections();
    }, []);

    // Validate TAN format
    const validateTAN = (tan) => {
        const tanRegex = /^[A-Z]{3}[A-Z][0-9]{5}[A-Z]$/;
        return tanRegex.test(tan.toUpperCase());
    };

    // Handle deductor form submit
    const handleDeductorSubmit = (e) => {
        e.preventDefault();
        if (!deductorName.trim() || !tanNumber.trim() || !entityName.trim()) {
            setError('Please fill all deductor details');
            return;
        }
        if (!validateTAN(tanNumber)) {
            setError('Invalid TAN format (e.g., ABCD12345E)');
            return;
        }
        setDeductor({
            deductor_name: deductorName.trim(),
            tan_number: tanNumber.toUpperCase().trim(),
            entity_name: entityName.trim(),
        });
        setError(null);
        setStep(2);
    };

    // Validate PAN
    const validatePAN = (pan) => {
        if (!pan) return true;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        return panRegex.test(pan.toUpperCase());
    };

    const detectCategoryFromPAN = (pan) => {
        if (!pan || pan.length < 4) return null;
        const fourthChar = pan[3].toUpperCase();
        return PAN_CATEGORY_MAP[fourthChar] || null;
    };

    const getEntityTypeLabel = (pan) => {
        if (!pan || pan.length < 4) return null;
        const fourthChar = pan[3].toUpperCase();
        return PAN_TYPE_LABELS[fourthChar] || null;
    };

    const handleModeSelect = () => {
        setTransactions([getDefaultTransaction()]);
        setTransactionResults([]);
        setCurrentTransactionIndex(0);
        setStep(3);
    };

    const handleTransactionChange = (field, value) => {
        const updated = [...transactions];
        updated[currentTransactionIndex] = {
            ...updated[currentTransactionIndex],
            [field]: value
        };
        setTransactions(updated);

        if (transactionResults[currentTransactionIndex]) {
            const newResults = [...transactionResults];
            newResults[currentTransactionIndex] = null;
            setTransactionResults(newResults);
        }
    };

    const handlePANChange = (value) => {
        const upperValue = value.toUpperCase();
        setPanError('');

        if (upperValue.length === 10) {
            if (!validatePAN(upperValue)) {
                setPanError('Invalid PAN format');
            } else {
                const detectedCategory = detectCategoryFromPAN(upperValue);
                if (detectedCategory) {
                    const updated = [...transactions];
                    updated[currentTransactionIndex] = {
                        ...updated[currentTransactionIndex],
                        deductee_pan: upperValue,
                        category: detectedCategory,
                        pan_available: true,
                        no_pan_available: false,
                    };
                    setTransactions(updated);
                    return;
                }
            }
        }

        // Combine both updates into a single state update to prevent race conditions
        const updated = [...transactions];
        updated[currentTransactionIndex] = {
            ...updated[currentTransactionIndex],
            deductee_pan: upperValue,
            pan_available: upperValue.length === 10 && validatePAN(upperValue),
        };
        setTransactions(updated);
    };

    const handleNoPANChange = (checked) => {
        const updated = [...transactions];
        updated[currentTransactionIndex] = {
            ...updated[currentTransactionIndex],
            no_pan_available: checked,
            deductee_pan: checked ? '' : transactions[currentTransactionIndex].deductee_pan,
            pan_available: !checked,
        };
        setTransactions(updated);
        if (checked) setPanError('');
    };

    const handleSectionSelect = (section) => {
        const updated = [...transactions];
        updated[currentTransactionIndex] = {
            ...updated[currentTransactionIndex],
            section_code: section.section,
            threshold_type: section.has_threshold_types ? section.threshold_types[0]?.type : '',
            selected_slab: section.has_slabs ? section.slabs[0]?.description : '',
            selected_condition: section.has_conditions ? section.conditions[0]?.condition : '',
        };
        setTransactions(updated);
        setSearchQuery(section.display_name);
        setShowDropdown(false);
    };

    const filteredSections = sections.filter(s =>
        s.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentTransaction = transactions[currentTransactionIndex];
    const selectedSection = sections.find(s => s.section === currentTransaction?.section_code);

    const validateCurrentTransaction = () => {
        const txn = transactions[currentTransactionIndex];
        if (!txn.deductee_name?.trim()) {
            setError('Please enter deductee name');
            return false;
        }
        if (!txn.no_pan_available && !txn.deductee_pan?.trim()) {
            setError('Please enter deductee PAN or select "No PAN Available"');
            return false;
        }
        if (!txn.no_pan_available && txn.deductee_pan?.trim().length !== 10) {
            setError('PAN must be exactly 10 characters');
            return false;
        }
        if (!txn.section_code) {
            setError('Please select a TDS section');
            return false;
        }
        if (txn.amount <= 0) {
            setError('Please enter a valid amount');
            return false;
        }
        if (!txn.deduction_date || !txn.payment_date) {
            setError('Please enter valid dates');
            return false;
        }
        return true;
    };

    const handleCalculateCurrent = async () => {
        setError(null);
        if (!validateCurrentTransaction()) return;

        setLoading(true);
        try {
            const currentTxn = transactions[currentTransactionIndex];
            const response = await tdsApi.calculateTDS(deductor, [currentTxn]);
            const result = response.results[0];

            const newResults = [...transactionResults];
            newResults[currentTransactionIndex] = result;
            setTransactionResults(newResults);
        } catch (err) {
            setError('Failed to calculate TDS. Please check your inputs and try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTransaction = () => {
        setError(null);
        if (!validateCurrentTransaction()) return;

        if (!transactionResults[currentTransactionIndex]) {
            handleCalculateCurrent();
        }

        const newTransactions = [...transactions, getDefaultTransaction()];
        setTransactions(newTransactions);
        setCurrentTransactionIndex(newTransactions.length - 1);
        setSearchQuery('');
    };

    const handleCalculate = async () => {
        setError(null);

        for (let i = 0; i < transactions.length; i++) {
            const txn = transactions[i];
            if (!txn.deductee_name?.trim() || !txn.section_code || txn.amount <= 0) {
                setError(`Transaction ${i + 1}: Please complete all required fields`);
                return;
            }
            // Validate PAN: must be exactly 10 characters if "No PAN Available" is not checked
            if (!txn.no_pan_available && (!txn.deductee_pan?.trim() || txn.deductee_pan.trim().length !== 10)) {
                setError(`Transaction ${i + 1}: PAN must be exactly 10 characters or select "No PAN Available"`);
                return;
            }
        }

        setLoading(true);
        try {
            const response = await tdsApi.calculateTDS(deductor, transactions);
            setResults(response.results);
            setTransactionResults(response.results);
            setEditMode(false);
            setEditTransactionIndex(null);
            setStep(4);
        } catch (err) {
            setError('Failed to calculate TDS. Please check your inputs and try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadExcel = async () => {
        setLoading(true);
        try {
            await tdsApi.downloadExcel(deductor, results);
        } catch (err) {
            setError('Failed to download Excel. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (transactionIdx) => {
        setEditMode(true);
        setEditTransactionIndex(transactionIdx);
        setCurrentTransactionIndex(transactionIdx);
        const section = sections.find(s => s.section === transactions[transactionIdx].section_code);
        if (section) setSearchQuery(section.display_name);
        setStep(3);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditTransactionIndex(null);
        setStep(4);
    };

    const handleSaveEdit = async () => {
        setError(null);
        if (!validateCurrentTransaction()) return;

        setLoading(true);
        try {
            const response = await tdsApi.calculateTDS(deductor, transactions);
            setResults(response.results);
            setTransactionResults(response.results);
            setEditMode(false);
            setEditTransactionIndex(null);
            setStep(4);
        } catch (err) {
            setError('Failed to recalculate TDS. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setResults(null);
        setTransactions([getDefaultTransaction()]);
        setTransactionResults([]);
        setCurrentTransactionIndex(0);
        setStep(1);
        setDeductor(null);
        setDeductorName('');
        setTanNumber('');
        setEntityName('');
        setMode('single');
        setEditMode(false);
        setEditTransactionIndex(null);
        setSearchQuery('');
    };

    const detectedEntityType = getEntityTypeLabel(currentTransaction?.deductee_pan);

    return (
        <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
                            <Calculator className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">TDS Calculator</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">Financial Year 2025-2026 | Non-Salary Payments</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                        <span className="text-destructive flex-1">{error}</span>
                        <button onClick={() => setError(null)} className="text-destructive hover:text-destructive/80">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Step 1: Deductor Form */}
                {step === 1 && (
                    <div className="glass-card shadow-card rounded-2xl p-8 max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Deductor Details</h2>
                            <p className="text-muted-foreground mt-2">Enter the details of the deductor for TDS deduction</p>
                        </div>

                        <form onSubmit={handleDeductorSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    <Building2 className="w-4 h-4 inline mr-2" />
                                    Deductor Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={deductorName}
                                    onChange={(e) => setDeductorName(e.target.value)}
                                    placeholder="Enter deductor name"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    TAN Number <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tanNumber}
                                    onChange={(e) => setTanNumber(e.target.value.toUpperCase())}
                                    placeholder="e.g., ABCD12345E"
                                    maxLength={10}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                                />

                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    <Building2 className="w-4 h-4 inline mr-2" />
                                    Entity Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={entityName}
                                    onChange={(e) => setEntityName(e.target.value)}
                                    placeholder="Enter entity name (used for Excel filename)"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 rounded-xl font-bold text-lg shadow-elevated hover:shadow-glow transform hover:-translate-y-0.5 transition-all"
                            >
                                Continue <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </form>
                    </div>
                )}

                {/* Step 2: Report Mode Selection */}
                {step === 2 && (
                    <div className="glass-card shadow-card rounded-2xl p-8 max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Report Mode</h2>
                            <p className="text-muted-foreground mt-2">Choose how many transactions you want to calculate</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <button
                                onClick={() => setMode('single')}
                                className={`w-full p-6 rounded-xl border-2 transition-all text-left ${mode === 'single'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${mode === 'single' ? 'border-primary bg-primary' : 'border-muted-foreground'
                                        }`}>
                                        {mode === 'single' && <Check className="w-4 h-4 text-primary-foreground" />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Single Report</h3>
                                        <p className="text-sm text-muted-foreground">Calculate TDS for one transaction</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => setMode('multiple')}
                                className={`w-full p-6 rounded-xl border-2 transition-all text-left ${mode === 'multiple'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${mode === 'multiple' ? 'border-primary bg-primary' : 'border-muted-foreground'
                                        }`}>
                                        {mode === 'multiple' && <Check className="w-4 h-4 text-primary-foreground" />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Multiple Reports</h3>
                                        <p className="text-sm text-muted-foreground">Calculate TDS for multiple transactions</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                onClick={() => setStep(1)}
                                variant="outline"
                                className="flex-1 py-6 rounded-xl font-semibold"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" /> Back
                            </Button>
                            <Button
                                onClick={handleModeSelect}
                                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 rounded-xl font-semibold"
                            >
                                Continue <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Transaction Form */}
                {step === 3 && (
                    <div className="space-y-6">
                        {/* Edit Mode Header */}
                        {editMode && (
                            <div className="bg-accent/20 border border-accent/30 rounded-xl p-4 flex items-center gap-3">
                                <Edit3 className="w-5 h-5 text-accent" />
                                <span className="text-accent font-semibold">Editing Transaction {editTransactionIndex + 1}</span>
                            </div>
                        )}

                        {/* Deductor Summary */}
                        <div className="glass-card rounded-xl p-4 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-primary" />
                                <span className="text-foreground font-medium">{deductor?.deductor_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">TAN: {deductor?.tan_number}</span>
                            </div>
                        </div>

                        {/* Progress for Multiple Mode */}
                        {mode === 'multiple' && transactions.length > 1 && !editMode && (
                            <div className="glass-card rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-foreground">Transaction Progress</span>
                                    <span className="text-sm text-muted-foreground">
                                        {currentTransactionIndex + 1} of {transactions.length}
                                    </span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                                        style={{ width: `${((currentTransactionIndex + 1) / transactions.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Transaction Form */}
                        <div className="glass-card shadow-card rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                {editMode ? `Edit Transaction ${editTransactionIndex + 1}` :
                                    mode === 'single' ? 'Transaction Details' : `Transaction ${currentTransactionIndex + 1}`}
                            </h3>

                            {/* Deductee Details */}
                            <div className="space-y-6 mb-8">
                                <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    👤 Deductee Details
                                </h4>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Deductee Name <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={currentTransaction?.deductee_name || ''}
                                        onChange={(e) => handleTransactionChange('deductee_name', e.target.value)}
                                        placeholder="Enter deductee name"
                                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">
                                            Deductee PAN {!currentTransaction?.no_pan_available && <span className="text-destructive">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            value={currentTransaction?.deductee_pan || ''}
                                            onChange={(e) => handlePANChange(e.target.value)}
                                            placeholder="e.g., ABCDE1234F"
                                            maxLength={10}
                                            disabled={currentTransaction?.no_pan_available}
                                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground ${panError ? 'border-destructive' : 'border-border'
                                                } ${currentTransaction?.no_pan_available ? 'opacity-50' : ''}`}
                                        />
                                        {panError && <p className="text-xs text-destructive mt-1">{panError}</p>}
                                        {detectedEntityType && !currentTransaction?.no_pan_available && (
                                            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Detected: {detectedEntityType}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-end">
                                        <label className="flex items-center gap-3 cursor-pointer bg-secondary/50 p-3 rounded-lg border border-border hover:bg-secondary transition-all">
                                            <input
                                                type="checkbox"
                                                checked={currentTransaction?.no_pan_available || false}
                                                onChange={(e) => handleNoPANChange(e.target.checked)}
                                                className="w-5 h-5 rounded"
                                            />
                                            <span className="text-sm font-medium text-foreground">No PAN Available</span>
                                        </label>
                                    </div>
                                </div>

                                {currentTransaction?.no_pan_available && (
                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                                        <p className="text-sm text-amber-500 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Higher TDS rate (20%) will apply when PAN is not available
                                        </p>
                                    </div>
                                )}

                                {currentTransaction?.no_pan_available && (
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">
                                            Deductee Category <span className="text-destructive">*</span>
                                        </label>
                                        <select
                                            value={currentTransaction?.category}
                                            onChange={(e) => handleTransactionChange('category', e.target.value)}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground"
                                        >
                                            <option value="Company / Firm / Co-operative Society / Local Authority">
                                                Company / Firm / Co-op / LA
                                            </option>
                                            <option value="Individual / HUF">Individual / HUF</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* TDS Details */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                                    📋 TDS Details
                                </h4>

                                <div className="relative">
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        TDS Section <span className="text-destructive">*</span>
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setShowDropdown(true);
                                            }}
                                            onFocus={() => setShowDropdown(true)}
                                            placeholder="Search section (e.g., 194C, Contractor...)"
                                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                                        />
                                    </div>
                                    {showDropdown && filteredSections.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-elevated max-h-60 overflow-auto">
                                            {filteredSections.slice(0, 10).map((section) => (
                                                <div
                                                    key={section.section}
                                                    className="px-4 py-3 hover:bg-primary/10 cursor-pointer border-b border-border/50 last:border-0"
                                                    onClick={() => handleSectionSelect(section)}
                                                >
                                                    <span className="font-semibold text-primary">{section.section}</span>
                                                    <span className="text-muted-foreground ml-2 text-sm">{section.description}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedSection?.has_threshold_types && (
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">Threshold Type</label>
                                        <select
                                            value={currentTransaction?.threshold_type || ''}
                                            onChange={(e) => handleTransactionChange('threshold_type', e.target.value)}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground"
                                        >
                                            {selectedSection.threshold_types.map((t) => (
                                                <option key={t.type} value={t.type}>
                                                    {t.type} - {t.threshold_note}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {selectedSection?.has_slabs && (
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">Applicable Slab</label>
                                        <select
                                            value={currentTransaction?.selected_slab || ''}
                                            onChange={(e) => handleTransactionChange('selected_slab', e.target.value)}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground"
                                        >
                                            {selectedSection.slabs.map((s) => (
                                                <option key={s.description} value={s.description}>
                                                    {s.description} - {s.rate}%
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {selectedSection?.has_conditions && (
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">
                                            Applicable Condition <span className="text-destructive">*</span>
                                        </label>
                                        <select
                                            value={currentTransaction?.selected_condition || ''}
                                            onChange={(e) => handleTransactionChange('selected_condition', e.target.value)}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground"
                                        >
                                            {selectedSection.conditions.map((c) => (
                                                <option key={c.condition} value={c.condition}>
                                                    {c.condition} - {c.rate}%
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {selectedSection?.section === '194Q' && (
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                        <label className="block text-sm font-semibold text-foreground mb-3">
                                            Was the ₹50 Lakh threshold exceeded before this payment?
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="threshold_exceeded"
                                                    checked={!currentTransaction?.threshold_exceeded_before}
                                                    onChange={() => handleTransactionChange('threshold_exceeded_before', false)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm text-foreground">No - Calculate TDS on excess over ₹50 Lakhs</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="threshold_exceeded"
                                                    checked={currentTransaction?.threshold_exceeded_before === true}
                                                    onChange={() => handleTransactionChange('threshold_exceeded_before', true)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm text-foreground">Yes - Deduct TDS on full amount entered</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {selectedSection?.section === '194C' && selectedSection?.has_threshold_types && (
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                        <label className="block text-sm font-semibold text-foreground mb-3">
                                            Was the threshold ({currentTransaction?.threshold_type === 'Single Transaction' ? '₹30,000' : '₹1,00,000'}) crossed in a previous transaction?
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="threshold_exceeded_194c"
                                                    checked={!currentTransaction?.threshold_exceeded_before}
                                                    onChange={() => handleTransactionChange('threshold_exceeded_before', false)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm text-foreground">No - Apply threshold check (TDS only if amount exceeds threshold)</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="threshold_exceeded_194c"
                                                    checked={currentTransaction?.threshold_exceeded_before === true}
                                                    onChange={() => handleTransactionChange('threshold_exceeded_before', true)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm text-foreground">Yes - Deduct TDS on full amount (threshold already exceeded)</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">
                                        Transaction Amount (₹) <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={currentTransaction?.amount || ''}
                                        onChange={(e) => handleTransactionChange('amount', parseFloat(e.target.value) || 0)}
                                        placeholder="Enter amount"
                                        min="0"
                                        step="100"
                                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">
                                            Date of Deduction <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={currentTransaction?.deduction_date || ''}
                                            onChange={(e) => handleTransactionChange('deduction_date', e.target.value)}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">
                                            Actual Payment Date <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={currentTransaction?.payment_date || ''}
                                            onChange={(e) => handleTransactionChange('payment_date', e.target.value)}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mini Result for Multiple Mode */}
                            {mode === 'multiple' && transactionResults[currentTransactionIndex] && !editMode && (
                                <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="font-semibold text-green-500">TDS Calculated</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Rate:</span>
                                            <p className="font-semibold text-foreground">{transactionResults[currentTransactionIndex].rate_display}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">TDS Amount:</span>
                                            <p className="font-semibold text-primary">{transactionResults[currentTransactionIndex].tds_amount_formatted}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Interest:</span>
                                            <p className="font-semibold text-foreground">{transactionResults[currentTransactionIndex].interest_formatted || '₹0'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Total:</span>
                                            <p className="font-semibold text-accent">{transactionResults[currentTransactionIndex].total_payable_formatted}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-8 flex flex-wrap gap-4">
                                {editMode ? (
                                    <>
                                        <Button
                                            onClick={handleCancelEdit}
                                            variant="outline"
                                            className="flex-1 py-6 rounded-xl font-semibold"
                                        >
                                            <X className="w-5 h-5 mr-2" /> Cancel Edit
                                        </Button>
                                        <Button
                                            onClick={handleSaveEdit}
                                            disabled={loading}
                                            className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 rounded-xl font-semibold"
                                        >
                                            {loading ? 'Saving...' : <><Check className="w-5 h-5 mr-2" /> Save & Recalculate</>}
                                        </Button>
                                    </>
                                ) : mode === 'single' ? (
                                    <>
                                        <Button
                                            onClick={() => setStep(2)}
                                            variant="outline"
                                            className="flex-1 py-6 rounded-xl font-semibold"
                                        >
                                            <ArrowLeft className="w-5 h-5 mr-2" /> Back
                                        </Button>
                                        <Button
                                            onClick={handleCalculate}
                                            disabled={loading}
                                            className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 rounded-xl font-semibold"
                                        >
                                            {loading ? 'Calculating...' : <><Calculator className="w-5 h-5 mr-2" /> Calculate TDS</>}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            onClick={currentTransactionIndex === 0 ? () => setStep(2) : () => setCurrentTransactionIndex(currentTransactionIndex - 1)}
                                            variant="outline"
                                            className="py-6 rounded-xl font-semibold"
                                        >
                                            <ArrowLeft className="w-5 h-5 mr-2" /> {currentTransactionIndex === 0 ? 'Back' : 'Previous'}
                                        </Button>

                                        {!transactionResults[currentTransactionIndex] ? (
                                            <Button
                                                onClick={handleCalculateCurrent}
                                                disabled={loading}
                                                variant="secondary"
                                                className="flex-1 py-6 rounded-xl font-semibold"
                                            >
                                                {loading ? 'Calculating...' : <><Calculator className="w-5 h-5 mr-2" /> Calculate This Transaction</>}
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    onClick={handleAddTransaction}
                                                    disabled={transactions.length >= 20}
                                                    variant="secondary"
                                                    className="py-6 rounded-xl font-semibold"
                                                >
                                                    <Plus className="w-5 h-5 mr-2" /> Next Transaction
                                                </Button>
                                                <Button
                                                    onClick={handleCalculate}
                                                    disabled={loading || transactionResults.filter(Boolean).length === 0}
                                                    className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 rounded-xl font-semibold"
                                                >
                                                    {loading ? 'Completing...' : <><Check className="w-5 h-5 mr-2" /> Complete ({transactionResults.filter(Boolean).length} Reports)</>}
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Transaction Summary for Multiple Mode */}
                        {mode === 'multiple' && transactionResults.filter(Boolean).length > 0 && !editMode && (
                            <div className="glass-card rounded-xl p-6">
                                <h4 className="text-lg font-bold text-foreground mb-4">📊 Transactions Summary</h4>
                                <div className="space-y-2">
                                    {transactions.map((txn, idx) => (
                                        transactionResults[idx] && (
                                            <div
                                                key={idx}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all ${idx === currentTransactionIndex
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border hover:border-primary/50'
                                                    }`}
                                                onClick={() => setCurrentTransactionIndex(idx)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="font-medium text-foreground">{transactionResults[idx].deductee_name}</span>
                                                        <span className="text-sm text-muted-foreground">Section {txn.section_code}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm text-muted-foreground">{transactionResults[idx].amount_formatted}</span>
                                                        <span className="text-sm font-semibold text-primary">{transactionResults[idx].tds_amount_formatted}</span>
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                                    <span className="font-semibold text-foreground">Total TDS:</span>
                                    <span className="text-xl font-bold text-primary">
                                        {formatCurrency(transactionResults.filter(Boolean).reduce((sum, r) => sum + r.total_payable, 0))}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Results Display */}
                {step === 4 && results && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="glass-card shadow-card rounded-2xl p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">TDS Calculation Report</h2>
                                        <p className="text-muted-foreground">{results.length} Transaction{results.length > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div className="bg-secondary/50 rounded-lg px-3 py-2 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-foreground">{deductor?.deductor_name}</span>
                                    </div>
                                    <div className="bg-secondary/50 rounded-lg px-3 py-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-muted-foreground">TAN: {deductor?.tan_number}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                                    <p className="text-sm text-muted-foreground mb-1">Total TDS</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {formatCurrency(results.reduce((sum, r) => sum + (r.tds_amount || 0), 0))}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl p-4">
                                    <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {formatCurrency(results.reduce((sum, r) => sum + (r.interest || 0), 0))}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-4">
                                    <p className="text-sm text-muted-foreground mb-1">Grand Total</p>
                                    <p className="text-2xl font-bold gradient-text">
                                        {formatCurrency(results.reduce((sum, r) => sum + (r.total_payable || 0), 0))}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Results List */}
                        <div className="space-y-4">
                            {results.map((result, index) => (
                                <div key={index} className="glass-card rounded-xl p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <h3 className="font-bold text-foreground">{result.deductee_name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    PAN: {result.deductee_pan} | Section {result.section}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleEdit(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Edit3 className="w-4 h-4 mr-1" /> Edit
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Amount:</span>
                                            <p className="font-semibold text-foreground">{result.amount_formatted}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Rate:</span>
                                            <p className="font-semibold text-foreground">{result.rate_display}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">TDS Amount:</span>
                                            <p className="font-semibold text-primary">{result.tds_amount_formatted}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Due Date:</span>
                                            <p className="font-semibold text-foreground">{result.due_date}</p>
                                        </div>
                                    </div>

                                    {!result.above_threshold && result.effective_threshold && (
                                        <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                            <p className="text-sm text-blue-400">
                                                ℹ️ Amount below threshold ({result.effective_threshold_note}) - No TDS applicable
                                            </p>
                                        </div>
                                    )}

                                    {result.is_late && (
                                        <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                                            <p className="text-sm text-amber-500">
                                                ⚠️ Late Payment | Interest: {result.interest_formatted} ({result.months_late} months)
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                                        <span className="text-muted-foreground">Total Payable:</span>
                                        <span className="text-xl font-bold text-primary">{result.total_payable_formatted}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Download Section */}
                        <div className="glass-card rounded-xl p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Download Report</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {results.length > 1
                                                ? `Excel file with ${results.length} sheets`
                                                : 'Complete transaction details'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleDownloadExcel}
                                        disabled={loading}
                                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold"
                                    >
                                        {loading ? 'Generating...' : <><Download className="w-5 h-5 mr-2" /> Download Excel</>}
                                    </Button>
                                    <a
                                        href="https://eportal.incometax.gov.in/iec/foservices/#/e-pay-tax-prelogin/user-details"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="outline" className="px-6 py-3 rounded-xl font-semibold">
                                            <CreditCard className="w-5 h-5 mr-2" /> Pay TDS
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* New Calculation Button */}
                        <div className="text-center">
                            <Button
                                onClick={handleBack}
                                variant="outline"
                                className="px-8 py-6 rounded-xl font-semibold"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" /> New Calculation
                            </Button>
                        </div>

                        {/* Disclaimer */}
                        <div className="text-center text-sm text-muted-foreground">
                            <p>📌 <strong>Disclaimer:</strong> This calculator is for informational purposes only. Please consult a tax professional for specific advice.</p>
                            <p className="mt-1">💡 Based on TDS rates applicable for FY 2025-2026 (Non-Salary Payments)</p>
                        </div>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
};

export default TDSCalculator;
