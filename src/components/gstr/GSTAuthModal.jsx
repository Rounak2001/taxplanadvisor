import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Clock } from 'lucide-react';
import { useGstStore } from '@/stores/useGstStore';

export default function GSTAuthModal({ isOpen, onClose, onSuccess }) {
  const { generateOTP, verifyOTP, isLoading, error, sessionId, expiresIn } = useGstStore();
  const [step, setStep] = useState('gstin'); // 'gstin' | 'otp'
  const [gstin, setGstin] = useState('');
  const [otp, setOtp] = useState('');

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    if (!gstin || gstin.length !== 15) return;

    try {
      await generateOTP(gstin);
      setStep('otp');
    } catch (err) {
      // Error handled by context
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;

    try {
      await verifyOTP(otp);
      onSuccess?.();
      onClose();
    } catch (err) {
      // Error handled by context
    }
  };

  const handleClose = () => {
    setStep('gstin');
    setGstin('');
    setOtp('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            GST Portal Authentication
          </DialogTitle>
          <DialogDescription>
            {step === 'gstin'
              ? 'Enter your GSTIN to receive OTP from GST portal'
              : 'Enter the OTP sent to your registered mobile number'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'gstin' ? (
            <form onSubmit={handleGenerateOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input
                  id="gstin"
                  placeholder="Enter 15-digit GSTIN"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  maxLength={15}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Format: 22AAAAA0000A1Z5
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || gstin.length !== 15}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Generate OTP'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="font-mono text-center text-lg"
                />
                {expiresIn > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Session expires in {expiresIn} minutes
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('gstin')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• OTP will be sent to your registered mobile number</p>
            <p>• Session is valid for 6 hours after verification</p>
            <p>• All data is fetched directly from GST portal</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}