import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Download, FileSpreadsheet, FileText, RefreshCw, ShoppingCart, TrendingUp, AlertTriangle, CheckCircle, Info, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useGstStore } from '@/stores/useGstStore';
import { gstService } from '@/api/gstService';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import { GSTPeriodPicker } from './GSTPeriodPicker';

export default function GstrReconciliation() {
  const { sessionId, gstin, username, isVerified } = useGstStore();
  const isAuthenticated = isVerified && !!sessionId;
  const navigate = useNavigate();
  const [fyYear, setFyYear] = useState('2024');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);

  const [periodType, setPeriodType] = useState('fy'); // 'fy', 'quarter', 'month'
  const [periodValue, setPeriodValue] = useState('');

  const years = [2025, 2024, 2023, 2022];
  const fyMonths = [
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/gst');
    }
  }, [isAuthenticated, navigate]);

  // Using gstService for API calls



  // Helper to format currency
  const fmt = (val) => val ? `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';

  // Helper for Month Names
  const monthName = (m) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1];

  const handleReconcile = async () => {
    if (!fyYear) return toast.error('Enter FY year');
    setLoading(true);
    try {
      const data = await gstService.reconcileComprehensive(sessionId, {
        year: fyYear,
        reco_type: periodType.toUpperCase(),
        month: periodType === 'month' ? periodValue : null,
        quarter: periodType === 'quarter' ? periodValue : null,
        force_refresh: forceRefresh
      });

      if (data.status === 'success') {
        // Map Backend fields to Frontend State - includes 2B data
        const resultsArray = data.data || [];
        const mappedResults = resultsArray.map(r => {
          const detail = r.detailed;
          return {
            year: detail.year,
            month: detail.month,

            // ----- SALES: GSTR-1 vs GSTR-3B -----
            tx1: detail.auto_tx || 0, tx3: detail.g3_tx || 0,
            ig1: detail.auto_igst || 0, ig3: detail.g3_igst || 0,
            cg1: detail.auto_cgst || 0, cg3: detail.g3_cgst || 0,
            sg1: detail.auto_sgst || 0, sg3: detail.g3_sgst || 0,
            exp_tx1: detail.auto_exp_tx || 0, exp_tx3: detail.g3_exp_tx || 0,
            exp_ig1: detail.auto_exp_igst || 0, exp_ig3: detail.g3_exp_igst || 0,
            nil_tx1: detail.auto_nil_tx || 0, nil_tx3: detail.g3_nil_tx || 0,
            ng1: detail.auto_nongst_tx || 0, ng3: detail.g3_nongst_tx || 0,
            sales_status: detail.sales_status || detail.status || 'N/A',

            // ----- PURCHASES: GSTR-2B vs GSTR-3B ITC -----
            itc_2b_igst: detail.g2b_itc_igst || 0,
            itc_2b_cgst: detail.g2b_itc_cgst || 0,
            itc_2b_sgst: detail.g2b_itc_sgst || 0,
            itc_2b_cess: detail.g2b_itc_cess || 0,

            itc_3b_igst: detail.g3_itc_igst || 0,
            itc_3b_cgst: detail.g3_itc_cgst || 0,
            itc_3b_sgst: detail.g3_itc_sgst || 0,
            itc_3b_cess: detail.g3_itc_cess || 0,

            itc_rcm_igst: detail.g3_rcm_igst || 0,
            itc_rcm_cgst: detail.g3_rcm_cgst || 0,
            itc_rcm_sgst: detail.g3_rcm_sgst || 0,
            itc_rcm_cess: detail.g3_rcm_cess || 0,

            itc_adj_igst: detail.g3_adj_igst || 0,
            itc_adj_cgst: detail.g3_adj_cgst || 0,
            itc_adj_sgst: detail.g3_adj_sgst || 0,
            itc_adj_cess: detail.g3_adj_cess || 0,

            itc_status: detail.itc_status || 'N/A'
          };
        });

        setResults(mappedResults);
        toast.success('Reconciliation complete');
      } else {
        toast.error(data.error || 'Reconciliation failed');
      }
    } catch (e) {
      toast.error(e.response?.data?.error || 'Reconciliation failed');
    }
    setLoading(false);
  };

  const downloadExcel = async () => {
    try {
      const res = await gstService.downloadReco1vs3b({ results, username, gstin, fy_year: fyYear });
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GSTR_Reconciliation_${gstin}_${fyYear}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast.error('Failed to download Excel');
    }
  };

  const download3BDetails = async (year, month) => {
    try {
      const pType = periodType === 'month' ? 'monthly' :
        periodType === 'quarter' ? 'quarterly' : 'fy';

      toast.info(`Fetching GSTR-3B Details...`);
      const res = await gstService.downloadGSTR3B(sessionId, {
        period_type: pType,
        fy: fyYear,
        quarter: periodValue,
        year,
        month,
        force_refresh: forceRefresh
      });

      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GSTR3B_Details_${gstin}_${pType}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('GSTR-3B details downloaded!');
    } catch (e) {
      toast.error(`Failed: ${e.response?.data?.error || e.message}`);
    }
  };

  const downloadGstr1Excel = async (year, month) => {
    try {
      const res = await gstService.downloadGSTR1(sessionId, {
        download_type: 'monthly',
        year,
        month,
        force_refresh: forceRefresh
      });

      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GSTR1_Data_${gstin}_${year}_${month.toString().padStart(2, '0')}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('GSTR1 data downloaded successfully');
    } catch (e) {
      if (e.response?.status === 404) {
        toast.error('GSTR1 download feature not available on production server yet');
      } else {
        toast.error('Failed to download GSTR1 data');
      }
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('GSTR-1 vs GSTR-3B Reconciliation Report', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`GSTIN: ${gstin} | FY: ${fyYear}-${parseInt(fyYear) + 1} | Date: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });

    let yPos = 30;

    results.forEach((r, idx) => {
      if (idx > 0 && yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(11);
      doc.setFillColor(76, 175, 80);
      doc.rect(14, yPos, 182, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(`${monthName(r.month)} ${r.year}`, 16, yPos + 5);
      doc.setTextColor(0, 0, 0);
      yPos += 8;

      const f = (v) => `Rs ${v?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}`;
      const d = (a, b) => f((a || 0) - (b || 0));

      const tableData = [
        ['3.1.a Taxable Value', f(r.tx1), f(r.tx3), d(r.tx1, r.tx3)],
        ['3.1.a IGST', f(r.ig1), f(r.ig3), d(r.ig1, r.ig3)],
        ['3.1.a CGST', f(r.cg1), f(r.cg3), d(r.cg1, r.cg3)],
        ['3.1.a SGST', f(r.sg1), f(r.sg3), d(r.sg1, r.sg3)],
        ['3.1.b Exports Taxable', f(r.exp_tx1), f(r.exp_tx3), d(r.exp_tx1, r.exp_tx3)],
        ['3.1.b Exports IGST', f(r.exp_ig1), f(r.exp_ig3), d(r.exp_ig1, r.exp_ig3)],
        ['3.1.c Nil/Exempt', f(r.nil_tx1), f(r.nil_tx3), d(r.nil_tx1, r.nil_tx3)],
        ['3.1.e Non-GST', f(r.ng1), f(r.ng3), d(r.ng1, r.ng3)],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['Particular', 'GSTR-1', 'GSTR-3B', 'Difference']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [224, 224, 224], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 0: { halign: 'left', fontStyle: 'bold' }, 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } }
      });
      yPos = doc.lastAutoTable.finalY + 10;
    });

    doc.save(`GSTR_Reconciliation_${gstin}_${fyYear}.pdf`);
  };

  const RecoRow = ({ label, v1, v2 }) => {
    const diff = (v1 || 0) - (v2 || 0);
    const isMismatch = Math.abs(diff) > 1.0;

    return (
      <TableRow className="hover:bg-gray-50">
        <TableCell className="font-medium text-gray-700 py-2">{label}</TableCell>
        <TableCell className="text-right py-2 text-gray-600">{fmt(v1)}</TableCell>
        <TableCell className="text-right py-2 text-gray-600">{fmt(v2)}</TableCell>
        <TableCell className={`text-right py-2 font-bold ${isMismatch ? 'text-red-600' : 'text-green-600'}`}>
          {diff > 0 ? '+' : ''}{fmt(diff)}
        </TableCell>
      </TableRow>
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
            <h1 className="text-2xl font-semibold text-foreground">Comprehensive Reconciliation</h1>
            <p className="text-muted-foreground">
              Reconcile your GSTR-1, GSTR-2B, and GSTR-3B data automatically
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
              Reconciliation Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 && (
              <div className="space-y-4">
                <GSTPeriodPicker
                  frequency={periodType === 'month' ? 'Monthly' : periodType === 'quarter' ? 'Quarterly' : 'Annually'}
                  onFrequencyChange={(freq) => {
                    const type = freq === 'Monthly' ? 'month' : freq === 'Quarterly' ? 'quarter' : 'fy';
                    setPeriodType(type);
                    setPeriodValue('');
                  }}
                  selectedFY={`${fyYear}-${parseInt(fyYear) + 1}`}
                  onFYChange={(fy) => setFyYear(fy.split('-')[0])}
                  selectedMonth={periodType === 'month' ? periodValue : ''}
                  onMonthChange={setPeriodValue}
                  selectedQuarter={periodType === 'quarter' ? periodValue : ''}
                  onQuarterChange={setPeriodValue}
                  className="mb-8"
                />

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="force-refresh"
                    checked={forceRefresh}
                    onChange={(e) => setForceRefresh(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <Label htmlFor="force-refresh" className="text-sm font-medium cursor-pointer">
                    Force Refresh (Bypass Cache)
                  </Label>
                </div>

                <Button onClick={handleReconcile} disabled={loading} className="w-full shadow-glow py-6 text-lg">
                  {loading ? 'Generating Report...' : 'Start Comprehensive Reconciliation'}
                </Button>

                {loading && (
                  <div className="mt-4 p-6 bg-primary/5 border border-primary/20 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full border-2 border-primary/20 animate-pulse"></div>
                        <RefreshCw className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Generating Reconciliation Report</p>
                        <p className="text-xs text-muted-foreground mt-1 italic">Fetching GSTR-1, GSTR-2B and GSTR-3B data from GST Portal...</p>
                      </div>
                    </div>
                    <div className="mt-5 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-full rounded-full animate-progress-fast" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-6">
                {/* Header with Period Controls */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Reconciliation Results</h3>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] tracking-widest font-black">
                        {periodType} ({periodValue || 'FULL YEAR'})
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                        onClick={() => setResults([])} variant="outline" size="sm">
                        <RefreshCw className="w-3.5 h-3.5 mr-2" />
                        New Analysis
                      </Button>
                      <Button
                        onClick={() => {
                          let mNum = null;
                          let yrNum = null;
                          if (periodType === 'month') {
                            mNum = parseInt(periodValue);
                            yrNum = mNum >= 4 ? parseInt(fyYear) : parseInt(fyYear) + 1;
                          }
                          download3BDetails(yrNum, mNum);
                        }}
                        variant="outline"
                        size="sm"
                        className="border-primary/30 text-primary hover:bg-primary/5 font-semibold"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 mr-2" /> 3B Details
                      </Button>
                      <Button onClick={downloadExcel} variant="outline" size="sm" className="bg-green-500/5 text-green-600 border-green-500/20 hover:bg-green-500/10 font-semibold">
                        <FileSpreadsheet className="w-3.5 h-3.5 mr-2" /> Excel
                      </Button>
                      <Button onClick={downloadPDF} variant="outline" size="sm" className="bg-red-500/5 text-red-600 border-red-500/20 hover:bg-red-500/10 font-semibold">
                        <Download className="w-3.5 h-3.5 mr-2" /> PDF
                      </Button>
                    </div>
                  </div>

                  {/* Period Selection Row - Simplified in standardized style */}
                  <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Label className="text-xs uppercase tracking-widest font-black text-muted-foreground">FY</Label>
                      <Select value={fyYear} onValueChange={setFyYear}>
                        <SelectTrigger className="w-[120px] h-9 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}-{year + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-3 border-l pl-4 border-border/50">
                      <Label className="text-xs uppercase tracking-widest font-black text-muted-foreground">Period</Label>
                      <Select value={periodType} onValueChange={(v) => { setPeriodType(v); setPeriodValue(''); }}>
                        <SelectTrigger className="w-[120px] h-9 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fy">Full Year</SelectItem>
                          <SelectItem value="quarter">Quarter</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {periodType === 'quarter' && (
                      <div className="flex items-center gap-3 border-l pl-4 border-border/50">
                        <Select value={periodValue} onValueChange={setPeriodValue}>
                          <SelectTrigger className="w-[130px] h-9 bg-background">
                            <SelectValue placeholder="Select Q" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Q1 (Apr-Jun)</SelectItem>
                            <SelectItem value="2">Q2 (Jul-Sep)</SelectItem>
                            <SelectItem value="3">Q3 (Oct-Dec)</SelectItem>
                            <SelectItem value="4">Q4 (Jan-Mar)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {periodType === 'month' && (
                      <div className="flex items-center gap-3 border-l pl-4 border-border/50">
                        <Select value={periodValue} onValueChange={setPeriodValue}>
                          <SelectTrigger className="w-[130px] h-9 bg-background">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {fyMonths.map(m => (
                              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button
                      onClick={handleReconcile}
                      disabled={loading}
                      className="ml-auto h-9 px-6 font-bold"
                      size="sm"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Run Reconciliation'}
                    </Button>
                  </div>
                </div>

                {/* Tabbed View: Sales vs Purchases */}
                <Tabs defaultValue="sales" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="sales" className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Sales (R1 vs 3B)
                    </TabsTrigger>
                    <TabsTrigger value="purchases" className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Purchases (2B vs 3B)
                    </TabsTrigger>
                  </TabsList>

                  {/* Sales Tab: GSTR-1 vs GSTR-3B */}
                  <TabsContent value="sales">
                    {results.map((r, i) => (
                      <div key={i} className="mb-6 border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur-sm shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-lg text-primary">{monthName(r.month)} {r.year}</h4>
                          <span className={`px-3 py-1.5 text-xs rounded-full font-medium flex items-center gap-1.5 ${r.sales_status === 'MATCH' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            r.sales_status === 'NO DATA' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                              r.sales_status === 'INCOMPLETE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                            {r.sales_status === 'MATCH' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {(r.sales_status === 'MISMATCH' || r.sales_status === 'INCOMPLETE') && <AlertTriangle className="w-3.5 h-3.5" />}
                            {r.sales_status === 'MATCH' ? 'MATCHED' : r.sales_status}
                          </span>
                        </div>
                        <Table>
                          <TableHeader className="bg-primary/10">
                            <TableRow>
                              <TableHead className="w-[40%]">Particular</TableHead>
                              <TableHead className="text-right">GSTR-1</TableHead>
                              <TableHead className="text-right">GSTR-3B</TableHead>
                              <TableHead className="text-right">Difference</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <RecoRow label="3.1.a Taxable Value" v1={r.tx1} v2={r.tx3} />
                            <RecoRow label="3.1.a IGST" v1={r.ig1} v2={r.ig3} />
                            <RecoRow label="3.1.a CGST" v1={r.cg1} v2={r.cg3} />
                            <RecoRow label="3.1.a SGST" v1={r.sg1} v2={r.sg3} />
                            <RecoRow label="3.1.b Exports Taxable" v1={r.exp_tx1} v2={r.exp_tx3} />
                            <RecoRow label="3.1.b Exports IGST" v1={r.exp_ig1} v2={r.exp_ig3} />
                            <RecoRow label="3.1.c Nil/Exempt" v1={r.nil_tx1} v2={r.nil_tx3} />
                            <RecoRow label="3.1.e Non-GST" v1={r.ng1} v2={r.ng3} />
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                  </TabsContent>

                  {/* Purchases Tab: GSTR-2B vs GSTR-3B ITC */}
                  <TabsContent value="purchases">
                    {results.map((r, i) => (
                      <div key={i} className="mb-6 border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur-sm shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-lg text-green-400">{monthName(r.month)} {r.year}</h4>
                          <span className={`px-3 py-1.5 text-xs rounded-full font-medium flex items-center gap-1.5 ${r.itc_status === 'RISK' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            r.itc_status === 'RECONCILED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              r.itc_status === 'MATCH' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                r.itc_status === 'PARTIAL' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                            {r.itc_status === 'RISK' && <AlertTriangle className="w-3.5 h-3.5" />}
                            {(r.itc_status === 'RECONCILED' || r.itc_status === 'MATCH') && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {r.itc_status === 'PARTIAL' && <Info className="w-3.5 h-3.5" />}
                            {r.itc_status === 'RISK' ? 'EXCESS CLAIM' :
                              r.itc_status === 'RECONCILED' ? 'RECONCILED' :
                                r.itc_status === 'MATCH' ? 'MATCHED' :
                                  r.itc_status === 'PARTIAL' ? 'PARTIAL CLAIM' :
                                    r.itc_status}
                          </span>
                        </div>

                        {/* ITC Table */}
                        <Table>
                          <TableHeader className="bg-green-500/10">
                            <TableRow>
                              <TableHead className="w-[40%]">ITC Component</TableHead>
                              <TableHead className="text-right">GSTR-2B</TableHead>
                              <TableHead className="text-right">GSTR-3B (Adj)</TableHead>
                              <TableHead className="text-right">Difference</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <RecoRow label="IGST" v1={r.itc_2b_igst} v2={r.itc_adj_igst} />
                            <RecoRow label="CGST" v1={r.itc_2b_cgst} v2={r.itc_adj_cgst} />
                            <RecoRow label="SGST" v1={r.itc_2b_sgst} v2={r.itc_adj_sgst} />
                            <RecoRow label="CESS" v1={r.itc_2b_cess} v2={r.itc_adj_cess} />
                          </TableBody>
                        </Table>

                        {/* RCM Info Section */}
                        {(r.itc_rcm_igst > 0 || r.itc_rcm_cgst > 0 || r.itc_rcm_sgst > 0) && (
                          <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-sm font-medium text-yellow-400 mb-2">
                              RCM/Imports ITC (Claimed in 3B but not in 2B):
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-yellow-300">
                              {r.itc_rcm_igst > 0 && <span>IGST: {fmt(r.itc_rcm_igst)}</span>}
                              {r.itc_rcm_cgst > 0 && <span>CGST: {fmt(r.itc_rcm_cgst)}</span>}
                              {r.itc_rcm_sgst > 0 && <span>SGST: {fmt(r.itc_rcm_sgst)}</span>}
                              {r.itc_rcm_cess > 0 && <span>CESS: {fmt(r.itc_rcm_cess)}</span>}
                            </div>
                            <p className="text-xs text-yellow-400/70 mt-2">
                              💡 Note: 3B values above are adjusted (Total 3B - RCM) for proper comparison with 2B
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            )}
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
                <span>Reconcile sales data between GSTR-1 and GSTR-3B</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Verify ITC availability between GSTR-2B and GSTR-3B</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Identify excess ITC claims or missing sales reporting</span>
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
}