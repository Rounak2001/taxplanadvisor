import { useState, useMemo } from 'react';
import { Search, Upload, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { DocumentList } from '@/components/vault/DocumentList';
import { DocumentViewer } from '@/components/vault/DocumentViewer';
import { CheckerForm } from '@/components/vault/CheckerForm';
import { StatusStepper } from '@/components/vault/StatusStepper';
import { useAppStore } from '@/stores/useAppStore';
import { mockDocuments, mockClients } from '@/lib/mockData';

export default function Vault() {
  const { consultantId } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDocId, setSelectedDocId] = useState(null);

  // Filter documents based on consultantId (RLS-ready)
  const filteredDocs = useMemo(() => {
    return mockDocuments
      .filter((doc) => doc.consultantId === consultantId)
      .filter((doc) => {
        if (typeFilter !== 'all' && doc.type !== typeFilter) return false;
        if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return doc.name.toLowerCase().includes(query);
        }
        return true;
      });
  }, [consultantId, searchQuery, typeFilter, statusFilter]);

  const selectedDoc = selectedDocId
    ? mockDocuments.find((d) => d.id === selectedDocId)
    : filteredDocs[0];

  const selectedClient = selectedDoc
    ? mockClients.find((c) => c.id === selectedDoc.clientId)
    : null;

  const handleStatusChange = (newStatus) => {
    console.log('Status changed to:', newStatus);
    // In production, this would update the document status via API
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Smart Vault</h1>
          <p className="text-muted-foreground">
            AI-powered document verification and checker workflow
          </p>
        </div>
        <Button>
          <Upload size={16} strokeWidth={1.5} className="mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Document List Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bank_statement">Bank Statement</SelectItem>
            <SelectItem value="pan_card">PAN Card</SelectItem>
            <SelectItem value="gst_return">GST Return</SelectItem>
            <SelectItem value="itr">ITR</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="checker_review">Checker Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content - Resizable Panels */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="rounded-lg border border-border">
          {/* Document List */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="h-full overflow-y-auto bg-card">
              <DocumentList
                documents={filteredDocs}
                selectedDocId={selectedDoc?.id}
                onSelectDocument={setSelectedDocId}
                consultantId={consultantId}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Document Viewer */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full bg-muted/30 flex flex-col">
              {selectedDoc ? (
                <DocumentViewer
                  document={selectedDoc}
                  consultantId={consultantId}
                  clientId={selectedDoc.clientId}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Select a document to preview
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Checker Form */}
          <ResizablePanel defaultSize={35} minSize={25}>
            <div className="h-full bg-card flex flex-col overflow-hidden">
              {selectedDoc ? (
                <>
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold mb-3">Document Status</h3>
                    <StatusStepper
                      currentStatus={selectedDoc.status}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <CheckerForm
                      document={selectedDoc}
                      client={selectedClient}
                      consultantId={consultantId}
                      clientId={selectedDoc.clientId}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Select a document to review
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
