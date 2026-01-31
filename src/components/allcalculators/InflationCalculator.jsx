import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";

export const InflationCalculator = ({ isDashboard = false, backPath }) => {
  const [currentCost, setCurrentCost] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [timePeriod, setTimePeriod] = useState(10);

  const calculateInflation = () => {
    const futureCost = currentCost * Math.pow(1 + inflationRate / 100, timePeriod);
    const totalIncrease = futureCost - currentCost;
    return {
      futureCost: Math.round(futureCost),
      totalIncrease: Math.round(totalIncrease)
    };
  };

  const result = calculateInflation();

  return (
    <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Inflation Calculator</h1>
          </div>
          <p className="text-muted-foreground text-lg">Calculate future cost considering inflation</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Inflation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Current Cost (₹)</Label>
                  <Input type="number" value={currentCost} onChange={(e) => setCurrentCost(Number(e.target.value))} className="w-32 text-right" />
                </div>
                <Slider value={[currentCost]} onValueChange={(v) => setCurrentCost(v[0])} min={1000} max={10000000} step={1000} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Inflation Rate (% p.a.)</Label>
                  <Input type="number" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="w-32 text-right" step="0.5" />
                </div>
                <Slider value={[inflationRate]} onValueChange={(v) => setInflationRate(v[0])} min={1} max={20} step={0.5} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Time Period (Years)</Label>
                  <Input type="number" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} className="w-32 text-right" />
                </div>
                <Slider value={[timePeriod]} onValueChange={(v) => setTimePeriod(v[0])} min={1} max={50} step={1} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Future Cost</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Current Cost</p>
                <p className="text-2xl font-bold">₹{currentCost.toLocaleString()}</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Inflation Rate</p>
                <p className="text-2xl font-bold">{inflationRate}% per year</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Increase</p>
                <p className="text-2xl font-bold text-orange-600">₹{result.totalIncrease.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-primary to-primary/90 p-4 rounded-lg text-white">
                <p className="text-sm opacity-90 mb-1">Future Cost (After {timePeriod} years)</p>
                <p className="text-3xl font-bold">₹{result.futureCost.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-base text-foreground space-y-6 leading-relaxed">
          <div>
            <h3 className="font-semibold text-lg mb-3">What is Inflation?</h3>
            <p>Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power. What costs ₹100 today will cost more in the future. Understanding inflation is crucial for financial planning and retirement corpus calculation.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Why Inflation Matters</h3>
            <p>• Erodes Purchasing Power: Your money buys less over time</p>
            <p>• Affects Goals: Child's education or retirement needs more money than today</p>
            <p>• Investment Returns: Real return = Nominal return - Inflation rate</p>
            <p>• Salary Planning: Need annual increments to maintain lifestyle</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Inflation Formula</h3>
            <p><strong>Future Cost = Current Cost × (1 + Inflation Rate)^Number of Years</strong></p>
            <p className="mt-2">Example: ₹1 lakh expense today at 6% inflation for 10 years</p>
            <p>Future Cost = 1,00,000 × (1.06)^10 = ₹1,79,085</p>
            <p>You'll need 79% more money for the same lifestyle!</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">India's Inflation Rates</h3>
            <p>• General Inflation: 5-7% average over long term</p>
            <p>• Healthcare: 10-12% (much higher than general inflation)</p>
            <p>• Education: 8-10% (private schools/colleges)</p>
            <p>• Food: 6-8% (varies with agricultural output)</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Beating Inflation</h3>
            <p>• Equity Investments: 12-15% returns beat 6% inflation comfortably</p>
            <p>• Real Estate: Appreciates faster than inflation in good locations</p>
            <p>• Gold: Traditional inflation hedge, 8-10% long-term returns</p>
            <p>• Avoid Cash: Keeping money idle means losing 6% value annually</p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};
