import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FileText, FileSearch, Clock } from 'lucide-react';

export function DocumentList({ documents, selectedDocId, onSelectDocument }) {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'VERIFIED': return 'bg-emerald-500 text-white border-none text-[10px] h-5 px-2';
      case 'REJECTED': return 'bg-rose-500 text-white border-none text-[10px] h-5 px-2';
      case 'PENDING': return 'bg-amber-500 text-white border-none text-[10px] h-5 px-2';
      default: return 'bg-slate-500 text-white border-none text-[10px] h-5 px-2';
    }
  };

  return (
    <div className="divide-y divide-border/50">
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => onSelectDocument(doc.id)}
          className={cn(
            'w-full p-3 text-left transition-all relative border-l-4 border-transparent hover:bg-muted/30',
            selectedDocId === doc.id ? 'bg-emerald-50/50 border-l-emerald-500' : 'bg-white'
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className={cn(
                "p-1.5 rounded-md shadow-sm border shrink-0",
                doc.file ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
              )}>
                {doc.file ? <FileText size={16} /> : <Clock size={16} />}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-foreground leading-tight truncate">{doc.title}</p>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Client: {doc.client_name}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-[9px] font-medium text-muted-foreground/60">
                {new Date(doc.created_at).toLocaleDateString()}
              </span>
              <Badge className={cn("uppercase font-black tracking-tighter rounded-sm text-[9px] h-4 px-1.5", getStatusClasses(doc.status))}>
                {doc.status}
              </Badge>
            </div>
          </div>
        </button>
      ))}
      {documents.length === 0 && (
        <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-4 bg-muted/5">
          <div className="p-4 rounded-full bg-muted/20">
            <FileSearch size={32} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium">No documents yet</p>
        </div>
      )}
    </div>
  );
}
