"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, Settings, Send, Mic, MicOff, Maximize2, Menu, Plus, Search, Trash2, ArrowLeft } from 'lucide-react';
import { getConversations, deleteConversation, startNewConversation } from '../utils/api';
import { setCurrentConversationId } from '../utils/session';
import toast from 'react-hot-toast';

export default function ChatWidget({
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
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll messages in widget
  useEffect(() => {
    if (isExpanded && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  // Load conversations when sidebar opens
  useEffect(() => {
    if (showSidebar) {
      loadConversations();
    }
  }, [showSidebar]);

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

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Widget button styles
  const widgetButtonStyle = bedtimeMode
    ? 'bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bdc4,-4px_-4px_8px_#ffffff] text-[#1a0f08] hover:shadow-[2px_2px_4px_#b8bdc4,-2px_-2px_4px_#ffffff]'
    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg hover:shadow-xl';

  const cardStyle = bedtimeMode
    ? 'bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bdc4,-4px_-4px_8px_#ffffff]'
    : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50';

  const inputStyle = bedtimeMode
    ? 'bg-[#d5dae1] shadow-[inset_2px_2px_4px_#b8bdc4,inset_-2px_-2px_4px_#ffffff] text-[#1a0f08]'
    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white';

  const buttonHoverStyle = bedtimeMode
    ? 'hover:bg-[#d1d6dc] text-[#1a0f08]'
    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300';

  const textMuted = bedtimeMode ? 'text-[#666]' : 'text-gray-500 dark:text-gray-400';

  const handleWidgetSend = () => {
    if (input?.trim() && onSend) {
      onSend();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleWidgetSend();
    }
  };

  if (!isMinimized) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 right-4 z-50"
      >
        {/* Expanded Widget - Functional Chat */}
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`w-80 h-96 rounded-2xl flex overflow-hidden ${cardStyle}`}
          >
            {/* Inline Sidebar */}
            <AnimatePresence>
              {showSidebar && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute inset-0 z-10 flex flex-col rounded-2xl overflow-hidden ${
                    bedtimeMode ? 'bg-[#e0e5ec]' : 'bg-white dark:bg-gray-900'
                  }`}
                >
                  {/* Sidebar Header */}
                  <div className={`flex items-center justify-between p-3 border-b ${
                    bedtimeMode ? 'border-[#c8ced6]' : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSidebar(false)}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${buttonHoverStyle}`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </motion.button>
                      <span className={`text-sm font-semibold ${bedtimeMode ? 'text-[#1a0f08]' : 'text-gray-800 dark:text-white'}`}>
                        Chats
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNewChat}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${widgetButtonStyle}`}
                      title="New Chat"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Search */}
                  <div className="p-2">
                    <div className="relative">
                      <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${textMuted}`} />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none transition-all ${inputStyle}`}
                      />
                    </div>
                  </div>

                  {/* Conversations List */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {sidebarLoading ? (
                      <div className={`text-center py-6 text-xs ${textMuted}`}>
                        Loading...
                      </div>
                    ) : filteredConversations.length === 0 ? (
                      <div className={`text-center py-6 px-4 ${textMuted}`}>
                        <MessageCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">
                          {searchQuery ? 'No results' : 'No chats yet'}
                        </p>
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
                                  : 'bg-purple-50 dark:bg-purple-900/20 border-l-2 border-purple-500'
                                : bedtimeMode
                                  ? 'hover:bg-[#d5dae1]'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
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
                                <h4 className={`text-xs font-medium truncate pr-5 ${
                                  bedtimeMode ? 'text-[#1a0f08]' : 'text-gray-800 dark:text-white'
                                }`}>
                                  {conv.title || 'New chat'}
                                </h4>
                                {conv.last_message && (
                                  <p className={`text-[10px] truncate mt-0.5 ${textMuted}`}>
                                    {conv.last_message}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Delete */}
                            <button
                              onClick={(e) => handleDeleteConversation(conv.id, e)}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                                bedtimeMode ? 'hover:bg-red-200 text-red-600' : 'hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500'
                              }`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className={`p-2 border-t text-center ${
                    bedtimeMode ? 'border-[#c8ced6]' : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <p className={`text-[10px] ${textMuted}`}>
                      {conversations.length} chat{conversations.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Chat View */}
            <div className="flex-1 flex flex-col">
              {/* Widget Header */}
              <div className={`flex items-center justify-between p-3 border-b ${
                bedtimeMode ? 'border-[#c8ced6]' : 'border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-center gap-2">
                  {/* Sidebar Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSidebar(true)}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${buttonHoverStyle}`}
                    title="Chat History"
                  >
                    <Menu className="w-4 h-4" />
                  </motion.button>
                  <Sparkles className={`w-4 h-4 ${bedtimeMode ? 'text-[#8b5a3c]' : 'text-cyan-500'}`} />
                  <span className={`text-sm font-bold ${bedtimeMode ? 'text-[#1a0f08]' : 'text-gray-800 dark:text-white'}`}>
                    AI<span className={bedtimeMode ? 'text-[#8b5a3c]' : 'text-cyan-500'}>SHINE</span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onToggle}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${buttonHoverStyle}`}
                    title="Full Screen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsExpanded(false)}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${buttonHoverStyle}`}
                    title="Minimize"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Messages Area */}
              <div className={`flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide ${
                bedtimeMode ? 'bg-[#e0e5ec]' : 'bg-gray-50 dark:bg-gray-900'
              }`}>
                {messages.length === 0 ? (
                  <div className={`text-center py-8 text-sm ${textMuted}`}>
                    Start a conversation...
                  </div>
                ) : (
                  messages.slice(-10).map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'human' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${
                          msg.role === 'human'
                            ? bedtimeMode
                              ? 'bg-[#d5dae1] shadow-[2px_2px_4px_#b8bdc4,-2px_-2px_4px_#ffffff] text-[#1a0f08] rounded-br-none'
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                            : bedtimeMode
                              ? 'bg-[#e8ecf0] shadow-[2px_2px_4px_#b8bdc4,-2px_-2px_4px_#ffffff] text-[#1a0f08] rounded-bl-none'
                              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                        }`}
                      >
                        <div dangerouslySetInnerHTML={{ __html: typeof msg.content === 'string' ? msg.content.slice(0, 200) + (msg.content.length > 200 ? '...' : '') : '' }} />
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`p-2 border-t ${
                bedtimeMode ? 'border-[#c8ced6]' : 'border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    ref={textareaRef}
                    type="text"
                    value={input || ''}
                    onChange={(e) => setInput && setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={loading}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none transition-all ${inputStyle} ${
                      loading ? 'opacity-50' : ''
                    }`}
                  />

                  {/* Mic Button */}
                  {onToggleListening && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onToggleListening}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        listening
                          ? 'bg-red-500 text-white'
                          : bedtimeMode
                            ? 'bg-[#d5dae1] shadow-[2px_2px_4px_#b8bdc4,-2px_-2px_4px_#ffffff] text-[#1a0f08]'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </motion.button>
                  )}

                  {/* Send Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWidgetSend}
                    disabled={loading || !input?.trim()}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      loading || !input?.trim()
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    } ${widgetButtonStyle}`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Collapsed Widget - Just Icon */
          <motion.div
            className="flex flex-col items-end gap-2"
          >
            {/* Mini card with logo */}
            <motion.div
              className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer ${cardStyle}`}
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className={`w-4 h-4 ${bedtimeMode ? 'text-[#8b5a3c]' : 'text-cyan-500'}`} />
              <span className={`text-xs font-bold ${bedtimeMode ? 'text-[#1a0f08]' : 'text-gray-800 dark:text-white'}`}>
                AI<span className={bedtimeMode ? 'text-[#8b5a3c]' : 'text-cyan-500'}>SHINE</span>
              </span>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSettings();
                }}
                className={`p-1.5 rounded-lg transition-all ${buttonHoverStyle}`}
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </motion.button>

              {/* Chat Icon */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
                className={`p-1.5 rounded-lg transition-all ${widgetButtonStyle}`}
                title="Open Chat"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>

            {/* Message notification badge */}
            {messages.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"
              />
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
