import { useState, useMemo, useEffect } from 'react';
import { Search, Upload, Filter, Clock, CheckCircle2, XCircle, FileText, Download, Maximize2, FileSearch, User, ChevronRight } from 'lucide-react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/api/documentService';
import { RequestDocumentModal } from '@/components/vault/RequestDocumentModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Vault() {
  const queryClient = useQueryClient();
  const [selectedClientId, setSelectedClientId] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Fetch all documents
  const { data: documents = [], isLoading: docsLoading } = useQuery({
    queryKey: ['vault-documents'],
    queryFn: documentService.list,
  });

  // Fetch assigned clients
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['assigned-clients'],
    queryFn: documentService.getAssignedClients,
  });

  // Filter documents by selected client and status
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedClientId !== 'all' && doc.client !== Number(selectedClientId)) return false;
      if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
      return true;
    });
  }, [documents, selectedClientId, statusFilter]);

  // Auto-select first document when filter changes
  useEffect(() => {
    if (filteredDocs.length > 0) {
      setSelectedDocId(filteredDocs[0].id);
    } else {
      setSelectedDocId(null);
    }
  }, [filteredDocs]);

  const selectedDoc = selectedDocId ? documents.find((d) => d.id === selectedDocId) : null;

  const reviewMutation = useMutation({
    mutationFn: ({ id, status }) => documentService.review(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['vault-documents']);
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status")
  });

  const handleStatusChange = (newStatus) => {
    if (selectedDoc) {
      reviewMutation.mutate({ id: selectedDoc.id, status: newStatus });
    }
  };

  const getFileUrl = (file) => {
    if (!file) return null;
    if (file.startsWith('http')) return file;
    return `http://localhost:8000${file.startsWith('/') ? file : `/${file}`}`;
  };

  const isLoading = docsLoading || clientsLoading;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Smart Vault</h1>
          <p className="text-sm text-muted-foreground">Manage and verify client documents</p>
        </div>
        <Button onClick={() => setIsRequestModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Upload size={16} className="mr-2" /> Request Document
        </Button>
      </div>

      {/* Controls - Client Selector + Status Filter */}
      <div className="flex items-center gap-3 mb-4">
        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
          <SelectTrigger className="w-64 h-10">
            <User size={14} className="mr-2 text-primary" />
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.full_name || client.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 h-10">
            <Filter size={14} className="mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="UPLOADED">Needs Review</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Badge variant="outline" className="ml-auto">{filteredDocs.length} documents</Badge>
      </div>

      {/* Main Layout */}
      <div className="flex-1 min-h-0 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <ResizablePanelGroup direction="horizontal">
          {/* Document List - Compact */}
          <ResizablePanel defaultSize={22} minSize={18} className="border-r border-border">
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Documents ({filteredDocs.length})
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredDocs.length > 0 ? (
                  <DocumentList documents={filteredDocs} selectedDocId={selectedDoc?.id} onSelectDocument={setSelectedDocId} />
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <FileSearch size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No documents found</p>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Area - Large */}
          <ResizablePanel defaultSize={78} minSize={50}>
            {selectedDoc ? (
              <div className="h-full flex flex-col">
                {/* Doc Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-white">
                  <div className="flex items-center gap-4">
                    <FileText size={20} className="text-primary" />
                    <div>
                      <h2 className="font-semibold text-lg">{selectedDoc.title}</h2>
                      <p className="text-xs text-muted-foreground">Owner: {selectedDoc.client_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={cn(
                      "text-xs font-semibold",
                      selectedDoc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                        selectedDoc.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                          selectedDoc.status === 'UPLOADED' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                    )}>
                      {selectedDoc.status}
                    </Badge>
                    {selectedDoc.file && (
                      <Button variant="outline" size="sm" onClick={() => window.open(getFileUrl(selectedDoc.file), '_blank')}>
                        <Maximize2 size={14} className="mr-1" /> Open
                      </Button>
                    )}
                  </div>
                </div>

                {/* Large Preview */}
                <div className="flex-1 p-4 bg-muted/30 overflow-hidden">
                  {selectedDoc.file ? (
                    <div className="w-full h-full rounded-lg border border-border bg-white shadow-inner overflow-hidden">
                      {selectedDoc.file.toLowerCase().endsWith('.pdf') ? (
                        <iframe src={getFileUrl(selectedDoc.file)} className="w-full h-full border-none" title="Document Preview" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                          <img src={getFileUrl(selectedDoc.file)} alt="Preview" className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-lg border-2 border-dashed border-border bg-white flex flex-col items-center justify-center gap-4">
                      <Clock size={48} className="text-amber-400 animate-pulse" />
                      <div className="text-center">
                        <p className="font-semibold">Awaiting Upload</p>
                        <p className="text-sm text-muted-foreground">Document requested from client</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="px-6 py-4 border-t border-border bg-white flex items-center justify-between">
                  <div className="text-sm">
                    {selectedDoc.description && (
                      <p className="text-muted-foreground italic">"{selectedDoc.description}"</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedDoc.file && (
                      <a href={getFileUrl(selectedDoc.file)} download>
                        <Button variant="outline" size="sm">
                          <Download size={14} className="mr-1" /> Download
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="outline"
                      className="border-rose-200 text-rose-600 hover:bg-rose-50"
                      onClick={() => handleStatusChange('REJECTED')}
                      disabled={!selectedDoc.file || selectedDoc.status === 'REJECTED'}
                    >
                      <XCircle size={14} className="mr-1" /> Reject
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleStatusChange('VERIFIED')}
                      disabled={!selectedDoc.file || selectedDoc.status === 'VERIFIED'}
                    >
                      <CheckCircle2 size={14} className="mr-1" /> Verify
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center flex-col gap-4 text-muted-foreground">
                <FileSearch size={60} strokeWidth={1} />
                <p>Select a document to preview</p>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <RequestDocumentModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        clients={clients}
        onSuccess={() => queryClient.invalidateQueries(['vault-documents'])}
      />
    </div>
  );
}
