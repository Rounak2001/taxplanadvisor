import { useState, useMemo, useEffect } from 'react';
import { Search, Upload, Filter, Clock, CheckCircle2, XCircle, FileText, Download, Maximize2, FileSearch, User, ChevronRight, Trash2, FileSpreadsheet, Calendar } from 'lucide-react';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { DocumentList } from '@/components/vault/DocumentList';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/api/documentService';
import { RequestDocumentModal } from '@/components/vault/RequestDocumentModal';
import { ShareReportModal } from '@/components/vault/ShareReportModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const REPORT_TYPE_COLORS = {
  CMA: 'bg-purple-100 text-purple-700',
  GST: 'bg-blue-100 text-blue-700',
  TAX: 'bg-green-100 text-green-700',
  AUDIT: 'bg-orange-100 text-orange-700',
  OTHER: 'bg-gray-100 text-gray-700',
};

export default function Vault() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedClientId, setSelectedClientId] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isShareReportModalOpen, setIsShareReportModalOpen] = useState(false);

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

  // Fetch shared reports (consultant's)
  const { data: sharedReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ['shared-reports'],
    queryFn: documentService.listSharedReports,
  });

  // Filter documents by selected client and status
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedClientId !== 'all' && doc.client !== Number(selectedClientId)) return false;
      if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
      return true;
    });
  }, [documents, selectedClientId, statusFilter]);

  // Filter shared reports by selected client
  const filteredReports = useMemo(() => {
    if (selectedClientId === 'all') return sharedReports;
    return sharedReports.filter((r) => r.client === Number(selectedClientId));
  }, [sharedReports, selectedClientId]);

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

  const deleteReportMutation = useMutation({
    mutationFn: (id) => documentService.deleteSharedReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['shared-reports']);
      toast.success("Report deleted");
    },
    onError: () => toast.error("Failed to delete report")
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
          <p className="text-sm text-muted-foreground">Manage client documents and shared reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsShareReportModalOpen(true)}>
            <FileText size={16} className="mr-2" /> Share Report
          </Button>
          <Button onClick={() => setIsRequestModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Upload size={16} className="mr-2" /> Request Document
          </Button>
        </div>
      </div>

      {/* Tabs + Controls */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="documents">Client Documents</TabsTrigger>
            <TabsTrigger value="shared">Shared Reports</TabsTrigger>
          </TabsList>

          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger className="w-56 h-9">
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

          {activeTab === 'documents' && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-9">
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
          )}

          <Badge variant="outline" className="ml-auto">
            {activeTab === 'documents' ? `${filteredDocs.length} documents` : `${filteredReports.length} reports`}
          </Badge>
        </div>

        {/* Documents Tab */}
        <TabsContent value="documents" className="flex-1 min-h-0 mt-0">
          <div className="h-full rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <ResizablePanelGroup direction="horizontal">
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

              <ResizablePanel defaultSize={78} minSize={50}>
                {selectedDoc ? (
                  <div className="h-full flex flex-col">
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

                    <div className="flex-1 p-4 bg-muted/30 overflow-hidden">
                      {selectedDoc.file ? (
                        <div className="w-full h-full rounded-lg border border-border bg-white shadow-inner overflow-hidden">
                          {selectedDoc.file.split('?')[0].toLowerCase().endsWith('.pdf') ? (
                            <iframe src={getFileUrl(selectedDoc.file)} className="w-full h-full border-none" title="Document Preview" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                              <img src={getFileUrl(selectedDoc.file)} alt={selectedDoc.title} className="max-w-full max-h-full object-contain" />
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

                    <div className="px-6 py-4 border-t border-border bg-white flex items-center justify-between">
                      <div className="text-sm">
                        {selectedDoc.description && (
                          <p className="text-muted-foreground italic">"{selectedDoc.description}"</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedDoc.file && (
                          <a href={getFileUrl(selectedDoc.file)} target="_blank" rel="noopener noreferrer">
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
        </TabsContent>

        {/* Shared Reports Tab */}
        <TabsContent value="shared" className="flex-1 min-h-0 mt-0">
          <div className="h-full rounded-xl border border-border bg-card overflow-hidden shadow-sm p-6">
            {reportsLoading ? (
              <div className="flex items-center justify-center h-full">
                <Clock className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="flex items-center justify-center h-full flex-col gap-4 text-muted-foreground">
                <FileSpreadsheet size={60} strokeWidth={1} />
                <p>No reports shared yet</p>
                <Button variant="outline" onClick={() => setIsShareReportModalOpen(true)}>
                  <FileText size={14} className="mr-2" /> Share Your First Report
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-full overflow-y-auto">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors border border-border/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileSpreadsheet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{report.title}</p>
                          <Badge className={cn("text-xs", REPORT_TYPE_COLORS[report.report_type] || REPORT_TYPE_COLORS.OTHER)}>
                            {report.report_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>Shared with: <span className="font-medium">{report.client_name || 'Client'}</span></span>
                          <span>•</span>
                          <Calendar size={12} />
                          <span>{new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => window.open(getFileUrl(report.file), '_blank')}>
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      <a href={getFileUrl(report.file)} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteReportMutation.mutate(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <RequestDocumentModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        clients={clients}
        onSuccess={() => queryClient.invalidateQueries(['vault-documents'])}
      />

      <ShareReportModal
        isOpen={isShareReportModalOpen}
        onClose={() => setIsShareReportModalOpen(false)}
        clients={clients}
        onSuccess={() => queryClient.invalidateQueries(['shared-reports'])}
      />
    </div>
  );
}
