// Chat/Bot API - TaxPlan Advisor
import { apiRequest } from './config';

/**
 * Send a chat message to AI assistant
 * POST /chat/
 */
export async function sendChatMessage(message, conversationHistory = []) {
  return apiRequest('/chat/', {
    method: 'POST',
    body: JSON.stringify({ 
      message,
      history: conversationHistory,
    }),
  });
}

/**
 * Send a query to the bot
 * POST /bot/send-query/
 */
export async function sendBotQuery(query) {
  return apiRequest('/bot/send-query/', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

/**
 * Save a lead from bot interaction
 * POST /bot/save-lead/
 */
export async function saveBotLead(leadData) {
  return apiRequest('/bot/save-lead/', {
    method: 'POST',
    body: JSON.stringify(leadData),
  });
}
