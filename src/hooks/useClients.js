import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/api/clientService';
import { toast } from 'sonner';

// Query key factory
export const clientsKeys = {
  all: ['assigned-clients'],
  list: () => [...clientsKeys.all],
  detail: (id) => [...clientsKeys.all, 'detail', id],
};

/**
 * Hook to fetch all clients for the consultant
 */
export function useClients() {
  return useQuery({
    queryKey: clientsKeys.list(),
    queryFn: clientService.getClients,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to create a new client
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.list() });
      toast.success('Client created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create client');
    },
  });
}

/**
 * Hook for smart onboarding
 */
export function useOnboardClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientService.onboardClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.list() });
      toast.success('Client onboarded successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to onboard client');
    },
  });
}
