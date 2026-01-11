import { motion, AnimatePresence } from 'framer-motion';
import { ClientSidebar } from './ClientSidebar';
import { ClientTopBar } from './ClientTopBar';
import { ChatBubble } from '@/components/client/ChatBubble';
import { useAppStore } from '@/stores/useAppStore';

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

export function ClientAppShell({ children }) {
  // Use individual selector for better stability
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      <ClientTopBar />
      
      <main 
        className="pt-16 min-h-screen transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 72 : 256 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={typeof children?.type === 'function' ? children.type.name : 'page'}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Chat Bubble */}
      <ChatBubble />
    </div>
  );
}
