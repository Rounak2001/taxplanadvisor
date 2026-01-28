import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, FileSpreadsheet, User, ArrowLeft, CheckCircle2, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useGstStore } from '@/stores/useGstStore';
import { gstService } from '@/api/gstService';
import { GSTPeriodPicker } from './GSTPeriodPicker';
import { Badge } from '@/components/ui/badge';

export default function GSTR3BRecoPage() {
  const { sessionId, gstin, username } = useGstStore();
  const navigate = useNavigate();
  const [recoType, setRecoType] = useState("MONTHLY");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [quarter, setQuarter] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(false);

  // Using gstService for API calls

  const handleSubmit = async () => {
    if (!file || !year) {
      toast.error("Please upload file and select year");
      return;
    }

    if (recoType === "MONTHLY" && !month) {
      toast.error("Please select month");
      return;
    }

    if (recoType === "QUARTERLY" && !quarter) {
      toast.error("Please select quarter");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("reco_type", recoType);
    formData.append("year", year);
    formData.append("force_refresh", forceRefresh);
    if (month) formData.append("month", month);
    if (quarter) formData.append("quarter", quarter);

    try {
      setLoading(true);
      toast.info("Running reconciliation...");

      const data = await gstService.reconcile3BvsBooks(sessionId, formData);

      if (data.status === 'success') {
        toast.success("Reconciliation completed!");
        setResults(data.data || []);
        setSessionInfo(data.session_info);
      } else {
        toast.error(data.error || 'Reconciliation failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-semibold text-foreground">GSTR-3B vs Books</h1>
            <p className="text-muted-foreground">
              Reconcile GSTR-3B liability and ITC with your accounting books
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
            <CardDescription>
              Select the period and upload your books data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-2">Step 1: Download Template</h3>
              <Button asChild variant="outline">
                <a href="/BOOKS_DATA_TEMPLATE.xlsx" download>
                  <Download className="w-4 h-4 mr-2" />
                  Download Books Template
                </a>
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Step 2: Select Period</h3>
              <GSTPeriodPicker
                frequency={recoType === 'MONTHLY' ? 'Monthly' : recoType === 'QUARTERLY' ? 'Quarterly' : 'Annually'}
                onFrequencyChange={(freq) => setRecoType(freq === 'Monthly' ? 'MONTHLY' : freq === 'Quarterly' ? 'QUARTERLY' : 'FY')}
                selectedFY={year ? `${year}-${(parseInt(year) + 1)}` : `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}
                onFYChange={(fy) => setYear(fy.split('-')[0])}
                selectedMonth={month}
                onMonthChange={setMonth}
                selectedQuarter={quarter}
                onQuarterChange={setQuarter}
                className="mb-8"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Step 3: Upload Template</h3>
              <div className="p-4 border-2 border-dashed rounded-lg bg-background/50 flex flex-col items-center justify-center gap-2">
                <Input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} className="cursor-pointer" />
                {file && <p className="text-sm text-green-600 font-medium italic">Selected: {file.name}</p>}
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={loading} className="w-full h-12 text-lg shadow-glow">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing Reconciliation...
                </span>
              ) : "Run Reconciliation"}
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
                <span>Verify liability reporting accuracy between books and filed 3B</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Match ITC claimed in 3B with your purchase register</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Identify discrepancies that may lead to GST notices</span>
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

      {results && results.length > 0 && (
        <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-muted/20 p-4 rounded-xl border">
            <h3 className="text-2xl font-bold text-foreground">Reconciliation Results</h3>
          </div>

          {results.map((monthBlock, idx) => (
            <div key={idx} className="border border-border/50 rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm shadow-xl">
              <div className="flex justify-between items-center p-4 bg-primary/10 border-b border-border/50">
                <h4 className="font-bold text-lg text-primary">{monthBlock.month}</h4>
                <span className={`px-4 py-1.5 text-xs rounded-full font-bold flex items-center gap-1.5 ${monthBlock.status === 'MATCHED'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                  {monthBlock.status === 'MATCHED' && <CheckCircle2 className="w-4 h-4" />}
                  {monthBlock.status === 'MISMATCHED' && <AlertTriangle className="w-4 h-4" />}
                  {monthBlock.status}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Description</th>
                      <th className="px-6 py-3 font-semibold text-right">Books Amount</th>
                      <th className="px-6 py-3 font-semibold text-right">Filed 3B Amount</th>
                      <th className="px-6 py-3 font-semibold text-right">Difference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {monthBlock.rows.map((row, rIdx) => {
                      const isMismatch = Math.abs(row.diff) > 1.0;
                      return (
                        <tr key={rIdx} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-3 font-medium text-foreground">{row.particular}</td>
                          <td className="px-6 py-3 text-right tabular-nums text-muted-foreground">
                            ₹{row.v1?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-3 text-right tabular-nums text-muted-foreground">
                            ₹{row.v2?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className={`px-6 py-3 text-right font-bold tabular-nums ${isMismatch ? 'text-red-500' : 'text-green-500'}`}>
                            {row.diff > 0.01 ? '+' : ''}₹{row.diff?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}