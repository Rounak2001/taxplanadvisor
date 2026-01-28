import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Copy, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/useAppStore';
import { chatService } from '@/api/chatService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

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
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (content) => {
    if (!content.trim() || isTyping) return;

    // Validate input
    const trimmedContent = content.trim();
    if (trimmedContent.length > 2000) {
      toast.error('Message is too long. Maximum 2000 characters.');
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedContent,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setSuggestedQuestions([]);
    setIsTyping(true);

    try {
      const response = await chatService.sendMessage(trimmedContent);

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response || 'No response received',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setSuggestedQuestions(response.follow_ups || []);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Could not reach the server. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error(error.message || 'Failed to get response');
    } finally {
      setIsTyping(false);
    }
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
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline hover:opacity-80"
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="mb-2 last:mb-0" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="pl-4 my-2 list-disc space-y-1" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="pl-4 my-2 list-decimal space-y-1" {...props} />
                        ),
                        code: ({ node, inline, ...props }) => (
                          inline
                            ? <code className="px-1.5 py-0.5 rounded text-xs bg-background/50" {...props} />
                            : <code className="block p-3 my-2 rounded-lg bg-background/50 text-xs overflow-x-auto" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-semibold" {...props} />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
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
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Suggested Questions</CardTitle>
            <CardDescription>Click to ask instantly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedQuestions.length > 0 ? (
              suggestedQuestions.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4 whitespace-normal"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isTyping}
                >
                  <Sparkles size={14} strokeWidth={1.5} className="mr-2 shrink-0 text-primary" />
                  <span className="text-sm break-words">{prompt}</span>
                </Button>
              ))
            ) : (
              suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4 whitespace-normal"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isTyping}
                >
                  <Sparkles size={14} strokeWidth={1.5} className="mr-2 shrink-0 text-primary" />
                  <span className="text-sm break-words">{prompt}</span>
                </Button>
              ))
            )}
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
