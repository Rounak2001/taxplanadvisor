import { useState } from 'react';
import { tdsApi } from '@/api/tdsService';
import { Download, ArrowLeft, FileSpreadsheet, CheckCircle, AlertTriangle, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MetricCard = ({ icon: Icon, label, value, colorClass }) => (
    <div className={`glass-card p-4 rounded-xl border-l-4 ${colorClass}`}>
        <div className="flex items-center gap-3 mb-2">
            <Icon className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
    </div>
);

const BulkResultsDisplay = ({ data, onReset }) => {
    const [downloading, setDownloading] = useState(false);
    const { summary, results } = data;

    const handleDownload = async () => {
        try {
            setDownloading(true);
            await tdsApi.downloadResults(results);
        } catch (err) {
            console.error('Download failed:', err);
        } finally {
            setDownloading(false);
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'Taxable') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                    <CheckCircle className="w-3 h-3" />
                    {status}
                </span>
            );
        }
        if (status === 'Under Threshold') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500">
                    <TrendingDown className="w-3 h-3" />
                    {status}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive">
                <AlertTriangle className="w-3 h-3" />
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    TDS Calculation Results
                </h2>
                <Button onClick={onReset} variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Calculate New
                </Button>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={FileSpreadsheet}
                    label="Total Transactions"
                    value={summary.total_transactions}
                    colorClass="border-primary"
                />
                <MetricCard
                    icon={CheckCircle}
                    label="Taxable"
                    value={summary.taxable_count}
                    colorClass="border-green-500"
                />
                <MetricCard
                    icon={TrendingDown}
                    label="Under Threshold"
                    value={summary.under_threshold_count}
                    colorClass="border-amber-500"
                />
                <MetricCard
                    icon={Download}
                    label="Total TDS"
                    value={summary.total_tds_formatted}
                    colorClass="border-purple-500 bg-purple-500/10"
                />
            </div>

            <div className="border-t border-border"></div>

            {/* Results Table */}
            <div className="glass-card overflow-hidden rounded-xl">
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary/50 sticky top-0">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Deductee Name</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">PAN</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Section</th>
                                <th className="px-4 py-3 text-right font-semibold text-foreground">Amount</th>
                                <th className="px-4 py-3 text-center font-semibold text-foreground">Rate</th>
                                <th className="px-4 py-3 text-right font-semibold text-foreground">TDS</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Deduction Date</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Due Date</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {results.map((row, idx) => (
                                <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-4 py-3 font-medium text-foreground">{row.deductee_name}</td>
                                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{row.deductee_pan}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.detected_category}</td>
                                    <td className="px-4 py-3 font-mono text-primary">{row.tds_section}</td>
                                    <td className="px-4 py-3 text-right text-foreground">₹{row.transaction_amount?.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3 text-center text-sm text-muted-foreground">{row.applicable_rate}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-green-500">
                                        ₹{row.tds_amount?.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.date_of_deduction}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.due_date}</td>
                                    <td className="px-4 py-3">{getStatusBadge(row.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="border-t border-border"></div>

            {/* Download Button */}
            <Button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 rounded-xl font-bold text-lg shadow-elevated hover:shadow-glow transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {downloading ? (
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Preparing Download...
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Download className="w-5 h-5" />
                        Download Results as Excel
                    </div>
                )}
            </Button>
        </div>
    );
};

export default BulkResultsDisplay;
