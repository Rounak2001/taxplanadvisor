import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, Download, FileText, CheckCircle, AlertCircle, XCircle, Clock, TrendingUp, ArrowLeft, Info, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { gstService } from '@/api/gstService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { GSTPeriodPicker } from './GSTPeriodPicker';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const REQUIRED_COLUMNS = [
  "GSTIN/UIN", "Supplier", "Invoice", "Date",
  "Gross Amt", "Taxable", "IGST", "SGST", "CGST", "Cess", "Type",
];

const Reco2b = () => {
  const navigate = useNavigate();
  const [selectedFy, setSelectedFy] = useState("2024-2025");
  const [periodType, setPeriodType] = useState("Monthly");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [tolerance, setTolerance] = useState(1);
  const [file2B, setFile2B] = useState(null);
  const [fileBooks, setFileBooks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("matched");

  // Helper to map month ID back to full name if required by backend,
  // though typically backend expects padded numbers.
  const getMonthName = (id) => {
    const months = {
      "01": "January", "02": "February", "03": "March", "04": "April",
      "05": "May", "06": "June", "07": "July", "08": "August",
      "09": "September", "10": "October", "11": "November", "12": "December"
    };
    return months[id] || id;
  };

  const getQuarterLabel = (id) => {
    const quarters = {
      "1": "Q1 (Apr-Jun)", "2": "Q2 (Jul-Sep)", "3": "Q3 (Oct-Dec)", "4": "Q4 (Jan-Mar)"
    };
    return quarters[id] || id;
  };

  const handleSubmit = async () => {
    setError("");
    setResult(null);

    if (!file2B || !fileBooks) {
      toast.error("Please upload both files.");
      return;
    }

    if (periodType === "Monthly" && !selectedMonth) {
      toast.error("Please select a month");
      return;
    }

    if (periodType === "Quarterly" && !selectedQuarter) {
      toast.error("Please select a quarter");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("file_2b", file2B);
      fd.append("file_books", fileBooks);
      fd.append("selected_fy", selectedFy);
      fd.append("period_type", periodType);

      // Map to backend expected format
      let periodVal = "";
      if (periodType === "Monthly") periodVal = getMonthName(selectedMonth);
      else if (periodType === "Quarterly") periodVal = getQuarterLabel(selectedQuarter);
      else if (periodType === "Annually") periodVal = "Entire Year";

      fd.append("selected_period_val", periodVal);
      fd.append("tolerance", tolerance);

      const data = await gstService.reconcile2BManual(fd, false);
      setResult(data);
      setActiveTab("matched");
      toast.success("Reconciliation successful!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || err.message || "Reconciliation failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!file2B || !fileBooks) {
      toast.error("Upload both files first.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("file_2b", file2B);
      fd.append("file_books", fileBooks);
      fd.append("selected_fy", selectedFy);
      fd.append("period_type", periodType);

      let periodVal = "";
      if (periodType === "Monthly") periodVal = getMonthName(selectedMonth);
      else if (periodType === "Quarterly") periodVal = getQuarterLabel(selectedQuarter);
      else if (periodType === "Annually") periodVal = "Entire Year";

      fd.append("selected_period_val", periodVal);
      fd.append("tolerance", tolerance);

      const res = await gstService.reconcile2BManual(fd, true);
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Reconciliation_${result?.periodLabel?.replace(/\s+/g, "_") || "Report"}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Excel downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Excel download failed.");
    }
  };

  const downloadTemplate = () => {
    const worksheetData = [REQUIRED_COLUMNS];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Purchase_2B_Template.xlsx");
    toast.success("Template downloaded!");
  };

  const tabs = [
    { id: "matched", label: "Matched", icon: CheckCircle, count: result?.metrics.matched || 0, color: "text-green-600" },
    { id: "mismatch_probable", label: "Mismatch/Probable", icon: AlertCircle, count: result?.metrics.mismatch_probable || 0, color: "text-orange-600" },
    { id: "invoice_mismatch", label: "Invoice Mismatch", icon: FileText, count: result?.metrics.invoice_mismatch || 0, color: "text-yellow-600" },
    { id: "only_2b", label: "Only in 2B", icon: XCircle, count: result?.metrics.only_2b || 0, color: "text-red-600" },
    { id: "only_books", label: "Only in Books", icon: XCircle, count: result?.metrics.only_books || 0, color: "text-purple-600" },
    { id: "out_of_period", label: "Out of Period", icon: Clock, count: result?.metrics.out_period || result?.metrics.out_of_period || 0, color: "text-gray-600" },
  ];

  const renderTable = (rows) => {
    if (!rows || rows.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg">No records found in this category</p>
        </div>
      );
    }
    const cols = Object.keys(rows[0]);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {cols.map((c) => (
                <th key={c} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {c.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {cols.map((c) => (
                  <td key={c} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {typeof r[c] === 'number' ? r[c].toLocaleString() : r[c]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/gst')}>
            <ArrowLeft size={20} strokeWidth={1.5} />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Manual GST Reconciliation</h1>
            <p className="text-muted-foreground">
              Reconcile your GSTR-2B and Books Excel files with full transparency
            </p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <CheckCircle size={14} className="text-success" />
          Manual Mode
        </Badge>
      </div>

      <div className={cn(
        "grid gap-6",
        result ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
      )}>
        <div className={cn(result ? "" : "lg:col-span-2", "space-y-6")}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet size={20} strokeWidth={1.5} />
                Reconciliation Options
              </CardTitle>
              <CardDescription>
                Select the period, configure tolerance and upload your Excel files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Standard Period Picker */}
              <div className="bg-muted/30 p-4 rounded-2xl border">
                <GSTPeriodPicker
                  frequency={periodType}
                  onFrequencyChange={setPeriodType}
                  selectedFY={selectedFy}
                  onFYChange={setSelectedFy}
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  selectedQuarter={selectedQuarter}
                  onQuarterChange={setSelectedQuarter}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold">Tolerance (₹)</Label>
                    <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">Current: ±₹{tolerance}</span>
                  </div>
                  <select
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full h-11 px-4 bg-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all hover:border-primary/30"
                  >
                    {[0, 1, 5, 10, 20, 50].map((t) => (
                      <option key={t} value={t}>±₹{t}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                    * Differences within this amount will be marked as matched.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold block">File Uploads</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="relative group/upload">
                      <input
                        type="file"
                        accept=".xlsx"
                        onChange={(e) => setFile2B(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className={cn(
                        "border-2 border-dashed transition-all rounded-xl p-3 flex items-center gap-3",
                        file2B ? "bg-primary/5 border-primary/50" : "bg-muted/30 border-border group-hover:border-primary/30"
                      )}>
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          file2B ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        )}>
                          <FileUp size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold uppercase tracking-tight">GSTR-2B (.xlsx)</span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                            {file2B ? file2B.name : "Select Portal File"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative group/upload">
                      <input
                        type="file"
                        accept=".xlsx"
                        onChange={(e) => setFileBooks(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className={cn(
                        "border-2 border-dashed transition-all rounded-xl p-3 flex items-center gap-3",
                        fileBooks ? "bg-accent/5 border-accent/50" : "bg-muted/30 border-border group-hover:border-primary/30"
                      )}>
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          fileBooks ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                        )}>
                          <FileUp size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold uppercase tracking-tight">Books (.xlsx)</span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                            {fileBooks ? fileBooks.name : "Select Purchase Register"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={loading} className="w-full h-12 text-lg shadow-glow-sm relative overflow-hidden group">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5 animate-pulse" />
                    Processing Large Datasets...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">Run Reconciliation Engine</span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-black leading-tight">{error}</p>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-2xl border-2 transition-all text-center group",
                      activeTab === tab.id
                        ? 'bg-primary/5 border-primary shadow-elevated-sm'
                        : 'bg-card hover:bg-muted/50 border-border/50'
                    )}
                  >
                    <tab.icon className={cn("w-6 h-6 mb-2 transition-transform group-hover:scale-110", tab.color)} />
                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1.5 leading-none">{tab.label}</p>
                    <p className="text-xl font-black tabular-nums tracking-tighter">{tab.count.toLocaleString()}</p>
                  </button>
                ))}
              </div>

              <Card className="overflow-hidden border-border/50 shadow-elevated-sm">
                <div className="flex border-b border-border/50 bg-muted/30 p-1.5 gap-1.5">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black rounded-xl transition-all",
                        activeTab === tab.id
                          ? 'bg-background shadow-elevated-sm text-primary border border-border/50'
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                      )}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      <span className="hidden md:inline uppercase tracking-widest">{tab.label}</span>
                    </button>
                  ))}
                </div>
                <div className="p-0">
                  {renderTable(result.tables[activeTab])}
                </div>
              </Card>

              {result.periodLabel && (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-px w-20 bg-border" />
                  <Button onClick={handleDownloadExcel} variant="ghost" className="gap-2 text-primary hover:bg-primary/5 font-black uppercase tracking-widest text-[11px]">
                    <Download className="w-4 h-4" />
                    Export {result.periodLabel} Report to Excel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - hidden when results are shown */}
        {!result && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-muted/30 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileSpreadsheet size={80} strokeWidth={1} />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest font-black">
                  <Info size={16} className="text-primary" />
                  Required Columns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10 font-black">
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Your Excel files MUST contain these exact headings for the data processing engine to work:
                </p>
                <div className="flex flex-wrap gap-2 text-black">
                  {REQUIRED_COLUMNS.map((col) => (
                    <Badge key={col} variant="secondary" className="font-black text-[10px] py-1 px-3 bg-secondary text-secondary-foreground border border-border/50">{col}</Badge>
                  ))}
                </div>
                <Button onClick={downloadTemplate} variant="outline" size="sm" className="w-full text-[11px] font-black uppercase tracking-widest h-11 border-2 text-foreground">
                  <Download className="w-4 h-4 mr-2" />
                  Download Blank Template
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20 shadow-inner">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest font-black text-primary">
                  <CheckCircle size={16} />
                  Key Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0 text-success">
                      <CheckCircle size={16} strokeWidth={3} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-tight">Zero latency</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Works instantly without waiting for GST portal response.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                      <CheckCircle size={16} strokeWidth={3} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-tight">Cross-Format</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Accepts purchase registers from Tally, SAP, or Sage.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 text-accent">
                      <CheckCircle size={16} strokeWidth={3} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-tight">Privacy First</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Reconciliation happens securely within your session.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reco2b;
