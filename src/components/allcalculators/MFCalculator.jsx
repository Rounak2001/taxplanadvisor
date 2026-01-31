import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Percent } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";

export const MFCalculator = ({ isDashboard = false, backPath }) => {
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [investmentPeriod, setInvestmentPeriod] = useState(5);
  const [exitLoad, setExitLoad] = useState(1);

  const calculateReturns = () => {
    const futureValue = investmentAmount * Math.pow(1 + expectedReturn / 100, investmentPeriod);
    const returns = futureValue - investmentAmount;
    const exitLoadAmount = (futureValue * exitLoad) / 100;
    const finalValue = futureValue - exitLoadAmount;
    return {
      futureValue: Math.round(futureValue),
      returns: Math.round(returns),
      exitLoadAmount: Math.round(exitLoadAmount),
      finalValue: Math.round(finalValue)
    };
  };

  const result = calculateReturns();

  return (
    <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Percent className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Mutual Fund Returns Calculator</h1>
          </div>
          <p className="text-muted-foreground text-lg">Calculate your mutual fund investment returns</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Investment Amount (₹)</Label>
                  <Input type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))} className="w-32 text-right" />
                </div>
                <Slider value={[investmentAmount]} onValueChange={(v) => setInvestmentAmount(v[0])} min={10000} max={10000000} step={10000} />
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
                  <Label>Investment Period (Years)</Label>
                  <Input type="number" value={investmentPeriod} onChange={(e) => setInvestmentPeriod(Number(e.target.value))} className="w-32 text-right" />
                </div>
                <Slider value={[investmentPeriod]} onValueChange={(v) => setInvestmentPeriod(v[0])} min={1} max={30} step={1} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Exit Load (%)</Label>
                  <Input type="number" value={exitLoad} onChange={(e) => setExitLoad(Number(e.target.value))} className="w-32 text-right" step="0.1" />
                </div>
                <Slider value={[exitLoad]} onValueChange={(v) => setExitLoad(v[0])} min={0} max={5} step={0.1} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Returns Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Invested Amount</p>
                <p className="text-2xl font-bold">₹{investmentAmount.toLocaleString()}</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Estimated Returns</p>
                <p className="text-2xl font-bold text-primary">₹{result.returns.toLocaleString()}</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Exit Load</p>
                <p className="text-xl font-bold text-red-600">-₹{result.exitLoadAmount.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-primary to-primary/90 p-4 rounded-lg text-white">
                <p className="text-sm opacity-90 mb-1">Final Value</p>
                <p className="text-3xl font-bold">₹{result.finalValue.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-base text-foreground space-y-6 leading-relaxed">
          <div>
            <h3 className="font-semibold text-lg mb-3">What are Mutual Funds?</h3>
            <p>Mutual Funds pool money from multiple investors to invest in stocks, bonds, or other securities. Professional fund managers manage the portfolio, making it ideal for investors who don't have time or expertise to pick individual stocks.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Key Benefits</h3>
            <p>• Professional Management: Expert fund managers handle your investments</p>
            <p>• Diversification: Your money spread across multiple stocks/bonds</p>
            <p>• Liquidity: Redeem units anytime (except ELSS with 3-year lock-in)</p>
            <p>• Affordability: Start with as low as ₹500</p>
            <p>• Transparency: Daily NAV updates and regular portfolio disclosures</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Understanding Exit Load</h3>
            <p>Exit load is a fee charged when you redeem your mutual fund units before a specified period. It discourages short-term trading and protects long-term investors.</p>
            <p className="mt-2"><strong>Common Structure:</strong> 1% if redeemed within 1 year, 0% after 1 year</p>
            <p><strong>Example:</strong> Redeem ₹1 lakh worth units in 6 months with 1% exit load = ₹1,000 deducted</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Types of Mutual Funds</h3>
            <p>• Equity Funds: Invest in stocks, higher risk, 12-15% expected returns</p>
            <p>• Debt Funds: Invest in bonds, lower risk, 6-8% expected returns</p>
            <p>• Hybrid Funds: Mix of equity and debt, moderate risk, 9-12% returns</p>
            <p>• Index Funds: Track market indices like Nifty 50, low cost</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Pro Tips</h3>
            <p>• Long-term Horizon: Stay invested for 5+ years to ride out volatility</p>
            <p>• SIP over Lumpsum: Rupee cost averaging reduces timing risk</p>
            <p>• Check Expense Ratio: Lower is better, aim for under 1.5%</p>
            <p>• Tax Planning: ELSS funds offer 80C deduction up to ₹1.5 lakh</p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};
