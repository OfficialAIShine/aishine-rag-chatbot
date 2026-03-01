import { useRef, useEffect, useState } from "react";
import { Send, Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InputArea({
  input,
  setInput,
  loading,
  listening,
  isFirstMessage,
  focusMode,
  bedtimeMode,
  textareaRef,
  fontFamilyMap,
  fontFamily,
  fontSizeMap,
  fontSize,
  onSend,
  onToggleListening,
  onTextareaChange,
  animationsEnabled
}) {
  const containerRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef && containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const buttonProps = animationsEnabled ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  } : {};

  // Shared button style matching the input bar aesthetic
  const buttonStyle = bedtimeMode
    ? 'bg-[#e0e5ec] shadow-[3px_3px_6px_#b8bdc4,-3px_-3px_6px_#ffffff] hover:shadow-[inset_2px_2px_4px_#b8bdc4,inset_-2px_-2px_4px_#ffffff]'
    : focusMode
      ? 'bg-white/15 hover:bg-white/25 border border-white/20'
      : 'bg-white/60 dark:bg-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-600/60 border border-white/30 dark:border-gray-600/30';

  const iconColor = bedtimeMode ? 'text-[#1a0f08]' : focusMode ? 'text-white' : 'text-gray-600 dark:text-gray-300';

  // Focus mode styling
  if (focusMode) {
    return (
      <div
        ref={containerRef}
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl border border-white/15 shadow-xl
          ${isFocused ? 'w-[90%] max-w-3xl' : 'w-[85%] max-w-xl'}
          rounded-2xl px-3 py-2 flex items-end gap-2 transition-all duration-300 z-30`}
      >
        <textarea
          ref={textareaRef}
          onFocus={() => setIsFocused(true)}
          className="flex-1 bg-transparent px-2 py-1.5 rounded-xl resize-none min-h-[36px] max-h-[120px]
            text-white text-sm placeholder-gray-400 outline-none overflow-y-auto scrollbar-hide"
          placeholder="Type your question..."
          value={input}
          rows="1"
          onChange={onTextareaChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />

        <motion.button
          {...buttonProps}
          onClick={onToggleListening}
          disabled={loading}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            listening ? "bg-gradient-to-r from-red-500 to-pink-500 text-white" : buttonStyle
          }`}
        >
          {listening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className={`w-4 h-4 ${iconColor}`} />}
        </motion.button>

        <motion.button
          {...buttonProps}
          onClick={onSend}
          disabled={loading || !input.trim()}
          className={`p-2 rounded-xl ${buttonStyle} disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer`}
        >
          <Send className={`w-4 h-4 ${iconColor}`} />
        </motion.button>
      </div>
    );
  }

  // Default & Bedtime mode
  const containerStyle = bedtimeMode
    ? 'bg-[#e0e5ec] shadow-[0_-2px_6px_#b8bdc4]'
    : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/30';

  const inputStyle = bedtimeMode
    ? 'bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#b8bdc4,inset_-3px_-3px_6px_#ffffff] text-[#1a0f08]'
    : 'bg-white/60 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 border border-white/30 dark:border-gray-700/30';

  const getWidthClass = () => {
    if (isFirstMessage) {
      return isFocused ? 'w-[90%] max-w-3xl' : 'w-[85%] max-w-xl';
    }
    return 'w-full';
  };

  const getPositionClass = () => {
    if (isFirstMessage) {
      return 'fixed bottom-6 left-1/2 -translate-x-1/2 px-3 rounded-2xl shadow-xl';
    }
    return 'relative w-full';
  };

  return (
    <div
      ref={containerRef}
      className={`${getPositionClass()} ${isFirstMessage ? getWidthClass() : ''} ${containerStyle}
        p-2 md:p-3 flex gap-2 items-end flex-shrink-0 z-20 transition-all duration-300
        ${fontFamilyMap[fontFamily]} ${fontSizeMap[fontSize]}`}
    >
      <textarea
        ref={textareaRef}
        onFocus={() => setIsFocused(true)}
        className={`flex-1 ${inputStyle} backdrop-blur-md px-3 py-2 rounded-xl resize-none min-h-[36px] max-h-[120px]
          text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-cyan-400 transition-all duration-200
          overflow-y-auto scrollbar-hide ${fontFamilyMap[fontFamily]}`}
        placeholder="Ask anything about AI..."
        rows="1"
        value={input}
        onChange={onTextareaChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />

      <motion.button
        {...buttonProps}
        onClick={onToggleListening}
        disabled={loading}
        className={`p-2 rounded-xl transition-all cursor-pointer ${buttonStyle} ${
          listening ? "bg-gradient-to-r from-red-500 to-pink-500 scale-105" : ""
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={listening ? "Listening..." : "Tap to Speak"}
      >
        {listening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className={`w-4 h-4 ${iconColor}`} />}
      </motion.button>

      <motion.button
        {...buttonProps}
        onClick={onSend}
        disabled={loading || !input.trim()}
        className={`p-2 rounded-xl ${
          bedtimeMode
            ? 'bg-[#e0e5ec] shadow-[3px_3px_6px_#b8bdc4,-3px_-3px_6px_#ffffff]'
            : 'bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-500 hover:from-pink-500 hover:via-purple-600 hover:to-cyan-600'
        } disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer`}
        title="Send message"
      >
        <Send className={`w-4 h-4 ${bedtimeMode ? 'text-[#1a0f08]' : 'text-white'}`} />
      </motion.button>
    </div>
  );
}
