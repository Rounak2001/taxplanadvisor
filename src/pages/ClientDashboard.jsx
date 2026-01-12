import { motion } from 'framer-motion';
import { TaxStatusCard } from '@/components/client/TaxStatusCard';
import { ActionItemsCard } from '@/components/client/ActionItemsCard';
import { UpcomingPaymentCard } from '@/components/client/UpcomingPaymentCard';
import { MilestoneTracker } from '@/components/client/MilestoneTracker';
import { QuickUploadDropzone } from '@/components/client/QuickUploadDropzone';
import { EmbeddedOffersCard } from '@/components/marketplace/EmbeddedOffersCard';

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
          Welcome back, Rounak 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your tax filing status for AY 2025-26
        </p>
      </motion.div>

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
