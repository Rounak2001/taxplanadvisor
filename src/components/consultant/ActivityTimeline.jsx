import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { consultantService } from '@/api/consultantService';
import { useState } from 'react';
import {
    Upload,
    CheckCircle,
    XCircle,
    Phone,
    FileText,
    Activity as ActivityIcon,
    Filter,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ActivityTimeline() {
    const [filter, setFilter] = useState({ type: 'all', date: 'week' });

    const { data: activities, isLoading } = useQuery({
        queryKey: ['activities', filter],
        queryFn: () => consultantService.getActivities(filter),
        refetchInterval: 5000, // Real-time updates every 5 seconds
    });

    const activityTypes = [
        { value: 'all', label: 'All Activities' },
        { value: 'document_upload', label: 'Documents' },
        { value: 'service_new', label: 'Services' },
        { value: 'call_made', label: 'Calls' },
    ];

    const dateFilters = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
    ];

    const getActivityIcon = (activityType) => {
        switch (activityType) {
            case 'document_upload':
                return <Upload className="text-blue-500" size={18} />;
            case 'document_verify':
                return <CheckCircle className="text-green-500" size={18} />;
            case 'document_reject':
                return <XCircle className="text-red-500" size={18} />;
            case 'call_made':
            case 'call_received':
                return <Phone className="text-purple-500" size={18} />;
            case 'service_new':
            case 'service_status':
            case 'service_complete':
                return <FileText className="text-orange-500" size={18} />;
            default:
                return <ActivityIcon className="text-gray-500" size={18} />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <ActivityIcon size={20} strokeWidth={1.5} />
                            Activity Timeline
                        </CardTitle>
                        <CardDescription>
                            Recent client interactions and system events
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Date Filter */}
                        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                            {dateFilters.map((dateFilter) => (
                                <Button
                                    key={dateFilter.value}
                                    variant={filter.date === dateFilter.value ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => setFilter({ ...filter, date: dateFilter.value })}
                                >
                                    {dateFilter.label}
                                </Button>
                            ))}
                        </div>

                        {/* Type Filter */}
                        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                            {activityTypes.map((type) => (
                                <Button
                                    key={type.value}
                                    variant={filter.type === type.value ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => setFilter({ ...filter, type: type.value })}
                                >
                                    {type.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : activities && activities.length > 0 ? (
                    <div className="space-y-3">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="mt-1 h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    {getActivityIcon(activity.activity_type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{activity.title}</p>
                                            {activity.description && (
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {activity.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {activity.target_user_name} • {activity.time_ago}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-xs shrink-0">
                                            {activity.activity_type_display}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <ActivityIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No activities found for the selected filters</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
