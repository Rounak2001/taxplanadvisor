import { motion } from 'framer-motion';
import { Video, Calendar, Clock, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const upcomingMeetings = [
  {
    id: 1,
    date: '2025-01-10',
    time: '14:30',
    topic: 'CMA Discussion',
    duration: 45,
    consultant: 'CA Vikram Mehta',
  },
  {
    id: 2,
    date: '2025-01-15',
    time: '11:00',
    topic: 'Tax Planning Session',
    duration: 60,
    consultant: 'CA Vikram Mehta',
  },
];

const sharedReplays = [
  {
    id: 1,
    date: '2025-01-05',
    topic: 'GST Filing Review',
    duration: '28:45',
    thumbnail: null,
  },
  {
    id: 2,
    date: '2024-12-28',
    topic: 'Year-End Tax Consultation',
    duration: '42:12',
    thumbnail: null,
  },
];

export function MeetingsList({ onJoinMeeting }) {
  return (
    <div className="space-y-6">
      {/* Upcoming Meetings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Video size={20} strokeWidth={1.5} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Upcoming Meetings</h3>
              <p className="text-sm text-muted-foreground">{upcomingMeetings.length} scheduled</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {upcomingMeetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex flex-col items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-semibold">
                    {new Date(meeting.date).getDate()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{meeting.topic}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={14} strokeWidth={1.5} />
                      {meeting.time}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {meeting.duration} min
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{meeting.consultant}</p>
                </div>
              </div>
              <Button onClick={() => onJoinMeeting?.(meeting)}>
                <Video size={16} strokeWidth={1.5} className="mr-2" />
                Join Meeting
              </Button>
            </motion.div>
          ))}
        </div>

        {upcomingMeetings.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Calendar size={32} strokeWidth={1.5} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No upcoming meetings</p>
          </div>
        )}
      </motion.div>

      {/* Shared Replays */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl overflow-hidden"
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Play size={20} strokeWidth={1.5} className="text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Shared Replays</h3>
              <p className="text-sm text-muted-foreground">Past session recordings</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {sharedReplays.map((replay, index) => (
            <motion.div
              key={replay.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center">
                  <Play size={24} strokeWidth={1.5} className="text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">{replay.topic}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>
                      {new Date(replay.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {replay.duration}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink size={14} strokeWidth={1.5} className="mr-2" />
                Watch
              </Button>
            </motion.div>
          ))}
        </div>

        {sharedReplays.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Play size={32} strokeWidth={1.5} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No shared replays yet</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
