import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileUp, Send, User, FileText, MessageSquare, Upload, File, X, CheckCircle2 } from 'lucide-react';
import { documentService } from '@/api/documentService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const REPORT_TYPES = [
    { value: 'CMA', label: 'CMA Report' },
    { value: 'GST', label: 'GST Report' },
    { value: 'TAX', label: 'Tax Report' },
    { value: 'AUDIT', label: 'Audit Report' },
    { value: 'OTHER', label: 'Other Document' },
];

export function ShareReportModal({ isOpen, onClose, clients = [], onSuccess }) {
    const [selectedClientId, setSelectedClientId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reportType, setReportType] = useState('OTHER');
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleSubmit = async () => {
        if (!selectedClientId || !title || !file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('client', selectedClientId);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('report_type', reportType);
        formData.append('file', file);

        try {
            await documentService.shareReport(formData, (progress) => setUploadProgress(progress));
            setIsSuccess(true);
            toast.success("Report shared successfully");
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 1500);
        } catch (error) {
            console.error("Share failed", error);
            toast.error("Failed to share report");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setSelectedClientId('');
        setTitle('');
        setDescription('');
        setReportType('OTHER');
        setFile(null);
        setUploadProgress(0);
        setIsUploading(false);
        setIsSuccess(false);
        onClose();
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const selectedClient = clients.find(c => c.id.toString() === selectedClientId);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <DialogTitle className="text-center text-xl">Share Report</DialogTitle>
                    <DialogDescription className="text-center">
                        Upload a report to share with your client. They'll be able to view and download it.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 flex-1 overflow-y-auto px-1">
                    {/* Client Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="client" className="text-sm font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Select Client
                        </Label>
                        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                            <SelectTrigger id="client" className="h-11">
                                <SelectValue placeholder="Choose a client..." />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                                {(client.name || client.email || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <span>{client.name || client.email}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Report Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">Report Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. GST Return Q1"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-11"
                            />
                        </div>

                        {/* Report Type */}
                        <div className="space-y-2">
                            <Label htmlFor="report-type" className="text-sm font-medium">Report Type</Label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger id="report-type" className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {REPORT_TYPES.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Notes <span className="text-muted-foreground font-normal">(Optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Add any notes for your client..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[80px] resize-none"
                        />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">File</Label>
                        <div
                            className={cn(
                                "relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer",
                                isDragging && "border-primary bg-primary/5 scale-[1.02]",
                                file && !isDragging && "border-primary/50 bg-primary/5",
                                !file && !isDragging && "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                                isSuccess && "border-emerald-500 bg-emerald-50"
                            )}
                            onClick={() => !isUploading && !isSuccess && document.getElementById('share-file-upload').click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                id="share-file-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isUploading || isSuccess}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                            />

                            <div className="flex flex-col items-center justify-center gap-2 text-center">
                                {isSuccess ? (
                                    <>
                                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                                        <p className="text-sm font-medium text-emerald-600">Shared!</p>
                                    </>
                                ) : file ? (
                                    <>
                                        <File className="h-10 w-10 text-primary" />
                                        <div>
                                            <p className="text-sm font-semibold truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive" onClick={removeFile}>
                                            <X className="h-3 w-3 mr-1" /> Remove
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-10 w-10 text-muted-foreground" />
                                        <p className="text-sm">
                                            <span className="text-primary font-medium">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">PDF, DOC, XLS, Images (max 10MB)</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {isUploading && (
                        <div className="space-y-2 px-1">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-muted-foreground">Uploading...</span>
                                <span className="text-primary">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    )}

                    {/* Preview Card */}
                    {selectedClient && title && file && !isSuccess && (
                        <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</p>
                            <p className="text-sm">
                                Sharing <span className="font-semibold text-primary">"{title}"</span> ({REPORT_TYPES.find(t => t.value === reportType)?.label}) with{' '}
                                <span className="font-semibold">{selectedClient.full_name || selectedClient.email}</span>
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedClientId || !title || !file || isUploading || isSuccess}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isUploading ? (
                            <>
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Sharing...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Share Report
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
