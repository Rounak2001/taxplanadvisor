import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Plus,
    Trash2,
    Calendar as CalendarIcon,
    Globe,
    ChevronDown,
    X,
    AlertCircle,
    CalendarDays,
    Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import TimeSelect from '@/components/ui/TimeSelect';
import api from '@/api/axios';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DAYS = [
    { id: 0, name: 'Sunday', short: 'S' },
    { id: 1, name: 'Monday', short: 'M' },
    { id: 2, name: 'Tuesday', short: 'T' },
    { id: 3, name: 'Wednesday', short: 'W' },
    { id: 4, name: 'Thursday', short: 'T' },
    { id: 5, name: 'Friday', short: 'F' },
    { id: 6, name: 'Saturday', short: 'S' },
];

export default function Availability() {
    const [weeklyHours, setWeeklyHours] = useState([]);
    const [dateOverrides, setDateOverrides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOverrideModal, setShowOverrideModal] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [timeRanges, setTimeRanges] = useState([{ start: '09:00', end: '17:00' }]);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [editingOverrideId, setEditingOverrideId] = useState(null);
    const { toast } = useToast();

    const fetchAvailability = async () => {
        try {
            const [weeklyRes, overridesRes] = await Promise.all([
                api.get('/consultations/weekly-availability/'),
                api.get('/consultations/date-overrides/')
            ]);
            setWeeklyHours(weeklyRes.data);
            setDateOverrides(overridesRes.data);
        } catch (error) {
            console.error('Failed to fetch availability:', error);
            toast({
                title: 'Error',
                description: 'Failed to load availability settings.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailability();
    }, []);

    const handleAddWeeklyRange = async (dayId) => {
        try {
            const response = await api.post('/consultations/weekly-availability/', {
                day_of_week: dayId,
                start_time: '09:00',
                end_time: '17:00'
            });
            setWeeklyHours([...weeklyHours, response.data]);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to add time range.',
                variant: 'destructive',
            });
        }
    };

    const handleRemoveWeeklyRange = async (rangeId) => {
        try {
            await api.delete(`/consultations/weekly-availability/${rangeId}/`);
            setWeeklyHours(weeklyHours.filter(h => h.id !== rangeId));
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to remove time range.',
                variant: 'destructive',
            });
        }
    };

    const handleUpdateTime = async (rangeId, field, value) => {
        try {
            const response = await api.patch(`/consultations/weekly-availability/${rangeId}/`, {
                [field]: value
            });
            setWeeklyHours(weeklyHours.map(h => h.id === rangeId ? response.data : h));
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update time.',
                variant: 'destructive',
            });
        }
    };

    const handleRemoveOverride = async (overrideId) => {
        try {
            await api.delete(`/consultations/date-overrides/${overrideId}/`);
            setDateOverrides(dateOverrides.filter(o => o.id !== overrideId));
            toast({
                title: 'Success',
                description: 'Date override removed.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to remove date override.',
                variant: 'destructive',
            });
        }
    };

    const handleEditOverride = (override) => {
        setEditingOverrideId(override.id);
        setSelectedDates([override.date]);
        setIsUnavailable(override.is_unavailable);
        if (override.start_time && override.end_time) {
            setTimeRanges([{ start: override.start_time, end: override.end_time }]);
        } else {
            setTimeRanges([{ start: '09:00', end: '17:00' }]);
        }
        setShowOverrideModal(true);
    };

    const handleSaveOverrides = async () => {
        try {
            if (editingOverrideId) {
                // Update existing override
                const data = {
                    date: selectedDates[0],
                    is_unavailable: isUnavailable,
                };

                if (!isUnavailable) {
                    data.start_time = timeRanges[0].start;
                    data.end_time = timeRanges[0].end;
                }

                await api.patch(`/consultations/date-overrides/${editingOverrideId}/`, data);

                toast({
                    title: 'Success',
                    description: 'Date override updated.',
                });
            } else {
                // Create new overrides
                const promises = selectedDates.map(date => {
                    if (isUnavailable) {
                        return api.post('/consultations/date-overrides/', {
                            date,
                            is_unavailable: true
                        });
                    } else {
                        return api.post('/consultations/date-overrides/', {
                            date,
                            is_unavailable: false,
                            start_time: timeRanges[0].start,
                            end_time: timeRanges[0].end
                        });
                    }
                });

                await Promise.all(promises);
                toast({
                    title: 'Success',
                    description: 'Date overrides saved successfully.',
                });
            }

            await fetchAvailability();
            setShowOverrideModal(false);
            resetModalState();
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to ${editingOverrideId ? 'update' : 'save'} date overrides.`,
                variant: 'destructive',
            });
        }
    };

    const resetModalState = () => {
        setSelectedDates([]);
        setTimeRanges([{ start: '09:00', end: '17:00' }]);
        setIsUnavailable(false);
        setEditingOverrideId(null);
    };

    const dayHasHours = (dayId) => weeklyHours.some(h => h.day_of_week === dayId);

    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Availability</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Configure your standard working hours and date-specific overrides
                    </p>
                </div>
                <div className="flex items-center gap-2 p-2 px-3 rounded-lg bg-white/5 border border-white/10 text-xs font-medium">
                    <Globe size={14} className="text-muted-foreground" />
                    India Standard Time (GMT+5:30)
                    <ChevronDown size={14} className="text-muted-foreground" />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Weekly Hours */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-primary" />
                                <h3 className="font-medium">Weekly hours</h3>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {DAYS.map((day) => {
                                const dayRanges = weeklyHours.filter(h => h.day_of_week === day.id);
                                const isActive = dayHasHours(day.id);

                                return (
                                    <div key={day.id} className="flex flex-col sm:flex-row sm:items-start gap-4 py-2 border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-4 w-32 shrink-0 h-10">
                                            <div className={cn(
                                                "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                                isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-white/5 text-muted-foreground"
                                            )}>
                                                {day.short}
                                            </div>
                                            <span className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                                                {day.name}
                                            </span>
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            {dayRanges.length > 0 ? (
                                                dayRanges.map((range) => (
                                                    <div key={range.id} className="flex items-center gap-2">
                                                        <TimeSelect
                                                            value={range.start_time}
                                                            onChange={(value) => handleUpdateTime(range.id, 'start_time', value)}
                                                            className="w-32"
                                                        />
                                                        <span className="text-muted-foreground">—</span>
                                                        <TimeSelect
                                                            value={range.end_time}
                                                            onChange={(value) => handleUpdateTime(range.id, 'end_time', value)}
                                                            className="w-32"
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRemoveWeeklyRange(range.id)}
                                                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-muted-foreground h-9 flex items-center">Unavailable</p>
                                            )}
                                        </div>

                                        {isActive && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAddWeeklyRange(day.id)}
                                                className="h-9 shrink-0 text-xs"
                                            >
                                                <Plus size={14} className="mr-1" />
                                                Add time
                                            </Button>
                                        )}

                                        {!isActive && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAddWeeklyRange(day.id)}
                                                className="h-9 shrink-0 text-xs"
                                            >
                                                Set hours
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Date Overrides */}
                <div className="space-y-6">
                    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon size={18} className="text-primary" />
                                    <h3 className="font-medium">Date-specific hours</h3>
                                </div>
                                <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => { resetModalState(); setShowOverrideModal(true); }}>
                                    <Plus size={14} className="mr-1.5" />
                                    Hours
                                </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-2">
                                Override your weekly hours for specific dates
                            </p>
                        </div>

                        <div className="p-0">
                            {dateOverrides.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <CalendarIcon size={24} className="text-muted-foreground/50" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">No date-specific hours</p>
                                        <p className="text-xs text-muted-foreground max-w-[200px] mt-1 mx-auto">
                                            Adjust your hours for specific days you might be off or working extra
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {dateOverrides.map((override) => (
                                        <div key={override.id} className="p-4 flex items-center justify-between group bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                    <CalendarDays size={16} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium">
                                                        {formatDateForDisplay(override.date)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {override.is_unavailable ? (
                                                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-destructive border-destructive/20 bg-destructive/5 px-1.5 py-0">Unavailable</Badge>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                                <span>{override.start_time.substring(0, 5)}</span>
                                                                <span>—</span>
                                                                <span>{override.end_time.substring(0, 5)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditOverride(override)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                >
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveOverride(override.id)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                        <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-black-200 uppercase tracking-wider">Note</p>
                            <p className="text-[11px] text-black leading-relaxed">
                                Date-specific hours take priority over your normal weekly schedule. Use them for holidays or one-off schedule changes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendly-style Modal for Date Override */}
            <AnimatePresence>
                {showOverrideModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowOverrideModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass rounded-2xl border border-white/10 max-w-md w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur">
                                <h3 className="font-semibold">{editingOverrideId ? 'Edit specific hours' : 'Select date(s) for specific hours'}</h3>
                                <Button variant="ghost" size="icon" onClick={() => setShowOverrideModal(false)}>
                                    <X size={16} />
                                </Button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Calendar Date Picker in Popover */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Date(s)</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal h-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10",
                                                    !selectedDates.length && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {selectedDates.length > 0 ? (
                                                    editingOverrideId ? (
                                                        formatDateForDisplay(selectedDates[0])
                                                    ) : (
                                                        `${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} selected`
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode={editingOverrideId ? "single" : "multiple"}
                                                selected={editingOverrideId
                                                    ? (selectedDates[0] ? new Date(selectedDates[0]) : undefined)
                                                    : selectedDates.map(d => new Date(d))
                                                }
                                                onSelect={(val) => {
                                                    if (editingOverrideId) {
                                                        if (val) {
                                                            const dateStr = val.toLocaleDateString('en-CA');
                                                            setSelectedDates([dateStr]);
                                                        } else {
                                                            setSelectedDates([]);
                                                        }
                                                    } else {
                                                        if (val) {
                                                            const dateStrings = val.map(d => d.toLocaleDateString('en-CA'));
                                                            setSelectedDates(dateStrings);
                                                        } else {
                                                            setSelectedDates([]);
                                                        }
                                                    }
                                                }}
                                                disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    {!editingOverrideId && selectedDates.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {selectedDates.map((date, index) => (
                                                <Badge key={index} variant="secondary" className="gap-2 bg-white/10">
                                                    {formatDateForDisplay(date)}
                                                    <button
                                                        onClick={() => setSelectedDates(selectedDates.filter((_, i) => i !== index))}
                                                        className="hover:text-destructive transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Availability Toggle */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="unavailable"
                                        checked={isUnavailable}
                                        onChange={(e) => setIsUnavailable(e.target.checked)}
                                        className="h-4 w-4 rounded border-white/10"
                                    />
                                    <label htmlFor="unavailable" className="text-sm font-medium">
                                        Mark as unavailable (day off)
                                    </label>
                                </div>

                                {/* Time Ranges */}
                                {!isUnavailable && (
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">What hours are you available?</label>
                                        <div className="space-y-2">
                                            {timeRanges.map((range, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <TimeSelect
                                                        value={range.start}
                                                        onChange={(value) => {
                                                            const newRanges = [...timeRanges];
                                                            newRanges[index].start = value;
                                                            setTimeRanges(newRanges);
                                                        }}
                                                    />
                                                    <span className="text-muted-foreground">—</span>
                                                    <TimeSelect
                                                        value={range.end}
                                                        onChange={(value) => {
                                                            const newRanges = [...timeRanges];
                                                            newRanges[index].end = value;
                                                            setTimeRanges(newRanges);
                                                        }}
                                                    />
                                                    {timeRanges.length > 1 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setTimeRanges(timeRanges.filter((_, i) => i !== index))}
                                                        >
                                                            <X size={16} />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setTimeRanges([...timeRanges, { start: '09:00', end: '17:00' }])}
                                                className="w-full"
                                            >
                                                <Plus size={14} className="mr-2" />
                                                Add hours
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/10 flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setShowOverrideModal(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleSaveOverrides}
                                    disabled={selectedDates.length === 0}
                                >
                                    {editingOverrideId ? 'Update' : 'Apply'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
