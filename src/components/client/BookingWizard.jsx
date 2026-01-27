import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Clock,
    BookOpen,
    User,
    Check,
    ArrowRight,
    ChevronLeft,
    AlertCircle,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import api from '@/api/axios';
import { cn } from '@/lib/utils';

export default function BookingWizard() {
    const [step, setStep] = useState(1);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableConsultants, setAvailableConsultants] = useState([]);
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await api.get('/consultations/topics/');
            setTopics(response.data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load topics.',
                variant: 'destructive',
            });
        }
    };

    const fetchAvailableConsultants = async () => {
        setLoading(true);
        try {
            const response = await api.get('/consultations/consultants-by-date/', {
                params: {
                    date: selectedDate,
                    topic_id: selectedTopic?.id
                }
            });
            setAvailableConsultants(response.data.consultants);
            if (response.data.consultants.length === 0) {
                toast({
                    title: 'No consultants available',
                    description: 'Try a different date.',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch available consultants.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchConsultantSlots = async () => {
        setLoading(true);
        try {
            const response = await api.get('/consultations/consultant-slots/', {
                params: {
                    consultant_id: selectedConsultant.id,
                    date: selectedDate
                }
            });
            setAvailableSlots(response.data.slots);
            if (response.data.slots.length === 0) {
                toast({
                    title: 'No slots available',
                    description: 'This consultant has no available times on this date.',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch available slots.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (step === 1 && selectedDate && selectedTopic) {
            await fetchAvailableConsultants();
            setStep(2);
        } else if (step === 2 && selectedConsultant) {
            await fetchConsultantSlots();
            setStep(3);
        } else if (step === 3 && selectedTimeSlot) {
            setStep(4);
        } else if (step === 4) {
            handleBooking();
        }
    };

    const handleBooking = async () => {
        setLoading(true);
        try {
            await api.post('/consultations/bookings/', {
                consultant: selectedConsultant.id,
                topic: selectedTopic.id,
                booking_date: selectedDate,
                start_time: selectedTimeSlot.start,
                end_time: selectedTimeSlot.end,
                notes: notes
            });

            toast({
                title: 'Booking Confirmed!',
                description: `Your consultation with ${selectedConsultant.first_name} ${selectedConsultant.last_name} is scheduled.`,
            });

            // Reset wizard
            setStep(1);
            setSelectedTopic(null);
            setSelectedDate('');
            setSelectedConsultant(null);
            setAvailableConsultants([]);
            setAvailableSlots([]);
            setSelectedTimeSlot(null);
            setNotes('');
        } catch (error) {
            console.error('Booking error:', error.response?.data);
            toast({
                title: 'Booking Failed',
                description: error.response?.data?.error || error.response?.data?.detail || 'Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const canProceed = () => {
        if (step === 1) return selectedDate && selectedTopic;
        if (step === 2) return selectedConsultant;
        if (step === 3) return selectedTimeSlot;
        if (step === 4) return true;
        return false;
    };

    // Get next 30 days for date selection
    // Disabled dates logic (disable past dates)
    const isDateDisabled = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    return (
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            {/* Progress Steps */}
            <div className="p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all",
                                step >= s
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "bg-white/5 text-muted-foreground"
                            )}>
                                {step > s ? <Check size={20} /> : s}
                            </div>
                            {s < 4 && (
                                <div className={cn(
                                    "h-1 w-16 mx-2 rounded-full transition-all",
                                    step > s ? "bg-primary" : "bg-white/10"
                                )} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between max-w-3xl mx-auto mt-3 text-xs text-muted-foreground">
                    <span>Date & Topic</span>
                    <span>Consultant</span>
                    <span>Time Slot</span>
                    <span>Details</span>
                </div>
            </div>

            {/* Step Content */}
            <div className="p-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {/* Step 1: Date & Topic */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <CalendarIcon size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Select Date & Topic</h2>
                                    <p className="text-sm text-muted-foreground">Choose when you need help and what for</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal h-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:text-white",
                                                    !selectedDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {selectedDate ? (
                                                    new Date(selectedDate).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate ? new Date(selectedDate) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const dateStr = date.toLocaleDateString('en-CA');
                                                        setSelectedDate(dateStr);
                                                    } else {
                                                        setSelectedDate('');
                                                    }
                                                }}
                                                disabled={isDateDisabled}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Topic</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {topics.map((topic) => (
                                            <motion.button
                                                key={topic.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedTopic(topic)}
                                                className={cn(
                                                    "p-4 rounded-xl border-2 transition-all text-left",
                                                    selectedTopic?.id === topic.id
                                                        ? "border-primary bg-primary/10 shadow-md"
                                                        : "border-white/10 bg-white/5 hover:border-white/20"
                                                )}
                                            >
                                                <div className="font-semibold mb-1">{topic.name}</div>
                                                <div className="text-xs text-muted-foreground">{topic.description}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Choose Consultant */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <User size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Choose Consultant</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {availableConsultants.length} consultant{availableConsultants.length !== 1 ? 's' : ''} available on {selectedDate}
                                    </p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                                    <p className="mt-4 text-sm text-muted-foreground">Finding available consultants...</p>
                                </div>
                            ) : availableConsultants.length > 0 ? (
                                <div className="space-y-3">
                                    {availableConsultants.map((consultant) => (
                                        <motion.button
                                            key={consultant.id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => setSelectedConsultant(consultant)}
                                            className={cn(
                                                "w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between",
                                                selectedConsultant?.id === consultant.id
                                                    ? "border-primary bg-primary/10 shadow-md"
                                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <User size={24} className="text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">
                                                        {consultant.first_name} {consultant.last_name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{consultant.email}</div>
                                                </div>
                                            </div>
                                            {selectedConsultant?.id === consultant.id && (
                                                <Check size={20} className="text-primary" />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No consultants available on this date.</p>
                                    <Button variant="outline" className="mt-4" onClick={() => setStep(1)}>
                                        <ChevronLeft size={16} className="mr-2" />
                                        Choose different date
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 3: Pick Time Slot (Calendly-style) */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Clock size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Pick a Time</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Available times for {selectedConsultant?.first_name} {selectedConsultant?.last_name}
                                    </p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                                    <p className="mt-4 text-sm text-muted-foreground">Loading available slots...</p>
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {availableSlots.map((slot, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedTimeSlot(slot)}
                                            className={cn(
                                                "p-4 rounded-xl border-2 transition-all",
                                                selectedTimeSlot?.start === slot.start
                                                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                            )}
                                        >
                                            <div className="text-sm font-semibold">
                                                {slot.start}
                                            </div>
                                            <div className="text-xs opacity-70 mt-1">
                                                {slot.end}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No available time slots for this consultant.</p>
                                    <Button variant="outline" className="mt-4" onClick={() => setStep(2)}>
                                        <ChevronLeft size={16} className="mr-2" />
                                        Choose different consultant
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 4: Enter Details */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 max-w-2xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <FileText size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Enter Details</h2>
                                    <p className="text-sm text-muted-foreground">Share what you'd like to discuss</p>
                                </div>
                            </div>

                            {/* Booking Summary */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                <h3 className="font-semibold text-sm mb-3">Booking Summary</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="text-muted-foreground">Consultant:</span>
                                    <span className="font-medium">{selectedConsultant?.first_name} {selectedConsultant?.last_name}</span>

                                    <span className="text-muted-foreground">Topic:</span>
                                    <span className="font-medium">{selectedTopic?.name}</span>

                                    <span className="text-muted-foreground">Date:</span>
                                    <span className="font-medium">
                                        {new Date(selectedDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>

                                    <span className="text-muted-foreground">Time:</span>
                                    <span className="font-medium">{selectedTimeSlot?.start} - {selectedTimeSlot?.end}</span>
                                </div>
                            </div>

                            {/* Notes Input */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Query / Meeting Notes <span className="text-muted-foreground">(Optional)</span>
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Please share anything that will help prepare for our meeting..."
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none min-h-[120px] resize-none"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                >
                    <ChevronLeft size={16} className="mr-2" />
                    Back
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={!canProceed() || loading}
                >
                    {step === 4 ? 'Confirm Booking' : 'Next'}
                    {step < 4 && <ArrowRight size={16} className="ml-2" />}
                </Button>
            </div>
        </div>
    );
}
