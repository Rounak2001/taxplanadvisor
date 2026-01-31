import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TrendingDown } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";

export const ExistingLoanCalculator = ({ isDashboard = false, backPath }) => {
  const [currentBalance, setCurrentBalance] = useState();
  const [currentEMI, setCurrentEMI] = useState();
  const [interestRate, setInterestRate] = useState();
  const [remainingMonths, setRemainingMonths] = useState();
  const [prepaymentAmount, setPrepaymentAmount] = useState();
  const [prepaymentOption, setPrepaymentOption] = useState("tenure"); // "tenure" or "emi"

  const formatIndian = (num) => {
    if (!num && num !== 0 || isNaN(num)) return '0';
    const n = Math.round(num).toString();
    const lastThree = n.substring(n.length - 3);
    const otherNumbers = n.substring(0, n.length - 3);
    return otherNumbers !== '' ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree : lastThree;
  };

  const calculateNewLoan = () => {
    if (!currentBalance || !currentEMI || !interestRate || !remainingMonths || !prepaymentAmount) {
      return { newEMI: 0, newBalance: 0, newMonths: 0, timeSaved: 0, interestSaved: 0 };
    }

    const r = interestRate / 12 / 100;
    const newPrincipal = currentBalance - prepaymentAmount;

    if (newPrincipal <= 0) {
      return { newEMI: 0, newBalance: newPrincipal, newMonths: 0, timeSaved: remainingMonths || 0, interestSaved: (currentEMI * remainingMonths) || 0 };
    }

    if (prepaymentOption === "tenure") {
      const newTenure = Math.log(currentEMI / (currentEMI - newPrincipal * r)) / Math.log(1 + r);
      const oldInterest = (currentEMI * remainingMonths) - currentBalance;
      const newInterest = (currentEMI * newTenure) - newPrincipal;
      const interestSaved = oldInterest - newInterest;
      return {
        newEMI: currentEMI,
        newBalance: newPrincipal,
        newMonths: Math.round(newTenure),
        timeSaved: remainingMonths - Math.round(newTenure),
        interestSaved
      };
    } else {
      const newEMI = (newPrincipal * r * Math.pow(1 + r, remainingMonths)) / (Math.pow(1 + r, remainingMonths) - 1);
      const oldInterest = (currentEMI * remainingMonths) - currentBalance;
      const newInterest = (newEMI * remainingMonths) - newPrincipal;
      const interestSaved = oldInterest - newInterest;
      return {
        newEMI,
        newBalance: newPrincipal,
        newMonths: remainingMonths,
        timeSaved: 0,
        interestSaved
      };
    }
  };

  const result = calculateNewLoan();

  return (
    <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
              <TrendingDown className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Pre-Payment Loan Calculator</h1>
          </div>
          <p className="text-muted-foreground text-lg">See how paying extra reduces your loan burden</p>
        </div>

        <Card className="glass-card shadow-elevated mb-3">
          <CardHeader>
            <CardTitle>Current Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Outstanding Balance (₹)</Label>
              <Input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div>
              <Label>Current EMI (₹)</Label>
              <Input type="number" value={currentEMI} onChange={(e) => setCurrentEMI(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div>
              <Label>Interest Rate (% p.a.)</Label>
              <Input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))} step="0.1" />
            </div>
            <div>
              <Label>Remaining Months</Label>
              <Input type="number" value={remainingMonths} onChange={(e) => setRemainingMonths(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div>
              <Label>Prepayment Amount (₹)</Label>
              <Input type="number" value={prepaymentAmount} onChange={(e) => setPrepaymentAmount(e.target.value === '' ? '' : Number(e.target.value))} className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
            </div>
            <div className="col-span-2">
              <Label>Prepayment Option</Label>
              <RadioGroup value={prepaymentOption} onValueChange={setPrepaymentOption} className="flex gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tenure" id="tenure" />
                  <Label htmlFor="tenure" className="cursor-pointer font-normal">Reduce Tenure (Keep EMI Same)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emi" id="emi" />
                  <Label htmlFor="emi" className="cursor-pointer font-normal">Reduce EMI (Keep Tenure Same)</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-elevated bg-accent/5 border-accent/20 mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Impact of Prepayment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">New Outstanding Balance</p>
              <p className="text-2xl font-bold text-primary">₹{formatIndian(result.newBalance)}</p>
              <p className="text-xs text-muted-foreground mt-1">(After ₹{formatIndian(prepaymentAmount)} prepayment)</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="glass-card p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">New EMI</p>
                <p className="text-xl font-bold text-primary">₹{formatIndian(result.newEMI)}</p>
              </div>
              <div className="glass-card p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">New Tenure</p>
                <p className="text-xl font-bold text-accent">{result.newMonths} months</p>
              </div>
              <div className="glass-card p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Time Saved</p>
                <p className="text-xl font-bold text-accent">{result.timeSaved} months</p>
              </div>
              <div className="glass-card p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Interest Saved</p>
                <p className="text-xl font-bold text-accent">₹{formatIndian(result.interestSaved)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-base text-foreground space-y-6 leading-relaxed">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-foreground">What is Loan Prepayment?</h3>
            <p>Loan prepayment means paying extra money towards your loan principal before the scheduled due date. This reduces your outstanding balance and can significantly lower your total interest burden or shorten your loan tenure.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-foreground">Two Prepayment Options</h3>
            <p><strong>Reduce Tenure (Keep EMI Same):</strong> Your monthly EMI stays the same, but loan gets paid off faster. Best if you can afford current EMI and want to be debt-free sooner.</p>
            <p className="mt-2"><strong>Reduce EMI (Keep Tenure Same):</strong> Your loan duration stays same, but monthly EMI reduces. Best if you want immediate relief in monthly cash flow.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Benefits of Prepayment</h3>
            <p>• Interest Savings: Can save lakhs in interest over loan tenure</p>
            <p>• Faster Debt Freedom: Become debt-free years earlier</p>
            <p>• Better Credit Score: Lower debt-to-income ratio improves creditworthiness</p>
            <p>• Financial Freedom: Free up future income for investments</p>
            <p>• Peace of Mind: Reduced financial stress and obligations</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">When to Prepay?</h3>
            <p><strong>Good Time to Prepay:</strong></p>
            <p>• Received bonus, inheritance, or windfall gains</p>
            <p>• High-interest loans (personal loans, credit cards)</p>
            <p>• Early in loan tenure (more interest component in EMI)</p>
            <p>• No better investment opportunities available</p>
            <p className="mt-2"><strong>Consider Alternatives:</strong></p>
            <p>• If you can earn higher returns through investments (equity, mutual funds)</p>
            <p>• If loan has tax benefits (home loan under 80C and 24b)</p>
            <p>• If prepayment penalty is high (check with your bank)</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Pro Tips</h3>
            <p>• Annual Prepayment: Make one extra EMI payment yearly to save significantly</p>
            <p>• Check Penalties: Most banks allow 25% prepayment per year without penalty</p>
            <p>• Prioritize High-Interest: Prepay personal loans before home loans</p>
            <p>• Keep Emergency Fund: Don't use emergency savings for prepayment</p>
            <p>• Tax Planning: Consider tax benefits before prepaying home loans</p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};
