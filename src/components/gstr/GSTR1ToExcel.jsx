import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveAs } from "file-saver";
import { FileSpreadsheet, Download, CheckCircle, AlertCircle, Calendar, User, ArrowLeft, Info } from "lucide-react";
import { useGstStore } from '@/stores/useGstStore';
import { gstService } from '@/api/gstService';
import { GSTPeriodPicker } from './GSTPeriodPicker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Using gstService for API calls

const GSTR1ToExcel = () => {
  const { sessionId, gstin, username } = useGstStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Determine if we're in client context
  const isClientContext = location.pathname.startsWith('/client');
  const backPath = isClientContext ? '/client/gst' : '/gst';

  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    type: "month",
    month: "01",
    quarter: "1",
    forceRefresh: false,
    fy: (() => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentFYStart = currentMonth >= 4 ? currentYear : currentYear - 1;
      return `${currentFYStart}-${(currentFYStart + 1).toString().slice(-2)}`;
    })()
  });

  const showMsg = (text, type = "info") => setMsg({ text, type });
  const clearMsg = () => setMsg(null);



  const handleDownload = async () => {
    clearMsg();
    setLoading(true);
    showMsg("Downloading GSTR1 data...", "info");

    try {
      const params = {
        type: formData.type,
        force_refresh: formData.forceRefresh
      };

      if (formData.type === "month") {
        const [startYearStr] = (formData.fy || "").split("-");
        const startYear = parseInt(startYearStr);
        params.year = formData.month >= 4 ? startYear : startYear + 1;
        params.month = formData.month;
      } else if (formData.type === "quarter") {
        params.fy = formData.fy;
        params.quarter = formData.quarter;
      } else {
        params.fy = formData.fy;
      }

      const response = await gstService.downloadGSTR1(sessionId, params);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      let filename = `GSTR1_${gstin}`;
      if (formData.type === "month") {
        filename += `_${formData.month}_${formData.year}`;
      } else if (formData.type === "quarter") {
        filename += `_Q${formData.quarter}_${formData.fy}`;
      } else {
        filename += `_${formData.fy}`;
      }
      filename += ".xlsx";

      saveAs(blob, filename);
      showMsg("Download completed successfully", "success");
    } catch (err) {
      showMsg(err.response?.data?.error || "Failed to download GSTR1 report", "error");
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
            <h1 className="text-2xl font-semibold text-foreground">Download GSTR-1</h1>
            <p className="text-muted-foreground">
              Fetch GSTR-1 data directly from the GST portal in Excel format
            </p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <CheckCircle size={14} className="text-success" />
          GSTIN: {gstin}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet size={20} strokeWidth={1.5} />
              Download Options
            </CardTitle>
            <CardDescription>
              Select the period and frequency for your GSTR-1 report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {msg && (
              <div className={`rounded-lg p-4 border-l-4 ${msg.type === 'success'
                ? 'bg-green-50 border-green-500'
                : msg.type === 'error'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-blue-50 border-blue-500'
                }`}>
                <div className="flex items-center">
                  {msg.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  ) : (
                    <AlertCircle className={`w-5 h-5 mr-3 ${msg.type === 'error' ? 'text-red-600' : 'text-blue-600'}`} />
                  )}
                  <p className={`font-medium ${msg.type === 'success' ? 'text-green-800' : msg.type === 'error' ? 'text-red-800' : 'text-blue-800'}`}>
                    {msg.text}
                  </p>
                </div>
              </div>
            )}

            <GSTPeriodPicker
              frequency={formData.type === 'month' ? 'Monthly' : formData.type === 'quarter' ? 'Quarterly' : 'Annually'}
              onFrequencyChange={(freq) => setFormData({
                ...formData,
                type: freq === 'Monthly' ? 'month' : freq === 'Quarterly' ? 'quarter' : 'year'
              })}
              selectedFY={formData.fy.includes('-') && formData.fy.split('-')[1].length === 2
                ? `${formData.fy.split('-')[0]}-20${formData.fy.split('-')[1]}`
                : formData.fy}
              onFYChange={(fy) => {
                const parts = fy.split('-');
                const formattedFY = `${parts[0]}-${parts[1].slice(-2)}`;
                setFormData({ ...formData, fy: formattedFY, year: parts[0] });
              }}
              selectedMonth={formData.month}
              onMonthChange={(m) => setFormData({ ...formData, month: m })}
              selectedQuarter={formData.quarter}
              onQuarterChange={(q) => setFormData({ ...formData, quarter: q })}
              className="mb-8"
            />

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="space-y-0.5">
                <Label htmlFor="force-refresh">Force Refresh</Label>
                <p className="text-sm text-muted-foreground">Bypass cache and fetch fresh data</p>
              </div>
              <Switch
                id="force-refresh"
                checked={formData.forceRefresh}
                onCheckedChange={(val) => setFormData({ ...formData, forceRefresh: val })}
              />
            </div>

            <Button
              onClick={handleDownload}
              disabled={loading}
              className="w-full h-12 text-lg shadow-glow"
            >
              <Download className="w-5 h-5 mr-2" />
              {loading ? "Downloading..." : "Download GSTR-1"}
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info size={20} strokeWidth={1.5} />
              Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Download GSTR-1 data directly from the GST portal</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Reports include B2B, B2C, and other credit/debit note sections</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>GSTR-1 data is synced with the portal in real-time</span>
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

export default GSTR1ToExcel;