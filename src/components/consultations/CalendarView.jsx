import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockMeetings = [
  { id: 1, date: '2025-01-10', time: '10:00', client: 'Rounak Patel', topic: 'GST Query', duration: 30 },
  { id: 2, date: '2025-01-10', time: '14:30', client: 'Priya Sharma', topic: 'CMA Discussion', duration: 45 },
  { id: 3, date: '2025-01-12', time: '11:00', client: 'Amit Kumar', topic: 'Tax Planning', duration: 60 },
  { id: 4, date: '2025-01-14', time: '09:00', client: 'Neha Gupta', topic: 'ITR Review', duration: 30 },
  { id: 5, date: '2025-01-15', time: '16:00', client: 'Rounak Patel', topic: 'Document Review', duration: 45 },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView({ onSelectMeeting }) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getMeetingsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return mockMeetings.filter((m) => m.date === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const days = getDaysInMonth(currentDate);
  const selectedMeetings = selectedDate ? getMeetingsForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 glass rounded-xl p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
              <ChevronLeft size={18} strokeWidth={1.5} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
              <ChevronRight size={18} strokeWidth={1.5} />
            </Button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const meetings = getMeetingsForDate(day);
            const isSelected = selectedDate && day && selectedDate.toDateString() === day.toDateString();
            const isToday = day && day.toDateString() === new Date().toDateString();

            return (
              <motion.button
                key={index}
                whileHover={day ? { scale: 1.05 } : {}}
                whileTap={day ? { scale: 0.95 } : {}}
                onClick={() => day && setSelectedDate(day)}
                disabled={!day}
                className={cn(
                  'aspect-square p-1 rounded-lg text-sm relative transition-colors',
                  day && 'hover:bg-muted cursor-pointer',
                  isSelected && 'bg-primary text-primary-foreground hover:bg-primary',
                  isToday && !isSelected && 'ring-2 ring-primary ring-offset-2',
                  !day && 'cursor-default'
                )}
              >
                {day && (
                  <>
                    <span className="font-medium">{day.getDate()}</span>
                    {meetings.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {meetings.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-1 h-1 rounded-full',
                              isSelected ? 'bg-primary-foreground' : 'bg-primary'
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Date Meetings */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">
          {selectedDate
            ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
            : 'Select a date'}
        </h3>

        {selectedMeetings.length > 0 ? (
          <div className="space-y-3">
            {selectedMeetings.map((meeting) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => onSelectMeeting?.(meeting)}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock size={14} strokeWidth={1.5} className="text-muted-foreground" />
                    {meeting.time}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {meeting.duration}m
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <User size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="font-medium">{meeting.client}</span>
                </div>
                <p className="text-sm text-muted-foreground">{meeting.topic}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Clock size={32} strokeWidth={1.5} className="mb-3 opacity-50" />
            <p className="text-sm">
              {selectedDate ? 'No meetings scheduled' : 'Click a date to view meetings'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
