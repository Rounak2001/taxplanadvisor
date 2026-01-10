import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function CheckerForm({ document, client, consultantId, clientId }) {
  const data = document.extractedData || {};

  return (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="font-medium mb-3">Extracted Data</h4>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <Label className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
              <Input defaultValue={String(value)} className="mt-1" />
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <Label className="text-xs text-muted-foreground">Checker Notes</Label>
        <Input placeholder="Add notes..." className="mt-1" />
      </div>
      <div className="flex gap-2">
        <Button className="flex-1">Approve</Button>
        <Button variant="destructive" className="flex-1">Reject</Button>
      </div>
    </div>
  );
}
