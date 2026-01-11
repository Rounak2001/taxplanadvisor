import { useState } from 'react';
import { 
  Phone, PhoneOff, Clock, CheckCircle2, Calendar, 
  FileText, User, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const CALL_OUTCOMES = [
  { 
    id: 'interested', 
    label: 'Interested', 
    description: 'Client showed interest, follow-up scheduled',
    icon: CheckCircle2,
    color: 'text-success'
  },
  { 
    id: 'document_promised', 
    label: 'Document Promised', 
    description: 'Client will send required documents',
    icon: FileText,
    color: 'text-info'
  },
  { 
    id: 'callback', 
    label: 'Callback Requested', 
    description: 'Client requested to call back later',
    icon: Phone,
    color: 'text-warning'
  },
  { 
    id: 'not_reachable', 
    label: 'Not Reachable', 
    description: 'Could not connect with client',
    icon: PhoneOff,
    color: 'text-muted-foreground'
  },
  { 
    id: 'issue_raised', 
    label: 'Issue/Concern Raised', 
    description: 'Client raised concerns that need attention',
    icon: AlertCircle,
    color: 'text-destructive'
  },
];

export function CallOutcomeModal({ open, onClose, client, callDuration, onSaveOutcome }) {
  const [outcome, setOutcome] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handleSave = () => {
    const outcomeData = {
      outcome,
      notes,
      followUpDate,
      duration: callDuration,
      timestamp: new Date().toISOString(),
      clientId: client?.id,
    };
    onSaveOutcome?.(outcomeData);
    // Reset form
    setOutcome('');
    setNotes('');
    setFollowUpDate('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone size={20} className="text-primary" />
            Log Call Outcome
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Call Summary */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{client?.name}</p>
                <p className="text-xs text-muted-foreground">{client?.phone}</p>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock size={12} />
              {formatDuration(callDuration)}
            </Badge>
          </div>

          {/* Outcome Selection */}
          <div className="space-y-3">
            <Label>Call Outcome *</Label>
            <RadioGroup value={outcome} onValueChange={setOutcome}>
              <div className="space-y-2">
                {CALL_OUTCOMES.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                        outcome === opt.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      )}
                    >
                      <RadioGroupItem value={opt.id} className="mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className={opt.color} />
                          <span className="font-medium text-sm">{opt.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {opt.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about the call..."
              rows={3}
            />
          </div>

          {/* Follow-up Date */}
          {(outcome === 'callback' || outcome === 'interested') && (
            <div className="space-y-2">
              <Label htmlFor="followUp">Schedule Follow-up</Label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="followUp"
                  type="datetime-local"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full pl-9 h-10 rounded-md border border-input bg-background px-3 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Skip
          </Button>
          <Button onClick={handleSave} disabled={!outcome}>
            <CheckCircle2 size={14} className="mr-2" />
            Save & Log to Timeline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
