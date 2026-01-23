import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Calendar, Clock, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import api from '@/api/axios';
import { cn } from '@/lib/utils';

export function MeetingsList({ onJoinMeeting }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth(); // Already imported useAuth in my thought, wait let me check imports

  useEffect(() => {
    fetchBookings();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/consultations/bookings/');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your meetings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Separate upcoming and past bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingMeetings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date);
    return bookingDate >= today && booking.status !== 'cancelled';
  }).sort((a, b) => {
    const dateA = new Date(`${a.booking_date}T${a.start_time}`);
    const dateB = new Date(`${b.booking_date}T${b.start_time}`);
    return dateA - dateB;
  });

  const pastMeetings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date);
    return bookingDate < today || booking.status === 'cancelled';
  }).sort((a, b) => {
    const dateA = new Date(`${a.booking_date}T${a.start_time}`);
    const dateB = new Date(`${b.booking_date}T${b.start_time}`);
    return dateB - dateA; // Most recent first
  });

  const calculateDuration = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startInMin = startHour * 60 + startMin;
    const endInMin = endHour * 60 + endMin;
    return endInMin - startInMin;
  };

  const isJoinable = (meetingDateStr, startTimeStr) => {
    const meetingDateTime = new Date(`${meetingDateStr}T${startTimeStr}`);
    const tenMinutesBefore = new Date(meetingDateTime.getTime() - 10 * 60000);
    const endDateTime = new Date(meetingDateTime.getTime() + 30 * 60000); // 30 mins duration

    return currentTime >= tenMinutesBefore && currentTime <= endDateTime;
  };

  const handleJoinClick = (meeting) => {
    if (isJoinable(meeting.booking_date, meeting.start_time)) {
      navigate(`/meeting/${meeting.id}`);
    } else {
      toast({
        title: "Meeting not started",
        description: "You can join 10 minutes before the scheduled time.",
      });
    }
  };

  const formatTime = (time24) => {
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };

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
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading meetings...</p>
            </div>
          ) : upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((meeting, index) => (
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
                      {new Date(meeting.booking_date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-semibold">
                      {new Date(meeting.booking_date).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{meeting.topic_name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={14} strokeWidth={1.5} />
                        {formatTime(meeting.start_time)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {calculateDuration(meeting.start_time, meeting.end_time)} min
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user?.role === 'CONSULTANT' ? `Client: ${meeting.client_name}` : `Consultant: ${meeting.consultant_name}`}
                    </p>
                    {meeting.notes && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        Note: {meeting.notes}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleJoinClick(meeting)}
                  disabled={!isJoinable(meeting.booking_date, meeting.start_time)}
                  className={cn(
                    "transition-all duration-300",
                    isJoinable(meeting.booking_date, meeting.start_time)
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                      : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                  )}
                >
                  <Video size={16} strokeWidth={1.5} className="mr-2" />
                  Join Meeting
                </Button>
              </motion.div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Calendar size={32} strokeWidth={1.5} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No upcoming meetings</p>
              <p className="text-xs mt-1">Book a consultation to get started</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Past Meetings */}
      {pastMeetings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted/10 flex items-center justify-center">
                <Play size={20} strokeWidth={1.5} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Past Meetings</h3>
                <p className="text-sm text-muted-foreground">Previous consultations</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border">
            {pastMeetings.slice(0, 5).map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="p-4 flex items-center justify-between gap-4 opacity-70"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-20 rounded-lg bg-muted flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {new Date(meeting.booking_date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-semibold">
                      {new Date(meeting.booking_date).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{meeting.topic_name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>
                        {new Date(meeting.booking_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                        })}
                      </span>
                      <Badge
                        variant={meeting.status === 'cancelled' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {meeting.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user?.role === 'CONSULTANT' ? `Client: ${meeting.client_name}` : `Consultant: ${meeting.consultant_name}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
