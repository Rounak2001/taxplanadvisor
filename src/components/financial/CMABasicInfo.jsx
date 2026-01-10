import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CMABasicInfo({ data, onChange, consultantId }) {
  const handleChange = (field, value) => onChange({ [field]: value });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Label>Business Name</Label>
        <Input value={data.businessName} onChange={(e) => handleChange('businessName', e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Financial Year</Label>
        <Select value={data.financialYear} onValueChange={(v) => handleChange('financialYear', v)}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="FY 2024-25">FY 2024-25</SelectItem>
            <SelectItem value="FY 2023-24">FY 2023-24</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Industry</Label>
        <Input value={data.industry} onChange={(e) => handleChange('industry', e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>PAN Number</Label>
        <Input value={data.panNumber} onChange={(e) => handleChange('panNumber', e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>GSTIN</Label>
        <Input value={data.gstin} onChange={(e) => handleChange('gstin', e.target.value)} className="mt-1" />
      </div>
    </div>
  );
}
