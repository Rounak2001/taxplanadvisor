import api from './axios';

export const chatService = {
  // AI Assistant Chat
  sendMessage: async (prompt, history = []) => {
    const response = await api.post('/chat/', {
      prompt,
      history: history
    });
    return response.data;
  },

  // Bot Queries
  sendBotQuery: async (query) => {
    const response = await api.post('/bot/send-query/', { query });
    return response.data;
  },

  // Leads
  saveBotLead: async (leadData) => {
    const response = await api.post('/bot/save-lead/', leadData);
    return response.data;
  }
};