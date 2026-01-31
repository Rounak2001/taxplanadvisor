import { useState } from 'react';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import BulkFileUpload from './BulkFileUpload';
import BulkSectionReference from './BulkSectionReference';
import BulkResultsDisplay from './BulkResultsDisplay';
import { Upload, BookOpen, Calculator } from 'lucide-react';

const BulkTDSCalculator = ({ isDashboard = false, backPath }) => {
    const [activeTab, setActiveTab] = useState('upload');
    const [results, setResults] = useState(null);

    const handleResults = (data) => {
        setResults(data);
    };

    const handleReset = () => {
        setResults(null);
    };

    const tabs = [
        { id: 'upload', label: 'Upload & Calculate', icon: Upload },
        { id: 'reference', label: 'Section Reference', icon: BookOpen },
    ];

    return (
        <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                            <Calculator className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Bulk TDS Calculator</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Upload your Excel file for bulk TDS calculation
                    </p>
                </div>

                {/* Show results or main content */}
                {results ? (
                    <BulkResultsDisplay data={results} onReset={handleReset} />
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="flex justify-center mb-8">
                            <div className="inline-flex glass-card p-1 rounded-xl">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                                            ? 'bg-primary text-primary-foreground shadow-lg'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="glass-card shadow-card rounded-2xl p-6 md:p-8">
                            {activeTab === 'upload' && (
                                <BulkFileUpload onResults={handleResults} />
                            )}
                            {activeTab === 'reference' && (
                                <BulkSectionReference />
                            )}
                        </div>
                    </>
                )}
            </div>
        </CalculatorLayout>
    );
};

export default BulkTDSCalculator;
