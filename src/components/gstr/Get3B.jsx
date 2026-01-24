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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { GSTPeriodPicker } from './GSTPeriodPicker';

const Get3b = () => {
    const { sessionId, gstin, username } = useGstStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    // Determine if we're in client context
    const isClientContext = location.pathname.startsWith('/client');
    const backPath = isClientContext ? '/client/gst' : '/gst';

    const [freq, setFreq] = useState("Monthly");
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [month, setMonth] = useState("01");
    const [fyYear, setFyYear] = useState(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentFYStart = currentMonth >= 4 ? currentYear : currentYear - 1;
        return `${currentFYStart}-${currentFYStart + 1}`;
    });
    const [qtr, setQtr] = useState("Q1");
    const [forceRefresh, setForceRefresh] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        toast.info("Fetching GSTR-3B data from GSTN, please wait…");

        const [startYearStr] = (fyYear || "").split("-");
        const startYear = parseInt(startYearStr);
        const actualYear = month >= 4 ? startYear : startYear + 1;

        const payload = {
            period_type: freq.toLowerCase(),
            force_refresh: forceRefresh,
            fy: fyYear,
            quarter: qtr,
            year: actualYear,
            month: month
        };

        try {
            const response = await gstService.downloadGSTR3B(sessionId, payload);

            // Check if response is an error (JSON) or blob
            if (response.headers?.['content-type']?.includes('application/json')) {
                const errorData = await response.data;
                toast.error(errorData.error || "Failed to download GSTR-3B");
                return;
            }

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });

            const periodLabel = freq === "Monthly"
                ? `${month}-${actualYear}`
                : freq === "Quarterly"
                    ? `${qtr}-${fyYear}`
                    : fyYear;

            saveAs(blob, `GSTR3B_${gstin}_${periodLabel}.xlsx`);
            toast.success("GSTR-3B downloaded successfully!");
        } catch (err) {
            console.error("Download error:", err);
            // Handle blob error responses
            let errorMessage = "Failed to download GSTR-3B";
            if (err.response?.data instanceof Blob) {
                try {
                    const text = await err.response.data.text();
                    const json = JSON.parse(text);
                    errorMessage = json.error || errorMessage;
                } catch (e) {
                    // Couldn't parse blob as JSON
                }
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            }
            toast.error(errorMessage);
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
                        <h1 className="text-2xl font-semibold text-foreground">Download GSTR-3B</h1>
                        <p className="text-muted-foreground">
                            Fetch GSTR-3B summary return data from GST portal in Excel format
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
                            <Download size={20} strokeWidth={1.5} />
                            Download Options
                        </CardTitle>
                        <CardDescription>
                            Select the period and download GSTR-3B return summary
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Period Picker */}
                        <GSTPeriodPicker
                            frequency={freq}
                            onFrequencyChange={setFreq}
                            selectedFY={fyYear}
                            onFYChange={setFyYear}
                            selectedQuarter={qtr}
                            onQuarterChange={setQtr}
                            selectedMonth={month}
                            onMonthChange={setMonth}
                        />

                        {/* Force Refresh */}
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                            <div className="flex items-center gap-3">
                                <RefreshCw size={18} className="text-muted-foreground" />
                                <div>
                                    <Label className="font-medium">Force Refresh</Label>
                                    <p className="text-sm text-muted-foreground">Bypass cache and fetch latest data</p>
                                </div>
                            </div>
                            <Switch
                                checked={forceRefresh}
                                onCheckedChange={setForceRefresh}
                            />
                        </div>

                        {/* Download Button */}
                        <Button
                            onClick={handleDownload}
                            disabled={loading || !sessionId}
                            className="w-full h-12 text-base"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="animate-spin mr-2" size={18} />
                                    Fetching GSTR-3B...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2" size={18} />
                                    Download GSTR-3B Excel
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet size={20} strokeWidth={1.5} />
                            About GSTR-3B
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Calendar size={16} className="mt-1 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Monthly Summary Return</p>
                                    <p className="text-xs text-muted-foreground">Self-declared summary of outward & inward supplies</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock size={16} className="mt-1 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Tax Payment</p>
                                    <p className="text-xs text-muted-foreground">Contains details of tax liability and ITC claimed</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle size={16} className="mt-1 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Excel Format</p>
                                    <p className="text-xs text-muted-foreground">Downloaded as XLSX for easy analysis</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-xs text-muted-foreground">
                                <strong className="text-foreground">Note:</strong> GSTR-3B data is fetched directly from the GST portal and may take a few seconds.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Get3b;
