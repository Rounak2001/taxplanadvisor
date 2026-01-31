import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export const AmortizationSchedule = ({
    principal,
    interestRate,
    tenure,
    emi,
    interestType,
    desiredEMI,
    showPrepayment
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showFullSchedule, setShowFullSchedule] = useState(false);

    const generateSchedule = () => {
        const schedule = [];
        let balance = principal;
        const monthlyRate = interestRate / 12 / 100;
        const months = tenure * 12;
        const actualEMI = desiredEMI || emi;

        if (interestType === 'fixed') {
            // Fixed rate: Equal principal + fixed interest each month
            const monthlyPrincipal = principal / months;
            const monthlyInterest = (principal * interestRate / 100) / 12;

            for (let month = 1; month <= months && balance > 0; month++) {
                const principalPayment = Math.min(monthlyPrincipal, balance);
                balance -= principalPayment;

                schedule.push({
                    month,
                    emi: monthlyPrincipal + monthlyInterest,
                    principal: principalPayment,
                    interest: monthlyInterest,
                    balance: Math.max(0, balance)
                });
            }
        } else {
            // Reducing balance: Interest calculated on remaining principal
            for (let month = 1; month <= months && balance > 0; month++) {
                const interestPayment = balance * monthlyRate;
                const principalPayment = Math.min(actualEMI - interestPayment, balance);
                balance -= principalPayment;

                // Handle prepayment at the end of each year
                let yearEndPrepayment = 0;
                if (showPrepayment && month % 12 === 0 && balance > actualEMI) {
                    yearEndPrepayment = actualEMI;
                    balance -= yearEndPrepayment;
                }

                schedule.push({
                    month,
                    emi: actualEMI,
                    principal: principalPayment,
                    interest: interestPayment,
                    balance: Math.max(0, balance),
                    prepayment: yearEndPrepayment
                });

                if (balance <= 0) break;
            }
        }

        return schedule;
    };

    const schedule = generateSchedule();
    const displaySchedule = showFullSchedule ? schedule : schedule.slice(0, 12);

    const totalPrincipal = schedule.reduce((sum, row) => sum + row.principal, 0);
    const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);

    if (!isExpanded) {
        return (
            <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsExpanded(true)}
            >
                <Calendar className="w-4 h-4 mr-2" />
                View Amortization Schedule
                <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
        );
    }

    return (
        <Card className="glass-card shadow-elevated">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Amortization Schedule
                        {showPrepayment && (
                            <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                                With Prepayment
                            </span>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(false)}
                    >
                        <ChevronUp className="w-4 h-4" />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div className="bg-primary/5 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Total Principal</p>
                        <p className="font-bold text-primary">₹{Math.round(totalPrincipal).toLocaleString()}</p>
                    </div>
                    <div className="bg-destructive/5 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Total Interest</p>
                        <p className="font-bold text-destructive">₹{Math.round(totalInterest).toLocaleString()}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Total Months</p>
                        <p className="font-bold">{schedule.length}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-2">Month</th>
                                <th className="text-right py-2 px-2">EMI</th>
                                <th className="text-right py-2 px-2">Principal</th>
                                <th className="text-right py-2 px-2">Interest</th>
                                <th className="text-right py-2 px-2">Balance</th>
                                {showPrepayment && <th className="text-right py-2 px-2">Prepayment</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {displaySchedule.map((row) => (
                                <tr key={row.month} className="border-b border-muted/50 hover:bg-muted/30">
                                    <td className="py-2 px-2">{row.month}</td>
                                    <td className="text-right py-2 px-2">₹{Math.round(row.emi).toLocaleString()}</td>
                                    <td className="text-right py-2 px-2 text-primary">₹{Math.round(row.principal).toLocaleString()}</td>
                                    <td className="text-right py-2 px-2 text-destructive">₹{Math.round(row.interest).toLocaleString()}</td>
                                    <td className="text-right py-2 px-2">₹{Math.round(row.balance).toLocaleString()}</td>
                                    {showPrepayment && (
                                        <td className="text-right py-2 px-2 text-success">
                                            {row.prepayment > 0 ? `₹${Math.round(row.prepayment).toLocaleString()}` : '-'}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {schedule.length > 12 && (
                    <Button
                        variant="ghost"
                        className="w-full mt-4"
                        onClick={() => setShowFullSchedule(!showFullSchedule)}
                    >
                        {showFullSchedule ? (
                            <>Show Less <ChevronUp className="w-4 h-4 ml-2" /></>
                        ) : (
                            <>Show All {schedule.length} Months <ChevronDown className="w-4 h-4 ml-2" /></>
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
