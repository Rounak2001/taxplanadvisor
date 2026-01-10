import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CMAProfitLoss({ data, onChange, consultantId }) {
  const handleChange = (field, value) => onChange({ [field]: value });
  const fields = [
    { key: 'revenue', label: 'Revenue from Operations' },
    { key: 'otherIncome', label: 'Other Income' },
    { key: 'costOfMaterials', label: 'Cost of Materials' },
    { key: 'employeeCost', label: 'Employee Cost' },
    { key: 'financeCost', label: 'Finance Cost' },
    { key: 'depreciation', label: 'Depreciation' },
    { key: 'otherExpenses', label: 'Other Expenses' },
    { key: 'taxExpense', label: 'Tax Expense' },
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
