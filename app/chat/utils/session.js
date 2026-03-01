/**
 * Session management for user identification
 * Generates UUID on first visit, persists in localStorage
 */

const SESSION_KEY = 'ai_shine_session_id';
const CURRENT_CONV_KEY = 'ai_shine_current_conversation';

/**
 * Get or generate session ID
 * @returns {string} Session UUID
 */
export function getSessionId() {
  if (typeof window === 'undefined') return null;
  
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
    console.log('[SESSION] Generated new:', sessionId);
  }
  
  return sessionId;
}

/**
 * Get current conversation ID
 * @returns {string|null}
 */
export function getCurrentConversationId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_CONV_KEY);
}

/**
 * Set current conversation ID
 * @param {string} conversationId
 */
export function setCurrentConversationId(conversationId) {
  if (typeof window === 'undefined') return;
  if (conversationId) {
    localStorage.setItem(CURRENT_CONV_KEY, conversationId);
  } else {
    localStorage.removeItem(CURRENT_CONV_KEY);
  }
}

/**
 * Clear session (logout/reset)
 */
export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(CURRENT_CONV_KEY);
  console.log('[SESSION] Cleared');
}

/**
 * Get headers with session + conversation IDs
 * @returns {Object}
 */
export function getApiHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const sessionId = getSessionId();
  if (sessionId) {
    headers['X-Session-ID'] = sessionId;
  }
  
  const conversationId = getCurrentConversationId();
  if (conversationId) {
    headers['X-Conversation-ID'] = conversationId;
  }
  
  return headers;
}