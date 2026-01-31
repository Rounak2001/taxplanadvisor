import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Target } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";

export const SWPCalculator = ({ isDashboard = false, backPath }) => {
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const calculateSWP = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    let balance = totalInvestment;
    let totalWithdrawn = 0;

    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
      totalWithdrawn += monthlyWithdrawal;
      if (balance <= 0) {
        return { finalValue: 0, totalWithdrawn: (i + 1) * monthlyWithdrawal, monthsLasted: i + 1 };
      }
    }

    return { finalValue: Math.round(balance), totalWithdrawn, monthsLasted: months };
  };

  const result = calculateSWP();

  return (
    <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">SWP Calculator</h1>
          </div>
          <p className="text-muted-foreground text-lg">Systematic Withdrawal Plan - Plan your regular income</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Total Investment (₹)</Label>
                  <Input type="number" value={totalInvestment} onChange={(e) => setTotalInvestment(Number(e.target.value))} className="w-32 text-right" />
                </div>
                <Slider value={[totalInvestment]} onValueChange={(v) => setTotalInvestment(v[0])} min={100000} max={10000000} step={50000} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Monthly Withdrawal (₹)</Label>
                  <Input type="number" value={monthlyWithdrawal} onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))} className="w-32 text-right" />
                </div>
                <Slider value={[monthlyWithdrawal]} onValueChange={(v) => setMonthlyWithdrawal(v[0])} min={1000} max={100000} step={1000} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Expected Return (% p.a.)</Label>
                  <Input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-32 text-right" step="0.5" />
                </div>
                <Slider value={[expectedReturn]} onValueChange={(v) => setExpectedReturn(v[0])} min={1} max={30} step={0.5} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Time Period (Years)</Label>
                  <Input type="number" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} className="w-32 text-right" />
                </div>
                <Slider value={[timePeriod]} onValueChange={(v) => setTimePeriod(v[0])} min={1} max={30} step={1} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Withdrawal Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Initial Investment</p>
                <p className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Withdrawn</p>
                <p className="text-2xl font-bold text-primary">₹{result.totalWithdrawn.toLocaleString()}</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Final Value</p>
                <p className="text-2xl font-bold text-blue-600">₹{result.finalValue.toLocaleString()}</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="text-2xl font-bold">{(result.monthsLasted / 12).toFixed(1)} years</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-base text-foreground space-y-6 leading-relaxed">
          <div>
            <h3 className="font-semibold text-lg mb-3">What is SWP?</h3>
            <p>SWP (Systematic Withdrawal Plan) allows you to withdraw a fixed amount from your mutual fund investment at regular intervals. It's the opposite of SIP - instead of investing regularly, you withdraw regularly while your remaining corpus continues to grow.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Key Benefits</h3>
            <p>• Regular Income: Get fixed monthly income like a salary or pension</p>
            <p>• Tax Efficient: Only capital gains taxed, not entire withdrawal amount</p>
            <p>• Flexibility: Change withdrawal amount or pause anytime</p>
            <p>• Corpus Growth: Remaining amount continues earning returns</p>
            <p>• Ideal for Retirees: Create your own pension plan</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">How SWP Works</h3>
            <p>You invest a lumpsum amount in a mutual fund and set up monthly withdrawals. Each month, units worth your withdrawal amount are redeemed. The remaining units continue to grow based on fund performance.</p>
            <p className="mt-2"><strong>Example:</strong> Invest ₹10 lakh, withdraw ₹10,000/month. If fund gives 12% returns, your corpus can last 15+ years while providing regular income.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Important Considerations</h3>
            <p>• Sustainable Rate: Keep withdrawal rate below expected returns to preserve capital</p>
            <p>• Market Risk: Returns fluctuate, corpus may deplete faster in bear markets</p>
            <p>• Emergency Buffer: Keep 6-12 months expenses separate for emergencies</p>
            <p>• Tax Planning: Long-term capital gains above ₹1.25L taxed at 12.5%</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Pro Tips</h3>
            <p>• Conservative Withdrawal: Limit to 6-8% annually to make corpus last longer</p>
            <p>• Balanced Funds: Choose hybrid funds for stable returns with lower volatility</p>
            <p>• Review Quarterly: Adjust withdrawal if corpus depleting faster than expected</p>
            <p>• Inflation Adjustment: Increase withdrawal by 5-6% annually to maintain purchasing power</p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};
