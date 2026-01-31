export const EMIPieChart = ({ principal, interest }) => {
    const total = principal + interest;
    const principalPercent = (principal / total) * 100;
    const interestPercent = (interest / total) * 100;

    return (
        <div className="flex flex-col items-center gap-6">
            {/* CSS Pie Chart */}
            <div
                className="w-40 h-40 rounded-full relative"
                style={{
                    background: `conic-gradient(
            hsl(var(--primary)) 0% ${principalPercent}%, 
            hsl(var(--destructive)) ${principalPercent}% 100%
          )`
                }}
            >
                <div className="absolute inset-4 bg-background rounded-full flex flex-col items-center justify-center">
                    <span className="text-xs text-muted-foreground">Total</span>
                    <span className="text-sm font-bold">₹{Math.round(total).toLocaleString()}</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="text-sm">
                        <span className="text-muted-foreground">Principal</span>
                        <span className="ml-1 font-medium">{principalPercent.toFixed(1)}%</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <div className="text-sm">
                        <span className="text-muted-foreground">Interest</span>
                        <span className="ml-1 font-medium">{interestPercent.toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
