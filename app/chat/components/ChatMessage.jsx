//chatmessage.jsx

import { motion } from "framer-motion";
import ChatActions from "./ChatActions";
import { CHAT_BUBBLE_COLORS, DEFAULT_BUBBLE_COLOR } from "../utils/constants";

export default function ChatMessage({
  message,
  index,
  isUser,
  feedback,
  copiedIndex,
  speaking,
  onFeedback,
  onCopy,
  onSpeak,
  onShare,
  onTellMeMore,
  fontSizeMap,
  fontSize,
  focusMode,
  isStreaming,
  bedtimeMode,
  bubbleColor = DEFAULT_BUBBLE_COLOR,
}) {
  const { role, type, content, timestamp } = message;

  // Get colors from selected palette
  const palette = CHAT_BUBBLE_COLORS[bubbleColor] || CHAT_BUBBLE_COLORS[DEFAULT_BUBBLE_COLOR];

  // User bubble style
  const userBubbleStyle = bedtimeMode
    ? 'bg-[#e0e5ec] shadow-[3px_3px_6px_#b8bdc4,-3px_-3px_6px_#ffffff] text-[#1a0f08]'
    : focusMode
      ? 'bg-white/10 text-white border border-white/20 backdrop-blur-md'
      : `shadow-md`;

  const userBubbleColor = !bedtimeMode && !focusMode
    ? { backgroundColor: palette.user, color: palette.userText }
    : {};

  // AI bubble style
  const aiBubbleStyle = bedtimeMode
    ? 'bg-[#e0e5ec] shadow-[3px_3px_6px_#b8bdc4,-3px_-3px_6px_#ffffff] text-[#1a0f08] border-none'
    : focusMode
      ? 'bg-white/10 text-white border border-white/20 backdrop-blur-md'
      : `shadow-md border`;

  const aiBubbleColor = !bedtimeMode && !focusMode
    ? { backgroundColor: palette.ai, color: palette.aiText, borderColor: '#e5e7eb' }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* No avatars - direct message content */}
      <div className="flex flex-col gap-1 max-w-[88%] md:max-w-[70%]">
        {type === "decline" || type === "error" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`border-l-3 border-red-500 px-3 py-2 rounded-lg shadow-sm relative text-sm ${
              bedtimeMode
                ? 'bg-[#e0e5ec] shadow-[3px_3px_6px_#b8bdc4,-3px_-3px_6px_#ffffff] text-[#1a0f08]'
                : focusMode
                  ? 'bg-red-900/20 text-white backdrop-blur-md'
                  : 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-800 dark:text-red-200'
            }`}
          >
            <div className="font-semibold mb-1 text-sm">⚠️ System Notice</div>
            <div className={`text-sm ${fontSizeMap[fontSize]}`} dangerouslySetInnerHTML={{ __html: content }} />

            {/* Timestamp */}
            <div className="flex items-center justify-end gap-1 mt-1.5">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {timestamp}
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col">
            {/* Message bubble - reduced padding for viewport fit */}
            <div
              className={`px-3 py-2 rounded-xl relative ${fontSizeMap[fontSize]} ${
                isUser
                  ? `${userBubbleStyle} rounded-br-none`
                  : isStreaming
                  ? "bg-gradient-to-r from-purple-600/40 via-pink-600/40 to-purple-600/40 bg-[length:200%_100%] animate-gradient text-white border border-purple-500/30 rounded-bl-none"
                  : `${aiBubbleStyle} rounded-bl-none`
              }`}
              style={isUser ? userBubbleColor : (isStreaming ? {} : aiBubbleColor)}
            >
              <div dangerouslySetInnerHTML={{ __html: content }} />

              {/* Timestamp */}
              <div className="flex items-center justify-end gap-1 mt-1.5">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {timestamp}
                </span>
              </div>
            </div>

            {/* Action buttons - always visible for AI messages */}
            {!isUser && !isStreaming && (
              <ChatActions
                messageIndex={index}
                content={content}
                feedback={feedback}
                onFeedback={onFeedback}
                onCopy={onCopy}
                onSpeak={onSpeak}
                onShare={onShare}
                onTellMeMore={() => onTellMeMore(index)}
                copied={copiedIndex}
                speaking={speaking}
                focusMode={focusMode}
                bedtimeMode={bedtimeMode}
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
