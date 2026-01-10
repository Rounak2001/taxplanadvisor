import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function CallDialer({ open, onClose, client }) {
  const [callActive, setCallActive] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (callActive) {
      interval = setInterval(() => setDuration(d => d + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallActive(false);
    setDuration(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-80 bg-card border-l border-border z-50 flex flex-col"
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Call</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} strokeWidth={1.5} />
            </Button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {client?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{client?.name || 'Unknown'}</h3>
              <p className="text-sm text-muted-foreground">{client?.phone}</p>
            </div>
            {callActive && (
              <p className="text-2xl font-mono text-success">{formatDuration(duration)}</p>
            )}
          </div>

          <div className="p-6 flex justify-center gap-4">
            {!callActive ? (
              <Button size="lg" className="rounded-full h-16 w-16 bg-success hover:bg-success/90" onClick={() => setCallActive(true)}>
                <Phone size={24} strokeWidth={1.5} />
              </Button>
            ) : (
              <Button size="lg" variant="destructive" className="rounded-full h-16 w-16" onClick={handleEndCall}>
                <PhoneOff size={24} strokeWidth={1.5} />
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
