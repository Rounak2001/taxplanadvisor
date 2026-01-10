import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const typeLabels = { bank_statement: 'Bank', pan_card: 'PAN', gst_return: 'GST', itr: 'ITR', other: 'Other' };
const statusColors = { draft: 'secondary', submitted: 'default', checker_review: 'warning', approved: 'success', rejected: 'destructive' };

export function DocumentList({ documents, selectedDocId, onSelectDocument, consultantId }) {
  return (
    <div className="divide-y divide-border">
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => onSelectDocument(doc.id)}
          className={cn('w-full p-4 text-left hover:bg-muted/50 transition-colors', selectedDocId === doc.id && 'bg-muted')}
        >
          <div className="flex items-center justify-between mb-1">
            <Badge variant="outline" className="text-xs">{typeLabels[doc.type]}</Badge>
            <Badge variant={statusColors[doc.status]} className="text-xs">{doc.status.replace('_', ' ')}</Badge>
          </div>
          <p className="font-medium text-sm truncate">{doc.name}</p>
          <p className="text-xs text-muted-foreground">{new Date(doc.uploadedAt).toLocaleDateString('en-IN')}</p>
        </button>
      ))}
      {documents.length === 0 && <div className="p-8 text-center text-muted-foreground">No documents found</div>}
    </div>
  );
}
