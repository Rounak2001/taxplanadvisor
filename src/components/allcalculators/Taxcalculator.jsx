import React, { useState } from "react";
import { Calculator, TrendingUp, Percent, DollarSign, Info, CheckCircle } from "lucide-react";
import CalculatorLayout from '@/components/calculators/CalculatorLayout';

// --- Tax Calculation Engine (Helper Functions) ---

const getTaxSlabs = (regime, age) => {
  if (regime === "New (Default)") {
    return [
      { limit: 400000, rate: 0.0 },
      { limit: 800000, rate: 0.05 },
      { limit: 1200000, rate: 0.10 },
      { limit: 1600000, rate: 0.15 },
      { limit: 2000000, rate: 0.20 },
      { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.30 },
    ];
  } else {
    if (age >= 80) {
      return [
        { limit: 500000, rate: 0.0 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
      ];
    } else if (age >= 60) {
      return [
        { limit: 300000, rate: 0.0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
      ];
    } else {
      return [
        { limit: 250000, rate: 0.0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
      ];
    }
  }
};

const calculateSlabTax = (income, slabs) => {
  let tax = 0;
  let lastLimit = 0;

  for (const { limit, rate } of slabs) {
    if (income > lastLimit) {
      const taxableAmountInSlab = Math.min(income - lastLimit, limit - lastLimit);
      tax += taxableAmountInSlab * rate;
      lastLimit = limit;
    } else {
      break;
    }
  }

  return tax;
};

const calculateRebateAndRelief = (regime, netTaxableIncome, basicTax) => {
  let rebate = 0;
  let marginalRelief87a = 0;
  let taxAfterRebate = basicTax;

  if (regime === "New (Default)") {
    if (netTaxableIncome <= 1200000) {
      rebate = Math.min(basicTax, 60000);
      taxAfterRebate = basicTax - rebate;
    } else if (netTaxableIncome > 1200000 && netTaxableIncome <= 1270000) {
      const incomeOverLimit = netTaxableIncome - 1200000;
      if (basicTax > incomeOverLimit) {
        marginalRelief87a = basicTax - incomeOverLimit;
        taxAfterRebate = basicTax - marginalRelief87a;
      }
    }
  } else {
    if (netTaxableIncome <= 500000) {
      rebate = Math.min(basicTax, 12500);
      taxAfterRebate = basicTax - rebate;
    }
  }

  return { rebate, marginalRelief87a, taxAfterRebate };
};

const calculateSurcharge = (totalTaxableIncome, regime, taxOnNormal, taxOnSpecialCapped, taxOnSpecialUncapped) => {
  let surchargeRateNormal = 0;
  let surchargeRateSpecialCap = 0;

  if (totalTaxableIncome > 50000000) {
    surchargeRateNormal = regime === "Old (Opt-in)" ? 0.37 : 0.25;
  } else if (totalTaxableIncome > 20000000) {
    surchargeRateNormal = 0.25;
  } else if (totalTaxableIncome > 10000000) {
    surchargeRateNormal = 0.15;
  } else if (totalTaxableIncome > 5000000) {
    surchargeRateNormal = 0.10;
  }

  surchargeRateSpecialCap = Math.min(surchargeRateNormal, 0.15);

  const surchargeOnNormalAndWinnings = (taxOnNormal + taxOnSpecialUncapped) * surchargeRateNormal;
  const surchargeOnSpecialCappedTax = taxOnSpecialCapped * surchargeRateSpecialCap;

  const totalSurcharge = surchargeOnNormalAndWinnings + surchargeOnSpecialCappedTax;

  return { totalSurcharge, surchargeRateNormal, surchargeRateSpecialCap };
};

const calculateMarginalReliefSurcharge = (totalTaxableIncome, taxAfterRebate, totalSurcharge, regime, age) => {
  const taxPlusSurcharge = taxAfterRebate + totalSurcharge;
  let relief = 0;

  const thresholds = [
    { threshold: 50000000, rate: regime === "Old (Opt-in)" ? 0.37 : 0.25 },
    { threshold: 20000000, rate: 0.25 },
    { threshold: 10000000, rate: 0.15 },
    { threshold: 5000000, rate: 0.10 },
  ];

  for (const { threshold, rate } of thresholds) {
    if (totalTaxableIncome > threshold) {
      const incomeOverThreshold = totalTaxableIncome - threshold;
      const slabs = getTaxSlabs(regime, age);
      const taxAtThresholdBasic = calculateSlabTax(threshold, slabs);

      let surchargeAtThreshold = 0;
      if (threshold === 50000000) surchargeAtThreshold = taxAtThresholdBasic * 0.25;
      else if (threshold === 20000000) surchargeAtThreshold = taxAtThresholdBasic * 0.15;
      else if (threshold === 10000000) surchargeAtThreshold = taxAtThresholdBasic * 0.10;
      else if (threshold === 5000000) surchargeAtThreshold = 0;

      const taxAtThresholdTotal = taxAtThresholdBasic + surchargeAtThreshold;
      const maxPayable = taxAtThresholdTotal + incomeOverThreshold;

      if (taxPlusSurcharge > maxPayable) {
        relief = taxPlusSurcharge - maxPayable;
      }

      break;
    }
  }

  return relief;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

const TaxCalculator = ({ isDashboard = false, backPath }) => {
  // Global Settings
  const [taxRegime, setTaxRegime] = useState("New (Default)");
  const [age, setAge] = useState(30);
  const [isSalaried, setIsSalaried] = useState(true);

  // Income State
  const [salaryIncome, setSalaryIncome] = useState(1000000);
  const [housePropertyIncome, setHousePropertyIncome] = useState(0);
  const [otherSourcesIncome, setOtherSourcesIncome] = useState(50000);

  // Special Income
  const [winningsLottery, setWinningsLottery] = useState(0);
  const [ltcgEquity112a, setLtcgEquity112a] = useState(0);
  const [stcgEquity111a, setStcgEquity111a] = useState(0);
  const [ltcgOther, setLtcgOther] = useState(0);

  // Deductions - New Regime
  const [deduction80ccd2, setDeduction80ccd2] = useState(0);
  const [deductionFamilyPension, setDeductionFamilyPension] = useState(0);

  // Deductions - Old Regime
  const [deduction80c, setDeduction80c] = useState(0);
  const [deductionNps80ccd1b, setDeductionNps80ccd1b] = useState(0);
  const [deduction80d, setDeduction80d] = useState(0);
  const [deductionHouseLoanInterest, setDeductionHouseLoanInterest] = useState(0);
  const [deduction80tta, setDeduction80tta] = useState(0);
  const [deduction80ttb, setDeduction80ttb] = useState(0);
  const [deduction80e, setDeduction80e] = useState(0);
  const [deduction80ccd2Old, setDeduction80ccd2Old] = useState(0);

  // Result State
  const [result, setResult] = useState(null);

  const getAgeCategory = () => {
    if (age >= 80) return "Super Senior (80+)";
    if (age >= 60) return "Senior (60-79)";
    return "Below 60";
  };

  const calculateTax = () => {
    // 1. Calculate Net Income from Each Head
    const standardDeductionSalary = isSalaried
      ? (taxRegime === "New (Default)" ? 75000 : 50000)
      : 0;
    const netSalaryIncome = salaryIncome - standardDeductionSalary;

    const standardDeductionRent = housePropertyIncome * 0.30;
    let netHousePropertyIncome = housePropertyIncome - standardDeductionRent;

    if (taxRegime === "Old (Opt-in)") {
      netHousePropertyIncome -= deductionHouseLoanInterest;
      netHousePropertyIncome = Math.max(-200000, netHousePropertyIncome);
    }

    const netOtherSourcesIncome = otherSourcesIncome;

    const specialIncomes = {
      ltcg112a: ltcgEquity112a,
      stcg111a: stcgEquity111a,
      ltcgOther: ltcgOther,
      winnings: winningsLottery
    };
    const totalSpecialIncome = Object.values(specialIncomes).reduce((a, b) => a + b, 0);

    // 2. Calculate GTI
    const gtiNormalIncome = netSalaryIncome + netHousePropertyIncome + netOtherSourcesIncome;
    const gtiTotal = gtiNormalIncome + totalSpecialIncome;

    // 3. Apply Chapter VI-A Deductions
    let totalChapterViaDeductions = 0;
    if (taxRegime === "New (Default)") {
      totalChapterViaDeductions = deduction80ccd2 + deductionFamilyPension;
    } else {
      totalChapterViaDeductions = deduction80c + deductionNps80ccd1b + deduction80d +
        deduction80tta + deduction80ttb + deduction80e + deduction80ccd2Old;
    }

    const deductionsToApply = Math.min(gtiNormalIncome, totalChapterViaDeductions);
    const netNormalTaxableIncome = Math.max(0, gtiNormalIncome - deductionsToApply);
    const totalTaxableIncome = netNormalTaxableIncome + totalSpecialIncome;

    // 4. Calculate Basic Tax
    const taxOnLtcg112a = Math.max(0, specialIncomes.ltcg112a - 125000) * 0.125;
    const taxOnStcg111a = specialIncomes.stcg111a * 0.20;
    const taxOnLtcgOther = specialIncomes.ltcgOther * 0.125;
    const taxOnWinnings = specialIncomes.winnings * 0.30;

    const taxOnSpecialCapped = taxOnLtcg112a + taxOnStcg111a + taxOnLtcgOther;
    const taxOnSpecialUncapped = taxOnWinnings;

    const slabs = getTaxSlabs(taxRegime, age);
    const taxOnNormal = calculateSlabTax(netNormalTaxableIncome, slabs);
    const totalBasicTax = taxOnNormal + taxOnSpecialCapped + taxOnSpecialUncapped;

    // 5. Apply Rebate & 87A Relief
    const { rebate, marginalRelief87a, taxAfterRebate } = calculateRebateAndRelief(
      taxRegime, totalTaxableIncome, totalBasicTax
    );

    // 6. Calculate Surcharge & Marginal Relief
    let totalSurcharge = 0;
    let surchargeRateNormal = 0;
    let surchargeRateSpecialCap = 0;

    if (taxAfterRebate > 0) {
      const surchargeResult = calculateSurcharge(
        totalTaxableIncome, taxRegime, taxOnNormal, taxOnSpecialCapped, taxOnSpecialUncapped
      );
      totalSurcharge = surchargeResult.totalSurcharge;
      surchargeRateNormal = surchargeResult.surchargeRateNormal;
      surchargeRateSpecialCap = surchargeResult.surchargeRateSpecialCap;
    }

    const marginalReliefSurcharge = calculateMarginalReliefSurcharge(
      totalTaxableIncome, taxAfterRebate, totalSurcharge, taxRegime, age
    );

    // 7. Apply Relief and Calculate Cess
    const taxPayableBeforeCess = taxAfterRebate + totalSurcharge - marginalReliefSurcharge;
    const cess = taxPayableBeforeCess * 0.04;

    // 8. Final Tax
    const finalTaxPayable = taxPayableBeforeCess + cess;

    setResult({
      gtiTotal,
      gtiNormalIncome,
      netSalaryIncome,
      netHousePropertyIncome,
      netOtherSourcesIncome,
      totalSpecialIncome,
      deductionsToApply,
      totalTaxableIncome,
      taxOnNormal,
      taxOnSpecialCapped,
      taxOnSpecialUncapped,
      totalBasicTax,
      rebate,
      marginalRelief87a,
      taxAfterRebate,
      totalSurcharge,
      surchargeRateNormal,
      surchargeRateSpecialCap,
      marginalReliefSurcharge,
      taxPayableBeforeCess,
      cess,
      finalTaxPayable,
    });
  };

  return (
    <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
              <Calculator className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Indian Income Tax Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground">For Financial Year 2025-26 (Assessment Year 2026-27)</p>
        </div>

        {/* Global Settings Card */}
        <div className="glass-card shadow-card rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Global Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tax Regime */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Your Tax Regime</label>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="New (Default)"
                    checked={taxRegime === "New (Default)"}
                    onChange={(e) => setTaxRegime(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`px-4 py-3 rounded-lg font-semibold text-center transition-all ${taxRegime === "New (Default)"
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-border'
                    }`}>
                    New (Default)
                  </div>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="Old (Opt-in)"
                    checked={taxRegime === "Old (Opt-in)"}
                    onChange={(e) => setTaxRegime(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`px-4 py-3 rounded-lg font-semibold text-center transition-all ${taxRegime === "Old (Opt-in)"
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-border'
                    }`}>
                    Old (Opt-in)
                  </div>
                </label>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Your Age</label>
              <input
                type="range"
                min="18"
                max="100"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full mb-2"
              />
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">{age}</span>
                <span className="text-sm font-medium text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">
                  {getAgeCategory()}
                </span>
              </div>
            </div>

            {/* Salaried */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Employment Status</label>
              <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-4 rounded-lg border border-border hover:bg-gray-100 transition-all">
                <input
                  type="checkbox"
                  checked={isSalaried}
                  onChange={(e) => setIsSalaried(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Salaried Individual or Pensioner
                </span>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">FY 2025-26 (AY 2026-27) Updates:</p>
                <ul className="space-y-1">
                  <li>• <strong>New Regime:</strong> Default, Rebate up to ₹12,00,000 taxable income, Standard Deduction of ₹75,000.</li>
                  <li>• <strong>Old Regime:</strong> Rebate up to ₹5,00,000 taxable income, Standard Deduction of ₹50,000.</li>
                  <li>• <strong>Capital Gains:</strong> STCG (Equity) @ 20%, LTCG (Equity) @ 12.5% over ₹1.25L.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Income & Deductions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Income Section */}
          <div className="glass-card shadow-elevated rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Your Annual Income</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Income from Salary / Pension
                </label>
                <input
                  type="number"
                  value={salaryIncome}
                  onChange={(e) => setSalaryIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter gross salary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Standard Deduction will be applied automatically
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Income from House Property (Gross Rent)
                </label>
                <input
                  type="number"
                  value={housePropertyIncome}
                  onChange={(e) => setHousePropertyIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter gross rental income"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  30% standard deduction will be applied
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Income from Other Sources
                </label>
                <input
                  type="number"
                  value={otherSourcesIncome}
                  onChange={(e) => setOtherSourcesIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Interest from Savings, FDs, etc."
                />
              </div>

              {/* Special Rate Incomes */}
              <details className="bg-gray-50 rounded-lg p-4 border border-border">
                <summary className="font-semibold text-gray-700 cursor-pointer">
                  Special Rate Incomes (Capital Gains, Lottery)
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Winnings from Lottery, Games, etc.
                    </label>
                    <input
                      type="number"
                      value={winningsLottery}
                      onChange={(e) => setWinningsLottery(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
                      placeholder="Taxed at flat 30%"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LTCG (Equity Shares / Equity MF &gt; 1 yr)
                    </label>
                    <input
                      type="number"
                      value={ltcgEquity112a}
                      onChange={(e) => setLtcgEquity112a(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
                      placeholder="Taxed at 12.5% above ₹1,25,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      STCG (Equity Shares / Equity MF &lt; 1 yr)
                    </label>
                    <input
                      type="number"
                      value={stcgEquity111a}
                      onChange={(e) => setStcgEquity111a(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
                      placeholder="Taxed at flat 20%"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LTCG (Debt MF, Gold, Real Estate)
                    </label>
                    <input
                      type="number"
                      value={ltcgOther}
                      onChange={(e) => setLtcgOther(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
                      placeholder="Taxed at 12.5%"
                    />
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="glass-card shadow-elevated rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Percent className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Your Annual Deductions</h2>
            </div>

            {taxRegime === "New (Default)" ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                  <p className="text-sm text-blue-800">
                    The New Regime has lower tax rates but fewer deductions. Only the following are allowed.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employer's NPS Contribution (80CCD(2))
                  </label>
                  <input
                    type="number"
                    value={deduction80ccd2}
                    onChange={(e) => setDeduction80ccd2(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Up to 14% of salary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Family Pension Deduction (57(iia))
                  </label>
                  <input
                    type="number"
                    value={deductionFamilyPension}
                    onChange={(e) => setDeductionFamilyPension(Math.min(parseFloat(e.target.value) || 0, 15000))}
                    max="15000"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Max ₹15,000"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                  <p className="text-sm text-green-800">
                    The Old Regime allows a wide range of deductions to lower your taxable income.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    80C (PPF, EPF, LIC, ELSS, etc.)
                  </label>
                  <input
                    type="number"
                    value={deduction80c}
                    onChange={(e) => setDeduction80c(Math.min(parseFloat(e.target.value) || 0, 150000))}
                    max="150000"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Max ₹1,50,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    80CCD(1B) (NPS Self-Contribution)
                  </label>
                  <input
                    type="number"
                    value={deductionNps80ccd1b}
                    onChange={(e) => setDeductionNps80ccd1b(Math.min(parseFloat(e.target.value) || 0, 50000))}
                    max="50000"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Max ₹50,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    80D (Medical Insurance Premium)
                  </label>
                  <input
                    type="number"
                    value={deduction80d}
                    onChange={(e) => setDeduction80d(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="e.g., ₹25k + ₹50k for senior parents"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interest on Home Loan (Self-Occupied) (Sec 24b)
                  </label>
                  <input
                    type="number"
                    value={deductionHouseLoanInterest}
                    onChange={(e) => setDeductionHouseLoanInterest(Math.min(parseFloat(e.target.value) || 0, 200000))}
                    max="200000"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Max ₹2,00,000"
                  />
                </div>

                {age < 60 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      80TTA (Savings Account Interest)
                    </label>
                    <input
                      type="number"
                      value={deduction80tta}
                      onChange={(e) => setDeduction80tta(Math.min(parseFloat(e.target.value) || 0, 10000))}
                      max="10000"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      placeholder="Max ₹10,000"
                    />
                  </div>
                )}

                {age >= 60 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      80TTB (Deposit Interest - Senior Citizen)
                    </label>
                    <input
                      type="number"
                      value={deduction80ttb}
                      onChange={(e) => setDeduction80ttb(Math.min(parseFloat(e.target.value) || 0, 50000))}
                      max="50000"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      placeholder="Max ₹50,000"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    80E (Education Loan Interest)
                  </label>
                  <input
                    type="number"
                    value={deduction80e}
                    onChange={(e) => setDeduction80e(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="No upper limit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employer's NPS Contribution (80CCD(2))
                  </label>
                  <input
                    type="number"
                    value={deduction80ccd2Old}
                    onChange={(e) => setDeduction80ccd2Old(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Up to 14% of salary"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateTax}
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-xl shadow-elevated hover:shadow-glow transform hover:-translate-y-0.5 transition-all mb-6"
        >
          Calculate My Tax
        </button>

        {/* Results Display */}
        {result && (
          <div className="glass-card shadow-elevated rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
              <div>
                <h2 className="text-3xl font-bold text-foreground">Tax Calculation Summary</h2>
                <p className="text-sm text-muted-foreground">FY 2025-26 (AY 2026-27) - {taxRegime}</p>
              </div>
            </div>

            {/* Final Tax Highlight */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-6 text-white">
              <p className="text-lg font-semibold mb-2 opacity-90">Total Tax Payable</p>
              <p className="text-5xl font-bold">{formatCurrency(result.finalTaxPayable)}</p>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Left Column - Income */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground border-b-2 border-primary pb-2">Income Breakdown</h3>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Gross Income (All Heads)</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(result.gtiTotal)}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Salary Income:</span>
                    <span className="font-semibold text-white">{formatCurrency(result.netSalaryIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net House Property:</span>
                    <span className="font-semibold text-white">{formatCurrency(result.netHousePropertyIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other Sources:</span>
                    <span className="font-semibold text-white">{formatCurrency(result.netOtherSourcesIncome)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="text-gray-600">Net Normal Income (GTI):</span>
                    <span className="font-bold text-white">{formatCurrency(result.gtiNormalIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Special Income:</span>
                    <span className="font-semibold text-white">{formatCurrency(result.totalSpecialIncome)}</span>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                  <p className="text-sm text-gray-600 mb-1">Total Deductions (80C, etc)</p>
                  <p className="text-xl font-bold text-orange-800">- {formatCurrency(result.deductionsToApply)}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 mb-1">Net Taxable Income</p>
                  <p className="text-2xl font-bold text-blue-800">{formatCurrency(result.totalTaxableIncome)}</p>
                </div>
              </div>

              {/* Right Column - Tax Calculation */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground border-b-2 border-primary pb-2">Tax Calculation</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax on Normal Income (Slabs):</span>
                    <span className="font-semibold text-white">{formatCurrency(result.taxOnNormal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax on Special Incomes (Flat):</span>
                    <span className="font-semibold text-white">
                      {formatCurrency(result.taxOnSpecialCapped + result.taxOnSpecialUncapped)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="text-gray-600 font-semibold">Total Basic Tax:</span>
                    <span className="font-bold text-white">{formatCurrency(result.totalBasicTax)}</span>
                  </div>
                </div>

                {result.rebate > 0 && (
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">Rebate (Sec 87A)</p>
                    <p className="text-xl font-bold text-green-800">- {formatCurrency(result.rebate)}</p>
                  </div>
                )}

                {result.marginalRelief87a > 0 && (
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">Marginal Relief (Rebate)</p>
                    <p className="text-xl font-bold text-green-800">- {formatCurrency(result.marginalRelief87a)}</p>
                  </div>
                )}

                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Tax After Rebate</p>
                  <p className="text-xl font-bold text-purple-800">{formatCurrency(result.taxAfterRebate)}</p>
                </div>

                {result.totalSurcharge > 0 && (
                  <>
                    <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                      <p className="text-sm text-gray-600 mb-1">Surcharge</p>
                      <p className="text-xl font-bold text-red-800">+ {formatCurrency(result.totalSurcharge)}</p>
                      {result.surchargeRateNormal > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Normal @ {(result.surchargeRateNormal * 100).toFixed(0)}%,
                          Special @ {(result.surchargeRateSpecialCap * 100).toFixed(0)}%
                        </p>
                      )}
                    </div>

                    {result.marginalReliefSurcharge > 0 && (
                      <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                        <p className="text-sm text-gray-600 mb-1">Marginal Relief (Surcharge)</p>
                        <p className="text-xl font-bold text-green-800">- {formatCurrency(result.marginalReliefSurcharge)}</p>
                      </div>
                    )}
                  </>
                )}

                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Tax before Cess</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(result.taxPayableBeforeCess)}</p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-sm text-gray-600 mb-1">Health & Education Cess (4%)</p>
                  <p className="text-xl font-bold text-yellow-800">+ {formatCurrency(result.cess)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Calculated on ₹{result.taxPayableBeforeCess.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Final Tax Again */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-700">Final Tax Payable:</span>
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(result.finalTaxPayable)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Important Information */}
        <div className="mt-8 glass-card shadow-card border-l-4 border-accent p-6 rounded-lg">
          <div className="flex items-start">
            <Info className="w-6 h-6 text-accent mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Important Information</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• This calculator uses tax rules for FY 2025-26 (AY 2026-27)</li>
                <li>• Calculations are for educational purposes only</li>
                <li>• Please consult a tax professional for accurate tax planning</li>
                <li>• Standard deductions are automatically applied based on your regime</li>
                <li>• Special income rates: LTCG Equity @ 12.5% (above ₹1.25L), STCG Equity @ 20%, Lottery @ 30%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default TaxCalculator;