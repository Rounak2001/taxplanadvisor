import { Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function TopBar() {
  const { 
    taxYear, 
    setTaxYear, 
    taxYearOptions, 
    setCommandPaletteOpen,
    sidebarCollapsed 
  } = useAppStore();

  return (
    <header 
      className="fixed top-0 right-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 transition-all duration-200"
      style={{ left: sidebarCollapsed ? 72 : 256 }}
    >
      {/* Left Section - Search */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="w-64 justify-start text-muted-foreground font-normal"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search size={16} strokeWidth={1.5} className="mr-2" />
          <span>Search...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Tax Year Selector */}
        <Select value={taxYear} onValueChange={setTaxYear}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {taxYearOptions.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} strokeWidth={1.5} />
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                variant="destructive"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">Document approved</span>
              <span className="text-xs text-muted-foreground">
                PAN Card for Rajesh Kumar has been approved
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">GST deadline approaching</span>
              <span className="text-xs text-muted-foreground">
                3 clients have GST filing due in 5 days
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium">New message received</span>
              <span className="text-xs text-muted-foreground">
                Sharma Textiles sent a new document
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  CA
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">CA Amit Shah</span>
                <span className="text-xs text-muted-foreground">Pro Plan</span>
              </div>
              <ChevronDown size={16} strokeWidth={1.5} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User size={16} strokeWidth={1.5} className="mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings size={16} strokeWidth={1.5} className="mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut size={16} strokeWidth={1.5} className="mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
