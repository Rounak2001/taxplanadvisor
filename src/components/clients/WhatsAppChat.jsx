import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Check, CheckCheck, FileText, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockChatMessages } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { TemplateGallery } from './TemplateGallery';

export function WhatsAppChat({ open, onClose, client, consultantId }) {
  const [message, setMessage] = useState('');
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const messages = client ? mockChatMessages.filter(m => m.clientId === client.id) : [];

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending:', message);
      setMessage('');
    }
  };

  const handleTemplateSelect = (templateContent) => {
    setMessage(templateContent);
  };

  return (
    <>
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
                      {msg.type === 'template' && (
                        <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                          <LayoutTemplate size={12} />
                          Template
                        </div>
                      )}
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

            <div className="p-4 border-t border-border space-y-2">
              {/* Template Quick Action */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setTemplateGalleryOpen(true)}
              >
                <LayoutTemplate size={14} className="mr-2" />
                Use Template
              </Button>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend}><Send size={16} strokeWidth={1.5} /></Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TemplateGallery
        open={templateGalleryOpen}
        onClose={() => setTemplateGalleryOpen(false)}
        onSelectTemplate={handleTemplateSelect}
        client={client}
      />
    </>
  );
}
