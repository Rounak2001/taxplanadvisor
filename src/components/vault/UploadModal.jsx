import { useState, useEffect } from 'react';
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
import { Upload, FileText, CheckCircle2, CloudUpload, File, X, Folder as FolderIcon } from 'lucide-react';
import { documentService } from '@/api/documentService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export function UploadModal({ isOpen, onClose, documentRequest = null, onSuccess }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState(documentRequest?.title || '');
    const [description, setDescription] = useState(documentRequest?.description || '');
    const [selectedFolderId, setSelectedFolderId] = useState('none');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Fetch folders for proactive upload
    const { data: folders = [] } = useQuery({
        queryKey: ['vault-folders'],
        queryFn: () => documentService.listFolders(),
        enabled: !documentRequest?.id && isOpen,
    });

    useEffect(() => {
        if (isOpen) {
            setTitle(documentRequest?.title || '');
            setDescription(documentRequest?.description || '');
        }
    }, [documentRequest, isOpen]);

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

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        // If it's a proactive upload or a requirement without an existing ID
        if (!documentRequest?.id) {
            formData.append('title', title || documentRequest?.title);
            formData.append('description', description || documentRequest?.description);
            if (selectedFolderId !== 'none') {
                formData.append('folder', selectedFolderId);
            }
        }

        try {
            if (documentRequest?.id) {
                await documentService.uploadToRequest(
                    documentRequest.id,
                    formData,
                    (progress) => setUploadProgress(progress)
                );
            } else {
                await documentService.uploadProactive(formData);
            }

            setIsSuccess(true);
            toast.success("Document uploaded successfully");

            // Dispatch custom event to notify sidebar to refresh pending count
            window.dispatchEvent(new CustomEvent('documentUploaded'));

            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 1500);
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload document");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setTitle('');
        setDescription('');
        setSelectedFolderId('none');
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

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <CloudUpload className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">
                        {documentRequest ? 'Upload Requested Document' : 'Upload Document'}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {documentRequest
                            ? `Your consultant requested: "${documentRequest.title}"`
                            : 'Upload a document to your secure vault.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 flex-1 overflow-y-auto px-1">
                    {!documentRequest?.title && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium">Document Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Bank Statement Q4"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">Description <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                <Textarea
                                    id="description"
                                    placeholder="Add any notes for your consultant..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[80px] resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="folder" className="text-sm font-medium flex items-center gap-2">
                                    <FolderIcon className="h-4 w-4 text-muted-foreground" />
                                    Select Folder <span className="text-muted-foreground font-normal">(Optional)</span>
                                </Label>
                                <Select
                                    value={selectedFolderId}
                                    onValueChange={setSelectedFolderId}
                                >
                                    <SelectTrigger id="folder" className="h-11">
                                        <SelectValue placeholder="Select destination folder..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No Folder (Root)</SelectItem>
                                        {folders.map(folder => (
                                            <SelectItem key={folder.id} value={folder.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <FolderIcon className="h-4 w-4 text-muted-foreground" />
                                                    <span>{folder.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">File</Label>
                        <div
                            className={cn(
                                "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer",
                                isDragging && "border-primary bg-primary/5 scale-[1.02]",
                                file && !isDragging && "border-primary/50 bg-primary/5",
                                !file && !isDragging && "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                                isSuccess && "border-emerald-500 bg-emerald-50"
                            )}
                            onClick={() => !isUploading && !isSuccess && document.getElementById('file-upload').click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isUploading || isSuccess}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                            />

                            <div className="flex flex-col items-center justify-center gap-3 text-center">
                                {isSuccess ? (
                                    <>
                                        <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                                        </div>
                                        <p className="text-sm font-medium text-emerald-600">Upload Complete!</p>
                                    </>
                                ) : file ? (
                                    <>
                                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <File className="h-7 w-7 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{formatFileSize(file.size)}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-muted-foreground hover:text-destructive"
                                            onClick={removeFile}
                                        >
                                            <X className="h-3 w-3 mr-1" /> Remove
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center">
                                            <Upload className="h-7 w-7 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                <span className="text-primary">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG, DOC, XLS (max 10MB)</p>
                                        </div>
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
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || isUploading || isSuccess}
                        className="bg-primary hover:bg-primary/90"
                    >
                        {isUploading ? (
                            <>
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
