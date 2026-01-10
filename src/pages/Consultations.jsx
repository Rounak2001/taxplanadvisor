import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Calendar, Archive, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarView } from '@/components/consultations/CalendarView';
import { RecordingArchive } from '@/components/consultations/RecordingArchive';
import { VideoCallRoom } from '@/components/consultations/VideoCallRoom';

export default function Consultations() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [inCall, setInCall] = useState(false);

  const handleStartCall = (meeting) => {
    setActiveMeeting(meeting);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Video Consultations</h1>
            <p className="text-muted-foreground mt-1">
              Schedule, manage, and review client video sessions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Settings size={16} strokeWidth={1.5} className="mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Plus size={16} strokeWidth={1.5} className="mr-2" />
              New Session
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar size={16} strokeWidth={1.5} />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="recordings" className="flex items-center gap-2">
              <Archive size={16} strokeWidth={1.5} />
              <span className="hidden sm:inline">Recordings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-6">
            <CalendarView onSelectMeeting={handleStartCall} />
          </TabsContent>

          <TabsContent value="recordings" className="mt-6">
            <RecordingArchive onViewRecording={(rec) => console.log('View recording:', rec)} />
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Video size={22} strokeWidth={1.5} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">12</p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Archive size={22} strokeWidth={1.5} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">48</p>
              <p className="text-sm text-muted-foreground">Total Recordings</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
              <Calendar size={22} strokeWidth={1.5} className="text-info" />
            </div>
            <div>
              <p className="text-2xl font-semibold">3</p>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
          </div>
        </motion.div>
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
