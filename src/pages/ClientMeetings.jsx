import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video } from 'lucide-react';
import { BookingWidget } from '@/components/client/BookingWidget';
import { MeetingsList } from '@/components/client/MeetingsList';
import { VideoCallRoom } from '@/components/consultations/VideoCallRoom';

export default function ClientMeetings() {
  const [inCall, setInCall] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState(null);

  const handleJoinMeeting = (meeting) => {
    setActiveMeeting({
      ...meeting,
      client: 'CA Vikram Mehta', // From client perspective, "client" is the consultant
    });
    setInCall(true);
  };

  const handleEndCall = () => {
    setInCall(false);
    setActiveMeeting(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Video size={24} strokeWidth={1.5} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Meetings</h1>
            <p className="text-muted-foreground">
              Schedule and join video consultations with your CA
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <BookingWidget />
          </div>

          {/* Meetings List */}
          <div className="lg:col-span-2">
            <MeetingsList onJoinMeeting={handleJoinMeeting} />
          </div>
        </div>
      </motion.div>

      {/* Video Call Room Overlay */}
      <AnimatePresence>
        {inCall && (
          <VideoCallRoom meeting={activeMeeting} onEndCall={handleEndCall} />
        )}
      </AnimatePresence>
    </>
  );
}
