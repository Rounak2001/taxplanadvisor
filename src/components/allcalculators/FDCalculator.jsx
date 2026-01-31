import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PiggyBank } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";

export const FDCalculator = ({ isDashboard = false, backPath }) => {
  const [principal, setPrincipal] = useState(100000);
  const [interestRate, setInterestRate] = useState(7);
  const [tenure, setTenure] = useState(1);
  const [compoundingFrequency, setCompoundingFrequency] = useState("quarterly");

  const calculateFD = () => {
    const r = interestRate / 100;
    let maturityAmount;

    if (compoundingFrequency === "simple") {
      // Simple Interest
      maturityAmount = principal * (1 + r * tenure);
    } else {
      // Compound Interest
      const frequencies = {
        quarterly: 4,
        monthly: 12,
        yearly: 1
      };
      const n = frequencies[compoundingFrequency];
      maturityAmount = principal * Math.pow(1 + r / n, n * tenure);
    }

    const interestEarned = maturityAmount - principal;

    return {
      maturityAmount: Math.round(maturityAmount),
      interestEarned: Math.round(interestEarned)
    };
  };

  const result = calculateFD();

  return (
    <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PiggyBank className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">FD Calculator</h1>
          </div>
          <p className="text-muted-foreground text-lg">Calculate Fixed Deposit returns</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>FD Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Principal Amount (₹)</Label>
                  <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value === '' ? '' : Number(e.target.value))} className="w-32 text-right" />
                </div>
                <Slider value={[principal]} onValueChange={(v) => setPrincipal(v[0])} min={10000} max={10000000} step={10000} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Interest Rate (% p.a.)</Label>
                  <Input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-32 text-right" step="0.1" />
                </div>
                <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={1} max={15} step={0.1} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Tenure (Years)</Label>
                  <Input type="number" value={tenure} onChange={(e) => setTenure(e.target.value === '' ? '' : Number(e.target.value))} className="w-32 text-right" />
                </div>
                <Slider value={[tenure]} onValueChange={(v) => setTenure(v[0])} min={0.25} max={10} step={0.25} />
              </div>

              <div className="space-y-3">
                <Label>Compounding Frequency</Label>
                <RadioGroup value={compoundingFrequency} onValueChange={setCompoundingFrequency}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="simple" id="simple" />
                    <Label htmlFor="simple" className="cursor-pointer font-normal">Simple Interest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer font-normal">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quarterly" id="quarterly" />
                    <Label htmlFor="quarterly" className="cursor-pointer font-normal">Quarterly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly" className="cursor-pointer font-normal">Yearly</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Maturity Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Principal Amount</p>
                <p className="text-2xl font-bold">₹{principal.toLocaleString()}</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Interest Earned</p>
                <p className="text-2xl font-bold text-primary">₹{result.interestEarned.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-primary to-primary/90 p-4 rounded-lg text-white">
                <p className="text-sm opacity-90 mb-1">Maturity Amount</p>
                <p className="text-3xl font-bold">₹{result.maturityAmount.toLocaleString()}</p>
              </div>
              <div className="glass-card p-3 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">After {tenure} years at {interestRate}% p.a.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-base text-foreground space-y-6 leading-relaxed">
          <div>
            <h3 className="font-semibold text-lg mb-3">What is a Fixed Deposit?</h3>
            <p>A Fixed Deposit (FD) is a financial instrument offered by banks and NBFCs where you deposit a lump sum amount for a fixed period at a predetermined interest rate. It's one of the safest investment options in India, offering guaranteed returns with minimal risk.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Key Features</h3>
            <p>• Guaranteed Returns: Fixed interest rate throughout the tenure</p>
            <p>• Safety: Deposits up to ₹5 lakh insured by DICGC</p>
            <p>• Flexible Tenure: 7 days to 10 years</p>
            <p>• Loan Facility: Can avail loan against FD up to 90% of deposit</p>
            <p>• Senior Citizen Benefits: Additional 0.25% - 0.75% interest</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Interest Calculation Types</h3>
            <p><strong>Simple Interest:</strong> Interest calculated only on principal amount.</p>
            <p>Formula: SI = P × R × T / 100</p>
            <p>Example: ₹1,00,000 @ 7% for 2 years = ₹14,000 interest</p>
            <p className="mt-2"><strong>Compound Interest:</strong> Interest calculated on principal + accumulated interest.</p>
            <p>Formula: A = P(1 + r/n)^(nt)</p>
            <p>Example: ₹1,00,000 @ 7% quarterly for 2 years = ₹14,969 interest</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Real-Life Example</h3>
            <p>Rajesh wants to save ₹5,00,000 for his daughter's education in 5 years.</p>
            <p>• Savings Account (3.5%): Maturity ₹5,93,968, Interest ₹93,968</p>
            <p>• FD (7% quarterly): Maturity ₹7,07,568, Interest ₹2,07,568</p>
            <p>By choosing FD, Rajesh earns ₹1,13,600 more!</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">How to Use This Calculator</h3>
            <p>1. Enter the principal amount you want to invest (minimum ₹1,000)</p>
            <p>2. Check your bank's current FD rates (typically 5-8%)</p>
            <p>3. Select investment period (7 days to 10 years)</p>
            <p>4. Choose compounding frequency (more frequent = higher returns, Quarterly recommended)</p>
          </div>
        </div>

        <div className="mt-8 text-base text-foreground space-y-6 leading-relaxed">
          <div>
            <h3 className="font-semibold text-lg mb-3">Advantages of FD</h3>
            <p>• Guaranteed Returns: No market risk</p>
            <p>• Capital Protection: Principal amount is safe</p>
            <p>• Predictable Income: Know exact maturity amount</p>
            <p>• Flexible Tenure: Choose as per your goal</p>
            <p>• Loan Against FD: Emergency liquidity option</p>
            <p>• Tax Benefits: 5-year FD eligible for 80C deduction</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Things to Consider</h3>
            <p>• Lower Returns: Compared to equity/mutual funds</p>
            <p>• Inflation Impact: Real returns may be low</p>
            <p>• Premature Penalty: 0.5-1% penalty on early withdrawal</p>
            <p>• TDS Deduction: 10% TDS if interest &gt; ₹40,000/year</p>
            <p>• Lock-in Period: Money not accessible during tenure</p>
            <p>• Taxable Income: Interest taxed as per your slab</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Pro Tips for FD Investment</h3>
            <p>• Laddering Strategy: Split investment across multiple FDs with different maturity dates for liquidity and better rates</p>
            <p>• Compare Rates: Small finance banks often offer 1-2% higher rates than traditional banks</p>
            <p>• Auto-Renewal: Enable auto-renewal to avoid missing out on interest during reinvestment gap</p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};
