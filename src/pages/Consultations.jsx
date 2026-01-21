import { motion } from 'framer-motion';
import Availability from '@/components/consultations/Availability';

export default function Consultations() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Availability />
    </motion.div>
  );
}
