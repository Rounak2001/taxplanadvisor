import { useAuthStore } from '@/stores/useAuthStore';

export default function ClientDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.first_name || user?.email || 'User'} 👋
        </h1>
      </div>

      {/* Empty state - ready for new content */}
      <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-muted-foreground/20 rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Dashboard content coming soon</p>
          <p className="text-muted-foreground/60 text-sm mt-2">This page is being redesigned</p>
        </div>
      </div>
    </div>
  );
}
