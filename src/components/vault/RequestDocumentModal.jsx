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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileUp, Send, User, FileText, MessageSquare, Folder as FolderIcon } from 'lucide-react';
import { documentService } from '@/api/documentService';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export function RequestDocumentModal({ isOpen, onClose, clients = [], selectedClientId: preSelectedClientId, onSuccess }) {
    const [selectedClientId, setSelectedClientId] = useState(preSelectedClientId?.toString() || '');
    const [selectedFolderId, setSelectedFolderId] = useState('none');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch folders for the selected client
    const { data: folders = [] } = useQuery({
        queryKey: ['client-folders', selectedClientId],
        queryFn: () => documentService.listFolders(selectedClientId),
        enabled: !!selectedClientId && isOpen,
    });

    const handleSubmit = async () => {
        if (!selectedClientId || !title) return;

        setIsSubmitting(true);
        try {
            const folderId = selectedFolderId === 'none' ? null : selectedFolderId;
            await documentService.createRequest(selectedClientId, title, description, folderId);
            toast.success("Document request sent to client");
            onSuccess?.();
            handleClose();
        } catch (error) {
            console.error("Request failed", error);
            toast.error("Failed to send request");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedClientId(preSelectedClientId?.toString() || '');
        setSelectedFolderId('none');
        setTitle('');
        setDescription('');
        setIsSubmitting(false);
        onClose();
    };

    const selectedClient = clients.find(c => c.id.toString() === selectedClientId);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <FileUp className="h-6 w-6 text-emerald-600" />
                    </div>
                    <DialogTitle className="text-center text-xl">Request Document</DialogTitle>
                    <DialogDescription className="text-center">
                        Send a document request to your client. They'll be notified to upload the required file.
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
                                                {(client.full_name || client.email || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <span>{client.full_name || client.email}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Folder Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="folder" className="text-sm font-medium flex items-center gap-2">
                            <FolderIcon className="h-4 w-4 text-muted-foreground" />
                            Select Folder <span className="text-muted-foreground font-normal">(Optional)</span>
                        </Label>
                        <Select
                            value={selectedFolderId}
                            onValueChange={setSelectedFolderId}
                            disabled={!selectedClientId}
                        >
                            <SelectTrigger id="folder" className="h-11">
                                <SelectValue placeholder={selectedClientId ? "Select destination folder..." : "Choose a client first"} />
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

                    {/* Document Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Document Title
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g. GST Certificate, PAN Card, Bank Statement"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    {/* Instructions */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            Instructions <span className="text-muted-foreground font-normal">(Optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Provide specific instructions for your client, e.g. 'Please upload the latest GST certificate dated after April 2024'"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px] resize-none"
                        />
                    </div>

                    {/* Preview Card */}
                    {selectedClient && title && (
                        <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</p>
                            <p className="text-sm">
                                Requesting <span className="font-semibold text-primary">"{title}"</span> from{' '}
                                <span className="font-semibold">{selectedClient.full_name || selectedClient.email}</span>
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedClientId || !title || isSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Send Request
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
