import { useState, useMemo, useEffect } from 'react';
import { Search, Upload, Filter, Clock, CheckCircle2, XCircle, FileText, Download, Maximize2, FileSearch, User, ChevronRight, Trash2, FileSpreadsheet, Calendar, ShieldAlert, AlertCircle, Folder as FolderIcon, Plus } from 'lucide-react';
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
import { clientService } from '@/api/clientService';
import { RequestDocumentModal } from '@/components/vault/RequestDocumentModal';
import { ShareReportModal } from '@/components/vault/ShareReportModal';
import { ShareNoticeModal } from '@/components/vault/ShareNoticeModal';
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
  const [selectedFolderId, setSelectedFolderId] = useState('all');
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isShareReportModalOpen, setIsShareReportModalOpen] = useState(false);
  const [isShareNoticeModalOpen, setIsShareNoticeModalOpen] = useState(false);

  // Fetch all documents
  const { data: documents = [], isLoading: docsLoading } = useQuery({
    queryKey: ['vault-documents', selectedClientId, selectedFolderId],
    queryFn: () => {
      // If we are in 'All Clients' view, fetch everything and filter locally
      // If we are in specific client view with an ID (number), fetch by folder ID
      const folderParam = (typeof selectedFolderId === 'number') ? selectedFolderId : null;
      return documentService.list(folderParam);
    },
  });

  // Fetch assigned clients
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['assigned-clients'],
    queryFn: clientService.getClients,
  });

  // Fetch shared reports (consultant's)
  const { data: sharedReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ['shared-reports'],
    queryFn: documentService.listSharedReports,
  });

  // Fetch legal notices
  const { data: legalNotices = [], isLoading: noticesLoading } = useQuery({
    queryKey: ['legal-notices'],
    queryFn: documentService.listLegalNotices,
  });

  // Fetch folders
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ['vault-folders', selectedClientId],
    queryFn: () => documentService.listFolders(selectedClientId === 'all' ? null : selectedClientId),
  });

  // Group folders by name for 'All Clients' view to avoid redundancy
  const displayFolders = useMemo(() => {
    if (selectedClientId !== 'all') return folders;

    // Smart Categories for firm-wide overview
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

    const categories = [
      {
        id: 'all',
        name: 'All Documents',
        icon: FileText,
        color: 'text-primary',
        count: documents.length,
        unverifiedCount: documents.filter(d => d.status !== 'VERIFIED').length
      },
      {
        id: 'pending',
        name: 'Pending Requests',
        icon: Clock,
        color: 'text-rose-500',
        count: documents.filter(d => d.status === 'PENDING').length,
        unverifiedCount: documents.filter(d => d.status === 'PENDING').length
      },
      {
        id: 'review',
        name: 'Needs Review',
        icon: AlertCircle,
        color: 'text-amber-500',
        count: documents.filter(d => d.status === 'UPLOADED').length,
        unverifiedCount: documents.filter(d => d.status === 'UPLOADED').length
      },
      {
        id: 'recent',
        name: 'Recent Uploads',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        count: documents.filter(d => d.uploaded_at && new Date(d.uploaded_at) > fortyEightHoursAgo).length,
        unverifiedCount: documents.filter(d => d.uploaded_at && new Date(d.uploaded_at) > fortyEightHoursAgo && d.status !== 'VERIFIED').length
      }
    ];

    // Include system folder totals as well
    const systemFolderNames = ['KYC', 'Bank Details', 'GST Details', 'Company Docs'];
    systemFolderNames.forEach(name => {
      const docsInThisFolder = documents.filter(d => d.folder_name === name);
      if (docsInThisFolder.length > 0) {
        categories.push({
          id: `sys-${name}`,
          name: name,
          icon: FolderIcon,
          is_system: true,
          count: docsInThisFolder.length,
          unverifiedCount: docsInThisFolder.filter(d => d.status !== 'VERIFIED').length
        });
      }
    });

    return categories;
  }, [folders, selectedClientId, documents]);

  // Reset folder selection when client changes to avoid mismatched IDs/names
  useEffect(() => {
    setSelectedFolderId('all');
  }, [selectedClientId]);

  // Filter documents by selected client, status, and folder/category
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // 1. Client filter - be robust to both ID and object formats
      const docClientId = typeof doc.client === 'object' ? doc.client.id : doc.client;
      if (selectedClientId !== 'all' && Number(docClientId) !== Number(selectedClientId)) return false;

      // 2. Status filter
      if (statusFilter !== 'all' && doc.status !== statusFilter) return false;

      // 3. Folder / Smart Category filter
      if (selectedFolderId !== 'all') {
        // Handling Smart Categories regardless of client selection
        if (selectedFolderId === 'pending') return doc.status === 'PENDING';
        if (selectedFolderId === 'review') return doc.status === 'UPLOADED';
        if (selectedFolderId === 'recent') {
          const fortyEightHoursAgo = new Date(Date.now() - (48 * 60 * 60 * 1000));
          return doc.uploaded_at && new Date(doc.uploaded_at) > fortyEightHoursAgo;
        }

        if (selectedFolderId.toString().startsWith('sys-')) {
          const folderName = selectedFolderId.replace('sys-', '');
          return doc.folder_name === folderName;
        }

        // ID-based for folders
        if (typeof selectedFolderId === 'number' && doc.folder !== selectedFolderId) return false;

        // Fallback for string matching folder names
        if (typeof selectedFolderId === 'string' && doc.folder_name !== selectedFolderId) return false;
      }
      return true;
    });
  }, [documents, selectedClientId, statusFilter, selectedFolderId]);

  // Filter shared reports by selected client
  const filteredReports = useMemo(() => {
    if (selectedClientId === 'all') return sharedReports;
    return sharedReports.filter((r) => r.client === Number(selectedClientId));
  }, [sharedReports, selectedClientId]);

  // Filter legal notices by selected client
  const filteredNotices = useMemo(() => {
    if (selectedClientId === 'all') return legalNotices;
    return legalNotices.filter((n) => n.client === Number(selectedClientId));
  }, [legalNotices, selectedClientId]);

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
    mutationFn: ({ id, status, rejection_reason }) => documentService.review(id, status, rejection_reason),
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

  const resolveNoticeMutation = useMutation({
    mutationFn: (id) => documentService.toggleNoticeResolved(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['legal-notices']);
      toast.success("Notice status updated");
    },
    onError: () => toast.error("Failed to update notice status")
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: (id) => documentService.deleteLegalNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['legal-notices']);
      toast.success("Notice deleted");
    },
    onError: () => toast.error("Failed to delete notice")
  });

  const createFolderMutation = useMutation({
    mutationFn: (name) => {
      if (selectedClientId === 'all') throw new Error("Please select a client first");
      return documentService.createFolder(name, selectedClientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vault-folders']);
      toast.success("Folder created");
    },
    onError: (err) => {
      const msg = err.response?.data?.name || err.response?.data?.non_field_errors || err.message || "Failed to create folder";
      toast.error(msg);
    }
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (id) => documentService.deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['vault-folders']);
      toast.success("Folder deleted");
      if (selectedFolderId === Number(id)) setSelectedFolderId('all');
    },
    onError: (err) => toast.error("Failed to delete folder")
  });

  const handleStatusChange = async (newStatus) => {
    if (!selectedDoc) return;

    let rejectionReason = '';

    // Prompt for rejection reason if rejecting
    if (newStatus === 'REJECTED') {
      rejectionReason = window.prompt(
        'Please provide a reason for rejecting this document:',
        ''
      );

      // Cancel if no reason provided
      if (rejectionReason === null || rejectionReason.trim() === '') {
        toast.error('Rejection reason is required');
        return;
      }
    }

    // Call mutation with rejection reason if provided
    reviewMutation.mutate({
      id: selectedDoc.id,
      status: newStatus,
      ...(rejectionReason && { rejection_reason: rejectionReason.trim() })
    });
  };

  const getFileUrl = (file) => {
    if (!file) return null;

    // If it's already a full URL (like S3), use it
    if (typeof file === 'string' && file.startsWith('http')) {
      return file;
    }

    // Fallback to local development server
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
    const filePath = typeof file === 'string' ? file : file.url;
    if (!filePath) return null;

    return `${baseUrl}${filePath.startsWith('/') ? filePath : `/${filePath}`}`;
  };

  const handleCreateFolder = () => {
    if (selectedClientId === 'all') {
      toast.error("Please select a specific client to create a folder for them.");
      return;
    }
    const name = window.prompt("Enter folder name:");
    if (name) {
      createFolderMutation.mutate(name);
    }
  };

  const isLoading = docsLoading || clientsLoading || foldersLoading;

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
          <p className="text-sm text-muted-foreground">Manage client documents, reports, and notices</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsShareNoticeModalOpen(true)} className="border-rose-200 text-rose-700 hover:bg-rose-50">
            <ShieldAlert size={16} className="mr-2" /> Share Notice
          </Button>
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
            <TabsTrigger value="notices">Legal & Notices</TabsTrigger>
          </TabsList>

          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger className="w-56 h-9">
              <User size={14} className="mr-2 text-primary" />
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {(Array.isArray(clients) ? clients : (clients.clients || [])).map((client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name || client.email}
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
              {/* Folder Sidebar */}
              <ResizablePanel defaultSize={15} minSize={12} className="border-r border-border bg-muted/5">
                <div className="h-full flex flex-col">
                  <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {selectedClientId === 'all' ? 'Firm Overview' : 'Folders'}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCreateFolder} title="New Folder">
                      <Plus size={14} />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    <button
                      onClick={() => setSelectedFolderId('all')}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedFolderId === 'all' ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <FolderIcon size={16} /> All Documents
                    </button>
                    {displayFolders.map(folder => {
                      const folderValue = folder.id || (selectedClientId === 'all' ? folder.name : folder.id);
                      const isSelected = selectedFolderId === folderValue;
                      const Icon = folder.icon || FolderIcon;

                      return (
                        <div key={folderValue} className="group flex items-center gap-1">
                          <button
                            onClick={() => setSelectedFolderId(folderValue)}
                            className={cn(
                              "flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors text-left",
                              isSelected ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                            )}
                          >
                            <Icon size={14} fill={isSelected ? "currentColor" : "none"} className={cn("shrink-0", folder.color)} />
                            <span className="truncate">{folder.name}</span>
                            <span className="ml-auto text-[10px] opacity-60">
                              ({folder.unverified_count ?? folder.unverifiedCount ?? 0}/{folder.document_count ?? folder.count})
                            </span>
                          </button>
                          {!folder.is_system && !folder.is_aggregated && !folder.icon && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete folder "${folder.name}"? Documents will be moved to "All Documents".`)) {
                                  deleteFolderMutation.mutate(folder.id);
                                }
                              }}
                              className="hidden group-hover:flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={20} minSize={15} className="border-r border-border">
                <div className="h-full flex flex-col">
                  <div className="p-3 border-b border-border bg-muted/30 text-[11px] font-bold text-muted-foreground uppercase tracking-tight truncate">
                    {selectedFolderId === 'all'
                      ? (selectedClientId === 'all' ? 'Firm-Wide Overview' : 'Client Overview')
                      : (displayFolders.find(f => (f.id === selectedFolderId || f.name === selectedFolderId))?.name || 'Category')} ({filteredDocs.length})
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
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors border border-border/20"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate">{report.title}</p>
                          <Badge className={cn("text-[9px] h-4 px-1 leading-none", REPORT_TYPE_COLORS[report.report_type] || REPORT_TYPE_COLORS.OTHER)}>
                            {report.report_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          <span className="truncate">For: <span className="font-medium">{report.client_name || 'Client'}</span></span>
                          <span>•</span>
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

        {/* Legal & Notices Tab */}
        <TabsContent value="notices" className="flex-1 min-h-0 mt-0">
          <div className="h-full rounded-xl border border-border bg-card overflow-hidden shadow-sm p-6">
            {noticesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Clock className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : filteredNotices.length === 0 ? (
              <div className="flex items-center justify-center h-full flex-col gap-4 text-muted-foreground">
                <ShieldAlert size={60} strokeWidth={1} />
                <p>No legal notices or communications found</p>
                <Button variant="outline" onClick={() => setIsShareNoticeModalOpen(true)}>
                  <Upload size={14} className="mr-2" /> Share Initial Notice
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-full overflow-y-auto pr-2">
                {filteredNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg transition-colors border",
                      notice.is_resolved ? "bg-muted/20 border-border/10 opacity-75" : "bg-muted/40 hover:bg-muted/60 border-border/20"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                        notice.priority === 'URGENT' ? 'bg-rose-100' :
                          notice.priority === 'HIGH' ? 'bg-orange-100' :
                            'bg-primary/10'
                      )}>
                        <ShieldAlert size={16} className={cn(
                          notice.priority === 'URGENT' ? 'text-rose-600' :
                            notice.priority === 'HIGH' ? 'text-orange-600' :
                              'text-primary'
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={cn("font-semibold text-sm truncate max-w-[200px]", notice.is_resolved && "line-through")}>
                            {notice.title}
                          </p>
                          <Badge variant="outline" className="text-[9px] h-3.5 px-1 uppercase leading-none">
                            {notice.source.replace('_', ' ')}
                          </Badge>
                          <Badge className={cn(
                            "text-[9px] h-3.5 px-1 leading-none",
                            notice.priority === 'URGENT' ? 'bg-rose-500' :
                              notice.priority === 'HIGH' ? 'bg-orange-500' :
                                notice.priority === 'MEDIUM' ? 'bg-amber-500' :
                                  'bg-emerald-500'
                          )}>
                            {notice.priority[0]}
                          </Badge>
                          {notice.is_resolved && (
                            <Badge variant="outline" className="text-[9px] h-3.5 px-1 border-emerald-500 text-emerald-600 bg-emerald-50 leading-none">
                              Res
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          <span className="truncate max-w-[100px] font-medium">{notice.client_name}</span>
                          <span>•</span>
                          <span className={cn((!notice.is_resolved && notice.priority === 'URGENT') ? 'text-rose-600 font-bold' : '')}>
                            {notice.due_date ? new Date(notice.due_date).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn("h-8 px-2 text-xs", notice.is_resolved ? "text-muted-foreground" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50")}
                        onClick={() => resolveNoticeMutation.mutate(notice.id)}
                      >
                        {notice.is_resolved ? "Reopen" : "Mark Resolved"}
                      </Button>
                      <div className="w-px h-6 bg-border mx-1" />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(getFileUrl(notice.file), '_blank')}>
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      <a href={getFileUrl(notice.file)} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (window.confirm("Delete this notice?")) {
                            deleteNoticeMutation.mutate(notice.id);
                          }
                        }}
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

      <ShareNoticeModal
        isOpen={isShareNoticeModalOpen}
        onClose={() => setIsShareNoticeModalOpen(false)}
        clients={clients}
        onSuccess={() => queryClient.invalidateQueries(['legal-notices'])}
      />
    </div>
  );
}
