"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, Plus, X, Search, MoreVertical, Edit2 } from 'lucide-react';
import { getConversations, deleteConversation, startNewConversation } from '../utils/api';
import { setCurrentConversationId } from '../utils/session';
import toast from 'react-hot-toast';

export default function ConversationSidebar({
  isOpen,
  onClose,
  onSelectConversation,
  onNewChat,
  currentConversationId,
  focusMode,
  bedtimeMode,
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const convs = await getConversations();
      setConversations(convs);
    } catch (error) {
      console.error('[SIDEBAR] Load error:', error);
      // toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (conversationId, e) => {
    e.stopPropagation();

    if (!confirm('Delete this conversation?')) return;

    try {
      await deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      toast.success('Conversation deleted');

      if (conversationId === currentConversationId) {
        handleNewChat();
      }
    } catch (error) {
      console.error('[SIDEBAR] Delete error:', error);
      toast.error('Failed to delete');
    }
  };

  const handleNewChat = async () => {
    try {
      const result = await startNewConversation();
      setCurrentConversationId(result.conversation_id);
      onNewChat();
      onClose();
      toast.success('New conversation started');
    } catch (error) {
      console.error('[SIDEBAR] New chat error:', error);
      toast.error('Failed to start new chat');
    }
  };

  const handleSelectConversation = (conversation) => {
    setCurrentConversationId(conversation.id);
    onSelectConversation(conversation);
    onClose();
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations by time
  const groupConversations = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: []
    };

    filteredConversations.forEach(conv => {
      const convDate = new Date(conv.created_at || conv.updated_at);
      if (convDate.toDateString() === today.toDateString()) {
        groups.today.push(conv);
      } else if (convDate.toDateString() === yesterday.toDateString()) {
        groups.yesterday.push(conv);
      } else if (convDate > lastWeek) {
        groups.lastWeek.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return groups;
  };

  const groups = groupConversations();

  // Styles
  const sidebarStyle = focusMode
    ? 'bg-gray-900/95 backdrop-blur-xl border-r border-white/10'
    : bedtimeMode
      ? 'bg-[#e0e5ec]'
      : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl';

  const itemStyle = focusMode
    ? 'hover:bg-white/10 text-white'
    : bedtimeMode
      ? 'hover:bg-[#d5dae1] text-gray-800'
      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200';

  const activeItemStyle = focusMode
    ? 'bg-white/15 border-l-2 border-cyan-400'
    : bedtimeMode
      ? 'bg-[#d5dae1] shadow-[inset_2px_2px_4px_#b8bdc4,inset_-2px_-2px_4px_#ffffff] border-l-2 border-[#8b5a3c]'
      : 'bg-purple-50 dark:bg-purple-900/20 border-l-2 border-purple-500';

  const textMuted = focusMode
    ? 'text-gray-400'
    : bedtimeMode
      ? 'text-[#666]'
      : 'text-gray-500 dark:text-gray-400';

  const inputStyle = focusMode
    ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400'
    : bedtimeMode
      ? 'bg-[#d5dae1] shadow-[inset_2px_2px_4px_#b8bdc4,inset_-2px_-2px_4px_#ffffff] text-[#1a0f08] placeholder:text-gray-500'
      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500';

  const renderGroup = (title, items) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className={`text-xs font-medium px-3 py-2 uppercase tracking-wider ${textMuted}`}>
          {title}
        </h3>
        <div className="space-y-1">
          {items.map((conv) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`group relative mx-2 rounded-lg cursor-pointer transition-all ${
                conv.id === currentConversationId
                  ? activeItemStyle
                  : itemStyle
              }`}
              onClick={() => handleSelectConversation(conv)}
              onMouseEnter={() => setHoveredId(conv.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="px-3 py-2.5">
                <div className="flex items-start gap-2">
                  <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    conv.id === currentConversationId
                      ? focusMode ? 'text-cyan-400' : bedtimeMode ? 'text-[#8b5a3c]' : 'text-purple-500'
                      : textMuted
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate pr-6">
                      {conv.title || 'New chat'}
                    </h4>
                    {conv.last_message && (
                      <p className={`text-xs truncate mt-0.5 ${textMuted}`}>
                        {conv.last_message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions on hover */}
              <AnimatePresence>
                {hoveredId === conv.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1"
                  >
                    <button
                      onClick={(e) => handleDelete(conv.id, e)}
                      className={`p-1.5 rounded-md transition-colors ${
                        focusMode
                          ? 'hover:bg-red-500/20 text-red-400'
                          : 'hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500'
                      }`}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sidebar Panel - Gemini Style */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed left-0 top-0 h-full w-72 ${sidebarStyle} shadow-2xl z-50 flex flex-col`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-3 border-b ${
              focusMode ? 'border-white/10' : bedtimeMode ? 'border-[#c8ced6]' : 'border-gray-200 dark:border-gray-700'
            }`}>
              <h2 className={`text-base font-semibold ${focusMode ? 'text-white' : bedtimeMode ? 'text-[#1a0f08]' : 'text-gray-800 dark:text-white'}`}>
                Chats
              </h2>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${itemStyle}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="p-3">
              <button
                onClick={handleNewChat}
                className={`w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  focusMode
                    ? 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
                    : bedtimeMode
                      ? 'bg-[#e0e5ec] shadow-[3px_3px_6px_#b8bdc4,-3px_-3px_6px_#ffffff] hover:shadow-[inset_2px_2px_4px_#b8bdc4,inset_-2px_-2px_4px_#ffffff] text-[#1a0f08]'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg'
                }`}
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            </div>

            {/* Search */}
            <div className="px-3 pb-2">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none transition-all ${inputStyle}`}
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto py-2">
              {loading ? (
                <div className={`text-center py-8 text-sm ${textMuted}`}>
                  <div className="animate-pulse">Loading...</div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className={`text-center py-8 ${textMuted}`}>
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchQuery ? 'No results found' : 'No conversations yet'}
                  </p>
                  <p className="text-xs mt-1 opacity-70">
                    Start a new chat to begin
                  </p>
                </div>
              ) : (
                <>
                  {renderGroup('Today', groups.today)}
                  {renderGroup('Yesterday', groups.yesterday)}
                  {renderGroup('Last 7 days', groups.lastWeek)}
                  {renderGroup('Older', groups.older)}
                </>
              )}
            </div>

            {/* Footer */}
            <div className={`p-3 border-t text-center ${
              focusMode ? 'border-white/10' : bedtimeMode ? 'border-[#c8ced6]' : 'border-gray-200 dark:border-gray-700'
            }`}>
              <p className={`text-xs ${textMuted}`}>
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
