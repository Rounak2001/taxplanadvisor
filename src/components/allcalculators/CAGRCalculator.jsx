import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";

export const CAGRCalculator = ({ isDashboard = false, backPath }) => {
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(200000);
  const [duration, setDuration] = useState(5);

  const calculateCAGR = () => {
    const cagr = (Math.pow(finalValue / initialValue, 1 / duration) - 1) * 100;
    const absoluteReturn = ((finalValue - initialValue) / initialValue) * 100;
    return { cagr: cagr.toFixed(2), absoluteReturn: absoluteReturn.toFixed(2) };
  };

  const result = calculateCAGR();

  return (
    <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LineChart className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">CAGR Calculator</h1>
          </div>
          <p className="text-muted-foreground text-lg">Calculate Compound Annual Growth Rate</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Initial Investment (₹)</Label>
                <Input type="number" value={initialValue} onChange={(e) => setInitialValue(Number(e.target.value))} />
              </div>
              <div>
                <Label>Final Value (₹)</Label>
                <Input type="number" value={finalValue} onChange={(e) => setFinalValue(Number(e.target.value))} />
              </div>
              <div>
                <Label>Duration (Years)</Label>
                <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="glass-card p-6 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">CAGR</p>
                <p className="text-4xl font-bold text-primary">{result.cagr}%</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Absolute Return</p>
                <p className="text-2xl font-bold">{result.absoluteReturn}%</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Gain</p>
                <p className="text-2xl font-bold text-primary">₹{(finalValue - initialValue).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-base text-foreground space-y-6 leading-relaxed">
          <div>
            <h3 className="font-semibold text-lg mb-3">What is CAGR?</h3>
            <p>CAGR (Compound Annual Growth Rate) represents the rate at which an investment would have grown if it grew at a steady rate annually. It smoothens out volatility and gives you a single percentage that represents overall growth over multiple years.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Why CAGR Matters</h3>
            <p>• True Performance: Shows actual annualized return, not just total return</p>
            <p>• Easy Comparison: Compare different investments with different time periods</p>
            <p>• Realistic Expectations: Understand what consistent growth rate you achieved</p>
            <p>• Investment Planning: Set realistic return expectations for future goals</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">CAGR Formula</h3>
            <p><strong>CAGR = [(Final Value / Initial Value)^(1/Number of Years) - 1] × 100</strong></p>
            <p className="mt-2">Example: ₹1 lakh grows to ₹2 lakh in 5 years</p>
            <p>CAGR = [(2,00,000 / 1,00,000)^(1/5) - 1] × 100 = 14.87%</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">CAGR vs Absolute Return</h3>
            <p><strong>Absolute Return:</strong> Simple percentage gain = (Final - Initial) / Initial × 100</p>
            <p><strong>CAGR:</strong> Annualized return considering compounding effect</p>
            <p className="mt-2">If investment doubles in 5 years: Absolute Return = 100%, but CAGR = 14.87%</p>
            <p>CAGR is more useful for comparing investments with different time periods</p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};
