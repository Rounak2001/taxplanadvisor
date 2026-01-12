import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, createClient, onboardClient } from '@/lib/api/clients';
import { toast } from 'sonner';

// Query key factory
export const clientsKeys = {
  all: ['clients'],
  list: () => [...clientsKeys.all, 'list'],
  detail: (id) => [...clientsKeys.all, 'detail', id],
};

/**
 * Hook to fetch all clients for the consultant
 */
export function useClients() {
  return useQuery({
    queryKey: clientsKeys.list(),
    queryFn: getClients,
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
    mutationFn: createClient,
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
    mutationFn: onboardClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.list() });
      toast.success('Client onboarded successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to onboard client');
    },
  });
}
