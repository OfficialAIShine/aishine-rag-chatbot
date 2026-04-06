"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Sparkles, Settings, Send, Mic, MicOff,
  Menu, Plus, Search, Trash2, ArrowLeft, Download
} from 'lucide-react';
import { getConversations, deleteConversation, startNewConversation } from '../utils/api';
import { setCurrentConversationId } from '../utils/session';
import { BACKGROUND_MAP } from '../utils/constants';
import ChatMessage from './ChatMessage';
import toast from 'react-hot-toast';

const stripHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function ChatWidget({
  isWidgetMode = false,
  isMinimized,
  onToggle,
  onOpenSettings,
  onSelectConversation,
  onNewChat,
  currentConversationId,
  bedtimeMode = false,
  messages = [],
  input = '',
  setInput,
  loading = false,
  listening = false,
  onSend,
  onToggleListening,
  onExportPDF,
  feedback = {},
  copiedIndex = null,
  speaking = false,
  onFeedback,
  onCopy,
  onSpeak,
  onShare,
  onTellMeMore,
  fontSizeMap = {},
  fontSize = 'medium',
  // FIX: fontWeight was used in messagesAreaStyle but never destructured.
  // Result: always undefined → bold/italic never applied in widget mode.
  fontWeight = 'regular',
  bubbleColor,
  background = 'moon',
  isDarkMode = false,
}) {
  const [isExpanded, setIsExpanded] = useState(isWidgetMode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isWidgetMode) setIsExpanded(true);
  }, [isWidgetMode]);

  useEffect(() => {
    if ((isExpanded || isWidgetMode) && !isCollapsed && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded, isWidgetMode, isCollapsed]);

  useEffect(() => {
    if (showSidebar) loadConversations();
  }, [showSidebar]);

  useEffect(() => {
  if (!isWidgetMode) return;
  window.parent.postMessage(
    { type: 'AISHINE_WIDGET_STATE', collapsed: isCollapsed },
    '*'
  );
}, [isCollapsed, isWidgetMode]);

  const loadConversations = async () => {
    try {
      setSidebarLoading(true);
      const convs = await getConversations();
      setConversations(convs);
    } catch (error) {
      console.error('[WIDGET] Load conversations error:', error);
    } finally {
      setSidebarLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const result = await startNewConversation();
      setCurrentConversationId(result.conversation_id);
      if (onNewChat) onNewChat();
      setShowSidebar(false);
      toast.success('New chat started');
    } catch (error) {
      console.error('[WIDGET] New chat error:', error);
      toast.error('Failed to start new chat');
    }
  };

  const handleSelectConversation = (conversation) => {
    setCurrentConversationId(conversation.id);
    if (onSelectConversation) onSelectConversation(conversation);
    setShowSidebar(false);
  };

  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;
    try {
      await deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      toast.success('Deleted');
    } catch (error) {
      console.error('[WIDGET] Delete error:', error);
      toast.error('Failed to delete');
    }
  };

  const handleWidgetSend = () => {
    if (input?.trim() && onSend) onSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleWidgetSend();
    }
  };

  if (!isMinimized && !isWidgetMode) return null;

  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stripHtml(conv.last_message || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Styles ─────────────────────────────────────────────────────────────────
  const widgetButtonStyle = bedtimeMode
    ? 'bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bdc4,-4px_-4px_8px_#ffffff] text-[#1a0f08]'
    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg hover:shadow-xl';

  const cardStyle = bedtimeMode
    ? 'bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bdc4,-4px_-4px_8px_#ffffff]'
    : isDarkMode
      ? 'bg-gray-900/90 backdrop-blur-xl shadow-2xl border border-gray-700/50'
      : 'bg-white/60 backdrop-blur-xl shadow-2xl border border-gray-200/50';

  const inputStyle = bedtimeMode
    ? 'bg-[#d5dae1] shadow-[inset_2px_2px_4px_#b8bdc4,inset_-2px_-2px_4px_#ffffff] text-[#1a0f08] placeholder:text-gray-500'
    : isDarkMode
      ? 'bg-gray-800 text-white placeholder:text-gray-400'
      : 'bg-white/80 text-gray-900 placeholder:text-gray-500';

  const buttonHoverStyle = bedtimeMode
    ? 'hover:bg-[#d1d6dc] text-[#1a0f08]'
    : isDarkMode
      ? 'hover:bg-gray-700 text-gray-300'
      : 'hover:bg-black/8 text-gray-600';

  const textMuted    = bedtimeMode ? 'text-[#666]'     : isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderStyle  = bedtimeMode ? 'border-[#c8ced6]': isDarkMode ? 'border-gray-700' : 'border-gray-200/60';
  const headingStyle = bedtimeMode ? 'text-[#1a0f08]'  : isDarkMode ? 'text-white' : 'text-gray-800';

  const headerFooterBg = bedtimeMode
    ? 'bg-[#e0e5ec]'
    : isDarkMode
      ? 'bg-gray-900/80 backdrop-blur-sm'
      : 'bg-white/70 backdrop-blur-sm';

  // FIX: fontWeight now properly destructured above — bold/italic apply correctly.
  const messagesAreaStyle = {
    ...(bedtimeMode
      ? { background: '#e0e5ec' }
      : isDarkMode
        ? { background: 'rgba(17, 24, 39, 0.95)' }
        : { background: BACKGROUND_MAP[background] || BACKGROUND_MAP.moon }),
    fontWeight: fontWeight === 'bold' ? '700' : '400',
    fontStyle:  fontWeight === 'italic' ? 'italic' : 'normal',
  };

  // FIX: collapsed in widget mode → shrink container to bottom-right so
  // the button doesn't render at top-left of the iframe.
  const containerClasses = isWidgetMode
    ? (isCollapsed ? 'absolute bottom-4 right-4 z-50' : 'absolute inset-0 z-50')
    : 'fixed bottom-4 right-4 z-50';

  const cardClasses = isWidgetMode
    ? `w-full h-full rounded-2xl flex overflow-hidden ${cardStyle}`
    : `w-80 h-96 rounded-2xl flex overflow-hidden ${cardStyle}`;

  const WIDGET_MESSAGE_LIMIT = 15;
  const messageOffset  = isWidgetMode ? 0 : Math.max(0, messages.length - WIDGET_MESSAGE_LIMIT);
  const messagesToShow = isWidgetMode ? messages : messages.slice(messageOffset);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={containerClasses}
      >
        {isCollapsed ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setIsCollapsed(false)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              bedtimeMode
                ? 'bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bdc4,-4px_-4px_8px_#ffffff] text-[#8b5a3c]'
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white'
            }`}
            title="Open AI Shine"
          >
            <Sparkles className="w-5 h-5" />
          </motion.button>

        ) : (isExpanded || isWidgetMode) ? (
          <motion.div
            initial={!isWidgetMode ? { opacity: 0, scale: 0.9 } : false}
            animate={{ opacity: 1, scale: 1 }}
            exit={!isWidgetMode ? { opacity: 0, scale: 0.9 } : false}
            className={`${cardClasses} relative`}
          >
            {/* ── Inline Sidebar ── */}
            <AnimatePresence>
              {showSidebar && (
                <motion.div
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '-100%', opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute inset-0 z-10 flex flex-col rounded-2xl overflow-hidden ${
                    bedtimeMode ? 'bg-[#e0e5ec]' : isDarkMode ? 'bg-gray-900' : 'bg-white/90 backdrop-blur-xl'
                  }`}
                >
                  <div className={`flex items-center justify-between p-3 border-b flex-shrink-0 ${borderStyle}`}>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSidebar(false)}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${buttonHoverStyle}`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </motion.button>
                      <span className={`text-sm font-semibold ${headingStyle}`}>Chats</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={handleNewChat}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${widgetButtonStyle}`}
                      title="New Chat"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <div className="p-2 flex-shrink-0">
                    <div className="relative">
                      <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${textMuted}`} />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none ${inputStyle}`}
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {sidebarLoading ? (
                      <div className={`text-center py-6 text-xs ${textMuted}`}>Loading...</div>
                    ) : filteredConversations.length === 0 ? (
                      <div className={`text-center py-6 px-4 ${textMuted}`}>
                        <MessageCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">{searchQuery ? 'No results' : 'No chats yet'}</p>
                      </div>
                    ) : (
                      <div className="px-2 space-y-1">
                        {filteredConversations.map((conv) => (
                          <motion.div
                            key={conv.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`group relative p-2 rounded-lg cursor-pointer transition-all ${
                              conv.id === currentConversationId
                                ? bedtimeMode
                                  ? 'bg-[#d5dae1] shadow-[inset_1px_1px_2px_#b8bdc4,inset_-1px_-1px_2px_#ffffff]'
                                  : isDarkMode
                                    ? 'bg-purple-900/30 border-l-2 border-purple-500'
                                    : 'bg-purple-50 border-l-2 border-purple-500'
                                : bedtimeMode
                                  ? 'hover:bg-[#d5dae1]'
                                  : isDarkMode
                                    ? 'hover:bg-gray-800'
                                    : 'hover:bg-black/5'
                            }`}
                            onClick={() => handleSelectConversation(conv)}
                          >
                            <div className="flex items-start gap-2">
                              <MessageCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                                conv.id === currentConversationId
                                  ? bedtimeMode ? 'text-[#8b5a3c]' : 'text-purple-500'
                                  : textMuted
                              }`} />
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-xs font-medium truncate pr-5 ${headingStyle}`}>
                                  {conv.title || 'New chat'}
                                </h4>
                                {conv.last_message && (
                                  <p className={`text-[10px] truncate mt-0.5 ${textMuted}`}>
                                    {stripHtml(conv.last_message)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleDeleteConversation(conv.id, e)}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                                bedtimeMode ? 'hover:bg-red-200 text-red-600' : 'hover:bg-red-100 text-red-500'
                              }`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`p-2 border-t text-center flex-shrink-0 ${borderStyle}`}>
                    <p className={`text-[10px] ${textMuted}`}>
                      {conversations.length} chat{conversations.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Main Chat View ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

              {/* Header */}
              <div className={`flex items-center justify-between p-3 border-b flex-shrink-0 ${borderStyle} ${headerFooterBg}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSidebar(true)}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer flex-shrink-0 ${buttonHoverStyle}`}
                    title="Chat History"
                  >
                    <Menu className="w-4 h-4" />
                  </motion.button>
                  <Sparkles className={`w-4 h-4 flex-shrink-0 ${bedtimeMode ? 'text-[#8b5a3c]' : 'text-cyan-500'}`} />
                  <span className={`text-sm font-bold truncate ${headingStyle}`}>
                    AI<span className={bedtimeMode ? 'text-[#8b5a3c]' : 'text-cyan-500'}>SHINE</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={handleNewChat}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${buttonHoverStyle}`}
                    title="New Chat"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>

                  {onExportPDF && messages.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                      onClick={onExportPDF}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${buttonHoverStyle}`}
                      title="Download Chat"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={onOpenSettings}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${buttonHoverStyle}`}
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCollapsed(true)}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${buttonHoverStyle}`}
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide"
                style={messagesAreaStyle}
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <Sparkles className={`w-8 h-8 mb-3 opacity-60 ${bedtimeMode ? 'text-[#8b5a3c]' : 'text-purple-500'}`} />
                    <p className={`text-sm font-medium mb-1 ${headingStyle}`}>Welcome to AI Shine!</p>
                    <p className={`text-xs ${textMuted}`}>Ask me anything about AI & technology</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messagesToShow.map((msg, sliceIdx) => {
                      const originalIdx = messageOffset + sliceIdx;
                      return (
                        <ChatMessage
                          key={originalIdx}
                          message={msg}
                          index={originalIdx}
                          isUser={msg.role === 'human'}
                          isStreaming={msg.isStreaming}
                          feedback={feedback}
                          copiedIndex={copiedIndex}
                          speaking={speaking}
                          onFeedback={onFeedback}
                          onCopy={onCopy}
                          onSpeak={onSpeak}
                          onShare={onShare}
                          onTellMeMore={onTellMeMore}
                          fontSizeMap={fontSizeMap}
                          fontSize={fontSize}
                          bedtimeMode={bedtimeMode}
                          bubbleColor={bubbleColor}
                          isCompact={true}
                        />
                      );
                    })}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`p-2 border-t flex-shrink-0 ${borderStyle} ${headerFooterBg}`}>
                <div className="flex items-center gap-2">
                  <input
                    ref={textareaRef}
                    type="text"
                    value={input || ''}
                    onChange={(e) => setInput && setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={loading}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none transition-all min-w-0 ${inputStyle} ${loading ? 'opacity-50' : ''}`}
                  />

                  {onToggleListening && (
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={onToggleListening}
                      className={`p-2 rounded-lg transition-all cursor-pointer flex-shrink-0 ${
                        listening
                          ? 'bg-red-500 text-white'
                          : bedtimeMode
                            ? 'bg-[#d5dae1] shadow-[2px_2px_4px_#b8bdc4,-2px_-2px_4px_#ffffff] text-[#1a0f08]'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-white/80 text-gray-600'
                      }`}
                    >
                      {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleWidgetSend}
                    disabled={loading || !input?.trim()}
                    className={`p-2 rounded-lg transition-all cursor-pointer flex-shrink-0 ${
                      loading || !input?.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    } ${widgetButtonStyle}`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

        ) : (
          !isWidgetMode && (
            <motion.div className="flex flex-col items-end gap-2">
              <motion.div
                className={`relative flex items-center gap-2 p-2 rounded-xl cursor-pointer ${cardStyle}`}
                onClick={() => setIsExpanded(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className={`w-4 h-4 ${bedtimeMode ? 'text-[#8b5a3c]' : 'text-cyan-500'}`} />
                <span className={`text-xs font-bold ${headingStyle}`}>
                  AI<span className={bedtimeMode ? 'text-[#8b5a3c]' : 'text-cyan-500'}>SHINE</span>
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); if (onOpenSettings) onOpenSettings(); }}
                  className={`p-1.5 rounded-lg transition-all ${buttonHoverStyle}`}
                  title="Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
                  className={`p-1.5 rounded-lg transition-all ${widgetButtonStyle}`}
                  title="Open Chat"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </motion.button>
                {messages.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                  />
                )}
              </motion.div>
            </motion.div>
          )
        )}
      </motion.div>
    </AnimatePresence>
  );
}