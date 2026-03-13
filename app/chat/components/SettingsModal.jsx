// SettingsModal.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Moon, Sun, Monitor, Volume2, VolumeX, Palette, Type,
  ChevronLeft, ChevronRight, Bell, Accessibility, Mic, Info,
  Check, Eye
} from 'lucide-react';
import { BACKGROUND_MAP, FONT_SIZE_MAP, CHAT_BUBBLE_COLORS, DEFAULT_BUBBLE_COLOR } from '../utils/constants';

const CATEGORIES = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'sound',      label: 'Sound & TTS', icon: Volume2 },
  { id: 'voice',      label: 'Voice',       icon: Mic },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'about',      label: 'About',       icon: Info },
];

export default function SettingsModal({
  show,
  onClose,
  settings,
  availableVoices = [],
  playSound,
  onPreviewBackground,
  isWidgetMode = false,
}) {
  const [activeCategory, setActiveCategory] = useState('appearance');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabScrollRef = useRef(null);

  // ── Tab scroll state ───────────────────────────────────────────────────────
  const updateScrollState = () => {
    const el = tabScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    if (show && isWidgetMode) {
      setTimeout(updateScrollState, 100);
    }
  }, [show, isWidgetMode]);

  const scrollTabs = (dir) => {
    const el = tabScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 80, behavior: 'smooth' });
    setTimeout(updateScrollState, 150);
  };

  if (!show) return null;

  // ── Bedtime-aware style tokens ─────────────────────────────────────────────
  const bedtime = settings.bedtimeMode;

  const glassStyle = bedtime
    ? 'bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bdc4,-4px_-4px_8px_#ffffff]'
    : 'bg-white dark:bg-gray-900 shadow-2xl border border-gray-200/60 dark:border-gray-700/50';

  const sidebarStyle = bedtime
    ? 'bg-[#d5dae1] border-r border-[#c8ced6]'
    : 'bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700';

  const activeTabStyle = bedtime
    ? 'bg-[#c8ced6] shadow-[inset_2px_2px_4px_#b8bdc4,inset_-2px_-2px_4px_#ffffff] text-[#1a0f08]'
    : 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 shadow-sm border border-gray-200 dark:border-gray-700';

  const inactiveTabStyle = bedtime
    ? 'text-[#555] hover:bg-[#d5dae1]'
    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white';

  const headingStyle   = bedtime ? 'text-[#1a0f08]' : 'text-gray-900 dark:text-white';
  const textMuted      = bedtime ? 'text-[#555]'    : 'text-gray-500 dark:text-gray-400';
  const labelStyle     = bedtime ? 'text-[#333]'    : 'text-gray-700 dark:text-gray-300';
  const inputStyle     = bedtime
    ? 'bg-[#d5dae1] shadow-[inset_2px_2px_4px_#b8bdc4,inset_-2px_-2px_4px_#ffffff] text-[#1a0f08] border-transparent'
    : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white';

  const divider = bedtime
    ? 'border-[#c8ced6]'
    : 'border-gray-200 dark:border-gray-700';

  // ── Content renderer ───────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeCategory) {

      // ────────────────────────── APPEARANCE ──────────────────────────────────
      case 'appearance':
        return (
          <div className="space-y-6">
            {/* Theme */}
            <section>
              <h3 className={`text-sm font-semibold mb-3 ${headingStyle}`}>Theme</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light',  label: 'Light',  icon: Sun },
                  { id: 'dark',   label: 'Dark',   icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => { settings.setTheme(id); playSound?.('click'); }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all cursor-pointer ${
                      settings.theme === id
                        ? bedtime
                          ? 'border-[#8b5a3c] bg-[#d5dae1] shadow-[inset_2px_2px_4px_#b8bdc4]'
                          : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                        : `border-transparent ${bedtime ? 'hover:bg-[#d5dae1]' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'} ${labelStyle}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Background */}
            <section>
              <h3 className={`text-sm font-semibold mb-3 ${headingStyle}`}>Background Theme</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(BACKGROUND_MAP).map(([key, gradient]) => (
                  <div
                    key={key}
                    className={`relative rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                      settings.background === key ? 'ring-2 ring-purple-500 ring-offset-1' : ''
                    }`}
                    style={{ background: gradient, height: 64 }}
                    onClick={() => { settings.setBackground(key); playSound?.('click'); }}
                    onMouseEnter={() => onPreviewBackground?.(key)}
                    onMouseLeave={() => onPreviewBackground?.(null)}
                  >
                    <div className="absolute inset-0 flex items-end justify-center pb-1.5">
                      <span className="text-[10px] font-semibold text-white drop-shadow capitalize">{key}</span>
                    </div>
                    {settings.background === key && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white/90 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-purple-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Chat Bubble Color */}
            <section>
              <h3 className={`text-sm font-semibold mb-3 ${headingStyle}`}>Chat Bubble Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(CHAT_BUBBLE_COLORS).map(([key, palette]) => (
                  <button
                    key={key}
                    onClick={() => { settings.setBubbleColor(key); playSound?.('click'); }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer ${
                      settings.bubbleColor === key
                        ? bedtime ? 'border-[#8b5a3c]' : 'border-purple-500'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex gap-0.5">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: palette.user }} />
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: palette.ai }} />
                    </div>
                    <span className={`text-[10px] font-medium truncate w-full text-center ${labelStyle}`}>{palette.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Bedtime Mode */}
            <section>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-sm font-semibold ${headingStyle}`}>Bedtime Mode</h3>
                  <p className={`text-xs mt-0.5 ${textMuted}`}>Warm neumorphic design for night reading</p>
                </div>
                <button
                  onClick={() => { settings.setBedtimeMode(v => !v); playSound?.('click'); }}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    settings.bedtimeMode
                      ? bedtime ? 'bg-[#8b5a3c]' : 'bg-purple-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.bedtimeMode ? 'left-6.5' : 'left-0.5'}`} />
                </button>
              </div>
            </section>
          </div>
        );

      // ────────────────────────── TYPOGRAPHY ──────────────────────────────────
      case 'typography':
        return (
          <div className="space-y-6">
            {/* Font Size */}
            <section>
              <h3 className={`text-sm font-semibold mb-3 ${headingStyle}`}>Font Size</h3>
              <div className="flex gap-2">
                {Object.keys(FONT_SIZE_MAP).map((size) => (
                  <button
                    key={size}
                    onClick={() => { settings.setFontSize(size); playSound?.('click'); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                      settings.fontSize === size
                        ? bedtime
                          ? 'border-[#8b5a3c] bg-[#d5dae1] shadow-[inset_2px_2px_4px_#b8bdc4] text-[#1a0f08]'
                          : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                        : `border-transparent ${bedtime ? 'bg-[#d5dae1] hover:bg-[#c8ced6]' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'} ${labelStyle}`
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </section>

            {/* Font Family */}
            <section>
              <h3 className={`text-sm font-semibold mb-3 ${headingStyle}`}>Font Family</h3>
              <div className="space-y-2">
                {[
                  { id: 'standard', label: 'Standard (Inter)',      style: 'font-sans' },
                  { id: 'lexend',   label: 'Lexend (Dyslexia-friendly)', style: "font-['Lexend',sans-serif]" },
                  { id: 'times',    label: 'Times New Roman',       style: 'font-serif' },
                ].map(({ id, label, style }) => (
                  <button
                    key={id}
                    onClick={() => { settings.setFontFamily(id); playSound?.('click'); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all cursor-pointer ${style} ${
                      settings.fontFamily === id
                        ? bedtime
                          ? 'border-[#8b5a3c] bg-[#d5dae1] shadow-[inset_2px_2px_4px_#b8bdc4] text-[#1a0f08]'
                          : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                        : `border-transparent ${bedtime ? 'bg-[#d5dae1] hover:bg-[#c8ced6]' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'} ${labelStyle}`
                    }`}
                  >
                    <span className="text-sm">{label}</span>
                    {settings.fontFamily === id && <Check className="w-4 h-4 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </section>

            {/* Font Weight */}
            <section>
              <h3 className={`text-sm font-semibold mb-3 ${headingStyle}`}>Font Style</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'regular', label: 'Regular' },
                  { id: 'bold',    label: 'Bold'    },
                  { id: 'italic',  label: 'Italic'  },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => { settings.setFontWeight(id); playSound?.('click'); }}
                    className={`py-2 rounded-lg text-sm border transition-all cursor-pointer ${
                      id === 'bold' ? 'font-bold' : id === 'italic' ? 'italic' : 'font-normal'
                    } ${
                      settings.fontWeight === id
                        ? bedtime
                          ? 'border-[#8b5a3c] bg-[#d5dae1] shadow-[inset_2px_2px_4px_#b8bdc4] text-[#1a0f08]'
                          : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                        : `border-transparent ${bedtime ? 'bg-[#d5dae1] hover:bg-[#c8ced6]' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'} ${labelStyle}`
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        );

      // ────────────────────────── SOUND & TTS ─────────────────────────────────
      case 'sound':
        return (
          <div className="space-y-6">
            <section className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-semibold ${headingStyle}`}>Sound Effects</h3>
                <p className={`text-xs mt-0.5 ${textMuted}`}>UI click and notification sounds</p>
              </div>
              <button
                onClick={() => { settings.setSoundEffects(v => !v); playSound?.('click'); }}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${settings.soundEffects ? (bedtime ? 'bg-[#8b5a3c]' : 'bg-purple-600') : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.soundEffects ? 'left-6.5' : 'left-0.5'}`} />
              </button>
            </section>

            <section className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-semibold ${headingStyle}`}>Text-to-Speech</h3>
                <p className={`text-xs mt-0.5 ${textMuted}`}>Read AI responses aloud</p>
              </div>
              <button
                onClick={() => { settings.setTtsEnabled(v => !v); playSound?.('click'); }}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${settings.ttsEnabled ? (bedtime ? 'bg-[#8b5a3c]' : 'bg-purple-600') : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.ttsEnabled ? 'left-6.5' : 'left-0.5'}`} />
              </button>
            </section>

            {settings.ttsEnabled && (
              <>
                {[
                  { key: 'rate',   label: 'Speed',  min: 0.5, max: 2,   step: 0.1 },
                  { key: 'pitch',  label: 'Pitch',  min: 0.5, max: 2,   step: 0.1 },
                  { key: 'volume', label: 'Volume', min: 0,   max: 1,   step: 0.1 },
                ].map(({ key, label, min, max, step }) => (
                  <section key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-sm font-semibold ${headingStyle}`}>{label}</h3>
                      <span className={`text-xs ${textMuted}`}>{settings.ttsSettings[key]?.toFixed(1)}</span>
                    </div>
                    <input
                      type="range" min={min} max={max} step={step}
                      value={settings.ttsSettings[key] || 1}
                      onChange={(e) => settings.setTtsSettings(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                      className="w-full accent-purple-600"
                    />
                  </section>
                ))}
              </>
            )}
          </div>
        );

      // ────────────────────────── VOICE ───────────────────────────────────────
      case 'voice':
        return (
          <div className="space-y-4">
            <h3 className={`text-sm font-semibold ${headingStyle}`}>Select Voice</h3>
            {availableVoices.length === 0 ? (
              <p className={`text-sm ${textMuted}`}>No voices available. Check browser TTS support.</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
                {availableVoices.map((voice) => (
                  <button
                    key={voice.name}
                    onClick={() => { settings.setSelectedVoice(voice); playSound?.('click'); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                      settings.selectedVoice?.name === voice.name
                        ? bedtime
                          ? 'bg-[#d5dae1] shadow-[inset_2px_2px_4px_#b8bdc4] text-[#1a0f08]'
                          : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                        : `${bedtime ? 'hover:bg-[#d5dae1]' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} ${labelStyle}`
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium truncate">{voice.name}</p>
                      <p className={`text-xs ${textMuted}`}>{voice.lang}</p>
                    </div>
                    {settings.selectedVoice?.name === voice.name && <Check className="w-4 h-4 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      // ────────────────────────── ACCESSIBILITY ───────────────────────────────
      case 'accessibility':
        return (
          <div className="space-y-6">
            <section className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-semibold ${headingStyle}`}>Animations</h3>
                <p className={`text-xs mt-0.5 ${textMuted}`}>Reduce motion for accessibility</p>
              </div>
              <button
                onClick={() => { settings.setAnimationsEnabled(v => !v); playSound?.('click'); }}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${settings.animationsEnabled ? (bedtime ? 'bg-[#8b5a3c]' : 'bg-purple-600') : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.animationsEnabled ? 'left-6.5' : 'left-0.5'}`} />
              </button>
            </section>

            <section className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-semibold ${headingStyle}`}>Auto-Scroll</h3>
                <p className={`text-xs mt-0.5 ${textMuted}`}>Automatically scroll to new messages</p>
              </div>
              <button
                onClick={() => { settings.setAutoScroll(v => !v); playSound?.('click'); }}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${settings.autoScroll ? (bedtime ? 'bg-[#8b5a3c]' : 'bg-purple-600') : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.autoScroll ? 'left-6.5' : 'left-0.5'}`} />
              </button>
            </section>
          </div>
        );

      // ────────────────────────── ABOUT ───────────────────────────────────────
      case 'about':
        return (
          <div className="space-y-4">
            <div className={`text-center p-6 rounded-2xl ${bedtime ? 'bg-[#d5dae1] shadow-[inset_2px_2px_4px_#b8bdc4,inset_-2px_-2px_4px_#ffffff]' : 'bg-gradient-to-br from-purple-500/10 to-cyan-500/10 dark:from-purple-900/20 dark:to-cyan-900/20'}`}>
              <div className="text-3xl mb-2">✨</div>
              <h3 className={`text-lg font-bold ${headingStyle}`}>AI Shine</h3>
              <p className={`text-sm mt-1 ${textMuted}`}>Your intelligent learning companion</p>
              <p className={`text-xs mt-3 ${textMuted}`}>Powered by Gemini · MongoDB Atlas · AWS Bedrock</p>
            </div>
            <p className={`text-xs text-center ${textMuted}`}>
              Ask any question about AI, machine learning, or technology.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Widget mode: full-screen takeover with horizontal tabs ─────────────────
  if (isWidgetMode) {
    return (
      <AnimatePresence>
        <motion.div
          key="widget-settings"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col overflow-hidden rounded-2xl"
        >
          <div className={`${glassStyle} w-full h-full flex flex-col rounded-2xl overflow-hidden`}>

            {/* Header */}
            <div className={`flex items-center justify-between px-3 py-2.5 border-b flex-shrink-0 ${bedtime ? 'border-[#c8ced6] bg-[#e0e5ec]' : 'border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'}`}>
              <span className={`text-sm font-bold ${headingStyle}`}>Settings</span>
              <button onClick={onClose} className={`p-1.5 rounded-lg transition-all cursor-pointer ${bedtime ? 'hover:bg-[#d5dae1] text-[#1a0f08]' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal tab bar */}
            <div className={`relative flex items-center flex-shrink-0 border-b ${bedtime ? 'border-[#c8ced6] bg-[#e0e5ec]' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'}`}>
              {canScrollLeft && (
                <button onClick={() => scrollTabs(-1)} className={`absolute left-0 z-10 p-1.5 ${bedtime ? 'bg-[#e0e5ec]' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
              <div
                ref={tabScrollRef}
                className="flex gap-1 overflow-x-auto scrollbar-hide px-2 py-1.5"
                style={{ minHeight: 0, scrollbarWidth: 'none' }}
                onScroll={updateScrollState}
              >
                {CATEGORIES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setActiveCategory(id); playSound?.('click'); }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                      activeCategory === id ? activeTabStyle : inactiveTabStyle
                    }`}
                  >
                    <Icon className="w-3 h-3 flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
              {canScrollRight && (
                <button onClick={() => scrollTabs(1)} className={`absolute right-0 z-10 p-1.5 ${bedtime ? 'bg-[#e0e5ec]' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
              {renderContent()}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Full-page mode: backdrop + sidebar layout ──────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        key="fullpage-settings"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className={`${glassStyle} rounded-3xl max-w-4xl w-full h-[80vh] flex overflow-hidden`}
        >
          {/* Sidebar */}
          <div className={`w-56 flex-shrink-0 flex flex-col ${sidebarStyle}`}>
            <div className={`p-5 border-b ${divider}`}>
              <h2 className={`text-lg font-bold ${headingStyle}`}>Settings</h2>
              <p className={`text-xs mt-0.5 ${textMuted}`}>Customise your experience</p>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
              {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setActiveCategory(id); playSound?.('click'); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${
                    activeCategory === id ? activeTabStyle : inactiveTabStyle
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className={`p-4 border-t ${divider}`}>
              <button
                onClick={onClose}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  bedtime
                    ? 'bg-[#d5dae1] shadow-[2px_2px_4px_#b8bdc4,-2px_-2px_4px_#ffffff] text-[#1a0f08] hover:shadow-[3px_3px_6px_#b8bdc4,-3px_-3px_6px_#ffffff]'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                <X className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className={`px-6 py-4 border-b ${divider}`}>
              <h2 className={`text-base font-semibold ${headingStyle}`}>
                {CATEGORIES.find(c => c.id === activeCategory)?.label}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {renderContent()}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}