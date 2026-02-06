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
import { FileUp, Send, User, Upload, File, X, CheckCircle2, ShieldAlert, Calendar as CalendarIcon } from 'lucide-react';
import { documentService } from '@/api/documentService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SOURCES = [
    { value: 'INCOME_TAX', label: 'Income Tax Dept' },
    { value: 'GST', label: 'GST Department' },
    { value: 'MCA', label: 'Ministry of Corporate Affairs' },
    { value: 'OTHER', label: 'Other Authority' },
];

const TYPES = [
    { value: 'NOTICE', label: 'Notice' },
    { value: 'ORDER', label: 'Order' },
    { value: 'COMMUNICATION', label: 'General Communication' },
];

const PRIORITIES = [
    { value: 'URGENT', label: 'Urgent', color: 'text-rose-600' },
    { value: 'HIGH', label: 'High', color: 'text-orange-600' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-amber-600' },
    { value: 'LOW', label: 'Low', color: 'text-emerald-600' },
];

export function ShareNoticeModal({ isOpen, onClose, clients = [], onSuccess, userRole = 'CONSULTANT' }) {
    const [selectedClientId, setSelectedClientId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [source, setSource] = useState('OTHER');
    const [noticeType, setNoticeType] = useState('NOTICE');
    const [priority, setPriority] = useState('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    const handleSubmit = async () => {
        if (userRole === 'CONSULTANT' && !selectedClientId) return;
        if (!title || !file) return;

        setIsUploading(true);
        const formData = new FormData();
        if (userRole === 'CONSULTANT') {
            formData.append('client', selectedClientId);
        }
        formData.append('title', title);
        formData.append('description', description);
        formData.append('source', source);
        formData.append('notice_type', noticeType);
        formData.append('priority', priority);
        if (dueDate) formData.append('due_date', dueDate);
        formData.append('file', file);

        try {
            await documentService.createLegalNotice(formData);
            setIsSuccess(true);
            toast.success("Notice uploaded successfully");
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 1500);
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload notice");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setSelectedClientId('');
        setTitle('');
        setDescription('');
        setSource('OTHER');
        setNoticeType('NOTICE');
        setPriority('MEDIUM');
        setDueDate('');
        setFile(null);
        setIsUploading(false);
        setIsSuccess(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                        <ShieldAlert className="h-6 w-6 text-rose-600" />
                    </div>
                    <DialogTitle className="text-center text-xl">Legal Notice & Communication</DialogTitle>
                    <DialogDescription className="text-center">
                        Upload official notices, orders, or legal documents.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 flex-1 overflow-y-auto px-1">
                    {userRole === 'CONSULTANT' && (
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
                                            {client.name || client.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">Document Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. IT Notice Sec 143(2)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-sm font-medium">Doc Type</Label>
                            <Select value={noticeType} onValueChange={setNoticeType}>
                                <SelectTrigger id="type" className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="source" className="text-sm font-medium">Authority Source</Label>
                            <Select value={source} onValueChange={setSource}>
                                <SelectTrigger id="source" className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SOURCES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger id="priority" className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRIORITIES.map(p => (
                                        <SelectItem key={p.value} value={p.value}>
                                            <span className={p.color}>{p.label}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="due-date" className="text-sm font-medium flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            Reply Due Date <span className="text-muted-foreground font-normal">(Optional)</span>
                        </Label>
                        <Input
                            id="due-date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">Notes</Label>
                        <Textarea
                            id="description"
                            placeholder="Briefly describe the notice or mentions actions required..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[80px] resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">File</Label>
                        <div
                            className={cn(
                                "relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer text-center",
                                isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                                file && "border-primary/50 bg-primary/5",
                                isSuccess && "border-emerald-500 bg-emerald-50"
                            )}
                            onClick={() => !isUploading && !isSuccess && document.getElementById('notice-upload').click()}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            <input id="notice-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                            {isSuccess ? (
                                <div className="flex flex-col items-center gap-2 text-emerald-600">
                                    <CheckCircle2 className="h-10 w-10" />
                                    <p className="text-sm font-medium">Success!</p>
                                </div>
                            ) : file ? (
                                <div className="flex flex-col items-center gap-2">
                                    <File className="h-10 w-10 text-primary" />
                                    <p className="text-sm font-semibold truncate max-w-[200px]">{file.name}</p>
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }}>Remove</Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-sm"><span className="text-primary font-medium">Click to upload</span> or drag and drop</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={isUploading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isUploading || isSuccess || !file || !title || (userRole === 'CONSULTANT' && !selectedClientId)} className="bg-rose-600 hover:bg-rose-700">
                        {isUploading ? "Uploading..." : "Save Notice"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
