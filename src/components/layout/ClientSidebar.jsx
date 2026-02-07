import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Video,
  Brain,
  Store,
  Shield,
  FileSpreadsheet,
  Calculator,
  Library,
  User,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { documentService } from '@/api/documentService';

const navItems = [
  { to: '/client', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/client/profile', icon: User, label: 'Profile' },
  { to: '/client/services', icon: Briefcase, label: 'Services' },
  { to: '/client/gst', icon: FileSpreadsheet, label: 'GSTR Reports' },
  // { to: '/client/insights', icon: Brain, label: 'Financial Insights' },
  { to: '/client/calculators', icon: Calculator, label: 'Financial Calculators' },
  { to: '/client/vault', icon: Library, label: 'Document  Vault', showBadge: true },
  { to: '/client/meetings', icon: Video, label: 'My Meetings' },
  { to: '/client/messages', icon: MessageSquare, label: 'Message Center' },
  // { to: '/client/marketplace', icon: Store, label: 'Marketplace' },
  // { to: '/client/billing', icon: CreditCard, label: 'Billing' },
  // { to: '/client/privacy', icon: Shield, label: 'Privacy & Data' },
];

export function ClientSidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const [notificationData, setNotificationData] = useState({ count: 0, pending: 0, rejected: 0 });

  useEffect(() => {
    fetchNotificationCounts();
    // Poll every 30 seconds to keep the count updated
    const interval = setInterval(fetchNotificationCounts, 5000);

    // Listen for custom document upload events to refresh immediately
    const handleDocumentUpdate = () => {
      fetchNotificationCounts();
    };
    window.addEventListener('documentUploaded', handleDocumentUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('documentUploaded', handleDocumentUpdate);
    };
  }, []);

  const fetchNotificationCounts = async () => {
    try {
      const data = await documentService.getPendingCount();
      setNotificationData({
        count: data.count || 0,
        pending: data.pending || 0,
        rejected: data.rejected || 0
      });
    } catch (error) {
      console.error('Error fetching document notification counts:', error);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar flex flex-col"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TP</span>
              </div>
              <span className="font-semibold text-sidebar-foreground">TaxPlan</span>
            </motion.div>
          )}
        </AnimatePresence>

        {sidebarCollapsed && (
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm">TP</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            const hasNotifications = item.showBadge && notificationData.count > 0;
            const hasRejected = item.showBadge && notificationData.rejected > 0;

            const linkContent = (
              <NavLink
                to={item.to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative',
                  'hover:bg-sidebar-accent',
                  isActive && 'bg-sidebar-accent text-sidebar-primary',
                  !isActive && 'text-sidebar-foreground'
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      'shrink-0',
                      isActive ? 'text-sidebar-primary' : 'text-muted-foreground'
                    )}
                    size={20}
                    strokeWidth={1.5}
                  />
                  {hasNotifications && sidebarCollapsed && (
                    <span className={cn(
                      "absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-sidebar animate-pulse",
                      hasRejected ? "bg-red-600" : "bg-red-500"
                    )} />
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden flex items-center gap-2 flex-1"
                    >
                      {item.label}
                      {hasNotifications && (
                        <span className={cn(
                          "ml-auto h-5 min-w-[20px] px-1.5 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse",
                          hasRejected ? "bg-red-600 shadow-sm shadow-red-500/50" : "bg-red-500"
                        )}>
                          {notificationData.count}
                        </span>
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.to} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    <div className="flex items-center gap-2">
                      {item.label}
                      {hasNotifications && (
                        <span className={cn(
                          "h-5 min-w-[20px] px-1.5 text-white text-[10px] font-bold rounded-full flex items-center justify-center",
                          hasRejected ? "bg-red-600" : "bg-red-500"
                        )}>
                          {notificationData.count}
                        </span>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.to}>{linkContent}</div>;
          })}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-center"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={18} strokeWidth={1.5} />
          ) : (
            <>
              <ChevronLeft size={18} strokeWidth={1.5} />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
