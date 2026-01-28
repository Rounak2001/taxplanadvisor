import api from './axios';

export const chatService = {
  sendMessage: async (prompt) => {
    const response = await api.post('/chat/', { prompt });
    return response.data;
  },

  // Future: Add conversation history, clear chat, etc.
};