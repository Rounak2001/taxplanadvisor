import { motion } from 'framer-motion';
import { TaxStatusCard } from '@/components/client/TaxStatusCard';
import { ActionItemsCard } from '@/components/client/ActionItemsCard';
import { UpcomingPaymentCard } from '@/components/client/UpcomingPaymentCard';
import { MilestoneTracker } from '@/components/client/MilestoneTracker';
import { QuickUploadDropzone } from '@/components/client/QuickUploadDropzone';
import { ClientProfileCard } from '@/components/client/ClientProfileCard';
import { EmbeddedOffersCard } from '@/components/marketplace/EmbeddedOffersCard';
import { useAuthStore } from '@/stores/useAuthStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const advisorName = user?.advisor?.name || 'Loading...';
  const isPanLinked = user?.advisor?.pan_linked;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.full_name || 'User'} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Your assigned CA: <span className="font-semibold text-primary">{advisorName}</span>
          {isPanLinked !== undefined && (
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${isPanLinked ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
              {isPanLinked ? 'PAN Linked' : 'PAN Pending'}
            </span>
          )}
        </p>
      </motion.div>

      {/* Client Profile Section */}
      <ClientProfileCard />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TaxStatusCard status="in-review" />
        <ActionItemsCard pendingCount={3} />
        <UpcomingPaymentCard type="GST" amount={45000} dueDate="2026-01-20" />
      </div>

      {/* Three Column Layout with Embedded Offers Sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <MilestoneTracker />
          <QuickUploadDropzone />
        </div>
        <div>
          <EmbeddedOffersCard />
        </div>
      </div>
    </motion.div>
  );
}
