import { useState } from 'react';
import { Send, Bot, User, Sparkles, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/useAppStore';

const suggestedPrompts = [
  'What are the GST filing deadlines for this quarter?',
  'Explain Section 80C deductions for FY 2024-25',
  'How to calculate advance tax installments?',
  'What documents are required for ITR-3 filing?',
];

const initialMessages = [
  {
    id: '1',
    role: 'assistant',
    content: `Hello! I'm your AI Tax Assistant. I can help you with:

• GST filing queries and deadlines
• Income tax calculations and deductions
• TDS compliance questions
• Financial ratio analysis
• Document requirements

How can I assist you today?`,
    timestamp: new Date().toISOString(),
  },
];

export default function AIChat() {
  const { consultantId } = useAppStore();
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(content),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (query) => {
    if (query.toLowerCase().includes('gst')) {
      return `For GST filing deadlines in the current quarter:

**GSTR-1 (Outward Supplies)**
• Monthly filers: 11th of the following month
• Quarterly filers (QRMP): 13th of the month following the quarter

**GSTR-3B (Summary Return)**
• Monthly filers: 20th of the following month
• Quarterly filers: 22nd/24th of the month following the quarter

**Key Dates for January 2025:**
• GSTR-1: January 11, 2025
• GSTR-3B: January 20, 2025

Would you like me to set reminders for your clients or help with any specific filing?`;
    }

    if (query.toLowerCase().includes('80c')) {
      return `**Section 80C Deductions for FY 2024-25**

Maximum deduction limit: **₹1,50,000**

**Eligible Investments:**
• Employee Provident Fund (EPF)
• Public Provident Fund (PPF)
• Life Insurance Premium
• ELSS Mutual Funds (3-year lock-in)
• NSC (National Savings Certificate)
• 5-year Tax Saving FD
• Sukanya Samriddhi Yojana
• Home Loan Principal Repayment
• Tuition Fees (2 children max)

**Pro Tip:** ELSS funds offer the shortest lock-in period among 80C investments while providing equity exposure for wealth creation.

Shall I help calculate optimal 80C investment allocation for any of your clients?`;
    }

    return `Thank you for your query. Based on the current tax regulations and your question about "${query.slice(0, 50)}...", here's what you need to know:

This is a simulated response. In the full version, I would provide:

1. **Detailed explanation** of the relevant tax provisions
2. **Step-by-step guidance** for compliance
3. **Relevant deadlines** and timelines
4. **Documentation requirements**
5. **Links to official resources** (if applicable)

Is there anything specific about this topic you'd like me to elaborate on?`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-card rounded-lg border border-border overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot size={20} strokeWidth={1.5} className="text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">AI Tax Assistant</h2>
            <p className="text-sm text-muted-foreground">Powered by TaxPlan AI</p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            <Sparkles size={12} className="mr-1" />
            Beta
          </Badge>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' && 'flex-row-reverse'
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={cn(
                      message.role === 'assistant'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <Bot size={16} strokeWidth={1.5} />
                    ) : (
                      <User size={16} strokeWidth={1.5} />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-4',
                    message.role === 'assistant'
                      ? 'bg-muted'
                      : 'bg-primary text-primary-foreground'
                  )}
                >
                  <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                    {message.content}
                  </div>
                  
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Copy size={14} strokeWidth={1.5} className="mr-1" />
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ThumbsUp size={14} strokeWidth={1.5} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ThumbsDown size={14} strokeWidth={1.5} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot size={16} strokeWidth={1.5} />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask anything about tax, GST, compliance..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send size={16} strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Suggested Prompts */}
      <div className="w-80 shrink-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Suggested Questions</CardTitle>
            <CardDescription>Click to ask instantly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => handleSendMessage(prompt)}
              >
                <Sparkles size={14} strokeWidth={1.5} className="mr-2 shrink-0 text-primary" />
                <span className="text-sm">{prompt}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Knowledge Base</CardTitle>
            <CardDescription>AI trained on latest tax laws</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Income Tax Act 1961</p>
              <p>• GST Act & Rules 2017</p>
              <p>• Finance Act 2024</p>
              <p>• CBDT Circulars & Notifications</p>
              <p>• Case Laws & Precedents</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
