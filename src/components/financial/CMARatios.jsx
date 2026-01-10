import { Card, CardContent } from '@/components/ui/card';

export function CMARatios({ balanceSheet, profitLoss, consultantId }) {
  const parse = (v) => parseFloat(v) || 0;
  const revenue = parse(profitLoss.revenue);
  const netProfit = revenue - parse(profitLoss.costOfMaterials) - parse(profitLoss.employeeCost) - parse(profitLoss.financeCost) - parse(profitLoss.depreciation) - parse(profitLoss.otherExpenses) - parse(profitLoss.taxExpense);
  const totalAssets = parse(balanceSheet.fixedAssets) + parse(balanceSheet.inventory) + parse(balanceSheet.tradeReceivables) + parse(balanceSheet.cashAndBank);
  const equity = parse(balanceSheet.shareCapital) + parse(balanceSheet.reservesAndSurplus);
  const debt = parse(balanceSheet.longTermBorrowings) + parse(balanceSheet.shortTermBorrowings);

  const ratios = [
    { label: 'Current Ratio', value: totalAssets && debt ? (totalAssets / debt).toFixed(2) : 'N/A' },
    { label: 'Debt/Equity Ratio', value: equity ? (debt / equity).toFixed(2) : 'N/A' },
    { label: 'Net Profit Margin', value: revenue ? ((netProfit / revenue) * 100).toFixed(1) + '%' : 'N/A' },
    { label: 'ROA', value: totalAssets ? ((netProfit / totalAssets) * 100).toFixed(1) + '%' : 'N/A' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {ratios.map(({ label, value }) => (
        <Card key={label}>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
