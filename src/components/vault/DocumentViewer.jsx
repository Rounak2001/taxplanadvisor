import { FileText, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DocumentViewer({ document, consultantId, clientId }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between bg-muted/50">
        <span className="text-sm font-medium truncate">{document.name}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ZoomOut size={16} strokeWidth={1.5} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><ZoomIn size={16} strokeWidth={1.5} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><RotateCw size={16} strokeWidth={1.5} /></Button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center text-muted-foreground">
          <FileText size={64} strokeWidth={1} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm">Document Preview</p>
          <p className="text-xs">PDF viewer integration ready</p>
        </div>
      </div>
    </div>
  );
}
