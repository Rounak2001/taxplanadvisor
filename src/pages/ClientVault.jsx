import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Download,
    Eye,
    Upload,
    AlertCircle,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    ShieldAlert,
    Maximize2,
    Inbox,
    Filter,
    Search,
    Calendar as CalendarIcon,
    Folder as FolderIcon,
    Plus,
    XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/api/documentService';
import { UploadModal } from '@/components/vault/UploadModal';
import { ShareNoticeModal } from '@/components/vault/ShareNoticeModal';

const REPORT_TYPE_COLORS = {
    CMA: 'bg-purple-100 text-purple-700 border-purple-200',
    GST: 'bg-blue-100 text-blue-700 border-blue-200',
    TAX: 'bg-green-100 text-green-700 border-green-200',
    AUDIT: 'bg-orange-100 text-orange-700 border-orange-200',
    OTHER: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function ClientVault() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('records');

    // States for different modals
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState('all');
    const [viewingDoc, setViewingDoc] = useState(null);

    // Queries
    const { data: documents = [], isLoading: docsLoading } = useQuery({
        queryKey: ['vault-documents', selectedFolderId],
        queryFn: () => documentService.list(selectedFolderId === 'all' ? null : selectedFolderId),
    });

    const { data: reports = [], isLoading: reportsLoading } = useQuery({
        queryKey: ['shared-reports'],
        queryFn: documentService.listSharedReports,
    });

    const { data: notices = [], isLoading: noticesLoading } = useQuery({
        queryKey: ['legal-notices'],
        queryFn: documentService.listLegalNotices,
    });

    const { data: folders = [], isLoading: foldersLoading } = useQuery({
        queryKey: ['vault-folders'],
        queryFn: () => documentService.listFolders(),
    });

    // Helpers
    const getFileUrl = (file) => {
        if (!file) return null;
        if (typeof file === 'string' && file.startsWith('http')) return file;
        const baseUrl = 'http://localhost:8000';
        const filePath = typeof file === 'string' ? file : file.url;
        if (!filePath) return null;
        return `${baseUrl}${filePath.startsWith('/') ? filePath : `/${filePath}`}`;
    };

    const handleUploadClick = (request = null) => {
        setSelectedRequest(request);
        setIsUploadModalOpen(true);
    };

    const handleDownload = (file, title) => {
        const url = getFileUrl(file);
        if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.download = title || 'document';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Filters for records
    const filteredDocs = useMemo(() => {
        if (selectedFolderId === 'all') return documents;
        return documents.filter(d => d.folder === Number(selectedFolderId));
    }, [documents, selectedFolderId]);

    const requestedDocs = filteredDocs.filter(d => d.status === 'PENDING');
    const rejectedDocs = filteredDocs.filter(d => d.status === 'REJECTED');
    const uploadedDocs = filteredDocs.filter(d => d.status !== 'PENDING' && d.status !== 'REJECTED');

    // Filters for notices
    const urgentNotices = notices.filter(n => !n.is_resolved && n.priority === 'URGENT');
    const otherNotices = notices.filter(n => !urgentNotices.includes(n));

    const handleCreateFolder = () => {
        const name = window.prompt("Enter new folder name:");
        if (name) {
            documentService.createFolder(name).then(() => {
                queryClient.invalidateQueries(['vault-folders']);
                toast.success("Folder created");
            }).catch(err => {
                const msg = err.response?.data?.name || err.response?.data?.non_field_errors || "Failed to create folder";
                toast.error(msg);
            });
        }
    };

    const isLoading = docsLoading || reportsLoading || noticesLoading || foldersLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Clock className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Smart Vault</h1>
                    <p className="text-muted-foreground mt-1">
                        One place for all your records, reports, and official notices
                    </p>
                </div>
                <div className="flex gap-2">
                    {activeTab === 'records' && (
                        <Button onClick={() => handleUploadClick()}>
                            <Upload className="mr-2 h-4 w-4" /> Proactive Upload
                        </Button>
                    )}
                    {activeTab === 'notices' && (
                        <Button onClick={() => setIsNoticeModalOpen(true)} className="bg-rose-600 hover:bg-rose-700">
                            <ShieldAlert className="mr-2 h-4 w-4" /> Upload Notice
                        </Button>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="records" className="gap-2">
                        <FolderOpen className="h-4 w-4" /> Records & Uploads
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="gap-2">
                        <FileSpreadsheet className="h-4 w-4" /> Analysis & Reports
                    </TabsTrigger>
                    <TabsTrigger value="notices" className="gap-2">
                        <ShieldAlert className="h-4 w-4" /> Legal & Notices
                    </TabsTrigger>
                </TabsList>

                {/* 1. Records & Uploads */}
                <TabsContent value="records" className="space-y-6 mt-0">
                    {/* Folder Navigation (Horizontal) */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                        <Button
                            variant={selectedFolderId === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedFolderId('all')}
                            className="rounded-full h-8"
                        >
                            All Documents
                        </Button>
                        {folders.map(folder => (
                            <Button
                                key={folder.id}
                                variant={selectedFolderId === folder.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedFolderId(folder.id)}
                                className="rounded-full h-8 gap-2 shrink-0"
                            >
                                <FolderIcon size={14} fill={selectedFolderId === folder.id ? "currentColor" : "none"} />
                                {folder.name}
                                <span className="opacity-60 text-[10px]">({folder.document_count})</span>
                            </Button>
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCreateFolder}
                            className="rounded-full h-8 border-dashed border-2 hover:border-primary/50"
                        >
                            <Plus size={14} className="mr-1" /> New Folder
                        </Button>
                    </div>

                    {requestedDocs.length > 0 && (
                        <Card className="border-warning/30 bg-warning/5 overflow-hidden">
                            <CardHeader className="pb-3 text-warning">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <AlertCircle className="h-5 w-5" />
                                    Pending Document Requests ({requestedDocs.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {requestedDocs.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg bg-white border border-border shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{doc.title}</p>
                                                <p className="text-sm text-muted-foreground">{doc.description || 'Action required'}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleUploadClick(doc)}>
                                            <Upload className="mr-2 h-4 w-4" /> Upload
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Rejected Documents Section */}
                    {rejectedDocs.length > 0 && (
                        <Card className="border-border/30 bg-grey/5 overflow-hidden">
                            <CardHeader className="pb-3 text-black">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <XCircle className="h-5 w-5" />
                                    Rejected Documents ({rejectedDocs.length})
                                </CardTitle>
                                <p className="text-xs text-black/80 mt-1">
                                    These documents need to be re-uploaded with corrections
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {rejectedDocs.map((doc) => (
                                    <DocumentRow
                                        key={doc.id}
                                        doc={doc}
                                        onOpen={setViewingDoc}
                                        onDownload={() => handleDownload(doc.file, doc.title)}
                                        onReupload={handleUploadClick}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <Card className="glass shadow-sm border-border/50">
                        <CardHeader className="pb-3 border-b border-border/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-success" />
                                My Uploaded Records
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-3">
                                {uploadedDocs.length === 0 ? (
                                    <EmptyState icon={FolderOpen} title="No records yet" description="Start by uploading documents or responding to requests." />
                                ) : (
                                    uploadedDocs.map((doc) => (
                                        <DocumentRow
                                            key={doc.id}
                                            doc={doc}
                                            onOpen={setViewingDoc}
                                            onDownload={() => handleDownload(doc.file, doc.title)}
                                            onReupload={handleUploadClick}
                                        />
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 2. Analysis & Reports */}
                <TabsContent value="reports" className="mt-0">
                    <Card className="glass shadow-sm border-border/50">
                        <CardHeader className="border-b border-border/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileSpreadsheet className="h-5 w-5 text-primary" />
                                Consultant Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-3">
                                {reports.length === 0 ? (
                                    <EmptyState icon={FileSpreadsheet} title="No reports shared" description="Analysis reports from your consultant will appear here." />
                                ) : (
                                    reports.map((report) => (
                                        <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/20">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <FileSpreadsheet className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold">{report.title}</p>
                                                        <Badge variant="outline" className={cn("text-[10px]", REPORT_TYPE_COLORS[report.report_type])}>
                                                            {report.report_type}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Shared on {new Date(report.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => setViewingDoc({ ...report, type: 'REPORT' })}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDownload(report.file, report.title)}>
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. Legal & Notices */}
                <TabsContent value="notices" className="space-y-6 mt-0">
                    {urgentNotices.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-rose-600 flex items-center gap-2 uppercase tracking-tight px-1">
                                <AlertCircle className="h-4 w-4" /> Urgent Actions Required
                            </h3>
                            {urgentNotices.map((notice) => (
                                <NoticeRow key={notice.id} notice={notice} getFileUrl={getFileUrl} onOpen={setViewingDoc} onDownload={() => handleDownload(notice.file, notice.title)} />
                            ))}
                        </div>
                    )}

                    <Card className="glass shadow-sm border-border/50">
                        <CardHeader className="border-b border-border/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-rose-600" />
                                Notice History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-3">
                                {notices.length === 0 ? (
                                    <EmptyState icon={ShieldAlert} title="No notices" description="Legal notices and official communications will be listed here." />
                                ) : (
                                    otherNotices.map((notice) => (
                                        <NoticeRow key={notice.id} notice={notice} getFileUrl={getFileUrl} onOpen={setViewingDoc} onDownload={() => handleDownload(notice.file, notice.title)} />
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modals */}
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                documentRequest={selectedRequest}
                onSuccess={() => queryClient.invalidateQueries(['vault-documents'])}
            />

            <ShareNoticeModal
                isOpen={isNoticeModalOpen}
                onClose={() => setIsNoticeModalOpen(false)}
                userRole="CLIENT"
                onSuccess={() => queryClient.invalidateQueries(['legal-notices'])}
            />

            <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
                <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
                    <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg">{viewingDoc?.title}</DialogTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {viewingDoc?.uploaded_at || viewingDoc?.created_at ?
                                            `Timestamp: ${new Date(viewingDoc.uploaded_at || viewingDoc.created_at).toLocaleString()}` : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleDownload(viewingDoc.file, viewingDoc.title)}>
                                    <Download className="h-4 w-4 mr-2" /> Download
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => window.open(getFileUrl(viewingDoc.file), '_blank')}>
                                    <Maximize2 className="h-4 w-4 mr-2" /> Fullscreen
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 bg-muted/20 p-4 overflow-hidden">
                        {viewingDoc?.file && (
                            <div className="w-full h-full rounded-lg border border-border bg-white overflow-hidden shadow-inner">
                                <iframe
                                    src={getFileUrl(viewingDoc.file)}
                                    className="w-full h-full border-none"
                                    title="File Preview"
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}

// Sub-components for cleaner code
function DocumentRow({ doc, onOpen, onDownload, onReupload }) {
    const isRejected = doc.status === 'REJECTED';

    return (
        <div className={cn(
            "flex items-center justify-between p-3 rounded-lg transition-colors border",
            isRejected
                ? "bg-destructive/5 hover:bg-destructive/10 border-destructive/20"
                : "bg-muted/20 hover:bg-muted/40 border-border/10"
        )}>
            <div className="flex items-center gap-3">
                <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                    isRejected
                        ? "bg-destructive/10 text-destructive"
                        : "bg-success/10 text-success"
                )}>
                    <FileText className="h-4 w-4" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{doc.title}</p>
                        <Badge variant="outline" className={cn(
                            "text-[9px] uppercase h-3.5 px-1 leading-none",
                            doc.status === 'VERIFIED' ? 'border-success text-success bg-success/5' :
                                doc.status === 'REJECTED' ? 'border-destructive text-destructive bg-destructive/5' : ''
                        )}>
                            {doc.status}
                        </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(doc.uploaded_at || doc.created_at).toLocaleDateString()}
                        {doc.folder_name && ` • ${doc.folder_name}`}
                    </p>
                    {isRejected && doc.description && (
                        <p className="text-[10px] text-destructive mt-1 font-medium">
                            Reason: {doc.description}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex gap-1 shrink-0">
                {isRejected && (
                    <>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpen(doc)}>
                            <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDownload}>
                            <Download className="h-3.5 w-3.5" />
                        </Button>
                    </>
                )}
                {isRejected && onReupload && (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 gap-1.5 text-xs"
                        onClick={() => onReupload(doc)}
                    >
                        <Upload className="h-3.5 w-3.5" /> Re-upload
                    </Button>
                )}
                {!isRejected && (
                    <>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpen(doc)}>
                            <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDownload}>
                            <Download className="h-3.5 w-3.5" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

function NoticeRow({ notice, onOpen, onDownload }) {
    return (
        <div className={cn(
            "flex items-center justify-between p-3 rounded-lg border transition-all",
            notice.is_resolved ? "bg-muted/10 opacity-60 grayscale-[0.5]" : "bg-card border-border hover:border-primary/20 shadow-sm"
        )}>
            <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                    notice.priority === 'URGENT' ? 'bg-rose-100 text-rose-600' : 'bg-primary/5 text-primary'
                )}>
                    <ShieldAlert className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className={cn("font-semibold text-sm truncate", notice.is_resolved && "line-through")}>{notice.title}</p>
                        <Badge variant="outline" className="text-[9px] h-3.5 px-1 uppercase leading-none">{notice.source.replace('_', ' ')}</Badge>
                        {notice.priority === 'URGENT' && <Badge className="bg-rose-500 text-white text-[9px] h-3.5 px-1 leading-none">!!!</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1"><CalendarIcon size={10} /> {notice.due_date ? new Date(notice.due_date).toLocaleDateString() : 'N/A'}</span>
                        {notice.is_resolved && <span className="text-emerald-600 font-bold ml-1">Resolved</span>}
                    </div>
                </div>
            </div>
            <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpen(notice)}>
                    <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDownload}>
                    <Download className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, title, description }) {
    return (
        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/50">
            <Icon className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-sm text-foreground/80">{title}</p>
            <p className="text-xs">{description}</p>
        </div>
    );
}

// Icons for the tabs
function FolderOpen(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2" />
        </svg>
    )
}
