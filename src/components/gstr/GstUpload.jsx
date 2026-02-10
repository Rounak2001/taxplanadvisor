import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function GstUpload() {
  const [gstr1, setGstr1] = useState(null);
  const [gstr3b, setGstr3b] = useState(null);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pollResult = async (jobId) => {
    const interval = setInterval(async () => {
      const res = await axios.get(`/api/reconciliationjobs/${jobId}/result/`);
      if (res.data.status === "COMPLETED") {
        clearInterval(interval);
        setResult(res.data.result);
        setMessage("Reconciliation completed!");
        setLoading(false);
      } else if (res.data.status === "FAILED") {
        clearInterval(interval);
        setMessage("Reconciliation failed: " + res.data.error_message);
        setLoading(false);
      }
    }, 2000);
  };

  const handleUpload = async () => {
    if (!gstr1 || !gstr3b) return setMessage("Select both files");
    setLoading(true);
    setResult(null);
    const fd = new FormData();
    fd.append("file", gstr1);
    fd.append("role", "GSTR1");
    const a = await axios.post("/api/uploadedfiles/", fd, { headers: { "Content-Type": "multipart/form-data" } });
    const g1 = a.data;
    const fd2 = new FormData();
    fd2.append("file", gstr3b);
    fd2.append("role", "GSTR3B");
    const b = await axios.post("/api/uploadedfiles/", fd2, { headers: { "Content-Type": "multipart/form-data" } });
    const g3 = b.data;
    const job = await axios.post("/api/reconciliationjobs/", {
      gstin: "27AAMCR5575Q1ZA",
      period: "2025-09",
      gstr1: g1.id,
      gstr3b: g3.id
    });
    await axios.post(`/api/reconciliationjobs/${job.data.id}/start/`);
    setMessage("Processing reconciliation....");
    pollResult(job.data.id);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 py-8 px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">GST Reconciliation</h1>
            </div>
            <p className="text-muted-foreground text-lg">Compare GSTR-1 vs GSTR-3B and identify discrepancies</p>
          </div>

          <Card className="glass-card shadow-elevated mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload GST Returns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gstr1">GSTR-1 File</Label>
                  <Input
                    id="gstr1"
                    type="file"
                    onChange={(e) => setGstr1(e.target.files[0])}
                    className="cursor-pointer"
                  />
                  {gstr1 && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {gstr1.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstr3b">GSTR-3B File</Label>
                  <Input
                    id="gstr3b"
                    type="file"
                    onChange={(e) => setGstr3b(e.target.files[0])}
                    className="cursor-pointer"
                  />
                  {gstr3b && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {gstr3b.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleUpload}
                  disabled={loading || !gstr1 || !gstr3b}
                  className="bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-glow glow-effect"
                  size="lg"
                >
                  {loading ? "Processing..." : "Upload & Reconcile"}
                </Button>
              </div>

              {message && (
                <div className="text-center p-4 glass-card rounded-lg">
                  <p className="text-foreground">{message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {result && (
            <Card className="glass-card shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.is_reconciled ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  GST Reconciliation Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.reconciliation_note && (
                  <p className="text-sm text-muted-foreground italic mb-4">{result.reconciliation_note}</p>
                )}

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <Card className="border border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">GSTR-1 Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {result.gstr1_summary?.total_records > 0 && (
                        <p className="text-sm"><span className="font-semibold">Total Records:</span> {result.gstr1_summary.total_records}</p>
                      )}
                      <p className="text-sm">Taxable Value: ₹{result.gstr1_summary?.total_taxable?.toFixed(2) || 0}</p>
                      <p className="text-sm">IGST: ₹{result.gstr1_summary?.igst?.toFixed(2) || 0}</p>
                      <p className="text-sm">CGST: ₹{result.gstr1_summary?.cgst?.toFixed(2) || 0}</p>
                      <p className="text-sm">SGST: ₹{result.gstr1_summary?.sgst?.toFixed(2) || 0}</p>
                      {result.gstr1_summary?.cess > 0 && (
                        <p className="text-sm">Cess: ₹{result.gstr1_summary.cess.toFixed(2)}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">GSTR-3B Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {result.gstr3b_summary?.total_records > 0 && (
                        <p className="text-sm"><span className="font-semibold">Total Records:</span> {result.gstr3b_summary.total_records}</p>
                      )}
                      <p className="text-sm">Taxable Value: ₹{result.gstr3b_summary?.total_taxable?.toFixed(2) || 0}</p>
                      <p className="text-sm">IGST: ₹{result.gstr3b_summary?.igst?.toFixed(2) || 0}</p>
                      <p className="text-sm">CGST: ₹{result.gstr3b_summary?.cgst?.toFixed(2) || 0}</p>
                      <p className="text-sm">SGST: ₹{result.gstr3b_summary?.sgst?.toFixed(2) || 0}</p>
                      {result.gstr3b_summary?.cess > 0 && (
                        <p className="text-sm">Cess: ₹{result.gstr3b_summary.cess.toFixed(2)}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className={`border ${result.is_reconciled ? 'border-green-500/50 bg-green-50/50' : 'border-red-500/50 bg-red-50/50'} mb-6`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {result.is_reconciled ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      Differences (GSTR-1 - GSTR-3B)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm"><span className="font-semibold">Status:</span> {result.is_reconciled ? "✅ Reconciled" : "❌ Mismatch Found"}</p>
                    <p className="text-sm">Taxable Value Δ: ₹{result.summary_deltas?.total_taxable_delta?.toFixed(2) || 0}</p>
                    <p className="text-sm">IGST Δ: ₹{result.summary_deltas?.igst_delta?.toFixed(2) || 0}</p>
                    <p className="text-sm">CGST Δ: ₹{result.summary_deltas?.cgst_delta?.toFixed(2) || 0}</p>
                    <p className="text-sm">SGST Δ: ₹{result.summary_deltas?.sgst_delta?.toFixed(2) || 0}</p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Reconciliation Table</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border/50 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-primary text-primary-foreground">
                          <th className="border border-border/50 p-3 text-left font-semibold">Particular</th>
                          <th className="border border-border/50 p-3 text-right font-semibold">GSTR-1</th>
                          <th className="border border-border/50 p-3 text-right font-semibold">GSTR-3B</th>
                          <th className="border border-border/50 p-3 text-right font-semibold">Difference</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border/50 p-2 font-semibold text-foreground">Total Taxable Value</td>
                          <td className="border border-border/50 p-2 text-right text-foreground">{result.gstr1_summary?.total_taxable?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="border border-border/50 p-2 text-right text-foreground">{result.gstr3b_summary?.total_taxable?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className={`border border-border/50 p-2 text-right font-semibold ${Math.abs(result.summary_deltas?.total_taxable_delta || 0) < 1 ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(result.summary_deltas?.total_taxable_delta || 0) < 1 ? "0" : result.summary_deltas?.total_taxable_delta?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                        <tr style={{ backgroundColor: "#f9f9f9" }}>
                          <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>IGST</td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{result.gstr1_summary?.igst?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{result.gstr3b_summary?.igst?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", color: Math.abs(result.summary_deltas?.igst_delta || 0) < 1 ? "green" : "red", fontWeight: "bold" }}>
                            {Math.abs(result.summary_deltas?.igst_delta || 0) < 1 ? "0" : result.summary_deltas?.igst_delta?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>CGST</td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{result.gstr1_summary?.cgst?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{result.gstr3b_summary?.cgst?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", color: Math.abs(result.summary_deltas?.cgst_delta || 0) < 1 ? "green" : "red", fontWeight: "bold" }}>
                            {Math.abs(result.summary_deltas?.cgst_delta || 0) < 1 ? "0" : result.summary_deltas?.cgst_delta?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                        <tr style={{ backgroundColor: "#f9f9f9" }}>
                          <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>SGST</td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{result.gstr1_summary?.sgst?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{result.gstr3b_summary?.sgst?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", color: Math.abs(result.summary_deltas?.sgst_delta || 0) < 1 ? "green" : "red", fontWeight: "bold" }}>
                            {Math.abs(result.summary_deltas?.sgst_delta || 0) < 1 ? "0" : result.summary_deltas?.sgst_delta?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                        {result.gstr1_categories?.Export?.taxable > 0 && (
                          <tr>
                            <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>Exports</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{result.gstr1_categories.Export.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{result.gstr3b_categories?.['3.1(b) - Zero Rated']?.taxable?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                              {((result.gstr1_categories.Export.taxable - (result.gstr3b_categories?.['3.1(b) - Zero Rated']?.taxable || 0))).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {result.is_reconciled && (
                    <Card className="border-green-500/50 bg-green-50/50 mt-4">
                      <CardContent className="p-4 text-center">
                        <p className="text-green-700 font-bold text-lg">
                          ✅ RESULT → GSTR-1 MATCHES GSTR-3B PERFECTLY
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
