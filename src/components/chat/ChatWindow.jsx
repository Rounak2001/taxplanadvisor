/**
 * ChatWindow Component
 * Real-time chat interface with WebSocket integration
 * Using Tailwind CSS and ShadCN UI components
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { chatService } from '@/api/chatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
    MessageSquare,
    Plus,
    Send,
    Wifi,
    WifiOff,
    Loader2,
    X,
    User,
    Check,
    CheckCheck
} from 'lucide-react';

export default function ChatWindow({ conversationId: propConversationId }) {
    const { user } = useAuthStore();
    const {
        activeConversationId,
        messages,
        conversations,
        isLoadingConversations,
        isLoadingMessages,
        connectionStatus,
        setConversations,
        setActiveConversation,
        setMessages,
        addMessage,
        updateMessage,
        removeMessage,
        clearMessages,
        setLoadingConversations,
        setLoadingMessages,
        setConnectionStatus,
        updateConversationLastMessage,
    } = useChatStore();

    const [messageInput, setMessageInput] = useState('');
    const [error, setError] = useState(null);
    const [showNewConversation, setShowNewConversation] = useState(false);
    const [availableClients, setAvailableClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [partnerOnline, setPartnerOnline] = useState(false);
    const [allMessagesRead, setAllMessagesRead] = useState(false);
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const currentConversationId = propConversationId || activeConversationId;

    // Scroll to bottom when messages change
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Fetch conversations list
    const fetchConversations = useCallback(async () => {
        setLoadingConversations(true);
        try {
            const data = await chatService.getConversations();
            setConversations(data);
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
            setError('Failed to load conversations');
        } finally {
            setLoadingConversations(false);
        }
    }, [setConversations, setLoadingConversations]);

    // Fetch messages for active conversation
    const fetchMessages = useCallback(async (convId) => {
        if (!convId) return;

        setLoadingMessages(true);
        clearMessages();
        try {
            const data = await chatService.getMessages(convId);
            setMessages(data.results || data);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setError('Failed to load messages');
        } finally {
            setLoadingMessages(false);
        }
    }, [setMessages, setLoadingMessages, clearMessages]);

    // Connect WebSocket
    const connectWebSocket = useCallback(async (convId) => {
        if (!convId || !user) return;

        if (wsRef.current) {
            wsRef.current.close();
        }

        setConnectionStatus('connecting');
        setPartnerOnline(false);

        try {
            const ws = await chatService.createWebSocket(convId);
            wsRef.current = ws;

            ws.onopen = () => {
                setConnectionStatus('connected');
                setError(null);
                // Mark messages as read when opening conversation
                ws.send(JSON.stringify({ type: 'mark_read' }));
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('WS received:', data.type, data);

                    // Handle different event types
                    if (data.type === 'presence') {
                        // Other user joined/left - ignore self
                        if (data.user_id !== user?.id) {
                            setPartnerOnline(data.status === 'online');
                        }
                    } else if (data.type === 'read_receipt') {
                        // Other user read our messages
                        if (data.reader_id !== user?.id) {
                            setAllMessagesRead(true);
                        }
                    } else if (data.type === 'error') {
                        // Handle errors from server
                        console.error('Server error:', data.message);
                        setError(data.message);
                    } else if (data.type === 'typing') {
                        // Typing indicator (future enhancement)
                        // setPartnerTyping(data.user_id !== user?.id && data.is_typing);
                    } else if (data.type === 'message') {
                        // New message received
                        // Backend sends temp_id (snake_case), we need to match with our tempId
                        if (data.sender_id === user?.id && data.temp_id) {
                            // This is confirmation of our own message - update tempId with real data
                            console.log('Updating temp message:', data.temp_id, 'with id:', data.id);
                            updateMessage(data.temp_id, { ...data, tempId: undefined });
                        } else if (data.sender_id !== user?.id) {
                            // Message from other user
                            console.log('Adding message from other user:', data.id);
                            addMessage(data);
                            updateConversationLastMessage(convId, data);
                            // Mark as read immediately
                            if (ws.readyState === WebSocket.OPEN) {
                                ws.send(JSON.stringify({ type: 'mark_read' }));
                            }
                        }
                    }
                } catch (err) {
                    console.error('Failed to parse message:', err);
                }
            };

            ws.onclose = (event) => {
                setConnectionStatus('disconnected');
                setPartnerOnline(false);
                if (event.code !== 1000 && event.code !== 4001 && event.code !== 4003) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectWebSocket(convId);
                    }, 3000);
                }
            };

            ws.onerror = () => {
                setConnectionStatus('error');
            };
        } catch (err) {
            console.error('WebSocket connection failed:', err);
            setConnectionStatus('error');
            setError('Failed to connect to chat');
        }
    }, [user, setConnectionStatus, addMessage, updateMessage, updateConversationLastMessage]);

    // Initialize
    useEffect(() => {
        fetchConversations();
        return () => {
            if (wsRef.current) wsRef.current.close(1000);
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        };
    }, [fetchConversations]);

    // Handle conversation change
    const currentConvIdRef = useRef(currentConversationId);

    useEffect(() => {
        if (currentConversationId && currentConversationId !== currentConvIdRef.current) {
            currentConvIdRef.current = currentConversationId;
        }

        if (currentConversationId) {
            setAllMessagesRead(false);  // Reset read status for new conversation
            fetchMessages(currentConversationId);
            connectWebSocket(currentConversationId);
        }

        return () => {
            if (wsRef.current) wsRef.current.close(1000);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentConversationId]);

    // Send message
    const handleSendMessage = useCallback((e) => {
        e.preventDefault();
        const content = messageInput.trim();
        if (!content || !wsRef.current || connectionStatus !== 'connected') return;

        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Optimistic update - add message immediately
        const tempMessage = {
            tempId,
            sender_id: user?.id,
            sender_username: user?.username,
            content,
            timestamp: new Date().toISOString(),
            is_read: false,
        };
        addMessage(tempMessage);

        // Send with tempId for server to echo back
        wsRef.current.send(JSON.stringify({
            type: 'message',
            content,
            tempId
        }));
        setMessageInput('');
    }, [messageInput, connectionStatus, user, addMessage]);

    // Handle conversation selection
    const handleSelectConversation = useCallback((convId) => {
        setActiveConversation(convId);
        setShowNewConversation(false);
    }, [setActiveConversation]);

    // Fetch available clients
    const fetchAvailableClients = useCallback(async () => {
        if (user?.role !== 'CONSULTANT') return;

        setLoadingClients(true);
        try {
            const data = await chatService.getAvailableClients();
            setAvailableClients(data || []);
        } catch (err) {
            console.error('Failed to fetch clients:', err);
        } finally {
            setLoadingClients(false);
        }
    }, [user?.role]);

    // Start new conversation
    const handleStartConversation = useCallback(async (clientId) => {
        try {
            const newConversation = await chatService.createConversation(clientId);
            await fetchConversations();
            setActiveConversation(newConversation.id);
            setShowNewConversation(false);
        } catch (err) {
            console.error('Failed to create conversation:', err);
            setError('Failed to start conversation');
        }
    }, [fetchConversations, setActiveConversation]);

    // Client start conversation
    const handleClientStartConversation = useCallback(async () => {
        try {
            const newConversation = await chatService.createConversation();
            await fetchConversations();
            setActiveConversation(newConversation.id);
        } catch (err) {
            console.error('Failed to create conversation:', err);
            setError(err.response?.data?.error || 'Failed to start conversation');
        }
    }, [fetchConversations, setActiveConversation]);

    // Get partner name
    const getPartnerName = (conversation) => {
        if (!user || !conversation) return 'Unknown';
        const partner = user.role === 'CONSULTANT' ? conversation.client : conversation.consultant;
        if (partner?.first_name || partner?.last_name) {
            return `${partner.first_name || ''} ${partner.last_name || ''}`.trim();
        }
        return partner?.username || 'Unknown';
    };

    // Connection/Presence status indicator
    const ConnectionStatus = () => {
        if (connectionStatus !== 'connected') {
            const config = {
                connecting: { icon: Loader2, color: 'text-yellow-500', text: 'Connecting...', animate: true, bg: 'bg-yellow-500/10' },
                disconnected: { icon: WifiOff, color: 'text-gray-400', text: 'Offline', bg: 'bg-gray-500/10' },
                error: { icon: WifiOff, color: 'text-red-500', text: 'Reconnecting...', bg: 'bg-red-500/10' },
            };
            const status = config[connectionStatus] || config.disconnected;
            const Icon = status.icon;
            return (
                <div className={cn('flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full', status.bg)}>
                    <Icon className={cn('h-3 w-3', status.color, status.animate && 'animate-spin')} />
                    <span className={status.color}>{status.text}</span>
                </div>
            );
        }

        // When connected, show partner presence
        return (
            <span className={cn(
                'text-xs',
                partnerOnline ? 'text-green-600' : 'text-gray-400'
            )}>
                {partnerOnline ? 'Online' : 'Offline'}
            </span>
        );
    };

    return (
        <div className="flex h-full rounded-xl overflow-hidden border border-border bg-background shadow-sm">
            {/* Sidebar */}
            <div className="w-72 min-w-[280px] border-r border-border bg-muted/30 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Conversations</h3>
                    <Button
                        size="icon"
                        variant="default"
                        className="h-7 w-7 rounded-full"
                        onClick={() => {
                            setShowNewConversation(true);
                            if (user?.role === 'CONSULTANT') fetchAvailableClients();
                        }}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* Conversation List */}
                <ScrollArea className="flex-1">
                    {isLoadingConversations ? (
                        <div className="p-4 space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-1.5 flex-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No conversations yet</p>
                            <Button
                                variant="link"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    setShowNewConversation(true);
                                    if (user?.role === 'CONSULTANT') fetchAvailableClients();
                                }}
                            >
                                Start your first chat
                            </Button>
                        </div>
                    ) : (
                        <div className="p-2">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv.id)}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                                        'hover:bg-muted',
                                        conv.id === currentConversationId && 'bg-primary/10 border-l-2 border-primary'
                                    )}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white text-sm">
                                            {getPartnerName(conv).charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {getPartnerName(conv)}
                                        </p>
                                        {conv.last_message && (
                                            <p className="text-xs text-muted-foreground truncate">
                                                {conv.last_message.content}
                                            </p>
                                        )}
                                    </div>
                                    {conv.unread_count > 0 && (
                                        <Badge variant="default" className="h-5 min-w-[20px] px-1.5">
                                            {conv.unread_count}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {showNewConversation ? (
                    /* New Conversation Panel */
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{user?.role === 'CONSULTANT' ? 'Start New Chat' : 'Chat with CA'}</span>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        onClick={() => setShowNewConversation(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user?.role === 'CONSULTANT' ? (
                                    loadingClients ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <Skeleton key={i} className="h-14 w-full" />
                                            ))}
                                        </div>
                                    ) : availableClients.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-8">
                                            No clients assigned yet
                                        </p>
                                    ) : (
                                        <ScrollArea className="max-h-64">
                                            <div className="space-y-2">
                                                {availableClients.map((client) => (
                                                    <div
                                                        key={client.id}
                                                        onClick={() => handleStartConversation(client.id)}
                                                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted border border-transparent hover:border-border"
                                                    >
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                                                                {(client.name || 'U').charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm">
                                                                {client.name || client.email}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {client.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    )
                                ) : (
                                    <div className="text-center py-4">
                                        <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <p className="text-muted-foreground mb-4">
                                            Connect with your assigned CA
                                        </p>
                                        <Button onClick={handleClientStartConversation}>
                                            Start Chat with CA
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : !currentConversationId ? (
                    /* No Conversation Selected */
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
                        <p>Select a conversation to start chatting</p>
                        <p className="text-sm mt-1 opacity-70">or click + to start a new conversation</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white text-sm">
                                        {conversations.find(c => c.id === currentConversationId)
                                            ? getPartnerName(conversations.find(c => c.id === currentConversationId)).charAt(0).toUpperCase()
                                            : '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold text-sm">
                                        {conversations.find(c => c.id === currentConversationId)
                                            ? getPartnerName(conversations.find(c => c.id === currentConversationId))
                                            : 'Chat'}
                                    </h4>
                                    <ConnectionStatus />
                                </div>
                            </div>
                        </div>

                        {/* Messages Area - WhatsApp-like background */}
                        <ScrollArea className="flex-1 p-4 bg-[#e5ddd5]">
                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                    {error}
                                </div>
                            )}

                            {isLoadingMessages ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-end' : 'justify-start')}>
                                            <Skeleton className="h-12 w-48 rounded-2xl" />
                                        </div>
                                    ))}
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((msg, index) => {
                                        const senderId = msg.sender_id || msg.sender?.id;
                                        const isSent = senderId === user?.id;

                                        return (
                                            <div
                                                key={msg.id || msg.tempId || index}
                                                className={cn('flex gap-2', isSent ? 'justify-end' : 'justify-start')}
                                            >
                                                {/* Avatar for received messages */}
                                                {!isSent && (
                                                    <Avatar className="h-7 w-7 flex-shrink-0 mt-1">
                                                        <AvatarFallback className="bg-slate-500 text-white text-xs">
                                                            {(msg.sender?.first_name || msg.sender_username || 'U').charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div
                                                    className={cn(
                                                        'max-w-[70%] px-3 py-2 rounded-lg shadow-sm relative',
                                                        isSent
                                                            ? 'bg-[#dcf8c6] text-gray-900 rounded-tr-none'  // WhatsApp green
                                                            : 'bg-white text-gray-900 rounded-tl-none border border-gray-100',
                                                        msg.tempId && 'opacity-70'
                                                    )}
                                                >
                                                    <p className="text-[14px] leading-relaxed break-words">
                                                        {msg.content}
                                                    </p>
                                                    <div className={cn(
                                                        'flex items-center gap-1 mt-0.5',
                                                        isSent ? 'justify-end' : 'justify-start'
                                                    )}>
                                                        <span className="text-[11px] text-gray-500">
                                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                        {/* Sent indicator for own messages */}
                                                        {isSent && (
                                                            msg.tempId
                                                                ? <Check className="h-3.5 w-3.5 text-gray-400" />  // Sending
                                                                : (msg.is_read || allMessagesRead)
                                                                    ? <CheckCheck className="h-3.5 w-3.5 text-blue-500" />  // Read
                                                                    : <CheckCheck className="h-3.5 w-3.5 text-gray-400" />  // Sent
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </ScrollArea>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                            <div className="flex gap-2">
                                <Input
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    disabled={connectionStatus !== 'connected'}
                                    className="flex-1 rounded-full"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!messageInput.trim() || connectionStatus !== 'connected'}
                                    className="rounded-full h-10 w-10"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
