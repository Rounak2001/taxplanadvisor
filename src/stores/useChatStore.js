/**
 * Chat Store - Zustand state management for real-time chat
 * Manages conversations, messages, and WebSocket connection state
 */

import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
    // State
    activeConversationId: null,
    messages: [],
    conversations: [],
    isLoadingConversations: false,
    isLoadingMessages: false,
    connectionStatus: 'disconnected', // 'disconnected' | 'connecting' | 'connected' | 'error'

    // Actions

    /**
     * Set the list of conversations (sidebar)
     */
    setConversations: (conversations) => set({ conversations }),

    /**
     * Set the active conversation ID
     */
    setActiveConversation: (id) => set({ activeConversationId: id }),

    /**
     * Set messages (initial REST load)
     */
    setMessages: (messages) => set({ messages }),

    /**
     * Add a single message (real-time or optimistic)
     */
    addMessage: (message) => set((state) => {
        // Prevent duplicates (check by id if it exists)
        if (message.id && state.messages.some(m => m.id === message.id)) {
            return state;
        }
        return { messages: [...state.messages, message] };
    }),

    /**
     * Update a temporary message with server response (for optimistic updates)
     */
    updateMessage: (tempId, serverMessage) => set((state) => ({
        messages: state.messages.map(m =>
            m.tempId === tempId ? { ...serverMessage, tempId: undefined } : m
        )
    })),

    /**
     * Remove a message (for failed sends)
     */
    removeMessage: (tempId) => set((state) => ({
        messages: state.messages.filter(m => m.tempId !== tempId)
    })),

    /**
     * Set loading state for conversations
     */
    setLoadingConversations: (isLoading) => set({ isLoadingConversations: isLoading }),

    /**
     * Set loading state for messages
     */
    setLoadingMessages: (isLoading) => set({ isLoadingMessages: isLoading }),

    /**
     * Set WebSocket connection status
     */
    setConnectionStatus: (status) => set({ connectionStatus: status }),

    /**
     * Clear messages when switching conversations
     */
    clearMessages: () => set({ messages: [] }),

    /**
     * Update last message in conversation list (for sidebar preview)
     */
    updateConversationLastMessage: (conversationId, message) => set((state) => ({
        conversations: state.conversations.map(conv =>
            conv.id === conversationId
                ? {
                    ...conv,
                    last_message: {
                        content: message.content.slice(0, 100),
                        timestamp: message.timestamp,
                        sender_id: message.sender_id,
                    },
                    updated_at: message.timestamp,
                }
                : conv
        )
    })),

    /**
     * Reset chat state (on logout or error)
     */
    reset: () => set({
        activeConversationId: null,
        messages: [],
        conversations: [],
        isLoadingConversations: false,
        isLoadingMessages: false,
        connectionStatus: 'disconnected',
    }),
}));
