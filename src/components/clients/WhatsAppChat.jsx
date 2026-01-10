import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Check, CheckCheck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockChatMessages } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export function WhatsAppChat({ open, onClose, client, consultantId }) {
  const [message, setMessage] = useState('');
  const messages = client ? mockChatMessages.filter(m => m.clientId === client.id) : [];

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending:', message);
      setMessage('');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-96 bg-card border-l border-border z-50 flex flex-col"
        >
          <div className="p-4 border-b border-border flex items-center justify-between bg-success/10">
            <div>
              <h3 className="font-semibold">{client?.name || 'WhatsApp'}</h3>
              <p className="text-xs text-muted-foreground">{client?.phone}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} strokeWidth={1.5} />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex', msg.direction === 'sent' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    'max-w-[80%] rounded-lg p-3',
                    msg.direction === 'sent' ? 'bg-success/20' : 'bg-muted'
                  )}>
                    {msg.type === 'document' && <FileText size={14} className="mb-1" />}
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.direction === 'sent' && (
                        msg.status === 'read' ? <CheckCheck size={12} className="text-info" /> : <Check size={12} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}><Send size={16} strokeWidth={1.5} /></Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
