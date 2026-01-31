import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";

export const SalaryCalculator = ({ isDashboard = false, backPath }) => {
  const [ctc, setCtc] = useState(1200000);
  const [basicPercent, setBasicPercent] = useState(40);
  const [hra, setHra] = useState(0);
  const [specialAllowance, setSpecialAllowance] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [pf, setPf] = useState(true);
  const [professionalTax, setProfessionalTax] = useState(2400);

  const calculateSalary = () => {
    const basic = (ctc * basicPercent) / 100;
    const hraAmount = hra || basic * 0.5;
    const specialAllowanceAmount = specialAllowance || ctc - basic - hraAmount - bonus;

    // Employee PF (12% of basic)
    const employeePF = pf ? basic * 0.12 : 0;

    // Employer PF (12% of basic)
    const employerPF = pf ? basic * 0.12 : 0;

    // Gratuity (4.81% of basic)
    const gratuity = basic * 0.0481;

    // Gross salary (excluding employer contributions)
    const grossSalary = basic + hraAmount + specialAllowanceAmount + bonus;

    // Monthly calculations
    const monthlyGross = grossSalary / 12;
    const monthlyPF = employeePF / 12;
    const monthlyPT = professionalTax / 12;
    const monthlyTakeHome = monthlyGross - monthlyPF - monthlyPT;

    // Annual deductions and take home
    const totalDeductions = employeePF + professionalTax;
    const annualTakeHome = grossSalary - totalDeductions;

    return {
      basic: Math.round(basic),
      hra: Math.round(hraAmount),
      specialAllowance: Math.round(specialAllowanceAmount),
      bonus: Math.round(bonus),
      grossSalary: Math.round(grossSalary),
      employeePF: Math.round(employeePF),
      employerPF: Math.round(employerPF),
      gratuity: Math.round(gratuity),
      professionalTax: Math.round(professionalTax),
      totalDeductions: Math.round(totalDeductions),
      monthlyTakeHome: Math.round(monthlyTakeHome),
      annualTakeHome: Math.round(annualTakeHome)
    };
  };

  const result = calculateSalary();

  return (
    <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wallet className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Salary Calculator</h1>
          </div>
          <p className="text-muted-foreground text-lg">Calculate your take-home salary from CTC</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Salary Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Annual CTC (₹)</Label>
                <Input type="number" value={ctc} onChange={(e) => setCtc(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <Label>Basic Salary (% of CTC)</Label>
                <Input type="number" value={basicPercent} onChange={(e) => setBasicPercent(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <Label>HRA (₹) - Leave 0 for auto (50% of basic)</Label>
                <Input type="number" value={hra} onChange={(e) => setHra(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <Label>Special Allowance (₹) - Leave 0 for auto</Label>
                <Input type="number" value={specialAllowance} onChange={(e) => setSpecialAllowance(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <Label>Annual Bonus (₹)</Label>
                <Input type="number" value={bonus} onChange={(e) => setBonus(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <Label>Professional Tax (Annual ₹)</Label>
                <Input type="number" value={professionalTax} onChange={(e) => setProfessionalTax(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={pf} onChange={(e) => setPf(e.target.checked)} id="pf" />
                <Label htmlFor="pf" className="cursor-pointer">Include PF (12% of basic)</Label>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="shadow-[var(--shadow-medium)]">
              <CardHeader>
                <CardTitle>Take Home Salary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gradient-to-r from-primary to-primary/90 p-4 rounded-lg text-primary-foreground">
                  <p className="text-sm opacity-90 mb-1">Monthly Take Home</p>
                  <p className="text-3xl font-bold">₹{result.monthlyTakeHome.toLocaleString()}</p>
                </div>
                <div className="glass-card p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Annual Take Home</p>
                  <p className="text-xl font-bold">₹{result.annualTakeHome.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-medium)]">
              <CardHeader>
                <CardTitle>Salary Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Basic Salary</span>
                  <span className="font-semibold">₹{result.basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>HRA</span>
                  <span className="font-semibold">₹{result.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Special Allowance</span>
                  <span className="font-semibold">₹{result.specialAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonus</span>
                  <span className="font-semibold">₹{result.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Gross Salary</span>
                  <span className="font-bold">₹{result.grossSalary.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-medium)]">
              <CardHeader>
                <CardTitle>Deductions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Employee PF</span>
                  <span className="font-semibold text-red-600">-₹{result.employeePF.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Professional Tax</span>
                  <span className="font-semibold text-red-600">-₹{result.professionalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Total Deductions</span>
                  <span className="font-bold text-red-600">-₹{result.totalDeductions.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-base text-foreground space-y-6 leading-relaxed">
          <div>
            <h3 className="font-semibold text-lg mb-3">Understanding CTC vs Take-Home</h3>
            <p>CTC (Cost to Company) is the total amount a company spends on you, including salary, benefits, and contributions. Take-home salary is what you actually receive in your bank account after all deductions. The difference can be 20-30% of CTC.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Salary Components</h3>
            <p>• Basic Salary: 40-50% of CTC, forms base for PF and gratuity calculations</p>
            <p>• HRA: House Rent Allowance, usually 40-50% of basic, partially tax-exempt</p>
            <p>• Special Allowance: Remaining amount to make up CTC, fully taxable</p>
            <p>• Bonus: Performance-based, annual or quarterly payments</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Deductions from Salary</h3>
            <p><strong>Employee PF (12% of basic):</strong> Your contribution to Provident Fund, tax-free under 80C</p>
            <p><strong>Employer PF (12% of basic):</strong> Company's contribution, part of CTC but not in-hand</p>
            <p><strong>Professional Tax:</strong> State tax, ₹200/month (₹2,400/year) in most states</p>
            <p><strong>Income Tax:</strong> Based on your tax slab and regime chosen</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">CTC Breakdown Example</h3>
            <p>₹12 lakh CTC typically breaks down as:</p>
            <p>• Basic: ₹4.8 lakh (40%) | HRA: ₹2.4 lakh (20%) | Special Allowance: ₹3.6 lakh (30%)</p>
            <p>• Employer PF: ₹57,600 (4.8%) | Gratuity: ₹23,088 (1.92%)</p>
            <p>• Gross Salary: ₹10.8 lakh | Deductions: ₹60,000 | Take-home: ₹10.2 lakh</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Pro Tips</h3>
            <p>• Higher Basic: Negotiate higher basic % for better PF accumulation</p>
            <p>• HRA Exemption: Claim HRA exemption if paying rent, submit rent receipts</p>
            <p>• Tax Planning: Use 80C (₹1.5L), 80D (₹25K-50K) deductions to save tax</p>
            <p>• New vs Old Regime: Calculate which tax regime gives better take-home</p>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};
