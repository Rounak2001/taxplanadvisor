import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, FileText, Send, Bell, Clock, PartyPopper, 
  Search, CheckCircle2, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { messageTemplates } from '@/lib/mockData';

const CATEGORY_ICONS = {
  Reminders: Bell,
  Updates: Clock,
  Greetings: PartyPopper,
};

// Extended templates for the gallery
const allTemplates = [
  ...messageTemplates,
  {
    id: 'template_006',
    category: 'Reminders',
    name: 'Bank Statement Request',
    content: 'Dear {{client_name}}, please share your bank statement for {{month}} {{year}} for GST reconciliation.',
  },
  {
    id: 'template_007',
    category: 'Reminders',
    name: 'ITR Filing Deadline',
    content: 'Important: ITR filing deadline is {{deadline_date}}. Please ensure all documents are submitted by {{submission_date}}.',
  },
  {
    id: 'template_008',
    category: 'Updates',
    name: 'GST Return Filed',
    content: 'Your GST Return for {{period}} has been successfully filed. Reference number: {{reference}}.',
  },
  {
    id: 'template_009',
    category: 'Updates',
    name: 'Meeting Confirmation',
    content: 'Your consultation is confirmed for {{date}} at {{time}}. Join link: {{meeting_link}}',
  },
  {
    id: 'template_010',
    category: 'Greetings',
    name: 'Festival Greeting',
    content: 'Wishing you and your family a happy {{festival_name}}! - Team TaxPlan Advisor',
  },
];

export function TemplateGallery({ open, onClose, onSelectTemplate, client }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [copied, setCopied] = useState(false);

  const categories = ['all', ...new Set(allTemplates.map(t => t.category))];

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const fillPlaceholders = (content) => {
    return content
      .replace('{{client_name}}', client?.name || '[Client Name]')
      .replace('{{document_type}}', 'Bank Statement')
      .replace('{{deadline_date}}', 'January 20th')
      .replace('{{submission_date}}', 'January 18th')
      .replace('{{amount}}', '25,000')
      .replace('{{month}}', 'December')
      .replace('{{year}}', '2024')
      .replace('{{period}}', 'December 2024')
      .replace('{{reference}}', 'GST/2024/001234')
      .replace('{{date}}', 'Tomorrow')
      .replace('{{time}}', '3:00 PM')
      .replace('{{meeting_link}}', 'meet.taxplan.in/xyz')
      .replace('{{festival_name}}', 'Diwali');
  };

  const handleCopy = () => {
    if (selectedTemplate) {
      navigator.clipboard.writeText(fillPlaceholders(selectedTemplate.content));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate?.(fillPlaceholders(selectedTemplate.content));
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                <h2 className="font-semibold">WhatsApp Template Gallery</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={18} strokeWidth={1.5} />
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="w-full justify-start">
                  {categories.map(cat => (
                    <TabsTrigger key={cat} value={cat} className="capitalize">
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Template List */}
            <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
              <ScrollArea className="h-full pr-2">
                <div className="space-y-2">
                  {filteredTemplates.map(template => {
                    const Icon = CATEGORY_ICONS[template.category] || FileText;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border transition-colors',
                          selectedTemplate?.id === template.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/50'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={14} className="text-muted-foreground" />
                          <span className="font-medium text-sm">{template.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.content}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Preview Panel */}
              <div className="flex flex-col border border-border rounded-lg overflow-hidden">
                <div className="p-3 bg-muted/50 border-b border-border">
                  <h3 className="text-sm font-medium">Preview</h3>
                </div>
                {selectedTemplate ? (
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{selectedTemplate.category}</Badge>
                      <span className="text-sm font-medium">{selectedTemplate.name}</span>
                    </div>
                    <div className="flex-1 p-3 bg-success/10 rounded-lg text-sm">
                      {fillPlaceholders(selectedTemplate.content)}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1">
                        {copied ? (
                          <>
                            <CheckCircle2 size={14} className="mr-2 text-success" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={14} className="mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button size="sm" onClick={handleUseTemplate} className="flex-1">
                        <Send size={14} className="mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                    Select a template to preview
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
