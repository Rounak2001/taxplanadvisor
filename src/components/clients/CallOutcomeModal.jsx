import { useState } from 'react';
import {
  Phone, PhoneOff, Clock, CheckCircle2, Calendar,
  FileText, User, AlertCircle, ThumbsUp, ThumbsDown, Loader2
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
import { toast } from 'sonner';
import api from '@/api/axios';

// Matches backend OUTCOME_CHOICES
const CALL_OUTCOMES = [
  {
    id: 'connected',
    label: 'Connected - Successful',
    description: 'Had a productive conversation',
    icon: CheckCircle2,
    color: 'text-success'
  },
  {
    id: 'interested',
    label: 'Interested - Follow Up',
    description: 'Client showed interest, needs follow-up',
    icon: ThumbsUp,
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
    id: 'no_answer',
    label: 'No Answer',
    description: 'Client did not pick up',
    icon: PhoneOff,
    color: 'text-muted-foreground'
  },
  {
    id: 'busy',
    label: 'Line Busy',
    description: 'Line was busy',
    icon: Phone,
    color: 'text-muted-foreground'
  },
  {
    id: 'not_interested',
    label: 'Not Interested',
    description: 'Client not interested at this time',
    icon: ThumbsDown,
    color: 'text-destructive'
  },
  {
    id: 'voicemail',
    label: 'Left Voicemail',
    description: 'Left a voicemail message',
    icon: FileText,
    color: 'text-muted-foreground'
  },
];

export function CallOutcomeModal({ open, onClose, client, callId, callDuration, onSaveOutcome }) {
  const [outcome, setOutcome] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handleSave = async () => {
    if (!callId) {
      // No call_id means we can't save to backend, just notify parent
      const outcomeData = {
        outcome,
        notes,
        followUpDate,
        duration: callDuration,
        timestamp: new Date().toISOString(),
        clientId: client?.id,
      };
      onSaveOutcome?.(outcomeData);
      resetForm();
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        outcome,
        notes,
      };

      // Convert datetime-local to YYYY-MM-DD for backend
      if (followUpDate) {
        payload.follow_up_date = followUpDate.split('T')[0];
      }

      const response = await api.patch(`/calls/logs/${callId}/outcome/`, payload);

      if (response.data.success) {
        toast.success('Call outcome saved!');
        onSaveOutcome?.(response.data);
        resetForm();
        onClose();
      } else {
        toast.error('Failed to save outcome');
      }
    } catch (err) {
      console.error('Failed to save outcome:', err);
      toast.error(err.response?.data?.error || 'Failed to save call outcome');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setOutcome('');
    setNotes('');
    setFollowUpDate('');
  };

  const handleSkip = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleSkip}>
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
                <p className="text-xs text-muted-foreground">Call completed</p>
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
              <div className="grid grid-cols-1 gap-2 max-h-[240px] overflow-y-auto pr-1">
                {CALL_OUTCOMES.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                        outcome === opt.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      )}
                    >
                      <RadioGroupItem value={opt.id} className="shrink-0" />
                      <Icon size={16} className={cn('shrink-0', opt.color)} />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm">{opt.label}</span>
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
              placeholder="Add notes about this call..."
              rows={2}
            />
          </div>

          {/* Follow-up Date - show for relevant outcomes */}
          {(outcome === 'callback' || outcome === 'interested' || outcome === 'connected') && (
            <div className="space-y-2">
              <Label htmlFor="followUp">Schedule Follow-up</Label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="followUp"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-9 h-10 rounded-md border border-input bg-background px-3 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleSkip} disabled={isSaving}>
            Skip
          </Button>
          <Button onClick={handleSave} disabled={!outcome || isSaving}>
            {isSaving ? (
              <Loader2 size={14} className="mr-2 animate-spin" />
            ) : (
              <CheckCircle2 size={14} className="mr-2" />
            )}
            Save Outcome
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

