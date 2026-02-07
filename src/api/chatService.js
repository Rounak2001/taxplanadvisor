/**
 * Chat Service - API functions for real-time chat
 */

import api from './axios';

// WebSocket base URL
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export const chatService = {
  // ========== AI Assistant Chat (Legacy) ==========
  sendMessage: async (prompt, history = []) => {
    const response = await api.post('/chat/', {
      prompt,
      history: history
    });
    return response.data;
  },

  sendBotQuery: async (query) => {
    const response = await api.post('/bot/send-query/', { query });
    return response.data;
  },

  saveBotLead: async (leadData) => {
    const response = await api.post('/bot/save-lead/', leadData);
    return response.data;
  },

  // ========== Real-time Chat ==========

  /**
   * Get all conversations for the current user
   */
  getConversations: async () => {
    const response = await api.get('/conversations/');
    return response.data;
  },

  /**
   * Get a specific conversation
   */
  getConversation: async (conversationId) => {
    const response = await api.get(`/conversations/${conversationId}/`);
    return response.data;
  },

  /**
   * Create a new conversation
   * For consultants: pass client_id
   * For clients: no params needed (uses assigned consultant)
   */
  createConversation: async (clientId = null) => {
    const payload = clientId ? { client_id: clientId } : {};
    const response = await api.post('/conversations/', payload);
    return response.data;
  },

  /**
   * Get messages for a conversation (paginated)
   */
  getMessages: async (conversationId, page = 1) => {
    const response = await api.get(`/conversations/${conversationId}/messages/`, {
      params: { page }
    });
    return response.data;
  },

  /**
   * Mark messages as read
   */
  markMessagesRead: async (conversationId) => {
    const response = await api.post(`/conversations/${conversationId}/read/`);
    return response.data;
  },

  /**
   * Get WebSocket token for authentication
   */
  getWebSocketToken: async () => {
    const response = await api.get('/auth/token/websocket/');
    return response.data?.token;
  },

  /**
   * Create WebSocket connection for a conversation
   */
  createWebSocket: async (conversationId) => {
    const token = await chatService.getWebSocketToken();
    if (!token) {
      throw new Error('Failed to get WebSocket token');
    }
    const wsUrl = `${WS_BASE_URL}/ws/chat/${conversationId}/?token=${token}`;
    return new WebSocket(wsUrl);
  },

  /**
   * Get available clients for new conversation (consultant only)
   */
  getAvailableClients: async () => {
    const response = await api.get('/consultant/clients/');
    return response.data;
  }
};

export default chatService;