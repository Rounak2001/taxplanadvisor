import React, { useState, useMemo } from "react";
import { TrendingUp, Calendar, Building, Landmark, Coins, AlertCircle, CheckCircle, Info } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";

// Cost Inflation Index (CII) Table
const CII = {
  "2001-02": 100, "2002-03": 105, "2003-04": 109, "2004-05": 113,
  "2005-06": 117, "2006-07": 122, "2007-08": 129, "2008-09": 137,
  "2009-10": 148, "2010-11": 167, "2011-12": 184, "2012-13": 200,
  "2013-14": 220, "2014-15": 240, "2015-16": 254, "2016-17": 264,
  "2017-18": 272, "2018-19": 280, "2019-20": 289, "2020-21": 301,
  "2021-22": 317, "2022-23": 331, "2023-24": 348, "2024-25": 363,
  "2025-26": 380,
};

const CII_YEARS = Object.keys(CII);
const BASE_CII_START_DATE = new Date(2001, 3, 1); // April 1, 2001

// Helper Functions
const getFinancialYear = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;

  if (month >= 4) {
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
};

const calculateHoldingPeriod = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  const totalMonths = years * 12 + months;

  return { years, months, days, totalDays, totalMonths };
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

const CapitalGainsCal = ({ isDashboard = false, backPath }) => {
  const [activeTab, setActiveTab] = useState('equity');
  const [taxpayerStatus, setTaxpayerStatus] = useState('individual');
  const [showCIITable, setShowCIITable] = useState(false);

  // Equity State
  const [equityData, setEquityData] = useState({
    purchaseDate: '2019-01-01',
    purchasePrice: 100000,
    saleDate: '2025-06-01',
    salePrice: 250000,
    isGrandfathered: false,
    fmv2018: 120000,
  });

  // Property State
  const [propertyData, setPropertyData] = useState({
    purchaseDate: '2015-06-01',
    purchasePrice: 2000000,
    saleDate: '2025-06-01',
    salePrice: 5000000,
    costOfImprovement: 0,
    improvementYear: '2020-21',
  });

  // Other Assets State
  const [otherData, setOtherData] = useState({
    purchaseDate: '2021-01-01',
    purchasePrice: 200000,
    saleDate: '2025-06-01',
    salePrice: 300000,
  });

  const [result, setResult] = useState(null);

  // Calculate Equity Gains
  const calculateEquityGains = () => {
    const holding = calculateHoldingPeriod(equityData.purchaseDate, equityData.saleDate);

    if (holding.totalDays <= 365) {
      // Short-Term Capital Gain
      const stcg = equityData.salePrice - equityData.purchasePrice;
      const taxRate = 0.20;
      const finalTax = stcg * taxRate;

      setResult({
        type: 'STCG',
        assetType: 'Equity',
        holding: holding,
        gain: stcg,
        taxableGain: stcg,
        taxRate: taxRate,
        finalTax: finalTax,
      });
    } else {
      // Long-Term Capital Gain
      let costOfAcquisition = equityData.purchasePrice;
      let grandfatheringNote = '';

      if (equityData.isGrandfathered) {
        const costForLtcg = Math.min(equityData.fmv2018, equityData.salePrice);
        costOfAcquisition = Math.max(equityData.purchasePrice, costForLtcg);
        grandfatheringNote = `Grandfathering applied. Cost of acquisition: ${formatCurrency(costOfAcquisition)}`;
      }

      const ltcg = equityData.salePrice - costOfAcquisition;
      const taxableGain = Math.max(0, ltcg - 125000);
      const taxRate = 0.125;
      const finalTax = taxableGain * taxRate;

      setResult({
        type: 'LTCG',
        assetType: 'Equity',
        holding: holding,
        gain: ltcg,
        taxableGain: taxableGain,
        exemption: 125000,
        taxRate: taxRate,
        finalTax: finalTax,
        note: grandfatheringNote,
      });
    }
  };

  // Calculate Property Gains
  const calculatePropertyGains = () => {
    const holding = calculateHoldingPeriod(propertyData.purchaseDate, propertyData.saleDate);

    if (holding.totalMonths <= 24) {
      // Short-Term Capital Gain
      const stcg = propertyData.salePrice - propertyData.purchasePrice - propertyData.costOfImprovement;

      setResult({
        type: 'STCG',
        assetType: 'Property',
        holding: holding,
        gain: stcg,
        taxableGain: stcg,
        note: 'This gain will be added to your total income and taxed at your applicable slab/flat rate.',
      });
    } else {
      // Long-Term Capital Gain
      const saleYear = getFinancialYear(propertyData.saleDate);
      const ciiSale = CII[saleYear] || 380;

      // Calculate for Option 1: 20% with indexation
      let ciiPurchase;
      const purchaseDate = new Date(propertyData.purchaseDate);

      if (purchaseDate < BASE_CII_START_DATE) {
        ciiPurchase = 100;
      } else {
        const purchaseYear = getFinancialYear(propertyData.purchaseDate);
        ciiPurchase = CII[purchaseYear] || 100;
      }

      const indexedCostAcq = propertyData.purchasePrice * (ciiSale / ciiPurchase);

      let indexedCostImp = 0;
      if (propertyData.costOfImprovement > 0) {
        const ciiCoi = CII[propertyData.improvementYear] || ciiSale;
        indexedCostImp = propertyData.costOfImprovement * (ciiSale / ciiCoi);
      }

      const gainWithIndex = propertyData.salePrice - indexedCostAcq - indexedCostImp;
      const taxWithIndex = gainWithIndex * 0.20;

      // Calculate for Option 2: 12.5% without indexation
      const gainNoIndex = propertyData.salePrice - propertyData.purchasePrice - propertyData.costOfImprovement;
      const taxNoIndex = gainNoIndex * 0.125;

      setResult({
        type: 'LTCG',
        assetType: 'Property',
        holding: holding,
        taxpayerStatus: taxpayerStatus,
        option1: {
          name: '20% with Indexation',
          gain: gainWithIndex,
          tax: taxWithIndex,
          indexedCostAcq: indexedCostAcq,
          indexedCostImp: indexedCostImp,
          ciiPurchase: ciiPurchase,
          ciiSale: ciiSale,
        },
        option2: {
          name: '12.5% without Indexation',
          gain: gainNoIndex,
          tax: taxNoIndex,
        },
      });
    }
  };

  // Calculate Other Assets Gains
  const calculateOtherGains = () => {
    const holding = calculateHoldingPeriod(otherData.purchaseDate, otherData.saleDate);

    if (holding.totalMonths <= 24) {
      // Short-Term Capital Gain
      const stcg = otherData.salePrice - otherData.purchasePrice;

      setResult({
        type: 'STCG',
        assetType: 'Other',
        holding: holding,
        gain: stcg,
        taxableGain: stcg,
        note: 'This gain will be added to your total income and taxed at your applicable slab/flat rate.',
      });
    } else {
      // Long-Term Capital Gain
      const ltcg = otherData.salePrice - otherData.purchasePrice;
      const taxRate = 0.125;
      const finalTax = ltcg * taxRate;

      setResult({
        type: 'LTCG',
        assetType: 'Other',
        holding: holding,
        gain: ltcg,
        taxableGain: ltcg,
        taxRate: taxRate,
        finalTax: finalTax,
      });
    }
  };

  return (
    <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Capital Gains Tax Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground">Calculate your capital gains tax for FY 2025-26</p>
        </div>

        {/* Global Settings Card */}
        <div className="glass-card shadow-card rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Taxpayer Status</h3>
              <div className="flex gap-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="individual"
                    checked={taxpayerStatus === 'individual'}
                    onChange={(e) => setTaxpayerStatus(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`px-6 py-2 rounded-lg font-semibold transition-all ${taxpayerStatus === 'individual'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}>
                    Individual / HUF
                  </div>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="firm"
                    checked={taxpayerStatus === 'firm'}
                    onChange={(e) => setTaxpayerStatus(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`px-6 py-2 rounded-lg font-semibold transition-all ${taxpayerStatus === 'firm'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}>
                    Firm / LLP / Company
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={() => setShowCIITable(!showCIITable)}
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              {showCIITable ? 'Hide' : 'View'} CII Table
            </button>
          </div>

          {showCIITable && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left text-foreground font-semibold">Financial Year</th>
                    <th className="px-4 py-2 text-left text-foreground font-semibold">CII Value</th>
                    <th className="px-4 py-2 text-left text-foreground font-semibold">Financial Year</th>
                    <th className="px-4 py-2 text-left text-foreground font-semibold">CII Value</th>
                  </tr>
                </thead>
                <tbody>
                  {CII_YEARS.map((year, index) => {
                    if (index % 2 === 0) {
                      return (
                        <tr key={year} className="border-b border-border/50">
                          <td className="px-4 py-2 text-muted-foreground">{year}</td>
                          <td className="px-4 py-2 text-foreground font-medium">{CII[year]}</td>
                          <td className="px-4 py-2 text-muted-foreground">{CII_YEARS[index + 1] || ''}</td>
                          <td className="px-4 py-2 text-foreground font-medium">{CII_YEARS[index + 1] ? CII[CII_YEARS[index + 1]] : ''}</td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => {
              setActiveTab('equity');
              setResult(null);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'equity'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-muted text-muted-foreground hover:bg-muted/70 border border-border'
              }`}
          >
            <TrendingUp className="w-5 h-5" />
            Listed Equity / Equity MFs
          </button>

          <button
            onClick={() => {
              setActiveTab('property');
              setResult(null);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'property'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-muted text-muted-foreground hover:bg-muted/70 border border-border'
              }`}
          >
            <Building className="w-5 h-5" />
            Land or Building
          </button>

          <button
            onClick={() => {
              setActiveTab('other');
              setResult(null);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'other'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-muted text-muted-foreground hover:bg-muted/70 border border-border'
              }`}
          >
            <Coins className="w-5 h-5" />
            Other Assets
          </button>
        </div>

        {/* Equity Tab */}
        {activeTab === 'equity' && (
          <div className="glass-card shadow-elevated rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Listed Equity & Equity Mutual Funds</h2>
                <p className="text-sm text-muted-foreground">Holding Period: 1 Year</p>
              </div>
            </div>

            <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6 rounded">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-foreground">
                  <p className="font-semibold mb-1">Tax Rules:</p>
                  <ul className="space-y-1">
                    <li>• <strong>STCG</strong> (≤1 year): 20%</li>
                    <li>• <strong>LTCG</strong> (&gt;1 year): 12.5% on gains over ₹1,25,000</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={equityData.purchaseDate}
                    onChange={(e) => setEquityData({ ...equityData, purchaseDate: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Purchase Price</label>
                  <input
                    type="number"
                    value={equityData.purchasePrice}
                    onChange={(e) => setEquityData({ ...equityData, purchasePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Sale Date</label>
                  <input
                    type="date"
                    value={equityData.saleDate}
                    onChange={(e) => setEquityData({ ...equityData, saleDate: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Sale Price</label>
                  <input
                    type="number"
                    value={equityData.salePrice}
                    onChange={(e) => setEquityData({ ...equityData, salePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="grandfathered"
                  checked={equityData.isGrandfathered}
                  onChange={(e) => setEquityData({ ...equityData, isGrandfathered: e.target.checked })}
                  className="w-5 h-5 text-primary rounded"
                />
                <label htmlFor="grandfathered" className="text-sm font-medium text-muted-foreground">
                  Purchased before Jan 31, 2018 (Grandfathering)
                </label>
              </div>

              {equityData.isGrandfathered && (
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Fair Market Value as on Jan 31, 2018</label>
                  <input
                    type="number"
                    value={equityData.fmv2018}
                    onChange={(e) => setEquityData({ ...equityData, fmv2018: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              )}

              <button
                onClick={calculateEquityGains}
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Calculate Equity Gain
              </button>
            </div>
          </div>
        )}

        {/* Property Tab */}
        {activeTab === 'property' && (
          <div className="glass-card shadow-elevated rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Land or Building</h2>
                <p className="text-sm text-muted-foreground">Holding Period: 2 Years</p>
              </div>
            </div>

            <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6 rounded">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-foreground">
                  <p className="font-semibold mb-1">Tax Rules:</p>
                  <ul className="space-y-1">
                    <li>• <strong>STCG</strong> (≤2 years): Added to income, taxed at slab rate</li>
                    <li>• <strong>LTCG</strong> (&gt;2 years): Individual/HUF can choose between two options</li>
                    <li>• <strong>LTCG</strong> (Firm/Company): 12.5% without indexation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={propertyData.purchaseDate}
                    onChange={(e) => setPropertyData({ ...propertyData, purchaseDate: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  {propertyData.purchaseDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Purchase Year CII ({getFinancialYear(propertyData.purchaseDate)}): {
                        new Date(propertyData.purchaseDate) < BASE_CII_START_DATE
                          ? '100 (Base)'
                          : CII[getFinancialYear(propertyData.purchaseDate)] || 'N/A'
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Purchase Price</label>
                  <input
                    type="number"
                    value={propertyData.purchasePrice}
                    onChange={(e) => setPropertyData({ ...propertyData, purchasePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Sale Date</label>
                  <input
                    type="date"
                    value={propertyData.saleDate}
                    onChange={(e) => setPropertyData({ ...propertyData, saleDate: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  {propertyData.saleDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Sale Year CII ({getFinancialYear(propertyData.saleDate)}): {CII[getFinancialYear(propertyData.saleDate)] || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Sale Price</label>
                  <input
                    type="number"
                    value={propertyData.salePrice}
                    onChange={(e) => setPropertyData({ ...propertyData, salePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Cost of Improvement</label>
                  <input
                    type="number"
                    value={propertyData.costOfImprovement}
                    onChange={(e) => setPropertyData({ ...propertyData, costOfImprovement: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                {propertyData.costOfImprovement > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Year of Improvement</label>
                    <select
                      value={propertyData.improvementYear}
                      onChange={(e) => setPropertyData({ ...propertyData, improvementYear: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    >
                      {CII_YEARS.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                onClick={calculatePropertyGains}
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Calculate Property Gain
              </button>
            </div>
          </div>
        )}

        {/* Other Assets Tab */}
        {activeTab === 'other' && (
          <div className="glass-card shadow-elevated rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Other Assets (Gold, Debt MFs, etc.)</h2>
                <p className="text-sm text-muted-foreground">Holding Period: 2 Years</p>
              </div>
            </div>

            <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6 rounded">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-foreground">
                  <p className="font-semibold mb-1">Tax Rules:</p>
                  <ul className="space-y-1">
                    <li>• <strong>STCG</strong> (≤2 years): Added to income, taxed at slab rate</li>
                    <li>• <strong>LTCG</strong> (&gt;2 years): 12.5% without indexation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={otherData.purchaseDate}
                    onChange={(e) => setOtherData({ ...otherData, purchaseDate: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Purchase Price</label>
                  <input
                    type="number"
                    value={otherData.purchasePrice}
                    onChange={(e) => setOtherData({ ...otherData, purchasePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Sale Date</label>
                  <input
                    type="date"
                    value={otherData.saleDate}
                    onChange={(e) => setOtherData({ ...otherData, saleDate: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Sale Price</label>
                  <input
                    type="number"
                    value={otherData.salePrice}
                    onChange={(e) => setOtherData({ ...otherData, salePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button
                onClick={calculateOtherGains}
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Calculate Other Asset Gain
              </button>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="glass-card shadow-elevated rounded-2xl p-8 mt-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Calculation Result</h2>
            </div>

            {/* Holding Period */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">Holding Period</h3>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {result.holding.years} years, {result.holding.months} months
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                ({result.holding.totalMonths} months / {result.holding.totalDays} days)
              </p>
            </div>

            {/* STCG Result */}
            {result.type === 'STCG' && (
              <div className="bg-destructive/10 border-l-4 border-destructive rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-destructive mb-2">Short-Term Capital Gain (STCG)</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Capital Gain:</span>
                        <span className="text-xl font-bold text-destructive">{formatCurrency(result.gain)}</span>
                      </div>

                      {result.assetType === 'Equity' && result.taxRate && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Tax Rate:</span>
                            <span className="text-lg font-semibold text-destructive">{(result.taxRate * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-destructive/50">
                            <span className="text-muted-foreground font-semibold">Final Tax:</span>
                            <span className="text-2xl font-bold text-destructive">{formatCurrency(result.finalTax)}</span>
                          </div>
                        </>
                      )}

                      {result.note && (
                        <div className="mt-4 p-3 bg-destructive/20 rounded">
                          <p className="text-sm text-destructive">{result.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LTCG Result - Equity */}
            {result.type === 'LTCG' && result.assetType === 'Equity' && (
              <div className="bg-primary/10 border-l-4 border-primary rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">Long-Term Capital Gain (LTCG)</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Capital Gain:</span>
                        <span className="text-xl font-bold text-foreground">{formatCurrency(result.gain)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Exemption:</span>
                        <span className="text-lg font-semibold text-success">₹1,25,000</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Taxable Gain:</span>
                        <span className="text-xl font-bold text-foreground">{formatCurrency(result.taxableGain)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Tax Rate:</span>
                        <span className="text-lg font-semibold text-success">{(result.taxRate * 100).toFixed(1)}%</span>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-success/50">
                        <span className="text-muted-foreground font-semibold">Final Tax:</span>
                        <span className="text-2xl font-bold text-success">{formatCurrency(result.finalTax)}</span>
                      </div>

                      {result.note && (
                        <div className="mt-4 p-3 bg-success/20 rounded">
                          <p className="text-sm text-foreground">{result.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LTCG Result - Property */}
            {result.type === 'LTCG' && result.assetType === 'Property' && (
              <div className="space-y-4">
                <div className="bg-primary/10 border-l-4 border-primary rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">Long-Term Capital Gain (LTCG)</h3>
                  </div>
                </div>

                {taxpayerStatus === 'individual' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Option 1 */}
                    <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-md">
                      <h4 className="text-lg font-bold text-purple-800 mb-4">Option 1: 20% with Indexation</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Indexed Cost of Acquisition:</p>
                          <p className="text-lg font-semibold text-foreground">{formatCurrency(result.option1.indexedCostAcq)}</p>
                          <p className="text-xs text-gray-500">CII: {result.option1.ciiPurchase} → {result.option1.ciiSale}</p>
                        </div>

                        {result.option1.indexedCostImp > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground">Indexed Cost of Improvement:</p>
                            <p className="text-lg font-semibold text-foreground">{formatCurrency(result.option1.indexedCostImp)}</p>
                          </div>
                        )}

                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-sm text-muted-foreground">Taxable Gain:</p>
                          <p className="text-xl font-bold text-purple-800">{formatCurrency(result.option1.gain)}</p>
                        </div>

                        <div className="pt-3 border-t border-purple-200">
                          <p className="text-sm text-muted-foreground">Final Tax @ 20%:</p>
                          <p className="text-2xl font-bold text-purple-900">{formatCurrency(result.option1.tax)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Option 2 */}
                    <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-md">
                      <h4 className="text-lg font-bold text-foreground mb-4">Option 2: 12.5% without Indexation</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">No indexation benefit</p>
                          <p className="text-xs text-gray-500 mt-8">&nbsp;</p>
                        </div>

                        <div className="pt-3 border-t border-gray-200" style={{ marginTop: '4.5rem' }}>
                          <p className="text-sm text-muted-foreground">Taxable Gain:</p>
                          <p className="text-xl font-bold text-foreground">{formatCurrency(result.option2.gain)}</p>
                        </div>

                        <div className="pt-3 border-t border-blue-200">
                          <p className="text-sm text-muted-foreground">Final Tax @ 12.5%:</p>
                          <p className="text-2xl font-bold text-blue-900">{formatCurrency(result.option2.tax)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-md">
                    <h4 className="text-lg font-bold text-foreground mb-4">Tax @ 12.5% (No Indexation)</h4>
                    <p className="text-sm text-muted-foreground mb-4">For Firms/Companies, only option is 12.5% without indexation</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Taxable Gain:</span>
                        <span className="text-xl font-bold text-foreground">{formatCurrency(result.option2.gain)}</span>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                        <span className="text-muted-foreground font-semibold">Final Tax @ 12.5%:</span>
                        <span className="text-2xl font-bold text-blue-900">{formatCurrency(result.option2.tax)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {taxpayerStatus === 'individual' && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">
                        <strong>Recommended:</strong> Choose the option with lower tax. In this case,
                        {result.option1.tax < result.option2.tax ? ' Option 1 (20% with indexation)' : ' Option 2 (12.5% without indexation)'}
                        {' '}saves you {formatCurrency(Math.abs(result.option1.tax - result.option2.tax))}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* LTCG Result - Other Assets */}
            {result.type === 'LTCG' && result.assetType === 'Other' && (
              <div className="bg-primary/10 border-l-4 border-primary rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">Long-Term Capital Gain (LTCG)</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Capital Gain:</span>
                        <span className="text-xl font-bold text-foreground">{formatCurrency(result.gain)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Tax Rate:</span>
                        <span className="text-lg font-semibold text-success">{(result.taxRate * 100).toFixed(1)}%</span>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-success/50">
                        <span className="text-muted-foreground font-semibold">Final Tax:</span>
                        <span className="text-2xl font-bold text-success">{formatCurrency(result.finalTax)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 glass-card shadow-card border-l-4 border-accent p-6 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-accent mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Important Information</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• This calculator uses tax rules for FY 2025-26</li>
                <li>• Calculations are for educational purposes only</li>
                <li>• Please consult a tax professional for accurate tax planning</li>
                <li>• CII values are official up to 2024-25, projected for 2025-26</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default CapitalGainsCal;