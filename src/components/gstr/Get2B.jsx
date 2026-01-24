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



const Get2b = () => {
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
    toast.info("Fetching data from GSTN, please wait…");

    const [startYearStr] = (fyYear || "").split("-");
    const startYear = parseInt(startYearStr);
    const actualYear = month >= 4 ? startYear : startYear + 1;

    const payload = {
      freq: freq,
      force_refresh: forceRefresh,
      fy_year: fyYear,
      quarter: qtr,
      year: actualYear,
      month: month
    };

    try {
      const res = await gstService.downloadGSTR2B(sessionId, payload);

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      let filename = `GSTR2B_${gstin}`;
      if (freq === "Monthly") filename += `_${month}_${year}`;
      else if (freq === "Quarterly") filename += `_${fyYear}_${qtr}`;
      else filename += `_${fyYear}_Annual`;
      filename += ".xlsx";

      saveAs(blob, filename);
      toast.success("Download completed successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to download report. Token may have expired.");
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
            <h1 className="text-2xl font-semibold text-foreground">Download GSTR-2B</h1>
            <p className="text-muted-foreground">
              Fetch GSTR-2B data directly from the GST portal in Excel format
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
              Download Options
            </CardTitle>
            <CardDescription>
              Select the period and frequency for your GSTR-2B report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">


            {/* Redesigned Period Picker */}
            <GSTPeriodPicker
              frequency={freq}
              onFrequencyChange={setFreq}
              selectedFY={fyYear}
              onFYChange={setFyYear}
              selectedMonth={month}
              onMonthChange={setMonth}
              selectedQuarter={qtr}
              onQuarterChange={setQtr}
              className="mb-8"
            />

            {/* Force Refresh Option */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="space-y-0.5">
                <Label htmlFor="force-refresh">Force Refresh</Label>
                <p className="text-sm text-muted-foreground">Bypass cache and fetch fresh data</p>
              </div>
              <Switch
                id="force-refresh"
                checked={forceRefresh}
                onCheckedChange={setForceRefresh}
              />
            </div>

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  Download Excel Report
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
              Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>GSTR-2B reports are downloaded directly from the GSTN portal</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Reports are generated in Excel format for easy analysis</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Session is valid for 6 hours from authentication</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <AlertCircle size={16} className="text-warning mt-0.5 flex-shrink-0" />
                <span>Ensure you have a stable internet connection</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>User:</strong> {username}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Get2b;