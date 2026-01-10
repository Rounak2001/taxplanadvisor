import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export function CMASummary({ formData, onSubmit, consultantId }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Business Details</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1">
          <p><span className="text-muted-foreground">Name:</span> {formData.basicInfo.businessName || '-'}</p>
          <p><span className="text-muted-foreground">Year:</span> {formData.basicInfo.financialYear}</p>
          <p><span className="text-muted-foreground">PAN:</span> {formData.basicInfo.panNumber || '-'}</p>
        </CardContent>
      </Card>
      <div className="flex items-center gap-2 text-success">
        <CheckCircle size={20} strokeWidth={1.5} />
        <span>All sections completed. Ready to generate CMA report.</span>
      </div>
    </div>
  );
}
