import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Clock } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";

export const RetirementCalculator = ({ isDashboard = false, backPath }) => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [lifeExpectancy, setLifeExpectancy] = useState(80);
  const [inflationRate, setInflationRate] = useState(6);
  const [expectedReturn, setExpectedReturn] = useState(12);

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;

    // Future monthly expense at retirement
    const futureMonthlyExpense = monthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetirement);

    // Corpus needed at retirement (considering inflation during retirement)
    let corpusNeeded = 0;
    for (let year = 0; year < yearsInRetirement; year++) {
      const yearlyExpense = futureMonthlyExpense * 12 * Math.pow(1 + inflationRate / 100, year);
      corpusNeeded += yearlyExpense / Math.pow(1 + expectedReturn / 100, year);
    }

    // Monthly SIP needed
    const monthlyRate = expectedReturn / 12 / 100;
    const months = yearsToRetirement * 12;
    const monthlySIP = (corpusNeeded * monthlyRate) / ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate));

    return {
      corpusNeeded: Math.round(corpusNeeded),
      monthlySIP: Math.round(monthlySIP),
      futureMonthlyExpense: Math.round(futureMonthlyExpense),
      yearsToRetirement,
      yearsInRetirement
    };
  };

  const result = calculateRetirement();

  return (
    <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Retirement Calculator</h1>
          </div>
          <p className="text-muted-foreground text-lg">Plan your retirement corpus</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Retirement Planning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Current Age</Label>
                  <Input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="w-24 text-right" />
                </div>
                <Slider value={[currentAge]} onValueChange={(v) => setCurrentAge(v[0])} min={18} max={60} step={1} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Retirement Age</Label>
                  <Input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} className="w-24 text-right" />
                </div>
                <Slider value={[retirementAge]} onValueChange={(v) => setRetirementAge(v[0])} min={40} max={75} step={1} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Current Monthly Expense (₹)</Label>
                  <Input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} className="w-32 text-right" />
                </div>
                <Slider value={[monthlyExpense]} onValueChange={(v) => setMonthlyExpense(v[0])} min={10000} max={500000} step={5000} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Life Expectancy</Label>
                  <Input type="number" value={lifeExpectancy} onChange={(e) => setLifeExpectancy(Number(e.target.value))} className="w-24 text-right" />
                </div>
                <Slider value={[lifeExpectancy]} onValueChange={(v) => setLifeExpectancy(v[0])} min={60} max={100} step={1} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Inflation Rate (% p.a.)</Label>
                  <Input type="number" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="w-24 text-right" step="0.5" />
                </div>
                <Slider value={[inflationRate]} onValueChange={(v) => setInflationRate(v[0])} min={1} max={15} step={0.5} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Expected Return (% p.a.)</Label>
                  <Input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-24 text-right" step="0.5" />
                </div>
                <Slider value={[expectedReturn]} onValueChange={(v) => setExpectedReturn(v[0])} min={1} max={20} step={0.5} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Retirement Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Years to Retirement</p>
                <p className="text-2xl font-bold">{result.yearsToRetirement} years</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Monthly Expense at Retirement</p>
                <p className="text-2xl font-bold">₹{result.futureMonthlyExpense.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-primary to-primary/90 p-4 rounded-lg text-white">
                <p className="text-sm opacity-90 mb-1">Corpus Needed</p>
                <p className="text-3xl font-bold">₹{(result.corpusNeeded / 10000000).toFixed(2)} Cr</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Monthly SIP Required</p>
                <p className="text-2xl font-bold text-primary">₹{result.monthlySIP.toLocaleString()}</p>
              </div>
              <div className="glass-card p-3 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Start investing ₹{result.monthlySIP.toLocaleString()}/month for {result.yearsToRetirement} years</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-base text-foreground space-y-6 leading-relaxed">
          <div>
            <h3 className="font-semibold text-lg mb-3">Why Retirement Planning?</h3>
            <p>Retirement planning ensures you maintain your lifestyle after you stop working. With increasing life expectancy and rising costs, you need a substantial corpus to fund 20-30 years of retirement without regular income.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Key Factors</h3>
            <p>• Life Expectancy: Indians now live 75-80 years on average, plan accordingly</p>
            <p>• Inflation: Your ₹50,000 monthly expense today will be ₹1.5 lakh in 20 years at 6% inflation</p>
            <p>• Healthcare: Medical costs rise 10-12% annually, keep separate health corpus</p>
            <p>• No Regular Income: Can't rely on salary, need corpus to generate income</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Retirement Corpus Formula</h3>
            <p>This calculator uses present value of future expenses adjusted for inflation during retirement years. It calculates how much you need at retirement to fund all future expenses.</p>
            <p className="mt-2"><strong>Rule of Thumb:</strong> Need 25-30 times your annual expenses as retirement corpus</p>
            <p>Example: ₹6 lakh annual expense = Need ₹1.5-1.8 crore corpus</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Investment Strategy</h3>
            <p>• Age 20-40: Aggressive (80% equity, 20% debt) for maximum growth</p>
            <p>• Age 40-50: Balanced (60% equity, 40% debt) reduce risk gradually</p>
            <p>• Age 50-60: Conservative (40% equity, 60% debt) protect capital</p>
            <p>• Post Retirement: Income-focused (20% equity, 80% debt/FD) for stability</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Pro Tips</h3>
            <p>• Start Early: ₹5,000/month from age 25 beats ₹20,000/month from age 40</p>
            <p>• Increase SIP: Raise investment by 10% annually with salary hikes</p>
            <p>• EPF + NPS: Utilize employer contributions and tax benefits</p>
            <p>• Health Insurance: ₹10-20 lakh cover to protect retirement corpus</p>
            <p>• Debt-Free: Clear all loans before retirement for lower expenses</p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};
