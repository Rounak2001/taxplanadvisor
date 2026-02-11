import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Users, Landmark, FileSpreadsheet, Percent, Plus, Minus, Download, FileText, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const MONTHS = [
    "April", "May", "June", "July", "August", "September",
    "October", "November", "December", "January", "February", "March"
];

export const InterestAndRemunerationCalculator = ({ isDashboard = false, backPath }) => {
    const [firmName, setFirmName] = useState('');
    const [numPartners, setNumPartners] = useState('');
    const [partners, setPartners] = useState([]);
    const [interestRate, setInterestRate] = useState(12);
    const [annualProfit, setAnnualProfit] = useState('');
    const [totalCalculatedInterest, setTotalCalculatedInterest] = useState(0);
    const [calculatedRemuneration, setCalculatedRemuneration] = useState(0);
    const [results, setResults] = useState(null);

    const handleNumPartnersChange = (e) => {
        const val = parseInt(e.target.value) || 0;
        setNumPartners(val);

        if (val >= 2) {
            setPartners(prev => {
                const currentCount = prev.length;
                if (val > currentCount) {
                    const newPartners = Array.from({ length: val - currentCount }, (_, i) => ({
                        id: currentCount + i + 1,
                        name: '',
                        share: '',
                        monthlyData: MONTHS.map(m => ({ month: m, capital: '', interest: 0 })),
                        expanded: false
                    }));
                    return [...prev, ...newPartners];
                } else if (val < currentCount) {
                    return prev.slice(0, val);
                }
                return prev;
            });
            setResults(null);
        } else {
            if (val === 0) setPartners([]);
        }
    };

    const updatePartner = (id, field, value) => {
        setPartners(prev => prev.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const toggleExpand = (id) => {
        setPartners(prev => prev.map(p =>
            p.id === id ? { ...p, expanded: !p.expanded } : p
        ));
    };

    const updateMonthlyCapital = (partnerId, monthIndex, value) => {
        const cap = parseFloat(value);
        const annualRate = parseFloat(interestRate) || 0;
        const monthlyRate = annualRate / 12;
        const interest = isNaN(cap) ? 0 : cap * (monthlyRate / 100);

        setPartners(prev => prev.map(p => {
            if (p.id !== partnerId) return p;
            const newData = [...p.monthlyData];
            newData[monthIndex] = { ...newData[monthIndex], capital: value, interest };
            return { ...p, monthlyData: newData };
        }));
    };

    const handleInterestRateChange = (val) => {
        setInterestRate(val);
        const annualRate = parseFloat(val) || 0;
        const monthlyRate = annualRate / 12;

        setPartners(prev => prev.map(p => ({
            ...p,
            monthlyData: p.monthlyData.map(m => ({
                ...m,
                interest: (parseFloat(m.capital) || 0) * (monthlyRate / 100)
            }))
        })));
    };

    useEffect(() => {
        const total = partners.reduce((sum, p) => {
            return sum + p.monthlyData.reduce((mSum, m) => mSum + m.interest, 0);
        }, 0);
        setTotalCalculatedInterest(total);
    }, [partners]);

    useEffect(() => {
        const profit = parseFloat(annualProfit) || 0;
        const npBeforeRemun = profit - totalCalculatedInterest;

        let remun = 0;
        if (npBeforeRemun <= 0) {
            remun = 0;
        } else if (npBeforeRemun <= 600000) {
            remun = npBeforeRemun * 0.90;
        } else {
            const excess = npBeforeRemun - 600000;
            remun = 540000 + (excess * 0.60);
        }

        const minimumFloor = Math.min(300000, npBeforeRemun);
        if (remun < minimumFloor && remun > 0) {
            remun = minimumFloor;
        }

        if (remun > npBeforeRemun) remun = npBeforeRemun;
        if (remun < 0) remun = 0;

        setCalculatedRemuneration(remun);
    }, [annualProfit, totalCalculatedInterest]);

    const calculateTax = () => {
        const profit = parseFloat(annualProfit);
        if (isNaN(profit)) {
            toast.error("Please enter a valid Annual Net Profit.");
            return;
        }

        const totalShare = partners.reduce((sum, p) => sum + (parseFloat(p.share) || 0), 0);
        if (Math.abs(totalShare - 100) > 0.1) {
            toast.error(`Total Profit Share must be 100%. Current: ${totalShare.toFixed(2)}%`);
            return;
        }

        let totalFirmInterest = totalCalculatedInterest;
        const partnerResults = partners.map(p => {
            const pTotalInterest = p.monthlyData.reduce((sum, m) => sum + m.interest, 0);
            return {
                ...p,
                totalInterest: pTotalInterest,
                shareVal: parseFloat(p.share) || 0
            };
        });

        const npBeforeRemun = profit - totalFirmInterest;

        let remun = 0;
        if (npBeforeRemun <= 0) {
            remun = 0;
        } else if (npBeforeRemun <= 600000) {
            remun = npBeforeRemun * 0.90;
        } else {
            const excess = npBeforeRemun - 600000;
            remun = 540000 + (excess * 0.60);
        }

        const minimumFloor = Math.min(300000, npBeforeRemun);
        if (remun < minimumFloor && remun > 0) {
            remun = minimumFloor;
        }

        if (remun > npBeforeRemun) remun = npBeforeRemun;

        const taxableProfit = npBeforeRemun - remun;
        const incomeTax = taxableProfit > 0 ? taxableProfit * 0.30 : 0;

        let surcharge = 0;
        if (taxableProfit > 10000000) {
            surcharge = incomeTax * 0.12;
        }
        const taxPlusSurcharge = incomeTax + surcharge;
        const cessAmount = taxPlusSurcharge * 0.04;
        const totalTax = taxPlusSurcharge + cessAmount;
        const profitAfterTax = taxableProfit - totalTax;

        const finalDistribution = partnerResults.map(p => {
            const pRemun = (remun * p.shareVal) / 100;
            const pShareProfit = (profitAfterTax * p.shareVal) / 100;
            const totalEarnings = p.totalInterest + pRemun + pShareProfit;

            return {
                ...p,
                remuneration: pRemun,
                shareProfit: pShareProfit,
                totalEarnings
            };
        });

        setResults({
            netProfit: profit,
            totalInterest: totalFirmInterest,
            npBeforeRemun,
            totalRemuneration: remun,
            taxableProfit,
            incomeTax,
            surcharge,
            cessAmount,
            totalTax,
            profitAfterTax,
            distribution: finalDistribution
        });
        toast.success("Tax calculation completed!");
    };

    const handleExportExcel = () => {
        if (!results) return;
        const summaryData = [
            ["PARTNERSHIP TAX CALCULATION", ""],
            ["Firm Name", firmName || "N/A"],
            ["", ""],
            ["(1) Annual Net Profit (Tally)", results.netProfit],
            ["(-) Total Interest on Capital", results.totalInterest],
            ["(2) NP Before Remuneration", results.npBeforeRemun],
            ["(-) Total Remuneration (Sec 40b)", results.totalRemuneration],
            ["", ""],
            ["(3) Profit (Before Tax)", results.taxableProfit],
            ["(-) Income Tax (30%)", results.incomeTax],
            ["(-) Surcharge (12%)", results.surcharge],
            ["(-) H&E Cess (4%)", results.cessAmount],
            ["To Provision for Tax", results.totalTax],
            ["", ""],
            ["(4) Distributable Profit (After Tax)", results.profitAfterTax]
        ];

        const distributionData = results.distribution.map(p => ({
            "Partner Name": p.name || `Partner ${p.id}`,
            "Interest on Capital": p.totalInterest,
            "Remuneration": p.remuneration,
            "Share of Profit": p.shareProfit,
            "Total Earnings": p.totalEarnings
        }));

        const monthlyDetails = [];
        partners.forEach(p => {
            p.monthlyData.forEach(m => {
                monthlyDetails.push({
                    "Partner Name": p.name || `Partner ${p.id}`,
                    "Month": m.month,
                    "Capital Balance": m.capital,
                    "Interest": m.interest
                });
            });
        });

        const wb = XLSX.utils.book_new();
        const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
        const ws2 = XLSX.utils.json_to_sheet(distributionData);
        const ws3 = XLSX.utils.json_to_sheet(monthlyDetails);
        XLSX.utils.book_append_sheet(wb, ws1, "Summary");
        XLSX.utils.book_append_sheet(wb, ws2, "Partner Distribution");
        XLSX.utils.book_append_sheet(wb, ws3, "Monthly Capital Details");
        XLSX.writeFile(wb, `${firmName.replace(/\s+/g, '_') || 'Tax_Calculation'}.xlsx`);
        toast.success("Excel exported successfully!");
    };

    const handleExportPDF = () => {
        if (!results) return;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Partnership Tax Calculation", 14, 20);
        doc.setFontSize(12);
        doc.text(`Firm Name: ${firmName || "N/A"}`, 14, 30);

        const summaryRows = [
            ["(1) Annual Net Profit (Tally)", results.netProfit.toLocaleString('en-IN')],
            ["(-) Total Interest on Capital", results.totalInterest.toLocaleString('en-IN')],
            ["(2) NP Before Remuneration", results.npBeforeRemun.toLocaleString('en-IN')],
            ["(-) Total Remuneration (Sec 40b)", results.totalRemuneration.toLocaleString('en-IN')],
            ["(3) Profit (Before Tax)", results.taxableProfit.toLocaleString('en-IN')],
            ["(-) Income Tax (30%)", results.incomeTax.toLocaleString('en-IN')],
            ["(-) Surcharge (12%)", (results.surcharge || 0).toLocaleString('en-IN')],
            ["(-) H&E Cess (4%)", results.cessAmount.toLocaleString('en-IN')],
            ["To Provision for Tax", results.totalTax.toLocaleString('en-IN')],
            ["(4) Distributable Profit (After Tax)", results.profitAfterTax.toLocaleString('en-IN')]
        ];

        autoTable(doc, {
            startY: 40,
            head: [['Particulars', 'Amount (INR)']],
            body: summaryRows,
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235] }
        });

        const distHeader = [["Partner", "Interest", "Remun", "Share Profit", "Total"]];
        const distRows = results.distribution.map(p => [
            p.name || `Partner ${p.id}`,
            p.totalInterest.toLocaleString('en-IN'),
            p.remuneration.toLocaleString('en-IN'),
            p.shareProfit.toLocaleString('en-IN'),
            p.totalEarnings.toLocaleString('en-IN')
        ]);

        doc.text("Partner Distribution", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: distHeader,
            body: distRows,
            theme: 'grid',
            headStyles: { fillColor: [22, 101, 52] }
        });

        // Add Monthly Capital Detail Section
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Monthly Capital & Interest Details", 14, 20);

        let currentY = 30;
        partners.forEach((p, idx) => {
            if (currentY > 240) {
                doc.addPage();
                currentY = 20;
            }

            doc.setFontSize(12);
            doc.text(`${p.name || `Partner ${p.id}`}`, 14, currentY);

            const partnerMonthlyRows = p.monthlyData.map(m => [
                m.month,
                m.capital.toLocaleString('en-IN'),
                m.interest.toLocaleString('en-IN')
            ]);

            autoTable(doc, {
                startY: currentY + 5,
                head: [['Month', 'Capital Balance', 'Interest']],
                body: partnerMonthlyRows,
                theme: 'striped',
                headStyles: { fillColor: [100, 116, 139] },
                margin: { left: 14 }
            });

            currentY = doc.lastAutoTable.finalY + 15;
        });

        doc.save(`${firmName.replace(/\s+/g, '_') || 'Tax_Calculation'}.pdf`);
        toast.success("PDF exported successfully!");
    };

    const formatCurrency = (val) => {
        return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <CalculatorLayout isDashboard={isDashboard} backPath={backPath}>
            <div className="max-w-7xl mx-auto py-6">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-glow">
                            <Landmark className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Interest & Remuneration Calculator
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Professional tax planning utility for Partnership Firms to calculate interest on capital and partner remuneration under Section 40(b).
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side - Configuration */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Firm & Partner Setup */}
                        <Card className="glass-card shadow-elevated overflow-hidden border-primary/10">
                            <CardHeader className="bg-primary/5 border-b border-primary/10">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Calculator className="w-5 h-5" />
                                    Firm Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="firmName">Name of Firm</Label>
                                        <div className="relative">
                                            <Input
                                                id="firmName"
                                                value={firmName}
                                                onChange={(e) => setFirmName(e.target.value)}
                                                placeholder="Enter Firm Name"
                                                className="pl-10"
                                            />
                                            <Landmark className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="numPartners">Number of Partners (Min 2)</Label>
                                        <div className="relative">
                                            <Input
                                                id="numPartners"
                                                type="text"
                                                inputMode="numeric"
                                                value={numPartners}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '' || /^\d*$/.test(val)) {
                                                        handleNumPartnersChange(e);
                                                    }
                                                }}
                                                placeholder="Enter number of partners"
                                                className="pl-10"
                                            />
                                            <Users className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>

                                {partners.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between pb-4 border-b">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                Partner Details
                                            </h3>
                                            <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-xl border border-primary/20">
                                                <Label className="text-xs font-bold text-primary uppercase whitespace-nowrap">Interest Rate (% p.a.)</Label>
                                                <Input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={interestRate}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                            handleInterestRateChange(val);
                                                        }
                                                    }}
                                                    className="w-20 h-8 text-right font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {partners.map((p, idx) => (
                                                <div key={p.id} className="border rounded-2xl overflow-hidden transition-all hover:shadow-md">
                                                    <div
                                                        className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${p.expanded ? 'bg-primary/5' : 'bg-card'}`}
                                                        onClick={() => toggleExpand(p.id)}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-lg"
                                                        >
                                                            {p.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                        </Button>

                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <Input
                                                                placeholder={`Partner ${p.id} Name`}
                                                                value={p.name}
                                                                onChange={(e) => updatePartner(p.id, 'name', e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="h-9"
                                                            />
                                                            <div className="relative">
                                                                <Input
                                                                    type="text"
                                                                    inputMode="decimal"
                                                                    placeholder="Profit Share (%)"
                                                                    value={p.share}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                                            updatePartner(p.id, 'share', val);
                                                                        }
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="h-9 pr-8"
                                                                />
                                                                <Percent className="w-3 h-3 absolute right-3 top-3 text-muted-foreground" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <AnimatePresence>
                                                        {p.expanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden border-t"
                                                            >
                                                                <div className="p-4 bg-muted/30">
                                                                    <div className="rounded-xl border bg-card overflow-hidden">
                                                                        <Table>
                                                                            <TableHeader className="bg-muted/50">
                                                                                <TableRow className="hover:bg-transparent">
                                                                                    <TableHead className="h-10 text-[10px] uppercase font-bold tracking-wider">Month</TableHead>
                                                                                    <TableHead className="h-10 text-[10px] uppercase font-bold tracking-wider">Capital Balance</TableHead>
                                                                                    <TableHead className="h-10 text-[10px] uppercase font-bold tracking-wider text-right">Interest ({(parseFloat(interestRate) / 12).toFixed(2)}%)</TableHead>
                                                                                </TableRow>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {p.monthlyData.map((m, mIdx) => (
                                                                                    <TableRow key={mIdx} className="hover:bg-primary/5 transition-colors border-b last:border-0">
                                                                                        <TableCell className="py-2 text-sm font-medium text-muted-foreground">{m.month}</TableCell>
                                                                                        <TableCell className="py-2">
                                                                                            <Input
                                                                                                type="text"
                                                                                                inputMode="numeric"
                                                                                                placeholder="0.00"
                                                                                                value={m.capital}
                                                                                                onChange={(e) => {
                                                                                                    const val = e.target.value;
                                                                                                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                                                                        updateMonthlyCapital(p.id, mIdx, val);
                                                                                                    }
                                                                                                }}
                                                                                                className="h-9 text-sm bg-background border-muted-foreground/20 focus:border-primary/50 transition-all font-mono"
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell className="py-2 text-right font-mono text-sm font-bold text-primary italic">
                                                                                            {m.interest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </div>
                                                                    <div className="mt-4 flex justify-end">
                                                                        <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl shadow-sm">
                                                                            <span className="text-sm font-semibold text-muted-foreground mr-3 uppercase tracking-wider">Total Annual Interest:</span>
                                                                            <span className="text-xl font-black text-primary">
                                                                                {formatCurrency(p.monthlyData.reduce((acc, curr) => acc + curr.interest, 0))}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Financial Input Section */}
                        {partners.length > 0 && (
                            <Card className="glass-card shadow-elevated border-primary/10">
                                <CardHeader className="bg-primary/5 border-b border-primary/10">
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <TrendingUp className="w-5 h-5" />
                                        Calculation Results preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label>Annual Net Profit (as per Tally)</Label>
                                            <Input
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="0.00"
                                                value={annualProfit}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                        setAnnualProfit(val);
                                                    }
                                                }}
                                                className="font-bold h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Interest on Capital</Label>
                                            <div className="h-11 flex items-center px-4 bg-red-500/10 border border-red-500/20 text-red-600 font-bold rounded-xl">
                                                {formatCurrency(totalCalculatedInterest)}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Max Remuneration (40b)</Label>
                                            <div className="h-11 flex items-center px-4 bg-blue-500/10 border border-blue-500/20 text-blue-600 font-bold rounded-xl">
                                                {formatCurrency(calculatedRemuneration)}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={calculateTax}
                                        className="w-full mt-8 h-12 text-lg font-bold shadow-glow"
                                    >
                                        Generate Full Tax Report
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Side - Summary Card */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-6">
                            <Card className="glass-card shadow-elevated border-primary/10 overflow-hidden">
                                <CardHeader className="bg-primary/5 border-b border-primary/10">
                                    <CardTitle className="text-lg">Tax Plan Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {!results ? (
                                        <div className="text-center py-10 text-muted-foreground space-y-4">
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                                <FileText className="w-8 h-8 opacity-50" />
                                            </div>
                                            <p>Complete the details and click Calculate to see results.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-2xl bg-muted/50 space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Book Profit</span>
                                                    <span className="font-semibold">{formatCurrency(results.npBeforeRemun)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Remuneration</span>
                                                    <span className="font-semibold text-blue-600">-{formatCurrency(results.totalRemuneration)}</span>
                                                </div>
                                                <div className="pt-2 border-t flex justify-between items-center text-base font-bold">
                                                    <span>Taxable Income</span>
                                                    <span>{formatCurrency(results.taxableProfit)}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-destructive px-1">
                                                    <span>Income Tax (30%)</span>
                                                    <span>{formatCurrency(results.incomeTax)}</span>
                                                </div>
                                                {results.surcharge > 0 && (
                                                    <div className="flex justify-between text-xs text-destructive px-1">
                                                        <span>Surcharge</span>
                                                        <span>{formatCurrency(results.surcharge)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-xs text-destructive px-1">
                                                    <span>Health & Edu Cess</span>
                                                    <span>{formatCurrency(results.cessAmount)}</span>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-destructive">Total Tax Provision</span>
                                                    <span className="text-lg font-black text-destructive">{formatCurrency(results.totalTax)}</span>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-primary">Distributable Profit</span>
                                                    <span className="text-lg font-black text-primary">{formatCurrency(results.profitAfterTax)}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-4">
                                                <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
                                                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                                    Excel
                                                </Button>
                                                <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
                                                    <Download className="w-4 h-4 text-rose-600" />
                                                    PDF
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Breakdown Table for Partners */}
                {results && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12"
                    >
                        <Card className="glass-card shadow-elevated border-primary/10 overflow-hidden">
                            <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    Partner-wise Distribution Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Partner Name</TableHead>
                                                <TableHead className="text-right">Interest on Capital</TableHead>
                                                <TableHead className="text-right">Remuneration</TableHead>
                                                <TableHead className="text-right">Share of NP</TableHead>
                                                <TableHead className="text-right font-bold text-foreground">Total Inflow</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {results.distribution.map((p) => (
                                                <TableRow key={p.id}>
                                                    <TableCell className="font-semibold">{p.name || `Partner ${p.id}`}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(p.totalInterest)}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(p.remuneration)}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(p.shareProfit)}</TableCell>
                                                    <TableCell className="text-right font-bold text-primary">{formatCurrency(p.totalEarnings)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Educational/Help Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-muted-foreground">
                    <div className="bg-muted/30 p-6 rounded-3xl border">
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                            <Percent className="w-4 h-4" />
                            Section 40(b) Remuneration Rules
                        </h4>
                        <ul className="space-y-2">
                            <li>• First ₹3 Lakhs of Book Profit: 90% or ₹1,50,000 (whichever is more)</li>
                            <li>• Balance Book Profit: 60%</li>
                            <li>• In case of loss: Max ₹1,50,000 allowed</li>
                        </ul>
                    </div>
                    <div className="bg-muted/30 p-6 rounded-3xl border">
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                            <Landmark className="w-4 h-4" />
                            Interest on Capital Rules
                        </h4>
                        <ul className="space-y-2">
                            <li>• Max interest allowed: 12% p.a.</li>
                            <li>• Must be authorized by the Partnership Deed</li>
                            <li>• Calculated on a monthly product basis or as per Deed</li>
                        </ul>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default InterestAndRemunerationCalculator;
