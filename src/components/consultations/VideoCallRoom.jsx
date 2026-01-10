import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Circle,
  PhoneOff,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function VideoCallRoom({ meeting, onEndCall }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showDocPanel, setShowDocPanel] = useState(true);
  const [duration, setDuration] = useState(0);
  const [meetingNotes, setMeetingNotes] = useState('');
  const [activeDocument, setActiveDocument] = useState(null);

  const mockDocuments = [
    { id: 1, name: 'Bank Statement Q3.pdf', type: 'pdf' },
    { id: 2, name: 'GST Returns 2024.xlsx', type: 'excel' },
    { id: 3, name: 'PAN Card.jpg', type: 'image' },
  ];

  useEffect(() => {
    const interval = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-background flex"
    >
      {/* Main Video Area */}
      <div className={cn('flex-1 flex flex-col', showDocPanel ? 'lg:w-2/3' : 'w-full')}>
        {/* Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onEndCall}>
              <ChevronLeft size={20} strokeWidth={1.5} />
            </Button>
            <div>
              <h2 className="font-semibold">{meeting?.client || 'Consultation'}</h2>
              <p className="text-sm text-muted-foreground">{meeting?.topic}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <Circle size={8} className="mr-1.5 fill-current" />
                REC
              </Badge>
            )}
            <Badge variant="secondary" className="font-mono">
              {formatDuration(duration)}
            </Badge>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Remote Video (Client) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl bg-muted/30 overflow-hidden aspect-video lg:aspect-auto flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <User size={40} strokeWidth={1.5} />
              </div>
              <p className="font-medium text-foreground">{meeting?.client || 'Client'}</p>
            </div>
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm">
                {meeting?.client?.split(' ')[0] || 'Client'}
              </Badge>
            </div>
          </motion.div>

          {/* Local Video (Consultant) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden aspect-video lg:aspect-auto flex items-center justify-center"
          >
            {isVideoOn ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={40} strokeWidth={1.5} className="text-primary" />
                </div>
                <p className="font-medium">You</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <VideoOff size={32} strokeWidth={1.5} />
                <p className="text-sm">Camera Off</p>
              </div>
            )}
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm">
                You {isMuted && '(Muted)'}
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="h-24 px-6 flex items-center justify-center gap-3 border-t border-border bg-card/50 backdrop-blur-sm">
          <Button
            variant={isMuted ? 'destructive' : 'secondary'}
            size="lg"
            className="rounded-full h-14 w-14"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff size={22} strokeWidth={1.5} /> : <Mic size={22} strokeWidth={1.5} />}
          </Button>

          <Button
            variant={!isVideoOn ? 'destructive' : 'secondary'}
            size="lg"
            className="rounded-full h-14 w-14"
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video size={22} strokeWidth={1.5} /> : <VideoOff size={22} strokeWidth={1.5} />}
          </Button>

          <Button
            variant={isScreenSharing ? 'default' : 'secondary'}
            size="lg"
            className="rounded-full h-14 w-14"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
          >
            <Monitor size={22} strokeWidth={1.5} />
          </Button>

          <Button
            variant={isRecording ? 'destructive' : 'secondary'}
            size="lg"
            className="rounded-full h-14 w-14"
            onClick={() => setIsRecording(!isRecording)}
          >
            <Circle size={22} strokeWidth={1.5} className={isRecording ? 'fill-current' : ''} />
          </Button>

          <div className="w-px h-10 bg-border mx-2" />

          <Button
            variant="secondary"
            size="lg"
            className="rounded-full h-14 w-14"
            onClick={() => setShowDocPanel(!showDocPanel)}
          >
            <FileText size={22} strokeWidth={1.5} />
          </Button>

          <div className="w-px h-10 bg-border mx-2" />

          <Button
            variant="destructive"
            size="lg"
            className="rounded-full h-14 px-6"
            onClick={onEndCall}
          >
            <PhoneOff size={20} strokeWidth={1.5} className="mr-2" />
            End Call
          </Button>
        </div>
      </div>

      {/* Document Panel */}
      <AnimatePresence>
        {showDocPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '33.333%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="hidden lg:flex flex-col border-l border-border bg-card/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="h-16 px-4 flex items-center justify-between border-b border-border">
              <h3 className="font-semibold">Documents & Notes</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowDocPanel(false)}>
                <ChevronRight size={18} strokeWidth={1.5} />
              </Button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Document List */}
              <div className="p-4 border-b border-border">
                <p className="text-sm font-medium text-muted-foreground mb-3">Shared Documents</p>
                <div className="space-y-2">
                  {mockDocuments.map((doc) => (
                    <motion.button
                      key={doc.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveDocument(doc)}
                      className={cn(
                        'w-full p-3 rounded-lg text-left flex items-center gap-3 transition-colors',
                        activeDocument?.id === doc.id
                          ? 'bg-primary/10 border border-primary/30'
                          : 'bg-muted/50 hover:bg-muted'
                      )}
                    >
                      <FileText size={18} strokeWidth={1.5} className="text-muted-foreground" />
                      <span className="text-sm font-medium truncate">{doc.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Document Preview */}
              {activeDocument && (
                <div className="p-4 border-b border-border flex-1 min-h-0">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Preview</p>
                  <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <FileText size={48} strokeWidth={1} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{activeDocument.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Meeting Notes */}
              <div className="p-4 flex-1 min-h-0 flex flex-col">
                <p className="text-sm font-medium text-muted-foreground mb-3">Meeting Notes</p>
                <Textarea
                  placeholder="Type meeting notes here... These will be saved to the client timeline."
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="flex-1 resize-none text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Auto-saved to Client 360 timeline
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
