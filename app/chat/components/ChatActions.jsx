import { ThumbsUp, ThumbsDown, Copy, Share2, Volume2, Check, Heart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ChatActions({
  messageIndex,
  content,
  feedback,
  onFeedback,
  onCopy,
  onSpeak,
  onShare,
  onTellMeMore,
  copied,
  speaking,
  focusMode = false,
  bedtimeMode = false,
  isCompact = false,
}) {
  const [showHeart, setShowHeart] = useState(false);

  const handleLike = () => {
    if (feedback[messageIndex] === 'up') {
      onFeedback(messageIndex, null);
    } else {
      onFeedback(messageIndex, 'up');
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  const handleDislike = () => {
    if (feedback[messageIndex] === 'down') {
      onFeedback(messageIndex, null);
    } else {
      onFeedback(messageIndex, 'down');
    }
  };

  const handleDoubleClick = () => {
    if (feedback[messageIndex] !== 'up') {
      onFeedback(messageIndex, 'up');
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  const containerStyle = bedtimeMode
    ? 'bg-[#d5dae1] shadow-[inset_1px_1px_3px_#b8bdc4,inset_-1px_-1px_3px_#ffffff]'
    : focusMode
      ? 'bg-white/5 backdrop-blur-sm border border-white/10'
      : 'bg-gray-50 dark:bg-gray-800/50';

  const buttonBase = bedtimeMode
    ? 'hover:bg-[#e0e5ec] hover:shadow-[1px_1px_2px_#b8bdc4,-1px_-1px_2px_#ffffff]'
    : focusMode
      ? 'hover:bg-white/10'
      : 'hover:bg-gray-100 dark:hover:bg-gray-700';

  const iconColor = bedtimeMode
    ? 'text-[#1a0f08]'
    : focusMode
      ? 'text-white/70'
      : 'text-gray-500 dark:text-gray-400';

  const divider = (
    <div className={`w-px h-4 mx-0.5 ${
      bedtimeMode
        ? 'bg-[#b8bdc4]'
        : focusMode
          ? 'bg-white/20'
          : 'bg-gray-300 dark:bg-gray-600'
    }`} />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex flex-wrap items-center gap-1 mt-1.5 px-2 py-1.5 rounded-lg ${containerStyle} relative`}
      onDoubleClick={handleDoubleClick}
    >
      {/* Instagram-style heart animation on double click */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumbs Up */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLike}
        className={`p-1.5 rounded-md transition-all cursor-pointer ${buttonBase} ${
          feedback[messageIndex] === 'up'
            ? bedtimeMode
              ? 'bg-green-200 text-green-700'
              : focusMode
                ? 'bg-green-500/30 text-green-400'
                : 'bg-green-100 dark:bg-green-900/30 text-green-600'
            : iconColor
        }`}
        title="Helpful"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </motion.button>

      {/* Thumbs Down */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleDislike}
        className={`p-1.5 rounded-md transition-all cursor-pointer ${buttonBase} ${
          feedback[messageIndex] === 'down'
            ? bedtimeMode
              ? 'bg-red-200 text-red-700'
              : focusMode
                ? 'bg-red-500/30 text-red-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600'
            : iconColor
        }`}
        title="Not helpful"
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </motion.button>

      {divider}

      {/* Copy */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onCopy(content, messageIndex)}
        className={`p-1.5 rounded-md transition-all cursor-pointer ${buttonBase} ${
          copied === messageIndex
            ? bedtimeMode
              ? 'text-green-700'
              : focusMode
                ? 'text-green-400'
                : 'text-green-600'
            : iconColor
        }`}
        title="Copy"
      >
        {copied === messageIndex
          ? <Check className="w-3.5 h-3.5" />
          : <Copy className="w-3.5 h-3.5" />
        }
      </motion.button>

      {/* Volume — hidden in compact (widget) mode to prevent overflow */}
      {!isCompact && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSpeak(content)}
          className={`p-1.5 rounded-md transition-all cursor-pointer ${buttonBase} ${
            speaking
              ? bedtimeMode
                ? 'text-blue-700'
                : focusMode
                  ? 'text-blue-400'
                  : 'text-blue-600'
              : iconColor
          }`}
          title="Read aloud"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </motion.button>
      )}

      {/* Share — hidden in compact (widget) mode to prevent overflow */}
      {!isCompact && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onShare(content, messageIndex)}
          className={`p-1.5 rounded-md transition-all cursor-pointer ${buttonBase} ${iconColor}`}
          title="Share"
        >
          <Share2 className="w-3.5 h-3.5" />
        </motion.button>
      )}

      {/* Tell Me More — full label in normal mode, icon-only in compact (widget) mode */}
      <motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  onClick={() => onTellMeMore?.()}
  className={`
    flex items-center gap-1 p-1.5 rounded-md transition-all duration-300 cursor-pointer
    border border-purple-600 dark:border-purple-400
    bg-purple-600 dark:bg-purple-400
    text-white dark:text-gray-900
    hover:bg-transparent hover:text-purple-600 dark:hover:text-purple-400
  `}
  title="Tell me more"
>
  <span className="text-xs font-semibold whitespace-nowrap">Tell Me More</span>
</motion.button>
    </motion.div>
  );
}
















// import { ThumbsUp, ThumbsDown, Copy, Share2, Volume2, Check, Heart } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useState } from 'react';

// export default function ChatActions({
//   messageIndex,
//   content,
//   feedback,
//   onFeedback,
//   onCopy,
//   onSpeak,
//   onShare,
//   onTellMeMore,
//   copied,
//   speaking,
//   focusMode = false,
//   bedtimeMode = false
// }) {
//   const [showHeart, setShowHeart] = useState(false);

//   const handleLike = () => {
//     if (feedback[messageIndex] === 'up') {
//       onFeedback(messageIndex, null);
//     } else {
//       onFeedback(messageIndex, 'up');
//       setShowHeart(true);
//       setTimeout(() => setShowHeart(false), 1000);
//     }
//   };

//   const handleDislike = () => {
//     if (feedback[messageIndex] === 'down') {
//       onFeedback(messageIndex, null);
//     } else {
//       onFeedback(messageIndex, 'down');
//     }
//   };

//   const handleDoubleClick = () => {
//     if (feedback[messageIndex] !== 'up') {
//       onFeedback(messageIndex, 'up');
//       setShowHeart(true);
//       setTimeout(() => setShowHeart(false), 1000);
//     }
//   };

//   // Dynamic styling based on mode - compact for viewport fit
//   const containerStyle = bedtimeMode
//     ? 'bg-[#d5dae1] shadow-[inset_1px_1px_3px_#b8bdc4,inset_-1px_-1px_3px_#ffffff]'
//     : focusMode
//       ? 'bg-white/5 backdrop-blur-sm border border-white/10'
//       : 'bg-gray-50 dark:bg-gray-800/50';

//   const buttonBaseStyle = bedtimeMode
//     ? 'hover:bg-[#e0e5ec] hover:shadow-[1px_1px_2px_#b8bdc4,-1px_-1px_2px_#ffffff]'
//     : focusMode
//       ? 'hover:bg-white/10'
//       : 'hover:bg-gray-100 dark:hover:bg-gray-700';

//   const iconColor = bedtimeMode
//     ? 'text-[#1a0f08]'
//     : focusMode
//       ? 'text-white/70'
//       : 'text-gray-500 dark:text-gray-400';

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -3 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.15 }}
//       className={`flex items-center gap-1 mt-1.5 px-2 py-1.5 rounded-lg ${containerStyle} relative`}
//       onDoubleClick={handleDoubleClick}
//     >
//       {/* Instagram-like Heart Animation */}
//       <AnimatePresence>
//         {showHeart && (
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1.5, opacity: 1 }}
//             exit={{ scale: 2, opacity: 0 }}
//             transition={{ duration: 0.6 }}
//             className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
//           >
//             <Heart className="w-8 h-8 text-red-500 fill-red-500" />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={handleLike}
//         className={`p-1.5 rounded-md transition-all cursor-pointer ${buttonBaseStyle} ${
//           feedback[messageIndex] === 'up'
//             ? bedtimeMode
//               ? 'bg-green-200 text-green-700'
//               : focusMode
//                 ? 'bg-green-500/30 text-green-400'
//                 : 'bg-green-100 dark:bg-green-900/30 text-green-600'
//             : iconColor
//         }`}
//         title="Helpful"
//       >
//         <ThumbsUp className="w-3.5 h-3.5" />
//       </motion.button>

//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={handleDislike}
//         className={`p-1.5 rounded-md transition-all cursor-pointer ${buttonBaseStyle} ${
//           feedback[messageIndex] === 'down'
//             ? bedtimeMode
//               ? 'bg-red-200 text-red-700'
//               : focusMode
//                 ? 'bg-red-500/30 text-red-400'
//                 : 'bg-red-100 dark:bg-red-900/30 text-red-600'
//             : iconColor
//         }`}
//         title="Not helpful"
//       >
//         <ThumbsDown className="w-3.5 h-3.5" />
//       </motion.button>

//       {/* Separator */}
//       <div className={`w-px h-4 mx-0.5 ${bedtimeMode ? 'bg-[#b8bdc4]' : focusMode ? 'bg-white/20' : 'bg-gray-300 dark:bg-gray-600'}`} />

//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => onCopy(content, messageIndex)}
//         className={`p-1.5 rounded-md transition-all cursor-pointer ${buttonBaseStyle} ${
//           copied === messageIndex
//             ? bedtimeMode
//               ? 'text-green-700'
//               : focusMode
//                 ? 'text-green-400'
//                 : 'text-green-600'
//             : iconColor
//         }`}
//         title="Copy"
//       >
//         {copied === messageIndex ? (
//           <Check className="w-3.5 h-3.5" />
//         ) : (
//           <Copy className="w-3.5 h-3.5" />
//         )}
//       </motion.button>

//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => onSpeak(content)}
//         className={`p-1.5 rounded-md transition-all cursor-pointer ${buttonBaseStyle} ${
//           speaking
//             ? bedtimeMode
//               ? 'text-blue-700'
//               : focusMode
//                 ? 'text-blue-400'
//                 : 'text-blue-600'
//             : iconColor
//         }`}
//         title="Read aloud"
//       >
//         <Volume2 className="w-3.5 h-3.5" />
//       </motion.button>

//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => onShare(content, messageIndex)}
//         className={`p-1.5 rounded-md transition-all cursor-pointer ${buttonBaseStyle} ${iconColor}`}
//         title="Share"
//       >
//         <Share2 className="w-3.5 h-3.5" />
//       </motion.button>
//       <motion.button
//   whileHover={{ scale: 1.1 }}
//   whileTap={{ scale: 0.9 }}
//   onClick={() => {
//     if (onTellMeMore) {
//       onTellMeMore();
//     }
//   }}
//   className={`
//     p-1.5
//     rounded-md
//     transition-all
//     duration-300
//     cursor-pointer
//     border
//     border-purple-600
//     dark:border-purple-400
//     bg-purple-600
//     dark:bg-purple-400
//     text-white
//     dark:text-gray-900
//     hover:bg-transparent
//     hover:text-purple-600
//     dark:hover:text-white-400
//   `}
//   title="Tell me more"
// >
//   <span className="text-xs font-semibold">
//     Tell Me More
//   </span>
// </motion.button>
//     </motion.div>
    
//   );
// }
