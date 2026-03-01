/**
 * Format AI response text with proper HTML formatting
 * Converts markdown-like syntax to HTML
 */

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Format text with markdown-like syntax to HTML
 * @param {string} text - Raw text to format
 * @returns {string} HTML formatted text
 */
export function formatAIResponse(text) {
  if (!text || typeof text !== 'string') return '';

  let formatted = text;

  // First, escape HTML to prevent XSS (but we'll add our own HTML)
  // Don't escape because we want to allow the AI to use some HTML
  // formatted = escapeHtml(formatted);

  // Code blocks (```code```) - must be done before inline code
  formatted = formatted.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || '';
    return `<pre class="bg-gray-800 dark:bg-gray-900 text-gray-100 p-3 rounded-lg my-2 overflow-x-auto text-sm"><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code (`code`)
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400">$1</code>');

  // Bold (**text** or __text__)
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');
  formatted = formatted.replace(/__([^_]+)__/g, '<strong class="font-semibold">$1</strong>');

  // Italic (*text* or _text_) - must be after bold
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  formatted = formatted.replace(/(?<![_\w])_([^_]+)_(?![_\w])/g, '<em class="italic">$1</em>');

  // Strikethrough (~~text~~)
  formatted = formatted.replace(/~~([^~]+)~~/g, '<del class="line-through">$1</del>');

  // Headers (# Header)
  formatted = formatted.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-3 mb-1">$1</h3>');
  formatted = formatted.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>');
  formatted = formatted.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');

  // Blockquotes (> text)
  formatted = formatted.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-purple-500 pl-3 py-1 my-2 italic text-gray-600 dark:text-gray-400">$1</blockquote>');

  // Horizontal rule (--- or ***)
  formatted = formatted.replace(/^(-{3,}|\*{3,})$/gm, '<hr class="my-4 border-gray-300 dark:border-gray-600" />');

  // Unordered lists (- item or * item)
  formatted = formatted.replace(/^[\-\*] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Ordered lists (1. item)
  formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

  // Wrap consecutive list items in ul/ol tags
  formatted = formatted.replace(/(<li class="ml-4 list-disc">[\s\S]*?<\/li>)+/g, '<ul class="my-2 space-y-1">$&</ul>');
  formatted = formatted.replace(/(<li class="ml-4 list-decimal">[\s\S]*?<\/li>)+/g, '<ol class="my-2 space-y-1">$&</ol>');

  // Links [text](url)
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-600 dark:text-purple-400 hover:underline">$1</a>');

  // Line breaks - convert double newlines to paragraph breaks
  formatted = formatted.replace(/\n\n+/g, '</p><p class="mb-2">');

  // Single newlines to <br>
  formatted = formatted.replace(/\n/g, '<br />');

  // Wrap in paragraph if not already wrapped
  if (!formatted.startsWith('<')) {
    formatted = `<p class="mb-2">${formatted}</p>`;
  }

  // Clean up empty paragraphs
  formatted = formatted.replace(/<p class="mb-2"><\/p>/g, '');
  formatted = formatted.replace(/<p class="mb-2">(<h[1-3])/g, '$1');
  formatted = formatted.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
  formatted = formatted.replace(/<p class="mb-2">(<ul|<ol|<pre|<blockquote)/g, '$1');
  formatted = formatted.replace(/(<\/ul>|<\/ol>|<\/pre>|<\/blockquote>)<\/p>/g, '$1');

  return formatted;
}

/**
 * Strip HTML tags from text (for copy/TTS)
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}
