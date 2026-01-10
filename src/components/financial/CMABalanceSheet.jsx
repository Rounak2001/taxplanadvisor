import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CMABalanceSheet({ data, onChange, consultantId }) {
  const handleChange = (field, value) => onChange({ [field]: value });
  const fields = [
    { key: 'shareCapital', label: 'Share Capital' },
    { key: 'reservesAndSurplus', label: 'Reserves & Surplus' },
    { key: 'longTermBorrowings', label: 'Long Term Borrowings' },
    { key: 'shortTermBorrowings', label: 'Short Term Borrowings' },
    { key: 'fixedAssets', label: 'Fixed Assets' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'tradeReceivables', label: 'Trade Receivables' },
    { key: 'cashAndBank', label: 'Cash & Bank' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map(({ key, label }) => (
        <div key={key}>
          <Label>{label}</Label>
          <Input type="number" value={data[key]} onChange={(e) => handleChange(key, e.target.value)} className="mt-1" placeholder="₹" />
        </div>
      ))}
    </div>
  );
}
