// /**
//  * API client for backend communication
//  */
// import { getApiHeaders, setCurrentConversationId } from './session';

// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// /**
//  * Send chat message with streaming
//  * @param {Array} chatHistory - Message history
//  * @param {Function} onChunk - Callback for each chunk
//  * @returns {Promise<Object>} Final response
//  */
// // export async function sendChatMessage(chatHistory, onChunk) {
// //   const response = await fetch(`${API_BASE_URL}/chat`, {
// //     method: 'POST',
// //     headers: getApiHeaders(),
// //     body: JSON.stringify({ chat_history: chatHistory }),
// //   });
// export async function sendChatMessage(chatHistory, onChunk) {
//   const headers = getApiHeaders();
//   headers['Content-Type'] = 'application/json';
  
//   const response = await fetch(`${API_BASE_URL}/chat`, {
//     method: 'POST',
//     headers: headers,
//     body: JSON.stringify({ chat_history: chatHistory }),
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//   }

//   // Extract conversation ID from response headers (if backend sends it)
//   // For now, we'll get it from the first successful response

//   const reader = response.body.getReader();
//   const decoder = new TextDecoder();
//   let fullContent = '';
//   let messageType = 'text';

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;

//     const chunk = decoder.decode(value, { stream: true });
//     const lines = chunk.split('\n');

//     for (const line of lines) {
//       if (!line.trim()) continue;

//       try {
//         const data = JSON.parse(line);

//         if (data.answer_chunk) {
//           fullContent += data.answer_chunk;
//           if (onChunk) onChunk(data.answer_chunk);
//         } else if (data.answer) {
//           fullContent = data.answer;
//           if (onChunk) onChunk(data.answer);
//         }

//         if (data.type) messageType = data.type;
//       } catch (e) {
//         console.error('[API] JSON parse error:', e);
//       }
//     }
//   }

//   return { content: fullContent, type: messageType };
// }

// /**
//  * Get list of conversations
//  * @param {number} limit
//  * @param {number} skip
//  * @returns {Promise<Array>}
//  */
// export async function getConversations(limit = 20, skip = 0) {
//   const response = await fetch(
//     `${API_BASE_URL}/api/conversations?limit=${limit}&skip=${skip}`,
//     {
//       method: 'GET',
//       headers: getApiHeaders(),
//     }
//   );

//   if (!response.ok) {
//     throw new Error('Failed to fetch conversations');
//   }

//   const data = await response.json();
//   return data.conversations;
// }

// /**
//  * Get full conversation by ID
//  * @param {string} conversationId
//  * @returns {Promise<Object>}
//  */
// export async function getConversation(conversationId) {
//   const response = await fetch(
//     `${API_BASE_URL}/api/conversations/${conversationId}`,
//     {
//       method: 'GET',
//       headers: getApiHeaders(),
//     }
//   );

//   if (!response.ok) {
//     throw new Error('Failed to fetch conversation');
//   }

//   return response.json();
// }

// /**
//  * Delete conversation
//  * @param {string} conversationId
//  * @returns {Promise<Object>}
//  */
// export async function deleteConversation(conversationId) {
//   const response = await fetch(
//     `${API_BASE_URL}/api/conversations/${conversationId}`,
//     {
//       method: 'DELETE',
//       headers: getApiHeaders(),
//     }
//   );

//   if (!response.ok) {
//     throw new Error('Failed to delete conversation');
//   }

//   return response.json();
// }

// /**
//  * Start new conversation (clears backend memory)
//  * @returns {Promise<Object>}
//  */
// export async function startNewConversation() {
//   const response = await fetch(`${API_BASE_URL}/api/conversations/new`, {
//     method: 'POST',
//     headers: getApiHeaders(),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to start new conversation');
//   }

//   const data = await response.json();
  
//   // Update current conversation ID
//   setCurrentConversationId(data.conversation_id);
  
//   return data;
// }











/**
 * API client for backend communication
 */
import { getApiHeaders, setCurrentConversationId } from './session';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * Send chat message with streaming.
 * Backend StreamChunk schema:
 *   { token: string, type: "token" | "done" | "error", message?: string }
 *
 * - type="token"  → append token to content, fire onChunk
 * - type="done"   → stream complete, stop reading
 * - type="error"  → backend error mid-stream, throw so page.js shows error UI
 */
export async function sendChatMessage(chatHistory, onChunk) {
  const headers = getApiHeaders();
  headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ chat_history: chatHistory }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';
  let messageType = 'text';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const raw = decoder.decode(value, { stream: true });
      const lines = raw.split('\n');

      for (const line of lines) {
        if (!line.trim()) continue;

        let data;
        try {
          data = JSON.parse(line);
        } catch (e) {
          // Non-JSON line (e.g. keep-alive) — skip silently
          console.warn('[API] Non-JSON line skipped:', line);
          continue;
        }

        // StreamChunk: type="token" — normal streaming token
        if (data.type === 'token' && data.token) {
          fullContent += data.token;
          if (onChunk) onChunk(data.token);
          continue;
        }

        // StreamChunk: type="done" — stream complete
        if (data.type === 'done') {
          return { content: fullContent, type: messageType };
        }

        // StreamChunk: type="error" — backend error mid-stream
        if (data.type === 'error') {
          throw new Error(data.message || 'Stream error from server');
        }

        // Legacy fallback — handles old backend key shapes during transition
        if (data.answer_chunk) {
          fullContent += data.answer_chunk;
          if (onChunk) onChunk(data.answer_chunk);
        } else if (data.answer) {
          fullContent = data.answer;
          if (onChunk) onChunk(data.answer);
        }

        if (data.type && data.type !== 'token' && data.type !== 'done' && data.type !== 'error') {
          messageType = data.type;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return { content: fullContent, type: messageType };
}

/**
 * Get list of conversations
 */
export async function getConversations(limit = 20, skip = 0) {
  const response = await fetch(
    `${API_BASE_URL}/api/conversations?limit=${limit}&skip=${skip}`,
    {
      method: 'GET',
      headers: getApiHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }

  const data = await response.json();
  return data.conversations;
}

/**
 * Get full conversation by ID
 */
export async function getConversation(conversationId) {
  const response = await fetch(
    `${API_BASE_URL}/api/conversations/${conversationId}`,
    {
      method: 'GET',
      headers: getApiHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch conversation');
  }

  return response.json();
}

/**
 * Delete conversation
 */
export async function deleteConversation(conversationId) {
  const response = await fetch(
    `${API_BASE_URL}/api/conversations/${conversationId}`,
    {
      method: 'DELETE',
      headers: getApiHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete conversation');
  }

  return response.json();
}

/**
 * Start new conversation
 */
export async function startNewConversation() {
  const response = await fetch(`${API_BASE_URL}/api/conversations/new`, {
    method: 'POST',
    headers: getApiHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to start new conversation');
  }

  const data = await response.json();
  setCurrentConversationId(data.conversation_id);
  return data;
}