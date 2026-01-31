import { useState, useEffect } from 'react';
import { tdsApi } from '@/api/tdsService';
import { Search, AlertCircle, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BulkSectionReference = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await tdsApi.getBulkSections();
            setSections(data.sections || []);
        } catch (err) {
            setError('Failed to load TDS sections. Please ensure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredSections = sections.filter(section =>
        section.section_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card p-6 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive text-lg mb-4">{error}</p>
                <Button onClick={fetchSections} variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Info Box */}
            <div className="glass-card p-4 border-l-4 border-primary">
                <div className="flex items-start gap-3">
                    <Info className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-foreground">How to use:</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Use the exact <code className="bg-secondary px-2 py-0.5 rounded text-primary">Section Code</code> from this table in your Excel file.
                            For sections with special classifications, use the specific code (e.g., <code className="bg-secondary px-2 py-0.5 rounded text-primary">194C-Single</code>, <code className="bg-secondary px-2 py-0.5 rounded text-primary">194J(a)</code>).
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search sections by code or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                />
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden rounded-xl">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary/50 sticky top-0">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Section Code</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Threshold</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Company/Firm</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Individual/HUF</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">No PAN</th>
                                <th className="px-4 py-3 text-left font-semibold text-foreground">Special Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredSections.map((section, idx) => (
                                <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-4 py-3 font-mono text-primary font-semibold">{section.section_code}</td>
                                    <td className="px-4 py-3 text-foreground max-w-xs">{section.description}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{section.threshold}</td>
                                    <td className="px-4 py-3 text-green-500">{section.company_rate}</td>
                                    <td className="px-4 py-3 text-amber-500">{section.individual_rate}</td>
                                    <td className="px-4 py-3 text-destructive">{section.no_pan_rate}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{section.special_notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Special Classifications */}
            <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Sections with Special Classifications
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div>
                            <p className="font-semibold text-foreground">194C - Payment to Contractors:</p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside ml-2">
                                <li><code className="text-primary">194C-A</code> - Annual Aggregate (₹1,00,000)</li>
                                <li><code className="text-primary">194C-S</code> - Single Transaction (₹30,000)</li>
                                <li><code className="text-primary">194C</code> - Full amount (threshold exceeded)</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">194J - Fees/Services:</p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside ml-2">
                                <li><code className="text-primary">194J(a)</code> - Technical Services (2%)</li>
                                <li><code className="text-primary">194J(b)</code> - Professional Services (10%)</li>
                            </ul>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="font-semibold text-foreground">194Q - Purchase of Goods:</p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside ml-2">
                                <li><code className="text-primary">194Q</code> - TDS on excess of ₹50 Lakhs</li>
                                <li><code className="text-primary">194Q-Exceed</code> - Full amount (threshold exceeded)</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">194N/194NC - Cash Withdrawal:</p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside ml-2">
                                <li>TDS only on amount exceeding threshold</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkSectionReference;
