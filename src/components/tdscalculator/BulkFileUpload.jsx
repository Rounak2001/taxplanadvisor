import { useState, useRef } from 'react';
import { tdsApi } from '@/api/tdsService';
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BulkFileUpload = ({ onResults }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (selectedFile) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];

        if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
            setFile(selectedFile);
            setError(null);
        } else {
            setError('Please upload a valid Excel file (.xlsx or .xls)');
            setFile(null);
        }
    };

    const handleCalculate = async () => {
        if (!file) return;

        try {
            setLoading(true);
            setError(null);
            const data = await tdsApi.calculateBulkTDS(file);

            if (data.success) {
                onResults(data);
            } else {
                setError(data.error || 'Failed to calculate TDS');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to process file. Please check if the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            await tdsApi.downloadTemplate();
        } catch (err) {
            setError('Failed to download template');
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Info Box */}
            <div className="glass-card p-4 border-l-4 border-primary">
                <div className="flex items-start gap-3">
                    <FileSpreadsheet className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-foreground">Expected Excel Format:</p>
                        <p className="text-sm text-muted-foreground mt-1">Your Excel file must contain these columns (exact header names):</p>
                        <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 ml-2 space-y-1">
                            <li><strong className="text-foreground">Deductee Name</strong> - Name of the deductee</li>
                            <li><strong className="text-foreground">Deductee PAN</strong> - PAN number (leave empty if not available)</li>
                            <li><strong className="text-foreground">TDS Section</strong> - Section code (e.g., 194C, 194J(a), 194Q-Exceed)</li>
                            <li><strong className="text-foreground">Transaction Amount</strong> - Transaction amount in ₹</li>
                            <li><strong className="text-foreground">Date of Deduction</strong> - Date of TDS deduction</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Download Template Button */}
            <Button
                onClick={handleDownloadTemplate}
                variant="outline"
                className="flex items-center gap-2"
            >
                <Download className="w-4 h-4" />
                Download Sample Template
            </Button>

            <div className="border-t border-border my-6"></div>

            {/* Upload Zone */}
            <div
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragActive
                    ? 'border-primary bg-primary/10'
                    : file
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                />

                <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                        <Upload className={`w-8 h-8 ${file ? 'text-green-500' : 'text-primary'}`} />
                    </div>
                    <div>
                        <p className="text-xl font-semibold text-foreground">
                            {file ? file.name : 'Drop your Excel file here'}
                        </p>
                        <p className="text-muted-foreground mt-2">
                            {file ? `${(file.size / 1024).toFixed(2)} KB` : 'or click to browse'}
                        </p>
                    </div>
                    {file && (
                        <div className="flex items-center justify-center gap-2 text-green-500">
                            <CheckCircle className="w-5 h-5" />
                            <span>File ready for processing</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="glass-card p-4 border-l-4 border-destructive bg-destructive/10">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                        <span className="text-destructive flex-1">{error}</span>
                        <button onClick={() => setError(null)} className="text-destructive hover:text-destructive/80">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Calculate Button */}
            <Button
                onClick={handleCalculate}
                disabled={!file || loading}
                className="w-full bg-primary text-primary-foreground py-6 rounded-xl font-bold text-lg shadow-elevated hover:shadow-glow transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {loading ? (
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-5 h-5" />
                        Calculate TDS
                    </div>
                )}
            </Button>
        </div>
    );
};

export default BulkFileUpload;
