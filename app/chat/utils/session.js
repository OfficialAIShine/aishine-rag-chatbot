/**
 * Session management for user identification.
 *
 * Priority order for session ID resolution:
 *   1. URL param ?session_id   → cross-origin iframe (parent site passes ID)
 *   2. localStorage            → same-origin, persists across browser sessions
 *   3. sessionStorage          → fallback when localStorage is blocked (Safari ITP)
 *
 * Session IDs are generated as UUIDs and stored client-side.
 * The backend receives them via X-Session-ID and X-Conversation-ID headers.
 */

const SESSION_KEY = 'ai_shine_session_id';
const CURRENT_CONV_KEY = 'ai_shine_current_conversation';

/**
 * Get or generate session ID.
 * @returns {string|null}
 */
export function getSessionId() {
  if (typeof window === 'undefined') return null;

  // 1. URL param — cross-origin iframe with parent-provided session
  const params = new URLSearchParams(window.location.search);
  const urlSessionId = params.get('session_id');
  if (urlSessionId) {
    console.log('[SESSION] URL session:', urlSessionId);
    return urlSessionId;
  }

  // 2. localStorage with sessionStorage fallback
  let sessionId = null;
  try {
    sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sessionId);
      console.log('[SESSION] New (localStorage):', sessionId);
    }
  } catch {
    // localStorage blocked (e.g. Safari ITP in cross-origin iframe)
    sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, sessionId);
      console.log('[SESSION] New (sessionStorage):', sessionId);
    }
  }

  return sessionId;
}

/**
 * Get current conversation ID.
 * Falls back to sessionStorage if localStorage is blocked.
 * @returns {string|null}
 */
export function getCurrentConversationId() {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(CURRENT_CONV_KEY) || sessionStorage.getItem(CURRENT_CONV_KEY);
  } catch {
    return sessionStorage.getItem(CURRENT_CONV_KEY);
  }
}

/**
 * Set or clear current conversation ID.
 * @param {string|null} conversationId
 */
export function setCurrentConversationId(conversationId) {
  if (typeof window === 'undefined') return;
  try {
    if (conversationId) {
      localStorage.setItem(CURRENT_CONV_KEY, conversationId);
    } else {
      localStorage.removeItem(CURRENT_CONV_KEY);
    }
  } catch {
    if (conversationId) {
      sessionStorage.setItem(CURRENT_CONV_KEY, conversationId);
    } else {
      sessionStorage.removeItem(CURRENT_CONV_KEY);
    }
  }
}

/**
 * Clear all session data (logout / hard reset).
 */
export function clearSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(CURRENT_CONV_KEY);
  } catch { /* noop */ }
  try {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(CURRENT_CONV_KEY);
  } catch { /* noop */ }
  console.log('[SESSION] Cleared');
}

/**
 * Build request headers with session + conversation IDs.
 * @returns {Record<string, string>}
 */
export function getApiHeaders() {
  const headers = { 'Content-Type': 'application/json' };

  const sessionId = getSessionId();
  if (sessionId) headers['X-Session-ID'] = sessionId;

  const conversationId = getCurrentConversationId();
  if (conversationId) headers['X-Conversation-ID'] = conversationId;

  return headers;
}




















// /**
//  * Session management for user identification
//  * Generates UUID on first visit, persists in localStorage
//  */

// const SESSION_KEY = 'ai_shine_session_id';
// const CURRENT_CONV_KEY = 'ai_shine_current_conversation';

// /**
//  * Get or generate session ID
//  * @returns {string} Session UUID
//  */
// export function getSessionId() {
//   if (typeof window === 'undefined') return null;
  
//   let sessionId = localStorage.getItem(SESSION_KEY);
  
//   if (!sessionId) {
//     sessionId = crypto.randomUUID();
//     localStorage.setItem(SESSION_KEY, sessionId);
//     console.log('[SESSION] Generated new:', sessionId);
//   }
  
//   return sessionId;
// }

// /**
//  * Get current conversation ID
//  * @returns {string|null}
//  */
// export function getCurrentConversationId() {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem(CURRENT_CONV_KEY);
// }

// /**
//  * Set current conversation ID
//  * @param {string} conversationId
//  */
// export function setCurrentConversationId(conversationId) {
//   if (typeof window === 'undefined') return;
//   if (conversationId) {
//     localStorage.setItem(CURRENT_CONV_KEY, conversationId);
//   } else {
//     localStorage.removeItem(CURRENT_CONV_KEY);
//   }
// }

// /**
//  * Clear session (logout/reset)
//  */
// export function clearSession() {
//   if (typeof window === 'undefined') return;
//   localStorage.removeItem(SESSION_KEY);
//   localStorage.removeItem(CURRENT_CONV_KEY);
//   console.log('[SESSION] Cleared');
// }

// /**
//  * Get headers with session + conversation IDs
//  * @returns {Object}
//  */
// export function getApiHeaders() {
//   const headers = {
//     'Content-Type': 'application/json',
//   };
  
//   const sessionId = getSessionId();
//   if (sessionId) {
//     headers['X-Session-ID'] = sessionId;
//   }
  
//   const conversationId = getCurrentConversationId();
//   if (conversationId) {
//     headers['X-Conversation-ID'] = conversationId;
//   }
  
//   return headers;
// }