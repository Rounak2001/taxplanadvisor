import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";

export const SIPCalculator = ({ isDashboard = false, backPath }) => {
  const [searchParams] = useSearchParams();
  const [investmentType, setInvestmentType] = useState(searchParams.get('type') || "sip");

  useEffect(() => {
    const type = searchParams.get('type');
    if (type && ['sip', 'stepup', 'lumpsum'].includes(type)) {
      setInvestmentType(type);
    }
  }, [searchParams]);
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const calculateSIP = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = monthlyInvestment * months;
    return { futureValue, totalInvestment, returns: futureValue - totalInvestment };
  };

  const calculateLumpsum = () => {
    const futureValue = lumpsumAmount * Math.pow(1 + expectedReturn / 100, timePeriod);
    return { futureValue, totalInvestment: lumpsumAmount, returns: futureValue - lumpsumAmount };
  };

  const calculateStepUpSIP = () => {
    let total = 0, invested = 0, currentMonthly = monthlyInvestment;
    const monthlyRate = expectedReturn / 12 / 100;
    for (let year = 0; year < timePeriod; year++) {
      if (year > 0) currentMonthly *= (1 + stepUpPercent / 100);
      for (let month = 0; month < 12; month++) {
        total = (total + currentMonthly) * (1 + monthlyRate);
        invested += currentMonthly;
      }
    }
    return { futureValue: total, totalInvestment: invested, returns: total - invested };
  };

  const result = investmentType === "sip" ? calculateSIP() : investmentType === "lumpsum" ? calculateLumpsum() : calculateStepUpSIP();

  return (
    <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Investment Calculator</h1>
          </div>
          <p className="text-muted-foreground text-lg">Calculate returns on SIP or Lumpsum investments</p>
          <div className="flex justify-center gap-4 mt-6">
            <Button variant={investmentType === "sip" ? "default" : "outline"} onClick={() => setInvestmentType("sip")}>SIP</Button>
            <Button variant={investmentType === "stepup" ? "default" : "outline"} onClick={() => setInvestmentType("stepup")}>Step-up SIP</Button>
            <Button variant={investmentType === "lumpsum" ? "default" : "outline"} onClick={() => setInvestmentType("lumpsum")}>Lumpsum</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {investmentType === "sip" || investmentType === "stepup" ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Monthly Investment (₹)</Label>
                      <Input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value))} className="w-32 text-right" />
                    </div>
                    <Slider value={[monthlyInvestment]} onValueChange={(v) => setMonthlyInvestment(v[0])} min={500} max={100000} step={500} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹500</span>
                      <span>₹1L</span>
                    </div>
                  </div>
                  {investmentType === "stepup" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Annual Step-up (%)</Label>
                        <Input type="number" value={stepUpPercent} onChange={(e) => setStepUpPercent(Number(e.target.value))} className="w-32 text-right" />
                      </div>
                      <Slider value={[stepUpPercent]} onValueChange={(v) => setStepUpPercent(v[0])} min={1} max={30} step={1} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1%</span>
                        <span>30%</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Total Investment (₹)</Label>
                    <Input type="number" value={lumpsumAmount} onChange={(e) => setLumpsumAmount(Number(e.target.value))} className="w-32 text-right" />
                  </div>
                  <Slider value={[lumpsumAmount]} onValueChange={(v) => setLumpsumAmount(v[0])} min={10000} max={10000000} step={10000} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹10K</span>
                    <span>₹1Cr</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Expected Return (% p.a.)</Label>
                  <Input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-32 text-right" step="0.5" />
                </div>
                <Slider value={[expectedReturn]} onValueChange={(v) => setExpectedReturn(v[0])} min={1} max={30} step={0.5} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Time Period (Years)</Label>
                  <Input type="number" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} className="w-32 text-right" />
                </div>
                <Slider value={[timePeriod]} onValueChange={(v) => setTimePeriod(v[0])} min={1} max={40} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 Year</span>
                  <span>40 Years</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Investment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {(() => {
                    const investedPercent = result.totalInvestment / result.futureValue;
                    const returnsPercent = result.returns / result.futureValue;
                    const investedAngle = investedPercent * 360;
                    const returnsAngle = returnsPercent * 360;

                    const investedEndX = 100 + 80 * Math.sin((investedAngle * Math.PI) / 180);
                    const investedEndY = 100 - 80 * Math.cos((investedAngle * Math.PI) / 180);
                    const largeArc = investedAngle > 180 ? 1 : 0;

                    return (
                      <>
                        <path d={`M 100 100 L 100 20 A 80 80 0 ${largeArc} 1 ${investedEndX} ${investedEndY} Z`} fill="#8b5cf6" />
                        <path d={`M 100 100 L ${investedEndX} ${investedEndY} A 80 80 0 ${1 - largeArc} 1 100 20 Z`} fill="#10b981" />
                      </>
                    );
                  })()}
                  <circle cx="100" cy="100" r="50" className="fill-card" />
                  <text x="100" y="95" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-muted-foreground">Total Value</text>
                  <text x="100" y="115" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-foreground">₹{(result.futureValue / 100000).toFixed(1)}L</text>
                </svg>
              </div>
              <div className="flex justify-center gap-4 text-xs mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Invested ({((result.totalInvestment / result.futureValue) * 100).toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>Returns ({((result.returns / result.futureValue) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Investment</p>
                <p className="text-2xl font-bold">₹{result.totalInvestment.toLocaleString()}</p>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Estimated Returns</p>
                <p className="text-2xl font-bold text-primary">₹{result.returns.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-primary to-primary/90 p-4 rounded-lg text-white">
                <p className="text-sm opacity-90 mb-1">Future Value</p>
                <p className="text-3xl font-bold">₹{result.futureValue.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-base text-foreground space-y-6 leading-relaxed">
          <div>
            <h3 className="font-semibold text-lg mb-3">What is {investmentType === "sip" ? "SIP" : investmentType === "stepup" ? "Step-up SIP" : "Lumpsum Investment"}?</h3>
            <p>{investmentType === "sip" ? "SIP (Systematic Investment Plan) is a method of investing a fixed amount regularly in mutual funds. It's like a recurring deposit but with market-linked returns. SIP helps you invest disciplined and benefit from rupee cost averaging." : investmentType === "stepup" ? "Step-up SIP allows you to increase your SIP amount annually by a fixed percentage. As your income grows, your investments grow too, helping you build a larger corpus without feeling the pinch." : "Lumpsum investment means investing a large amount at once. Ideal when you have surplus funds and want to benefit from long-term compounding. Best suited for long investment horizons."}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Key Benefits</h3>
            {investmentType === "sip" || investmentType === "stepup" ? (
              <>
                <p>• Rupee Cost Averaging: Buy more units when prices are low, fewer when high</p>
                <p>• Disciplined Investing: Automated monthly investments build wealth systematically</p>
                <p>• Power of Compounding: Returns generate returns over long periods</p>
                <p>• Flexibility: Start with as low as ₹500, increase or pause anytime</p>
                {investmentType === "stepup" && <p>• Growing Investment: Matches your salary increments automatically</p>}
              </>
            ) : (
              <>
                <p>• Full Market Exposure: Entire amount starts earning returns immediately</p>
                <p>• Maximum Compounding: Longer time in market means higher returns</p>
                <p>• Ideal for Windfalls: Best use of bonus, inheritance, or sale proceeds</p>
                <p>• Lower Transaction Costs: One-time investment, minimal charges</p>
              </>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Investment Formula</h3>
            {investmentType === "lumpsum" ? (
              <>
                <p><strong>Future Value:</strong> FV = P × (1 + r)^n</p>
                <p>Where P = Principal, r = Annual return rate, n = Number of years</p>
              </>
            ) : (
              <>
                <p><strong>SIP Future Value:</strong> FV = P × [(1 + r)^n - 1] / r × (1 + r)</p>
                <p>Where P = Monthly investment, r = Monthly return rate, n = Number of months</p>
              </>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Pro Tips</h3>
            <p>• Start Early: Even small amounts grow significantly over 15-20 years</p>
            <p>• Stay Invested: Don't stop SIP during market falls - that's when you buy cheap</p>
            <p>• Diversify: Invest across large-cap, mid-cap, and debt funds</p>
            <p>• Review Annually: Check fund performance and rebalance if needed</p>
            {investmentType === "stepup" && <p>• Increase by 10-15%: Match your expected salary increment</p>}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};
