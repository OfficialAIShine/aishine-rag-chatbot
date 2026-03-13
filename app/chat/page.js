"use client";

import { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

// Components
import Header from "./header_components/Header";
import LandingScreen from "./components/LandingScreen";
import ChatMessage from "./components/ChatMessage";
import InputArea from "./components/InputArea";
import SettingsModal from "./components/SettingsModal";
import ConversationSidebar from "./components/ConversationSidebar";
import ChatWidget from "./components/ChatWidget";

// Hooks
import { useSettings } from "./hooks/useSettings";
import { useTTS } from "./hooks/useTTS";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { useConfetti } from "./hooks/useConfetti";

// Utils
import { playSound } from "./utils/soundEffects";
import { exportToPDF } from "./utils/exportHelpers";
import { sendChatMessage, getConversation } from "./utils/api";
import { getSessionId, getCurrentConversationId, setCurrentConversationId } from "./utils/session";
import { getWidgetMode } from "./utils/widgetMode";
import {
  FONT_SIZE_MAP,
  FONT_FAMILY_MAP,
  BACKGROUND_MAP,
  WELCOME_GRADIENTS,
  getChatBackground,
} from "./utils/constants";

export default function Home() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentConversationId, setCurrentConvId] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isWidgetMode, setIsWidgetMode] = useState(false);

  const [streamingContent, setStreamingContent] = useState("");
  const fullStreamBuffer = useRef("");
  const isStreamingActive = useRef(false);
  const [sessionDate, setSessionDate] = useState('');
  const [gradientIndex, setGradientIndex] = useState(0);
  const [hoveredSuggestion, setHoveredSuggestion] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [previewBackground, setPreviewBackground] = useState(null);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const settings = useSettings();
  const { speak, cancel, speaking, availableVoices } = useTTS(settings.ttsSettings, settings.selectedVoice);
  const speechRecognition = useSpeechRecognition();
  const { triggerCelebration } = useConfetti();

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const widgetMode = getWidgetMode();
    if (widgetMode) {
      setIsWidgetMode(true);
      setIsMinimized(true);
      document.documentElement.style.background = 'transparent';
      document.body.style.background = 'transparent';
    }

    const sessionId = getSessionId();
    console.log('[APP] Session ID:', sessionId);

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    setSessionDate(formattedDate);
    setGradientIndex(Math.floor(Math.random() * WELCOME_GRADIENTS.length));

    const convId = getCurrentConversationId();
    if (convId) {
      setCurrentConvId(convId);
      console.log('[APP] Loaded conversation ID:', convId);
    }
  }, []);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (settings.autoScroll !== false && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, settings.autoScroll, streamingContent]);

  // ── formatMessage ──────────────────────────────────────────────────────────
  const formatMessage = (text) => {
    if (!text || typeof text !== 'string') return '';

    let formatted = text;

    formatted = formatted.replace(/```(\w+)?\n?([\\s\S]*?)```/g, (match, lang, code) => {
      return `<pre style="background:#1f2937;color:#f3f4f6;border-radius:8px;padding:12px;margin:8px 0;overflow-x:auto;font-size:13px;font-family:monospace;white-space:pre-wrap;word-break:break-word;"><code>${code.trim()}</code></pre>`;
    });

    formatted = formatted.replace(/`([^`]+)`/g,
      '<code style="background:#e5e7eb;color:#db2777;padding:2px 6px;border-radius:4px;font-size:13px;font-family:monospace;">$1</code>'
    );

    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:700;">$1</strong>');
    formatted = formatted.replace(/__([^_]+)__/g, '<strong style="font-weight:700;">$1</strong>');
    formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em style="font-style:italic;">$1</em>');
    formatted = formatted.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em style="font-style:italic;">$1</em>');

    formatted = formatted.replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:12px 0 4px;line-height:1.4;">$1</h3>');
    formatted = formatted.replace(/^## (.+)$/gm,  '<h2 style="font-size:17px;font-weight:700;margin:12px 0 4px;line-height:1.4;">$1</h2>');
    formatted = formatted.replace(/^# (.+)$/gm,   '<h1 style="font-size:19px;font-weight:700;margin:12px 0 6px;line-height:1.4;">$1</h1>');

    formatted = formatted.replace(/^> (.+)$/gm,
      '<blockquote style="border-left:4px solid #a855f7;padding:4px 12px;margin:8px 0;font-style:italic;color:#6b7280;">$1</blockquote>'
    );

    formatted = formatted.replace(/^[\-\*] (.+)$/gm, '<li style="margin-left:20px;list-style-type:disc;margin-bottom:3px;line-height:1.5;">$1</li>');
    formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li style="margin-left:20px;list-style-type:decimal;margin-bottom:3px;line-height:1.5;">$1</li>');

    formatted = formatted.replace(/(<li style="margin-left:20px;list-style-type:disc[^"]*">[^<]*<\/li>\n?)+/g, '<ul style="margin:8px 0;padding:0;">$&</ul>');
    formatted = formatted.replace(/(<li style="margin-left:20px;list-style-type:decimal[^"]*">[^<]*<\/li>\n?)+/g, '<ol style="margin:8px 0;padding:0;">$&</ol>');

    formatted = formatted.replace(/^(-{3,}|\*{3,})$/gm, '<hr style="margin:12px 0;border:none;border-top:1px solid #d1d5db;" />');
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#9333ea;text-decoration:underline;">$1</a>');

    formatted = formatted.replace(/\n\n+/g, '</p><p style="margin-bottom:10px;line-height:1.6;">');
    formatted = formatted.replace(/\n/g, '<br />');

    if (!formatted.startsWith('<h') && !formatted.startsWith('<pre') && !formatted.startsWith('<ul') && !formatted.startsWith('<ol') && !formatted.startsWith('<blockquote')) {
      formatted = `<p style="margin-bottom:10px;line-height:1.6;">${formatted}</p>`;
    }

    formatted = formatted.replace(/<p style="margin-bottom:10px;line-height:1.6;"><\/p>/g, '');
    formatted = formatted.replace(/<p style="margin-bottom:10px;line-height:1.6;">(<h[1-3])/g, '$1');
    formatted = formatted.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
    formatted = formatted.replace(/<p style="margin-bottom:10px;line-height:1.6;">(<ul|<ol|<pre|<blockquote|<hr)/g, '$1');
    formatted = formatted.replace(/(<\/ul>|<\/ol>|<\/pre>|<\/blockquote>)<\/p>/g, '$1');
    formatted = formatted.replace(/<br \/><\/p>/g, '</p>');
    formatted = formatted.replace(/<p style="margin-bottom:10px;line-height:1.6;"><br \/>/g, '<p style="margin-bottom:10px;line-height:1.6;">');

    return formatted;
  };

  // ── Streaming ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isStreamingActive.current) return;
    const interval = setInterval(() => {
      setStreamingContent((prev) => {
        const target = fullStreamBuffer.current;
        if (prev.length >= target.length) return prev;
        const chunkSize = Math.min(5, target.length - prev.length);
        return prev + target.slice(prev.length, prev.length + chunkSize);
      });
    }, 15);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (loading && messages.length > 0) {
      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx]?.role === "ai" && updated[lastIdx]?.isStreaming) {
          updated[lastIdx].content = formatMessage(streamingContent);
        }
        return updated;
      });
    }
  }, [streamingContent, loading]);

  // ── Focus textarea ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (textareaRef.current && isFirstMessage && !isWidgetMode) {
      textareaRef.current.focus();
    }
  }, [isFirstMessage, isWidgetMode]);

  // ── Speech recognition ─────────────────────────────────────────────────────
  useEffect(() => {
    if (speechRecognition.transcript) {
      setInput(prev => prev ? `${prev} ${speechRecognition.transcript}` : speechRecognition.transcript);
      speechRecognition.resetTranscript();
    }
  }, [speechRecognition.transcript]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (settings.bedtimeMode) return 'Good evening';
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handlePreviewBackground = (bg) => setPreviewBackground(bg);

  const handleSuggestionClick = (suggestion) => {
    if (loading) { toast.error('Please wait for AI to finish responding'); return; }
    if (settings.animationsEnabled) triggerCelebration();
    playSound('success', settings.soundEffects);
    setInput(suggestion);
    setTimeout(() => {
      if (!suggestion.trim()) return;
      setIsFirstMessage(false);
      const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const userMessage = { role: 'human', type: 'text', content: suggestion, timestamp };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      sendToAI(newMessages);
    }, 300);
  };

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim()) return;
    if (loading) { toast.error('Please wait for AI to finish responding'); return; }
    playSound('send', settings.soundEffects);
    if (isFirstMessage) setIsFirstMessage(false);

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const userMessage = { role: 'human', type: 'text', content: input, timestamp };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await sendToAI(newMessages);
  };

  async function sendToAI(chatHistory) {
    if (loading) return;
    setLoading(true);
    fullStreamBuffer.current = "";
    setStreamingContent("");
    isStreamingActive.current = true;

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { role: 'ai', type: 'text', content: '', timestamp, isStreaming: true }]);

    try {
      const formattedMessages = chatHistory
        .filter((msg) => msg.type !== 'error')
        .map((msg) => ({
          role: msg.role,
          content: typeof msg.content === 'string' ? msg.content : msg.content?.answer || JSON.stringify(msg.content),
          type: msg.type || 'text',
        }));

      await sendChatMessage(formattedMessages, (chunk) => {
        fullStreamBuffer.current += chunk;
      });

      playSound('success', settings.soundEffects);
    } catch (error) {
      console.error('[STREAMING_ERROR]', error);
      setMessages((prev) => {
        const newArr = [...prev];
        const lastIndex = newArr.length - 1;
        newArr[lastIndex] = { ...newArr[lastIndex], role: 'ai', type: 'error', content: '⚠️ Connection lost. Please try again.', isStreaming: false };
        return newArr;
      });
      toast.error('Connection interrupted');
    } finally {
      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx].content = formatMessage(fullStreamBuffer.current);
        updated[lastIdx].isStreaming = false;
        return updated;
      });
      isStreamingActive.current = false;
      setLoading(false);
      setTimeout(() => {
        if (settings.autoScroll && messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    const maxHeight = 200;
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
    e.target.style.overflowY = e.target.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  // ── Chat management ────────────────────────────────────────────────────────
  const handleClearChat = () => {
    setMessages([]);
    setInput('');
    setIsFirstMessage(true);
    setFeedback({});
    setCurrentConvId(null);
    setCurrentConversationId(null);
    setGradientIndex(Math.floor(Math.random() * WELCOME_GRADIENTS.length));
    playSound('click', settings.soundEffects);
    toast.success('Chat cleared!');
  };

  const handleSelectConversation = async (conversation) => {
    try {
      toast.loading('Loading conversation...');
      const fullConv = await getConversation(conversation.id);
      const loadedMessages = fullConv.messages.map(msg => ({
        role: msg.role === 'human' ? 'human' : 'ai',
        type: msg.metadata?.response_type || 'text',
        content: msg.role === 'ai' ? formatMessage(msg.content) : msg.content,
        timestamp: new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }));
      setMessages(loadedMessages);
      setCurrentConvId(conversation.id);
      setIsFirstMessage(false);
      toast.dismiss();
      toast.success('Conversation loaded');
    } catch (error) {
      console.error('[LOAD_CONVERSATION]', error);
      toast.dismiss();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setFeedback({});
    setCurrentConvId(null);
    setCurrentConversationId(null);
    setGradientIndex(Math.floor(Math.random() * WELCOME_GRADIENTS.length));
    playSound('click', settings.soundEffects);
    if (!isWidgetMode) setIsFirstMessage(true);
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleFeedback = (messageIndex, type) => {
    setFeedback(prev => {
      const updated = { ...prev };
      if (updated[messageIndex] === type) delete updated[messageIndex];
      else updated[messageIndex] = type;
      return updated;
    });
    playSound('click', settings.soundEffects);
    if (type !== null) {
      toast.success('Thanks for your feedback!');
      try {
        const stored = JSON.parse(localStorage.getItem('aiFeedback') || '[]');
        stored.push({ messageIndex, type, timestamp: new Date().toISOString(), message: messages[messageIndex]?.content });
        localStorage.setItem('aiFeedback', JSON.stringify(stored));
      } catch { /* localStorage may be blocked in widget mode */ }
    }
  };

  const handleCopy = (content, index) => {
    const textToCopy = typeof content === 'string'
      ? content
      : content.answer + '\n\nKey Points:\n' + content.keyPoints?.join('\n');
    navigator.clipboard.writeText(textToCopy.replace(/<[^>]*>/g, ''));
    setCopiedIndex(index);
    playSound('success', settings.soundEffects);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (content) => {
    if (speaking) {
      cancel();
    } else {
      const textToSpeak = typeof content === 'string'
        ? content.replace(/<[^>]*>/g, '')
        : content.answer.replace(/<[^>]*>/g, '') + '. Key Points: ' + content.keyPoints?.join('. ');
      speak(textToSpeak);
    }
  };

  const handleShare = async (content) => {
    playSound('click', settings.soundEffects);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Shine Response',
          text: typeof content === 'string' ? content.replace(/<[^>]*>/g, '') : content.answer.replace(/<[^>]*>/g, ''),
        });
        toast.success('Shared successfully!');
      } catch (error) {
        console.error('[SHARE_ERROR]', error);
      }
    } else {
      toast.error('Sharing not supported on this browser');
    }
  };

  const handleTellMeMore = async (messageIndex) => {
    if (loading) { toast.error('Please wait for AI to finish responding'); return; }
    playSound('click', settings.soundEffects);
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const tellMeMoreMessage = { role: 'human', type: 'text', content: 'tell me more', timestamp };
    const newMessages = [...messages, tellMeMoreMessage];
    setMessages(newMessages);
    await sendToAI(newMessages);
  };

  const handleExportPDF = async () => {
    playSound('click', settings.soundEffects);
    toast.loading('Generating PDF...');
    try {
      await exportToPDF(messages, sessionDate);
      toast.dismiss();
      toast.success('PDF downloaded!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate PDF');
      console.error('[PDF_ERROR]', error);
    }
  };

  const toggleListening = () => {
    if (speechRecognition.listening) {
      speechRecognition.stopListening();
    } else {
      const started = speechRecognition.startListening();
      if (started) {
        playSound('click', settings.soundEffects);
      } else {
        toast.error('Speech recognition not supported. Try Chrome or Edge.');
      }
    }
  };

  // ── Computed styles ────────────────────────────────────────────────────────
  // Active background: preview (hover in settings) takes priority over saved setting
  const activeBackground = previewBackground || settings.background;

  // BACKGROUND_MAP values are real CSS gradient strings — must use style prop, not className.
  const mainBgStyle = isWidgetMode
    ? { background: 'transparent' }
    : {
        background: BACKGROUND_MAP[activeBackground] || BACKGROUND_MAP.moon,
        filter: settings.bedtimeMode ? 'brightness(0.75) saturate(0.5)' : undefined,
      };

  // Messages area: dark mode → transparent (gradient shows through); light → warm semi-transparent off-white
  const messagesBgStyle = settings.bedtimeMode
    ? {}
    : settings.isDarkMode
      ? { background: 'transparent' }
      : { background: 'rgba(250, 248, 245, 0.35)' };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Toaster position="top-center" />

      <SettingsModal
        show={showSettings}
        onClose={() => {
          setShowSettings(false);
          setPreviewBackground(null);
        }}
        settings={settings}
        availableVoices={availableVoices}
        playSound={(type) => playSound(type, settings.soundEffects)}
        onPreviewBackground={handlePreviewBackground}
        isWidgetMode={isWidgetMode}
      />

      {/* main: background applied via style prop */}
      <main
        className="fixed inset-0 flex flex-col transition-all duration-500"
        style={mainBgStyle}
      >
        {/* ── Full-page-only UI ─────────────────────────────────────────────── */}
        {!isWidgetMode && (
          <>
            <ConversationSidebar
              isOpen={showSidebar}
              onClose={() => setShowSidebar(false)}
              onSelectConversation={handleSelectConversation}
              onNewChat={handleNewChat}
              currentConversationId={currentConversationId}
              bedtimeMode={settings.bedtimeMode}
            />

            {isFirstMessage && (
              <LandingScreen
                greeting={getGreeting()}
                gradientIndex={gradientIndex}
                hoveredSuggestion={hoveredSuggestion}
                setHoveredSuggestion={setHoveredSuggestion}
                onSuggestionClick={handleSuggestionClick}
                animationsEnabled={settings.animationsEnabled}
              />
            )}

            {!isFirstMessage && !isMinimized && (
              <Header
                onClearChat={handleClearChat}
                onExportPDF={handleExportPDF}
                onOpenSettings={() => {
                  setShowSettings(true);
                  playSound('click', settings.soundEffects);
                }}
                bedtimeMode={settings.bedtimeMode}
                playSound={(type) => playSound(type, settings.soundEffects)}
                currentBackground={activeBackground}
                onResetToLanding={() => {
                  setMessages([]);
                  setInput('');
                  setIsFirstMessage(true);
                  setFeedback({});
                  playSound('click', settings.soundEffects);
                }}
                onMinimize={() => {
                  setIsMinimized(true);
                  playSound('click', settings.soundEffects);
                }}
                onOpenSidebar={() => setShowSidebar(true)}
              />
            )}

            {!isFirstMessage && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`relative flex-grow overflow-y-auto px-3 md:px-4 py-3 space-y-3 scrollbar-hide ${
  FONT_FAMILY_MAP[settings.fontFamily] ?? ''
} ${FONT_SIZE_MAP[settings.fontSize] ?? ''}`}
style={{
  ...messagesBgStyle,
  fontWeight: settings.fontWeight === 'bold' ? '700' : '400',
  fontStyle: settings.fontWeight === 'italic' ? 'italic' : 'normal',
}}
              >
                {/* Bubble-color complementary gradient overlay */}
                {!settings.bedtimeMode && settings.bubbleColor && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getChatBackground(settings.bubbleColor, settings.isDarkMode)} pointer-events-none -z-10`}
                  />
                )}

                <div className="flex justify-center mb-2">
                  <div className={`px-3 py-0.5 rounded-full text-[11px] font-medium ${
                    settings.bedtimeMode
                      ? 'bg-[#e0e5ec] shadow-[2px_2px_4px_#b8bdc4,-2px_-2px_4px_#ffffff] text-gray-700'
                      : 'bg-black/10 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {sessionDate}
                  </div>
                </div>

                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <ChatMessage
                      key={idx}
                      message={msg}
                      index={idx}
                      isUser={msg.role === 'human'}
                      isStreaming={msg.isStreaming}
                      feedback={feedback}
                      copiedIndex={copiedIndex}
                      speaking={speaking}
                      onFeedback={handleFeedback}
                      onCopy={handleCopy}
                      onSpeak={settings.ttsEnabled ? handleSpeak : () => toast.error('TTS is disabled')}
                      onShare={handleShare}
                      onTellMeMore={handleTellMeMore}
                      fontSizeMap={FONT_SIZE_MAP}
                      fontSize={settings.fontSize}
                      bedtimeMode={settings.bedtimeMode}
                      bubbleColor={settings.bubbleColor}
                    />
                  ))}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </motion.div>
            )}

            {!isMinimized && (
              <InputArea
                input={input}
                setInput={setInput}
                loading={loading}
                listening={speechRecognition.listening}
                isFirstMessage={isFirstMessage}
                bedtimeMode={settings.bedtimeMode}
                textareaRef={textareaRef}
                fontFamilyMap={FONT_FAMILY_MAP}
                fontFamily={settings.fontFamily}
                fontSizeMap={FONT_SIZE_MAP}
                fontSize={settings.fontSize}
                onSend={sendMessage}
                onToggleListening={toggleListening}
                onOpenSettings={() => {
                  setShowSettings(true);
                  playSound('click', settings.soundEffects);
                }}
                onTextareaChange={handleTextareaChange}
                animationsEnabled={settings.animationsEnabled}
              />
            )}
          </>
        )}

        {/* ── ChatWidget ────────────────────────────────────────────────────── */}
        {(isMinimized || isWidgetMode) && (
          <ChatWidget
            isWidgetMode={isWidgetMode}
            isMinimized={isMinimized}
            onToggle={() => {
              setIsMinimized(false);
              playSound('click', settings.soundEffects);
            }}
            onOpenSettings={() => {
              setShowSettings(true);
              playSound('click', settings.soundEffects);
            }}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            currentConversationId={currentConversationId}
            bedtimeMode={settings.bedtimeMode}
            messages={messages}
            input={input}
            setInput={setInput}
            loading={loading}
            listening={speechRecognition.listening}
            onSend={sendMessage}
            onToggleListening={toggleListening}
            onExportPDF={handleExportPDF}
            feedback={feedback}
            copiedIndex={copiedIndex}
            speaking={speaking}
            onFeedback={handleFeedback}
            onCopy={handleCopy}
            onSpeak={settings.ttsEnabled ? handleSpeak : () => toast.error('TTS is disabled')}
            onShare={handleShare}
            onTellMeMore={handleTellMeMore}
            fontSizeMap={FONT_SIZE_MAP}
            fontSize={settings.fontSize}
            fontFamily={settings.fontFamily}
            fontFamilyMap={FONT_FAMILY_MAP}
            fontWeight={settings.fontWeight}
            bubbleColor={settings.bubbleColor}
            background={activeBackground}
            isDarkMode={settings.isDarkMode}
          />
        )}
      </main>
    </>
  );
}