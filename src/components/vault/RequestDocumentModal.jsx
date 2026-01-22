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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { documentService } from '@/api/documentService';
import { toast } from 'sonner';

export function RequestDocumentModal({ isOpen, onClose, clients = [], onSuccess }) {
    const [selectedClientId, setSelectedClientId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedClientId || !title) return;

        setIsSubmitting(true);
        try {
            await documentService.createRequest(selectedClientId, title, description);
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
        setSelectedClientId('');
        setTitle('');
        setDescription('');
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] glass">
                <DialogHeader>
                    <DialogTitle>Request Document</DialogTitle>
                    <DialogDescription>
                        Select a client and specify what document they need to upload.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="client">Client</Label>
                        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                            <SelectTrigger id="client">
                                <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id.toString()}>
                                        {client.full_name || client.username}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Document Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. GST Certificate"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Instructions (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Tell the client exactly what is needed..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedClientId || !title || isSubmitting}
                    >
                        {isSubmitting ? 'Sending Request...' : 'Send Request'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
