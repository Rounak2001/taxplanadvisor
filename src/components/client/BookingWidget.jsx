import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const topics = [
  { value: 'gst', label: 'GST Query', duration: '30 min' },
  { value: 'cma', label: 'CMA Discussion', duration: '45 min' },
  { value: 'itr', label: 'ITR Review', duration: '30 min' },
  { value: 'tax-planning', label: 'Tax Planning', duration: '60 min' },
  { value: 'documents', label: 'Document Review', duration: '30 min' },
];

const availableSlots = [
  { date: '2025-01-10', day: 'Fri', slots: ['09:00', '11:00', '14:00', '16:00'] },
  { date: '2025-01-13', day: 'Mon', slots: ['10:00', '13:00', '15:00'] },
  { date: '2025-01-14', day: 'Tue', slots: ['09:30', '11:30', '14:30'] },
  { date: '2025-01-15', day: 'Wed', slots: ['10:00', '12:00', '16:00'] },
];

export function BookingWidget() {
  const [step, setStep] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooked, setIsBooked] = useState(false);

  const handleBook = () => {
    setIsBooked(true);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedTopic(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setIsBooked(false);
  };

  if (isBooked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle size={32} strokeWidth={1.5} className="text-success" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">Meeting Scheduled!</h3>
        <p className="text-muted-foreground mb-4">
          Your {topics.find((t) => t.value === selectedTopic)?.label} session is confirmed for{' '}
          <span className="font-medium text-foreground">
            {availableSlots.find((d) => d.date === selectedDate)?.day}, {selectedSlot}
          </span>
        </p>
        <Button variant="outline" onClick={handleReset}>
          Schedule Another
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar size={20} strokeWidth={1.5} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Schedule a Call</h3>
            <p className="text-sm text-muted-foreground">Book a session with your CA</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={cn(
                  'h-2 flex-1 rounded-full transition-colors',
                  step >= s ? 'bg-primary' : 'bg-muted'
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <p className="text-sm font-medium mb-4">What would you like to discuss?</p>
            <div className="space-y-2">
              {topics.map((topic) => (
                <motion.button
                  key={topic.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedTopic(topic.value);
                    setStep(2);
                  }}
                  className={cn(
                    'w-full p-4 rounded-lg text-left flex items-center justify-between transition-colors',
                    selectedTopic === topic.value
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-muted/50 hover:bg-muted'
                  )}
                >
                  <span className="font-medium">{topic.label}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {topic.duration}
                    </Badge>
                    <ChevronRight size={16} strokeWidth={1.5} className="text-muted-foreground" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium">Pick a date</p>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot) => (
                <motion.button
                  key={slot.date}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedDate(slot.date);
                    setStep(3);
                  }}
                  className={cn(
                    'p-4 rounded-lg text-center transition-colors',
                    selectedDate === slot.date
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-muted/50 hover:bg-muted'
                  )}
                >
                  <p className="text-lg font-semibold">{slot.day}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {slot.slots.length} slots
                  </Badge>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium">Select a time</p>
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                Back
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {availableSlots
                .find((s) => s.date === selectedDate)
                ?.slots.map((slot) => (
                  <motion.button
                    key={slot}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      'p-3 rounded-lg text-center font-medium transition-colors',
                      selectedSlot === slot
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 hover:bg-muted'
                    )}
                  >
                    {slot}
                  </motion.button>
                ))}
            </div>
            <Button
              className="w-full"
              disabled={!selectedSlot}
              onClick={handleBook}
            >
              <Calendar size={16} strokeWidth={1.5} className="mr-2" />
              Confirm Booking
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
