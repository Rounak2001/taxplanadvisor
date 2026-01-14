import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Video, Calendar, Clock, Link as LinkIcon,
  CheckCircle2, Copy, Send, User, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

const DURATIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' },
];

export function MeetingScheduler({ open, onClose, client, onSchedule }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar dates
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    return date < today;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const generatedLink = `meet.taxplan.in/${String(client?.id || 'abc123').slice(-6)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${generatedLink}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSchedule = () => {
    const meetingData = {
      clientId: client?.id,
      clientName: client?.name,
      date: selectedDate?.toISOString(),
      time: selectedTime,
      duration,
      topic,
      notes,
      meetingLink: generatedLink,
      createdAt: new Date().toISOString(),
    };
    onSchedule?.(meetingData);
    // Reset and close
    setStep(1);
    setSelectedDate(null);
    setSelectedTime('');
    setDuration('30');
    setTopic('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card border border-border rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video size={20} className="text-primary" />
                <h2 className="font-semibold">Schedule Video Consultation</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={18} strokeWidth={1.5} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Client Info */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{client?.name || 'Select Client'}</p>
                  <p className="text-xs text-muted-foreground">{client?.email}</p>
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  {/* Calendar */}
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
                        <ChevronLeft size={16} />
                      </Button>
                      <h3 className="font-medium">
                        {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                      </h3>
                      <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
                        <ChevronRight size={16} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-xs text-muted-foreground py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {days.map((date, index) => (
                        <button
                          key={index}
                          onClick={() => date && !isDateDisabled(date) && setSelectedDate(date)}
                          disabled={isDateDisabled(date)}
                          className={cn(
                            'aspect-square text-sm rounded-md transition-colors',
                            !date && 'invisible',
                            date && isDateDisabled(date) && 'text-muted-foreground/40 cursor-not-allowed',
                            date && !isDateDisabled(date) && 'hover:bg-muted cursor-pointer',
                            selectedDate?.toDateString() === date?.toDateString() &&
                            'bg-primary text-primary-foreground hover:bg-primary'
                          )}
                        >
                          {date?.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="space-y-2">
                      <Label>Select Time</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {TIME_SLOTS.map(time => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              'py-2 px-3 text-sm rounded-md border transition-colors',
                              selectedTime === time
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:bg-muted'
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {/* Selected Date/Time Summary */}
                  <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                    <Calendar size={18} className="text-success" />
                    <div>
                      <p className="font-medium text-sm">{formatDate(selectedDate)}</p>
                      <p className="text-xs text-muted-foreground">{selectedTime}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => setStep(1)}
                    >
                      Change
                    </Button>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger>
                        <Clock size={14} className="mr-2 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATIONS.map(d => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Topic */}
                  <div className="space-y-2">
                    <Label htmlFor="topic">Meeting Topic *</Label>
                    <Input
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., GST Filing Discussion"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="meetingNotes">Additional Notes</Label>
                    <Textarea
                      id="meetingNotes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific agenda items..."
                      rows={3}
                    />
                  </div>

                  {/* Meeting Link Preview */}
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LinkIcon size={14} className="text-muted-foreground" />
                        <span className="text-sm font-mono">{generatedLink}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                        {linkCopied ? (
                          <CheckCircle2 size={14} className="text-success" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This link will be shared with the client via WhatsApp/Email
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex justify-between">
              {step === 1 ? (
                <>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continue
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handleSchedule} disabled={!topic}>
                    <Send size={14} className="mr-2" />
                    Schedule & Send Invite
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
