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
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import { documentService } from '@/api/documentService';
import { toast } from 'sonner';

export function UploadModal({ isOpen, onClose, documentRequest = null, onSuccess }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState(documentRequest?.title || '');
    const [description, setDescription] = useState(documentRequest?.description || '');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file && !documentRequest) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        if (!documentRequest) {
            formData.append('title', title);
            formData.append('description', description);
        }

        try {
            if (documentRequest) {
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
        setUploadProgress(0);
        setIsUploading(false);
        setIsSuccess(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] glass">
                <DialogHeader>
                    <DialogTitle>{documentRequest ? 'Fulfill Request' : 'Upload Document'}</DialogTitle>
                    <DialogDescription>
                        {documentRequest
                            ? `Uploading for: ${documentRequest.title}`
                            : 'Upload a document to your secure vault.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {!documentRequest && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Bank Statement Q4"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Add any notes here..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className="grid gap-2">
                        <Label>File</Label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${file ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isUploading || isSuccess}
                            />
                            {isSuccess ? (
                                <CheckCircle2 className="h-10 w-10 text-success animate-in zoom-in" />
                            ) : file ? (
                                <FileText className="h-10 w-10 text-primary" />
                            ) : (
                                <Upload className="h-10 w-10 text-muted-foreground" />
                            )}

                            <p className="text-sm font-medium">
                                {file ? file.name : "Click to select file"}
                            </p>
                            {!file && <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>}
                        </div>
                    </div>

                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-1" />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={handleClose} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || isUploading || isSuccess}
                        className="bg-primary text-primary-foreground"
                    >
                        {isUploading ? 'Uploading...' : 'Upload Now'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
