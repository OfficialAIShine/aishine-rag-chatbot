import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SUGGESTIONS, WELCOME_GRADIENTS, WORKSHOP_GREETING } from '../utils/constants';

export default function LandingScreen({
  greeting,
  gradientIndex,
  hoveredSuggestion,
  setHoveredSuggestion,
  onSuggestionClick,
  animationsEnabled
}) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
      >
      {/* Greeting Section */}
      {/* Greeting Section */}
      <motion.div
        initial={animationsEnabled ? { y: -20, opacity: 0 } : {}}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <motion.h1 
            className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${WELCOME_GRADIENTS[gradientIndex]} bg-clip-text text-transparent`}
            animate={animationsEnabled ? {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            } : {}}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            {greeting}
          </motion.h1>
          
          {animationsEnabled && (
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-4xl md:text-5xl"
            >
              ✨
            </motion.div>
          )}
        </div>

        <motion.p 
          className={`text-xl md:text-2xl bg-gradient-to-r ${WELCOME_GRADIENTS[gradientIndex]} bg-clip-text text-transparent font-semibold mb-8`}
          animate={animationsEnabled ? {
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          } : {}}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        >
          What would you like to ask <strong>AI-SHINE</strong> today?
        </motion.p>

        {/* ✅ NEW: Workshop Welcome Section */}
        <motion.div
          initial={animationsEnabled ? { y: 20, opacity: 0 } : {}}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          {/* Welcome Text */}
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            {WORKSHOP_GREETING.welcome}
          </p>

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-4xl mx-auto">
            {WORKSHOP_GREETING.checklist.map((item, idx) => (
              <motion.div
                key={idx}
                initial={animationsEnabled ? { scale: 0.9, opacity: 0 } : {}}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl p-4 text-center"
              >
                <h3 className="font-semibold text-sm md:text-base text-gray-800 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Let's Dive In */}
          <p className={`text-lg md:text-xl font-semibold bg-gradient-to-r ${WELCOME_GRADIENTS[gradientIndex]} bg-clip-text text-transparent`}>
            {WORKSHOP_GREETING.divein}
          </p>
        </motion.div>
      </motion.div>

      {/* Suggestions Grid */}
      <motion.div
        initial={animationsEnabled ? { y: 20, opacity: 0 } : {}}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {SUGGESTIONS.map((suggestion, idx) => (
            <motion.button
              key={idx}
              initial={animationsEnabled ? { y: 20, opacity: 0 } : {}}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              whileTap={animationsEnabled ? { scale: 0.98 } : {}}
              onMouseEnter={() => setHoveredSuggestion(idx)}
              onMouseLeave={() => setHoveredSuggestion(null)}
              onClick={() => onSuggestionClick(suggestion)}
              className={`relative p-4 rounded-xl backdrop-blur-md border-2 transition-all shadow-lg text-left group overflow-hidden cursor-pointer ${
                hoveredSuggestion === idx 
                  ? 'bg-gradient-to-r from-pink-200 via-purple-200 to-cyan-200 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-cyan-900/30 border-transparent' 
                  : 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Flowing Gradient Background on Hover */}
              {hoveredSuggestion === idx && animationsEnabled && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-500 opacity-20"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                />
              )}

{hoveredSuggestion === idx && (
                <>
                  {/* Top Right - Star */}
                  <motion.svg
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-1 -right-1 w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <motion.path
                      d="M12 2L15.5 8.5L22 9.5L17 14.5L18 21L12 17.5L6 21L7 14.5L2 9.5L8.5 8.5L12 2Z"
                      stroke="url(#gradient1)"
                      strokeWidth="2"
                      fill="url(#gradient1)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f472b6" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </motion.svg>

                  {/* Bottom Left - Curve */}
                  <motion.svg
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute -bottom-1 -left-1 w-12 h-12"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <motion.path
                      d="M3 18 Q8 8, 18 3"
                      stroke="url(#gradient2)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <defs>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </motion.svg>

                  {/* Top Left - Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="absolute top-2 left-2 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"
                  />

                  {/* Bottom Right - Triangle */}
                  <motion.svg
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="absolute bottom-2 right-2 w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <motion.path
                      d="M12 2L22 22L2 22Z"
                      stroke="url(#gradient3)"
                      strokeWidth="2"
                      fill="url(#gradient3)"
                      fillOpacity="0.3"
                    />
                    <defs>
                      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </motion.svg>

                  {/* Middle Right - Zigzag */}
                  <motion.svg
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="absolute top-1/2 -right-1 w-6 h-12"
                    viewBox="0 0 12 24"
                    fill="none"
                  >
                    <motion.path
                      d="M2 2L10 8L2 14L10 20"
                      stroke="url(#gradient4)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7 }}
                    />
                    <defs>
                      <linearGradient id="gradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </motion.svg>

                  {/* Middle Left - Spiral */}
                  <motion.svg
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute top-1/3 -left-1 w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <motion.path
                      d="M12 2 Q18 6, 18 12 Q18 18, 12 18 Q6 18, 6 12 Q6 8, 10 8"
                      stroke="url(#gradient5)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1 }}
                    />
                    <defs>
                      <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </motion.svg>

                  {/* Top Middle - Hearts */}
                  <motion.svg
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="url(#gradient6)"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    <defs>
                      <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f472b6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </motion.svg>

                  {/* Bottom Middle - Plus */}
                  <motion.svg
                    initial={{ opacity: 0, rotate: 45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="absolute -bottom-1 left-1/3 w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <motion.path
                      d="M12 5v14M5 12h14"
                      stroke="url(#gradient7)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </>
              )}

              {/* Content */}
              <div className="flex items-start gap-3 relative z-10">
                <Sparkles className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-all ${
                  hoveredSuggestion === idx ? 'text-purple-600' : 'text-purple-500'
                }`} />
                <span className={`text-sm transition-colors ${
                  hoveredSuggestion === idx 
                    ? 'text-gray-900 dark:text-white font-medium' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {suggestion}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}