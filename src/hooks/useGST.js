import { useQuery, useMutation } from '@tanstack/react-query';
import { gstService } from '@/api/gstService';
import { toast } from 'sonner';

// Query key factory
export const gstKeys = {
  all: ['gst'],
  reconciliation: (type) => [...gstKeys.all, 'reconciliation', type],
};

/**
 * Hook to generate GST OTP
 */
export function useGenerateGstOtp() {
  return useMutation({
    mutationFn: ({ gstin, username }) => gstService.generateGstOtp(gstin, username),
    onSuccess: () => {
      toast.success('OTP sent successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate OTP');
    },
  });
}

/**
 * Hook to verify GST OTP
 */
export function useVerifyGstOtp() {
  return useMutation({
    mutationFn: ({ gstin, otp }) => gstService.verifyGstOtp(gstin, otp),
    onSuccess: () => {
      toast.success('GST authentication successful');
    },
    onError: (error) => {
      toast.error(error.message || 'OTP verification failed');
    },
  });
}

/**
 * Hook to reconcile GSTR data
 */
export function useReconcileGstr() {
  return useMutation({
    mutationFn: gstService.reconcileComprehensive,
    onSuccess: () => {
      toast.success('Reconciliation completed');
    },
    onError: (error) => {
      toast.error(error.message || 'Reconciliation failed');
    },
  });
}

/**
 * Hook to reconcile GSTR1 vs Books
 */
export function useReconcileGstr1VsBook() {
  return useMutation({
    mutationFn: gstService.reconcile1vsBooks,
    onSuccess: () => {
      toast.success('GSTR1 vs Books reconciliation completed');
    },
    onError: (error) => {
      toast.error(error.message || 'Reconciliation failed');
    },
  });
}

/**
 * Hook to reconcile GSTR3B
 */
export function useReconcileGstr3b() {
  return useMutation({
    mutationFn: gstService.reconcile3BvsBooks,
    onSuccess: () => {
      toast.success('GSTR3B reconciliation completed');
    },
    onError: (error) => {
      toast.error(error.message || 'Reconciliation failed');
    },
  });
}

/**
 * Hook to download GSTR Excel
 */
export function useDownloadGstrExcel() {
  return useMutation({
    mutationFn: gstService.downloadGstrExcel,
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gst-reconciliation-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success('Excel downloaded successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Download failed');
    },
  });
}
