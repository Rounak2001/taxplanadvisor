import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from '@/components/CommandPalette';
import { useAppStore } from '@/stores/useAppStore';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function AppShell({ children }) {
  const { sidebarCollapsed, commandPaletteOpen, setCommandPaletteOpen } = useAppStore();

  // Command+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
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
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <CommandPalette 
        open={commandPaletteOpen} 
        onOpenChange={setCommandPaletteOpen} 
      />
    </div>
  );
}
