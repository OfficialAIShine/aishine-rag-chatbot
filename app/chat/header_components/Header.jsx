"use client";
import { motion } from "framer-motion";
import { Sparkles, Download, Settings, Focus, Minimize2, Menu } from "lucide-react";
import { BACKGROUND_MAP } from "../utils/constants";

export default function Header({
  onClearChat,
  onExportPDF,
  onOpenSettings,
  bedtimeMode,
  focusMode,
  setFocusMode,
  playSound,
  currentBackground,
  onResetToLanding,
  onMinimize,
  onOpenSidebar
}) {
  // Don't render in focus mode
  if (focusMode) return null;

  const getHeaderGradient = () => {
    if (bedtimeMode) {
      return "bg-[#e0e5ec] shadow-[0_4px_6px_#b8bdc4]";
    }

    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

    switch(currentBackground) {
      case 'ocean':
        return isDark
          ? "bg-gradient-to-r from-[hsl(210,50%,30%)] to-[hsl(212,60%,25%)] backdrop-blur-xl border-b border-white/10"
          : "bg-gradient-to-r from-[hsl(210,90%,70%)] to-[hsl(212,93%,45%)] backdrop-blur-xl border-b border-white/20";
      case 'beach':
        return isDark
          ? "bg-gradient-to-r from-[hsl(40,40%,35%)] to-[hsl(22,60%,30%)] backdrop-blur-xl border-b border-white/10"
          : "bg-gradient-to-r from-[hsl(40,63%,75%)] to-[hsl(22,94%,70%)] backdrop-blur-xl border-b border-white/20";
      case 'forest':
        return isDark
          ? "bg-gradient-to-r from-[hsl(165,70%,18%)] to-[hsl(161,40%,25%)] backdrop-blur-xl border-b border-white/10"
          : "bg-gradient-to-r from-[hsl(165,89%,28%)] to-[hsl(161,46%,45%)] backdrop-blur-xl border-b border-white/20";
      case 'sunset':
        return isDark
          ? "bg-gradient-to-r from-[hsl(33,80%,35%)] to-[hsl(58,70%,40%)] backdrop-blur-xl border-b border-white/10"
          : "bg-gradient-to-r from-[hsl(33,100%,50%)] to-[hsl(58,100%,65%)] backdrop-blur-xl border-b border-white/20";
      case 'twilight':
        return isDark
          ? "bg-gradient-to-r from-[hsl(186,25%,30%)] to-[hsl(216,30%,35%)] backdrop-blur-xl border-b border-white/10"
          : "bg-gradient-to-r from-[hsl(186,33%,88%)] to-[hsl(216,41%,75%)] backdrop-blur-xl border-b border-white/20";
      default:
        return isDark
          ? "bg-gradient-to-r from-pink-900/70 via-purple-900/70 to-cyan-900/70 backdrop-blur-xl border-b border-white/10"
          : "bg-gradient-to-r from-pink-400/90 via-purple-500/90 to-cyan-500/90 backdrop-blur-xl border-b border-white/20";
    }
  };

  // Match input bar button styling
  const buttonStyle = bedtimeMode
    ? "bg-[#e0e5ec] shadow-[3px_3px_6px_#b8bdc4,-3px_-3px_6px_#ffffff] text-[#1a0f08] hover:shadow-[inset_2px_2px_4px_#b8bdc4,inset_-2px_-2px_4px_#ffffff]"
    : "bg-white/60 dark:bg-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-600/60 backdrop-blur-md border border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200";

  const textColor = bedtimeMode ? 'text-[#1a0f08]' : 'text-gray-800 dark:text-white';

  return (
    <header className={`relative z-30 ${getHeaderGradient()} shadow-lg`}>
      <div className="flex items-center justify-between px-3 md:px-4 py-2 gap-2">
        {/* Left: Sidebar Toggle + Logo */}
        <div className="flex items-center gap-2">
          {/* Sidebar Toggle */}
          {onOpenSidebar && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onOpenSidebar();
                playSound('click');
              }}
              className={`p-2 rounded-lg transition-all cursor-pointer ${buttonStyle}`}
              title="Chat History"
            >
              <Menu className="w-4 h-4" />
            </motion.button>
          )}

          {/* Logo */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onResetToLanding}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Sparkles className={`w-5 h-5 ${bedtimeMode ? 'text-[#8b5a3c]' : 'text-cyan-300'}`} />
            <div className={`text-xl md:text-2xl font-bold tracking-tight ${textColor}`}>
              AI <span className={bedtimeMode ? 'text-[#8b5a3c]' : 'text-cyan-300'}>SHINE</span>
            </div>
          </motion.button>
        </div>

        {/* Right: Icon Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1.5"
        >
          {/* Download */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExportPDF}
            className={`p-2 rounded-lg transition-all cursor-pointer ${buttonStyle}`}
            title="Download Chat"
          >
            <Download className="w-4 h-4" />
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettings}
            className={`p-2 rounded-lg transition-all cursor-pointer ${buttonStyle}`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </motion.button>

          {/* Focus Mode */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setFocusMode(true);
              playSound('click');
            }}
            className={`p-2 rounded-lg transition-all cursor-pointer ${buttonStyle}`}
            title="Focus Mode"
          >
            <Focus className="w-4 h-4" />
          </motion.button>

          {/* Minimize to Widget */}
          {onMinimize && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onMinimize();
                playSound('click');
              }}
              className={`p-2 rounded-lg transition-all cursor-pointer ${buttonStyle}`}
              title="Minimize to Widget"
            >
              <Minimize2 className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      </div>
    </header>
  );
}
