import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Phone, PhoneCall, PhoneOff, PhoneMissed, Play, Clock,
    Loader2, ChevronLeft, ChevronRight, Calendar, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/axios';

const STATUS_CONFIG = {
    completed: { label: 'Completed', variant: 'default', icon: PhoneCall },
    busy: { label: 'Busy', variant: 'secondary', icon: PhoneOff },
    failed: { label: 'Failed', variant: 'destructive', icon: PhoneMissed },
    'no-answer': { label: 'No Answer', variant: 'outline', icon: PhoneMissed },
    canceled: { label: 'Canceled', variant: 'outline', icon: PhoneOff },
    initiated: { label: 'Initiated', variant: 'secondary', icon: Phone },
    ringing: { label: 'Ringing', variant: 'secondary', icon: Phone },
    'in-progress': { label: 'In Progress', variant: 'default', icon: PhoneCall },
};

const OUTCOME_LABELS = {
    connected: 'Connected',
    voicemail: 'Voicemail',
    no_answer: 'No Answer',
    busy: 'Busy',
    callback: 'Callback',
    interested: 'Interested',
    not_interested: 'Not Interested',
    wrong_number: 'Wrong Number',
    other: 'Other',
};

export function CallLogsTable({ clientId = null, limit = 10, showTitle = true }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        fetchLogs();
    }, [offset, clientId]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString(),
            });
            if (clientId) params.append('client_id', clientId);

            const response = await api.get(`/calls/logs/?${params.toString()}`);
            setLogs(response.data.results);
            setTotal(response.data.total);
        } catch (err) {
            toast.error('Failed to load call logs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayRecording = (url) => {
        if (url) {
            window.open(url, '_blank');
        } else {
            toast.error('Recording not available');
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return (
        <Card>
            {showTitle && (
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Call History
                        <Badge variant="secondary" className="ml-2">{total}</Badge>
                    </CardTitle>
                    <CardDescription>
                        Your recent calls with clients
                    </CardDescription>
                </CardHeader>
            )}
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Phone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No calls yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {logs.map((log) => {
                            const statusConfig = STATUS_CONFIG[log.status] || STATUS_CONFIG.initiated;
                            const StatusIcon = statusConfig.icon;

                            return (
                                <div
                                    key={log.id}
                                    className="p-4 rounded-lg border bg-secondary/20 hover:bg-secondary/30 transition-colors"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Left: Client and Status */}
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className={`p-2 rounded-full ${log.status === 'completed' ? 'bg-success/20 text-success' :
                                                log.status === 'failed' ? 'bg-destructive/20 text-destructive' :
                                                    'bg-muted text-muted-foreground'
                                                }`}>
                                                <StatusIcon className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium truncate">{log.client_name}</p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{formatDate(log.created_at)}</span>
                                                    {log.duration > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{log.duration_display}</span>
                                                        </>
                                                    )}
                                                    {log.price && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-primary">₹{parseFloat(log.price).toFixed(2)}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle: Outcome and Notes */}
                                        <div className="hidden md:flex items-center gap-2">
                                            {log.outcome && (
                                                <Badge variant="outline" className="text-xs">
                                                    {OUTCOME_LABELS[log.outcome] || log.outcome}
                                                </Badge>
                                            )}
                                            {log.notes && (
                                                <div title={log.notes}>
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                            {log.follow_up_date && (
                                                <div className="flex items-center gap-1 text-xs text-primary" title={`Follow up: ${log.follow_up_date}`}>
                                                    <Calendar className="h-3 w-3" />
                                                    {log.follow_up_date}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex items-center gap-2">
                                            <Badge variant={statusConfig.variant}>
                                                {statusConfig.label}
                                            </Badge>
                                            {log.recording_url && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handlePlayRecording(log.recording_url)}
                                                    title="Play Recording"
                                                >
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Showing {offset + 1}-{Math.min(offset + limit, total)} of {total}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setOffset(Math.max(0, offset - limit))}
                                        disabled={offset === 0}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setOffset(offset + limit)}
                                        disabled={offset + limit >= total}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
