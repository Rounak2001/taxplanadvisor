import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { generateGstOtp, verifyGstOtp } from '@/lib/api/gst';
import { toast } from 'sonner';
import { z } from 'zod';

const gstinSchema = z.string()
  .length(15, 'GSTIN must be exactly 15 characters')
  .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format');

const usernameSchema = z.string()
  .min(4, 'Username must be at least 4 characters')
  .max(50, 'Username too long');

export function GSTAuthModal({ open, onClose, onAuthenticated }) {
  const [step, setStep] = useState('gstin'); // 'gstin' | 'otp' | 'success'
  const [gstin, setGstin] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionData, setSessionData] = useState(null);

  const handleGenerateOtp = async () => {
    setError('');
    
    // Validate inputs
    try {
      gstinSchema.parse(gstin);
      usernameSchema.parse(username);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await generateGstOtp(gstin.toUpperCase(), username);
      setSessionData(response);
      setStep('otp');
      toast.success('OTP sent to your registered mobile number');
    } catch (err) {
      setError(err.message || 'Failed to generate OTP. Please check your GSTIN and username.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await verifyGstOtp(gstin.toUpperCase(), otp);
      setStep('success');
      toast.success('GST Portal authenticated successfully!');
      
      // Call the callback with auth data
      setTimeout(() => {
        onAuthenticated?.({
          gstin: gstin.toUpperCase(),
          username,
          token: response.token || response.auth_token,
          ...response
        });
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('gstin');
    setGstin('');
    setUsername('');
    setOtp('');
    setError('');
    setSessionData(null);
    onClose();
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await generateGstOtp(gstin.toUpperCase(), username);
      toast.success('OTP resent successfully');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            GST Portal Authentication
          </DialogTitle>
          <DialogDescription>
            Authenticate with the GST portal to fetch GSTR data
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'gstin' && (
            <motion.div
              key="gstin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 pt-4"
            >
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input
                  id="gstin"
                  placeholder="29ABCDE1234F1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  maxLength={15}
                  className="font-mono uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  15-character GST Identification Number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">GST Portal Username</Label>
                <Input
                  id="username"
                  placeholder="Your GST portal username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={50}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateOtp} 
                  disabled={loading || !gstin || !username}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Get OTP
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-4"
            >
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Enter the OTP sent to your registered mobile number
                </p>
                <p className="text-xs font-mono bg-muted px-2 py-1 rounded inline-block">
                  GSTIN: {gstin}
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <div className="flex items-center justify-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="text-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  Didn't receive OTP? Resend
                </Button>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => { setStep('gstin'); setOtp(''); setError(''); }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleVerifyOtp} 
                  disabled={loading || otp.length !== 6}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center space-y-4"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Authentication Successful!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You can now fetch GSTR data for {gstin}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
