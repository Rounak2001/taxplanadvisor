import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  FileSpreadsheet,
  Receipt,
  MessageSquare,
  CreditCard,
  Shield,
  Search,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { mockClients } from '@/lib/mockData';
import { useAppStore } from '@/stores/useAppStore';

const navigationItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/vault', icon: FolderOpen, label: 'Smart Vault' },
  { to: '/cma-maker', icon: FileSpreadsheet, label: 'CMA Maker' },
  { to: '/gst-reco', icon: Receipt, label: 'GST Reconciliation' },
  { to: '/ai-chat', icon: MessageSquare, label: 'AI Chat' },
  { to: '/pricing', icon: CreditCard, label: 'Subscription' },
  { to: '/compliance', icon: Shield, label: 'DPDP Compliance' },
];

export function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const { setActiveClientId } = useAppStore();

  const handleNavigate = (to) => {
    navigate(to);
    onOpenChange(false);
  };

  const handleSelectClient = (clientId) => {
    setActiveClientId(clientId);
    navigate('/clients');
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, clients, or actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Pages">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.to}
                onSelect={() => handleNavigate(item.to)}
                className="flex items-center gap-3"
              >
                <Icon size={16} strokeWidth={1.5} className="text-muted-foreground" />
                <span>{item.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Clients">
          {mockClients.map((client) => (
            <CommandItem
              key={client.id}
              onSelect={() => handleSelectClient(client.id)}
              className="flex items-center gap-3"
            >
              <Users size={16} strokeWidth={1.5} className="text-muted-foreground" />
              <div className="flex flex-col">
                <span>{client.name}</span>
                <span className="text-xs text-muted-foreground">{client.pan}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => handleNavigate('/vault?action=upload')}
            className="flex items-center gap-3"
          >
            <FolderOpen size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <span>Upload Document</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigate('/cma-maker?action=new')}
            className="flex items-center gap-3"
          >
            <FileSpreadsheet size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <span>New CMA Report</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
