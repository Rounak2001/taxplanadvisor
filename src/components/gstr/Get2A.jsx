import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveAs } from "file-saver";
import { Download, Calendar, Clock, CheckCircle, AlertCircle, ArrowLeft, FileSpreadsheet, RefreshCw } from "lucide-react";
import { useGstStore } from '@/stores/useGstStore';
import { gstService } from '@/api/gstService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { GSTPeriodPicker } from './GSTPeriodPicker';

const Get2a = () => {
    const { sessionId, gstin, username } = useGstStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    // Determine if we're in client context
    const isClientContext = location.pathname.startsWith('/client');
    const backPath = isClientContext ? '/client/gst' : '/gst';

    const [freq, setFreq] = useState("Monthly");
    const [month, setMonth] = useState("01");
    const [quarter, setQuarter] = useState("1");
    const [fyYear, setFyYear] = useState(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentFYStart = currentMonth >= 4 ? currentYear : currentYear - 1;
        return `${currentFYStart}-${currentFYStart + 1}`;
    });

    const handleDownload = async () => {
        setLoading(true);
        toast.info(`Fetching live GSTR-2A data for ${freq} period...`);

        const [startYearStr] = (fyYear || "").split("-");
        const startYear = parseInt(startYearStr);
        const actualYear = month >= 4 ? startYear : startYear + 1;

        const payload = {
            download_type: freq,
            fy: fyYear,
            quarter: quarter,
            year: actualYear,
            month: month
        };

        try {
            const res = await gstService.downloadGSTR2A(sessionId, payload);

            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            let periodLabel = "";
            if (freq === "Monthly") periodLabel = `${month}_${actualYear}`;
            else if (freq === "Quarterly") periodLabel = `${fyYear}_Q${quarter}`;
            else periodLabel = fyYear;

            const filename = `GSTR2A_${gstin}_${periodLabel}.xlsx`;

            saveAs(blob, filename);
            toast.success("Download completed successfully!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to download GSTR-2A. Ensure session is active.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}>
                        <ArrowLeft size={20} strokeWidth={1.5} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Download GSTR-2A</h1>
                        <p className="text-muted-foreground">
                            Fetch real-time GSTR-2A data enriched with supplier names
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success" />
                    GSTIN: {gstin}
                </Badge>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Download Options Card */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet size={20} strokeWidth={1.5} />
                            Report Options
                        </CardTitle>
                        <CardDescription>
                            Select the period for your GSTR-2A report. This will initiate a live crawl.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <GSTPeriodPicker
                            frequency={freq}
                            onFrequencyChange={setFreq}
                            selectedFY={fyYear}
                            onFYChange={setFyYear}
                            selectedMonth={month}
                            onMonthChange={setMonth}
                            selectedQuarter={quarter}
                            onQuarterChange={setQuarter}
                            className="mb-8"
                        />

                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                            <p className="text-sm text-muted-foreground italic">
                                Note: This process performs a live fetch and supplier name lookup. It may take 10-20 seconds.
                            </p>
                        </div>

                        <Button
                            onClick={handleDownload}
                            disabled={loading}
                            className="w-full"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw size={16} className="mr-2 animate-spin" />
                                    Fetching Live Data...
                                </>
                            ) : (
                                <>
                                    <Download size={16} className="mr-2" />
                                    Generate Excel Report
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle size={20} strokeWidth={1.5} />
                            How it works
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm">
                                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                                <span>Fetches live B2B, CDN, ISD, and Import data</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                                <span>Automatically looks up Supplier Names via GSTIN search</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                <span>Direct portal fetch - no stale or cached data</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                <strong>Party Name:</strong> Enriched from Public Search
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Get2a;
