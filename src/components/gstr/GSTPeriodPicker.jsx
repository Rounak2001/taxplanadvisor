import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    ChevronRight,
    Check,
    Info,
    Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

const MONTHS = [
    { id: 4, name: 'Apr', fullName: 'April' },
    { id: 5, name: 'May', fullName: 'May' },
    { id: 6, name: 'Jun', fullName: 'June' },
    { id: 7, name: 'Jul', fullName: 'July' },
    { id: 8, name: 'Aug', fullName: 'August' },
    { id: 9, name: 'Sep', fullName: 'September' },
    { id: 10, name: 'Oct', fullName: 'October' },
    { id: 11, name: 'Nov', fullName: 'November' },
    { id: 12, name: 'Dec', fullName: 'December' },
    { id: 1, name: 'Jan', fullName: 'January' },
    { id: 2, name: 'Feb', fullName: 'February' },
    { id: 3, name: 'Mar', fullName: 'March' },
];

const QUARTERS = [
    { id: '1', name: 'Q1', range: 'Apr - Jun' },
    { id: '2', name: 'Q2', range: 'Jul - Sep' },
    { id: '3', name: 'Q3', range: 'Oct - Dec' },
    { id: '4', name: 'Q4', range: 'Jan - Mar' },
];

export function GSTPeriodPicker({
    frequency,
    onFrequencyChange,
    selectedFY,
    onFYChange,
    selectedMonth,
    onMonthChange,
    selectedQuarter,
    onQuarterChange,
    className
}) {
    // Generate FY options (last 5 years)
    const fyOptions = useMemo(() => {
        const now = new Date();
        // Indian FY starts in April. If current month is Jan-Mar, current FY started last year
        const currentFYStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
        const options = [];
        for (let i = 0; i < 5; i++) {
            const startYear = currentFYStart - i;
            options.push({
                label: `FY ${startYear}-${(startYear + 1).toString().slice(-2)}`,
                value: `${startYear}-${startYear + 1}`,
                startYear,
                endYear: startYear + 1
            });
        }
        return options;
    }, []);

    const isFutureMonth = (monthId) => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-12

        const [startYearStr, endYearStr] = (selectedFY || "").split('-');
        if (!startYearStr) return false;

        const startYear = parseInt(startYearStr);
        const endYear = parseInt(endYearStr);

        const yearOfTargetMonth = monthId >= 4 ? startYear : endYear;

        if (yearOfTargetMonth > currentYear) return true;
        if (yearOfTargetMonth === currentYear && monthId > currentMonth) return true;
        return false;
    };

    const isFutureQuarter = (qId) => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        const [startYearStr, endYearStr] = (selectedFY || "").split('-');
        if (!startYearStr) return false;

        const startYear = parseInt(startYearStr);
        const endYear = parseInt(endYearStr);

        const quarterEndMonth = qId === '1' ? 6 : qId === '2' ? 9 : qId === '3' ? 12 : 3;
        const yearOfQuarterEnd = qId === '4' ? endYear : startYear;

        if (yearOfQuarterEnd > currentYear) return true;
        if (yearOfQuarterEnd === currentYear && quarterEndMonth > currentMonth) return true;
        return false;
    };

    const currentFreq = frequency?.toLowerCase() || 'monthly';

    return (
        <div className={cn("space-y-8", className)}>
            {/* Frequency Toggle */}
            <div className="flex justify-center">
                <div className="inline-flex items-center p-1 bg-muted rounded-2xl border shadow-inner">
                    {['Monthly', 'Quarterly', 'Annually'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => onFrequencyChange(mode)}
                            className={cn(
                                "relative px-8 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                                currentFreq === mode.toLowerCase()
                                    ? "bg-background text-primary shadow-elevated ring-1 ring-border"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                            )}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* FY Selector */}
                <div className="md:col-span-4 space-y-4">
                    <div className="space-y-3">
                        <label className="text-sm font-bold flex items-center gap-2 text-foreground/80">
                            <Layers size={16} className="text-primary" />
                            Financial Year
                        </label>
                        <Select value={selectedFY} onValueChange={onFYChange}>
                            <SelectTrigger className="h-14 bg-background border-2 transition-all hover:border-primary/50 focus:ring-primary rounded-xl px-4">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {fyOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value} className="py-3 rounded-lg">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{opt.label}</span>
                                            <span className="text-[11px] text-muted-foreground font-medium">Apr {opt.startYear} - Mar {opt.endYear}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                        <Info size={18} className="text-primary mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            GST reporting follows the <span className="text-primary font-bold">April to March</span> cycle. Future periods are automatically disabled until data is available.
                        </p>
                    </div>
                </div>

                {/* Dynamic Period Content */}
                <div className="md:col-span-8">
                    <AnimatePresence mode="wait">
                        {currentFreq === 'monthly' && (
                            <motion.div
                                key="monthly"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                <label className="text-sm font-bold block text-foreground/80">Select Month</label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {MONTHS.map((m) => {
                                        const future = isFutureMonth(m.id);
                                        const mVal = m.id.toString().padStart(2, '0');
                                        const selected = selectedMonth === mVal;
                                        return (
                                            <button
                                                key={m.id}
                                                disabled={future}
                                                onClick={() => onMonthChange(mVal)}
                                                className={cn(
                                                    "group relative h-16 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-0.5 overflow-hidden",
                                                    selected
                                                        ? "bg-primary border-primary text-primary-foreground shadow-glow-sm"
                                                        : "bg-background border-border hover:border-primary/40 hover:bg-primary/5",
                                                    future && "opacity-40 cursor-not-allowed bg-muted/50 border-dashed"
                                                )}
                                            >
                                                <span className="text-sm font-black uppercase tracking-widest">{m.name}</span>
                                                {selected && (
                                                    <motion.div layoutId="m-active" className="absolute top-1.5 right-1.5 bg-primary-foreground/20 rounded-full p-0.5">
                                                        <Check size={10} strokeWidth={4} />
                                                    </motion.div>
                                                )}
                                                {!future && !selected && (
                                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {currentFreq === 'quarterly' && (
                            <motion.div
                                key="quarterly"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                <label className="text-sm font-bold block text-foreground/80">Select Quarter</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {QUARTERS.map((q) => {
                                        const future = isFutureQuarter(q.id);
                                        const selected = selectedQuarter === q.id;
                                        return (
                                            <button
                                                key={q.id}
                                                disabled={future}
                                                onClick={() => onQuarterChange(q.id)}
                                                className={cn(
                                                    "relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden",
                                                    selected
                                                        ? "bg-primary border-primary text-primary-foreground shadow-glow"
                                                        : "bg-background border-border hover:border-primary/40 hover:bg-primary/5",
                                                    future && "opacity-40 cursor-not-allowed bg-muted/50 border-dashed"
                                                )}
                                            >
                                                <div className="flex flex-col gap-1 z-10 relative">
                                                    <span className="text-xl font-black tracking-tight">{q.name}</span>
                                                    <span className={cn(
                                                        "text-xs font-bold opacity-80 antialiased",
                                                        selected ? "text-primary-foreground" : "text-muted-foreground"
                                                    )}>
                                                        {q.range}
                                                    </span>
                                                </div>
                                                {selected ? (
                                                    <div className="absolute -bottom-4 -right-4 opacity-10">
                                                        <Calendar size={80} strokeWidth={1} />
                                                    </div>
                                                ) : (
                                                    <ChevronRight className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 opacity-0 group-hover:opacity-40 transition-all font-bold" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {currentFreq === 'annually' && (
                            <motion.div
                                key="annually"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="h-full flex flex-col justify-center items-center py-10 px-6 text-center space-y-4 rounded-3xl bg-primary/5 border-2 border-dashed border-primary/20"
                            >
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                    <Calendar size={40} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-foreground antialiased">Annual Report Selected</h3>
                                    <p className="text-sm text-muted-foreground max-w-[280px] font-medium leading-relaxed">
                                        This will consolidate and download GST data for the entire selected Financial Year.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
