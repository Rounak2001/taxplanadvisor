import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import BookingWizard from '@/components/client/BookingWizard';
import { MeetingsList } from '@/components/client/MeetingsList';

export default function ClientMeetings() {
  const handleJoinMeeting = (meeting) => {
    console.log('Joining meeting:', meeting);
  };

  return (
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
          <h1 className="text-2xl font-semibold tracking-tight">Book a Consultation</h1>
          <p className="text-muted-foreground">
            Schedule video consultations with available tax consultants
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Booking Wizard */}
        <div className="xl:col-span-3">
          <BookingWizard />
        </div>

        {/* Meetings List */}
        <div className="xl:col-span-2">
          <MeetingsList onJoinMeeting={handleJoinMeeting} />
        </div>
      </div>
    </motion.div>
  );
}
