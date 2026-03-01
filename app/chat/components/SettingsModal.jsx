import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Type, 
  Volume2, 
  Zap, 
  Focus,
  HelpCircle,
  Film
} from 'lucide-react';
import { useState } from 'react';
import { BACKGROUND_MAP, CHAT_BUBBLE_COLORS } from '../utils/constants';

const SETTINGS_CATEGORIES = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'accessibility', label: 'Accessibility', icon: Type },
  { id: 'audio', label: 'Audio & Voice', icon: Volume2 },
  { id: 'modes', label: 'Modes', icon: Focus }
];

const TOOLTIPS = {
  theme: "Choose between light, dark, or system-based theme",
  fontSize: "Adjust text size for better readability",
  fontFamily: "Select font family (Lexend is dyslexia-friendly)",
  background: "Choose background style for the chat interface. Hover to preview, click to apply.",
  fontWeight: "Change text appearance (regular, bold, or italic)",
  soundEffects: "Enable or disable click and notification sounds",
  bedtimeMode: "Reduces blue light with warm colors for nighttime use",
  ttsVoice: "Select the voice for text-to-speech",
  speechRate: "Adjust how fast the AI speaks",
  speechPitch: "Change the pitch (tone) of the AI voice",
  speechVolume: "Control the volume of text-to-speech",
  focusMode: "Minimalist interface with no distractions",
  animations: "Enable or disable animations throughout the app",
  ttsToggle: "Turn text-to-speech on or off completely"
};

function Tooltip({ text }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
        type="button"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-6 top-0 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl z-50 pointer-events-none"
          >
            {text}
            <div className="absolute left-0 top-2 w-2 h-2 bg-gray-900 transform -translate-x-1 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SettingsModal({ 
  show, 
  onClose, 
  settings, 
  availableVoices, 
  playSound,
  onPreviewBackground
}) {
  const [activeCategory, setActiveCategory] = useState('appearance');

  if (!show) return null;

  const {
    theme, setTheme,
    fontSize, setFontSize,
    fontFamily, setFontFamily,
    background, setBackground,
    fontWeight, setFontWeight,
    soundEffects, setSoundEffects,
    bedtimeMode, setBedtimeMode,
    focusMode, setFocusMode,
    animationsEnabled, setAnimationsEnabled,
    ttsEnabled, setTtsEnabled,
    ttsSettings, setTtsSettings,
    selectedVoice, setSelectedVoice,
    isDarkMode,
    bubbleColor, setBubbleColor
  } = settings;

  const glassStyle = !bedtimeMode
    ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl"
    : "bg-[#e0e5ec] shadow-[8px_8px_16px_#b8bdc4,-8px_-8px_16px_#ffffff]";

  const textColor = bedtimeMode ? 'text-[#1a0f08]' : 'text-gray-900 dark:text-white';
  const labelColor = bedtimeMode ? 'text-[#1a0f08]' : 'text-gray-700 dark:text-gray-300';

  const buttonGlassStyle = !bedtimeMode
    ? "bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/30 dark:border-gray-700/30"
    : "bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bdc4,-4px_-4px_8px_#ffffff]";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`${glassStyle} rounded-3xl max-w-4xl w-full h-[80vh] flex overflow-hidden`}
          >
            {/* Sidebar */}
            <div className={`w-64 ${bedtimeMode ? 'bg-[#e0e5ec]' : 'bg-white/30 dark:bg-gray-800/30'} border-r ${bedtimeMode ? '' : 'border-white/20 dark:border-gray-700/30'} p-4`}>
              <div className="flex items-center gap-2 mb-6 px-2">
                <Settings className={`w-6 h-6 ${bedtimeMode ? 'text-[#1a0f08]' : 'text-purple-600'}`} />
                <h2 className={`text-xl font-bold ${textColor}`}>Settings</h2>
              </div>

              <nav className="space-y-2">
                {SETTINGS_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      playSound('click');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                      activeCategory === category.id
                        ? bedtimeMode
                          ? 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bdc4,inset_-4px_-4px_8px_#ffffff] text-[#1a0f08]'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : bedtimeMode
                          ? 'hover:bg-[#d1d6dc] text-[#1a0f08]'
                          : 'hover:bg-white/20 dark:hover:bg-gray-700/20 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <category.icon className={`w-5 h-5 ${bedtimeMode && activeCategory !== category.id ? 'text-[#1a0f08]' : ''}`} />
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </nav>  
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${textColor}`}>
                  {SETTINGS_CATEGORIES.find(c => c.id === activeCategory)?.label}
                </h3>
                <button
                  onClick={onClose}
                  className={`${bedtimeMode ? 'text-[#1a0f08] hover:text-[#000]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'} text-2xl cursor-pointer`}
                >
                  ✕
                </button>
              </div>

              {/* Appearance Settings */}
{activeCategory === 'appearance' && (
  <div className="space-y-6">
    {/* Theme */}
    <div>
      <div className="flex items-center mb-3">
        <label className={`text-sm font-semibold ${labelColor}`}>Theme</label>
        <Tooltip text={TOOLTIPS.theme} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: 'light', icon: Sun, label: 'Light' },
          { value: 'dark', icon: Moon, label: 'Dark' },
          { value: 'system', icon: Monitor, label: 'System' }
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setTheme(t.value);
              playSound('click');
            }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all cursor-pointer ${
              theme === t.value
                ? bedtimeMode
                  ? 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bdc4,inset_-4px_-4px_8px_#ffffff] text-[#1a0f08]'
                  : 'border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : `${buttonGlassStyle} ${bedtimeMode ? 'text-[#1a0f08]' : ''}`
            }`}
          >
            <t.icon className={`w-6 h-6 ${bedtimeMode ? 'text-[#1a0f08]' : ''}`} />
            <span className="text-xs font-medium">{t.label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Chat Bubble Colors */}
    <div>
      <div className="flex items-center mb-3">
        <label className={`text-sm font-semibold ${labelColor}`}>Chat Bubble Color</label>
        <Tooltip text="Choose your preferred chat bubble color scheme. User bubbles will use the selected color, AI bubbles will use a complementary shade." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(CHAT_BUBBLE_COLORS).map(([key, palette]) => (
          <button
            key={key}
            onClick={() => {
              setBubbleColor(key);
              playSound('click');
            }}
            className={`p-3 rounded-xl transition-all cursor-pointer relative overflow-hidden ${
              bubbleColor === key
                ? bedtimeMode
                  ? 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bdc4,inset_-4px_-4px_8px_#ffffff] text-[#1a0f08] ring-2 ring-gray-400'
                  : 'border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : `${buttonGlassStyle} ${bedtimeMode ? 'text-[#1a0f08]' : ''}`
            }`}
          >
            {/* Color preview */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: palette.user }}
              />
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: palette.ai }}
              />
            </div>
            <span className="text-sm font-medium relative z-10">{palette.name}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Background */}
    <div>
      <div className="flex items-center mb-3">
        <label className={`text-sm font-semibold ${labelColor}`}>Background</label>
        <Tooltip text={TOOLTIPS.background} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { value: 'moon', label: 'Moon' },
          { value: 'ocean', label: 'Ocean' },
          { value: 'beach', label: 'Beach' },
          { value: 'forest', label: 'Forest' },
          { value: 'sunset', label: 'Sunset' },
          { value: 'twilight', label: 'Twilight' }
        ].map((bg) => (
          <button
            key={bg.value}
            onClick={() => {
              setBackground(bg.value);
              playSound('click');
            }}
            onMouseEnter={() => onPreviewBackground(bg.value)}
            onMouseLeave={() => onPreviewBackground(background)}
            className={`p-3 rounded-xl transition-all cursor-pointer relative overflow-hidden ${
              background === bg.value
                ? bedtimeMode
                  ? 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bdc4,inset_-4px_-4px_8px_#ffffff] text-[#1a0f08]'
                  : 'border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : `${buttonGlassStyle} ${bedtimeMode ? 'text-[#1a0f08]' : ''}`
            }`}
          >
            <div className={`absolute inset-0 opacity-20 ${BACKGROUND_MAP[bg.value]}`} />
            <span className="text-sm font-medium relative z-10">{bg.label}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
)}

              {/* Accessibility Settings */}
              {activeCategory === 'accessibility' && (
                <div className="space-y-6">
                  {/* Font Size */}
                  <div>
                    <div className="flex items-center mb-3">
                      <label className={`text-sm font-semibold ${labelColor}`}>Font Size</label>
                      <Tooltip text={TOOLTIPS.fontSize} />
                    </div>
                    <div className="flex gap-2">
                      {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setFontSize(size);
                            playSound('click');
                          }}
                          className={`flex-1 py-3 rounded-xl transition-all cursor-pointer ${
                            fontSize === size
                              ? bedtimeMode
                                ? 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bdc4,inset_-4px_-4px_8px_#ffffff] text-[#1a0f08]'
                                : 'border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : `${buttonGlassStyle} ${bedtimeMode ? 'text-[#1a0f08]' : ''}`
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Family */}
                  <div>
                    <div className="flex items-center mb-3">
                      <label className={`text-sm font-semibold ${labelColor}`}>Font Family</label>
                      <Tooltip text={TOOLTIPS.fontFamily} />
                    </div>
                    <select
                      value={fontFamily}
                      onChange={(e) => {
                        setFontFamily(e.target.value);
                        playSound('click');
                      }}
                      className={`w-full p-3 rounded-xl ${buttonGlassStyle} ${textColor} cursor-pointer`}
                    >
                      <option value="standard">Standard (Sans-serif)</option>
                      <option value="lexend">Lexend (Dyslexia-friendly)</option>
                      <option value="times">Times New Roman</option>
                    </select>
                  </div>

                  {/* Font Weight */}
                  <div>
                    <div className="flex items-center mb-3">
                      <label className={`text-sm font-semibold ${labelColor}`}>Font Weight</label>
                      <Tooltip text={TOOLTIPS.fontWeight} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'regular', label: 'Regular' },
                        { value: 'bold', label: 'Bold' },
                        { value: 'italic', label: 'Italic' }
                      ].map((fw) => (
                        <button
                          key={fw.value}
                          onClick={() => {
                            setFontWeight(fw.value);
                            playSound('click');
                          }}
                          className={`p-3 rounded-xl transition-all cursor-pointer ${
                            fontWeight === fw.value
                              ? bedtimeMode
                                ? 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bdc4,inset_-4px_-4px_8px_#ffffff] text-[#1a0f08]'
                                : 'border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : `${buttonGlassStyle} ${bedtimeMode ? 'text-[#1a0f08]' : ''}`
                          }`}
                        >
                          {fw.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Audio & Voice Settings */}
              {activeCategory === 'audio' && (
                <div className="space-y-6">
                  {/* TTS Toggle */}
                  <div className={`flex items-center justify-between p-4 rounded-xl ${buttonGlassStyle}`}>
                    <div className="flex items-center">
                      <span className={`text-sm font-semibold ${labelColor}`}>Text-to-Speech</span>
                      <Tooltip text={TOOLTIPS.ttsToggle} />
                    </div>
                    <button
                      onClick={() => {
                        setTtsEnabled(!ttsEnabled);
                        playSound('click');
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        ttsEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          ttsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* TTS Voice */}
                  <div>
                    <div className="flex items-center mb-3">
                      <label className={`text-sm font-semibold ${labelColor}`}>Voice Selection</label>
                      <Tooltip text={TOOLTIPS.ttsVoice} />
                    </div>
                    <select
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const voice = availableVoices.find(v => v.name === e.target.value);
                        setSelectedVoice(voice);
                        playSound('click');
                      }}
                      disabled={!ttsEnabled}
                      className={`w-full p-3 rounded-xl ${buttonGlassStyle} ${textColor} disabled:opacity-50 cursor-pointer`}
                    >
                      <option value="">Default Voice</option>
                      {availableVoices.map((voice, idx) => (
                        <option key={idx} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Speech Rate */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <label className={`text-sm font-semibold ${labelColor}`}>Speech Rate</label>
                        <Tooltip text={TOOLTIPS.speechRate} />
                      </div>
                      <span className={`text-xs ${bedtimeMode ? 'text-[#1a0f08]' : 'text-gray-600 dark:text-gray-400'}`}>{ttsSettings.rate}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={ttsSettings.rate}
                      onChange={(e) => {
                        setTtsSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }));
                        playSound('click');
                      }}
                      disabled={!ttsEnabled}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-50"
                    />
                  </div>

                  {/* Speech Pitch */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <label className={`text-sm font-semibold ${labelColor}`}>Speech Pitch</label>
                        <Tooltip text={TOOLTIPS.speechPitch} />
                      </div>
                      <span className={`text-xs ${bedtimeMode ? 'text-[#1a0f08]' : 'text-gray-600 dark:text-gray-400'}`}>{ttsSettings.pitch}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={ttsSettings.pitch}
                      onChange={(e) => {
                        setTtsSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }));
                        playSound('click');
                      }}
                      disabled={!ttsEnabled}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-50"
                    />
                  </div>

                  {/* Speech Volume */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <label className={`text-sm font-semibold ${labelColor}`}>Speech Volume</label>
                        <Tooltip text={TOOLTIPS.speechVolume} />
                      </div>
                      <span className={`text-xs ${bedtimeMode ? 'text-[#1a0f08]' : 'text-gray-600 dark:text-gray-400'}`}>{Math.round(ttsSettings.volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={ttsSettings.volume}
                      onChange={(e) => {
                        setTtsSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }));
                        playSound('click');
                      }}
                      disabled={!ttsEnabled}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-50"
                    />
                  </div>

                  {/* Sound Effects */}
                  <div className={`flex items-center justify-between p-4 rounded-xl ${buttonGlassStyle}`}>
                    <div className="flex items-center">
                      <Zap className={`w-5 h-5 mr-2 ${bedtimeMode ? 'text-[#1a0f08]' : 'text-yellow-500'}`} />
                      <span className={`text-sm font-semibold ${labelColor}`}>Sound Effects</span>
                      <Tooltip text={TOOLTIPS.soundEffects} />
                    </div>
                    <button
                      onClick={() => {
                        setSoundEffects(!soundEffects);
                        if (!soundEffects) playSound('click');
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        soundEffects ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          soundEffects ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Modes Settings */}
              {activeCategory === 'modes' && (
                <div className="space-y-6">
                  {/* Bedtime Mode */}
                  <div className={`flex items-center justify-between p-4 rounded-xl ${buttonGlassStyle}`}>
                    <div className="flex items-center">
                      <Moon className={`w-5 h-5 mr-2 ${bedtimeMode ? 'text-[#1a0f08]' : 'text-indigo-500'}`} />
                      <span className={`text-sm font-semibold ${labelColor}`}>Bedtime Mode</span>
                      <Tooltip text={TOOLTIPS.bedtimeMode} />
                    </div>
                    <button
                      onClick={() => {
                        setBedtimeMode(!bedtimeMode);
                        playSound('click');
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        bedtimeMode ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          bedtimeMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Focus Mode */}
                  <div className={`flex items-center justify-between p-4 rounded-xl ${buttonGlassStyle}`}>
                    <div className="flex items-center">
                      <Focus className={`w-5 h-5 mr-2 ${bedtimeMode ? 'text-[#1a0f08]' : 'text-blue-500'}`} />
                      <span className={`text-sm font-semibold ${labelColor}`}>Focus Mode</span>
                      <Tooltip text={TOOLTIPS.focusMode} />
                    </div>
                    <button
                      onClick={() => {
                        setFocusMode(!focusMode);
                        playSound('click');
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        focusMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          focusMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Animations Toggle */}
                  <div className={`flex items-center justify-between p-4 rounded-xl ${buttonGlassStyle}`}>
                    <div className="flex items-center">
                      <Film className={`w-5 h-5 mr-2 ${bedtimeMode ? 'text-[#1a0f08]' : 'text-pink-500'}`} />
                      <span className={`text-sm font-semibold ${labelColor}`}>Animations</span>
                      <Tooltip text={TOOLTIPS.animations} />
                    </div>
                    <button
                      onClick={() => {
                        setAnimationsEnabled(!animationsEnabled);
                        playSound('click');
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        animationsEnabled ? 'bg-pink-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



















// // app/chat/components/SettingsModal.jsx
// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, ChevronLeft } from "lucide-react";

// const LEFT_WIDTH = 280;

// const categories = [
//   { id: "appearance", title: "Appearance" },
//   { id: "typography", title: "Typography" },
//   { id: "voice", title: "Voice & Speech" },
//   { id: "chat", title: "Chat Behavior" },
//   { id: "performance", title: "Performance" },
// ];

// export default function SettingsModal({
//   show,
//   onClose,
//   settings,
//   availableVoices = [],
//   playSound = () => {},
// }) {
//   // local draft state so changes are only applied on Save
//   const [openCategory, setOpenCategory] = useState("appearance");
//   const [isMobileNav, setIsMobileNav] = useState(false);
//   const [draft, setDraft] = useState(() => createDraft(settings));

//   useEffect(() => {
//     setDraft(createDraft(settings));
//   }, [show, settings]);

//   useEffect(() => {
//     const onResize = () => setIsMobileNav(window.innerWidth < 768);
//     onResize();
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   function createDraft(s) {
//     if (!s) return {};
//     return {
//       theme: s.isDarkMode ? "dark" : "light",
//       bedtimeMode: !!s.bedtimeMode,
//       focusMode: !!s.focusMode,
//       animationsEnabled: !!s.animationsEnabled,
//       ttsEnabled: !!s.ttsEnabled,
//       selectedVoice: s.selectedVoice || null,
//       fontSize: s.fontSize || "M",
//       fontFamily: s.fontFamily || "standard",
//       background: s.background || "doodles",
//       soundEffects: !!s.soundEffects,
//     };
//   }

//   function applyDraft() {
//     // Apply draft to settings API
//     if (!settings) return;
//     settings.setDarkMode(draft.theme === "dark");
//     settings.setBedtimeMode(!!draft.bedtimeMode);
//     settings.setFocusMode(!!draft.focusMode);
//     settings.setAnimationsEnabled(!!draft.animationsEnabled);
//     settings.setTTSEnabled(!!draft.ttsEnabled);
//     if (draft.selectedVoice) settings.setSelectedVoice(draft.selectedVoice);
//     settings.setFontSize(draft.fontSize);
//     settings.setFontFamily(draft.fontFamily);
//     settings.setBackground(draft.background);
//     settings.setSoundEffects(!!draft.soundEffects);

//     playSound("click");
//   }

//   function handleSaveAndClose() {
//     applyDraft();
//     onClose?.();
//   }

//   function handleCancel() {
//     setDraft(createDraft(settings)); // reset
//     onClose?.();
//   }

//   // helpers
//   const setDraftKey = (key, value) =>
//     setDraft((d) => ({ ...d, [key]: value }));

//   // motion variants
//   const backdrop = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
//   const panel = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } };
//   const slideLeft = (x = 0) => ({ hidden: { x }, visible: { x: 0 }, exit: { x } });

//   return (
//     <AnimatePresence>
//       {show && (
//         <>
//           {/* backdrop */}
//           <motion.div
//             key="backdrop"
//             initial="hidden"
//             animate="visible"
//             exit="hidden"
//             variants={backdrop}
//             transition={{ duration: 0.18 }}
//             onClick={handleCancel}
//             className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
//             aria-hidden="true"
//           />

//           {/* modal container */}
//           <motion.div
//             key="panel"
//             initial="hidden"
//             animate="visible"
//             exit="hidden"
//             variants={panel}
//             transition={{ duration: 0.18 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//             role="dialog"
//             aria-modal="true"
//           >
//             <div
//               className={`relative w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl`}
//             >
//               <div className="absolute inset-0 pointer-events-none">
//                 {/* subtle glass layer */}
//                 <div className="w-full h-full backdrop-blur-[22px] bg-white/6 dark:bg-black/20" />
//               </div>

//               <div className="relative z-10 flex h-full">
//                 {/* Left column - categories */}
//                 <div
//                   className={`hidden md:flex flex-col w-[${LEFT_WIDTH}px] min-w-[${LEFT_WIDTH}px] bg-transparent border-r border-white/10 p-4 gap-4`}
//                 >
//                   {/* Header */}
//                   <div className="flex items-center justify-between">
//                     <div className="text-lg font-semibold">Settings</div>
//                     <button
//                       onClick={handleCancel}
//                       className="p-2 rounded-md hover:bg-white/5 transition-colors"
//                       aria-label="Close settings"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>

//                   <nav className="flex-1 overflow-auto space-y-1 pr-1">
//                     {categories.map((c) => (
//                       <button
//                         key={c.id}
//                         onClick={() => setOpenCategory(c.id)}
//                         className={`w-full text-left p-3 rounded-xl transition-colors cursor-pointer
//                           ${openCategory === c.id ? "bg-white/10 backdrop-blur-md" : "hover:bg-white/3"}
//                         `}
//                       >
//                         <div className="font-medium">{c.title}</div>
//                         <div className="text-xs text-muted-foreground/70 mt-1">
//                           {categorySubtitle(c.id)}
//                         </div>
//                       </button>
//                     ))}
//                   </nav>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleSaveAndClose}
//                       className="flex-1 px-4 py-2 rounded-[16px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-semibold shadow-md"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={handleCancel}
//                       className="flex-0 px-4 py-2 rounded-[16px] border border-white/10 text-white/90"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>

//                 {/* Right column - content */}
//                 <div className="flex-1 overflow-auto">
//                   {/* Mobile top bar (when width < md) — back button to category list */}
//                   <div className="md:hidden flex items-center justify-between p-3 border-b border-white/6">
//                     <div className="flex items-center gap-3">
//                       <button
//                         onClick={() => {
//                           // on mobile, switching to categories view toggles the nav
//                           if (openCategory === "categories") {
//                             setOpenCategory("appearance");
//                           } else {
//                             setOpenCategory("categories");
//                           }
//                         }}
//                         className="p-2 rounded-md"
//                         aria-label="back"
//                       >
//                         <ChevronLeft className="w-5 h-5" />
//                       </button>
//                       <div className="text-lg font-semibold">Settings</div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={handleSaveAndClose}
//                         className="px-3 py-2 rounded-[16px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white text-sm font-semibold"
//                       >
//                         Save
//                       </button>
//                     </div>
//                   </div>

//                   {/* Main content area (split behavior on md+) */}
//                   <div className="md:flex md:gap-6 md:p-6 p-4">
//                     {/* category list column for mobile (slide in) */}
//                     <div className="md:hidden mb-4">
//                       <div className="flex gap-2 overflow-x-auto">
//                         {categories.map((c) => (
//                           <button
//                             key={c.id}
//                             onClick={() => setOpenCategory(c.id)}
//                             className={`px-3 py-2 rounded-[16px] text-sm font-medium transition-colors whitespace-nowrap
//                               ${openCategory === c.id ? "bg-white/10" : "bg-white/3/20 hover:bg-white/6"}
//                             `}
//                           >
//                             {c.title}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     {/* content card */}
//                     <div className="flex-1 min-h-[60vh]">
//                       {/* content header */}
//                       <div className="flex items-center justify-between mb-4 md:mb-6">
//                         <div>
//                           <h3 className="text-xl font-semibold">
//                             {categoryTitle(openCategory)}
//                           </h3>
//                           <p className="text-sm text-muted-foreground/80 mt-1">
//                             {categoryDescription(openCategory)}
//                           </p>
//                         </div>
//                         <div className="hidden md:flex items-center gap-2">
//                           <button
//                             onClick={() => {
//                               // quick revert to defaults
//                               setDraft(createDraft(settings));
//                               playSound("click");
//                             }}
//                             className="px-3 py-2 rounded-[16px] border border-white/10 text-sm"
//                           >
//                             Revert
//                           </button>
//                         </div>
//                       </div>

//                       {/* panels for each category */}
//                       <div className="space-y-6">
//                         {openCategory === "appearance" && (
//                           <AppearancePanel draft={draft} setDraftKey={setDraftKey} />
//                         )}

//                         {openCategory === "typography" && (
//                           <TypographyPanel draft={draft} setDraftKey={setDraftKey} />
//                         )}

//                         {openCategory === "voice" && (
//                           <VoicePanel
//                             draft={draft}
//                             setDraftKey={setDraftKey}
//                             availableVoices={availableVoices}
//                           />
//                         )}

//                         {openCategory === "chat" && (
//                           <ChatPanel draft={draft} setDraftKey={setDraftKey} />
//                         )}

//                         {openCategory === "performance" && (
//                           <PerformancePanel draft={draft} setDraftKey={setDraftKey} />
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Mobile Save/Cancel bar bottom */}
//                   <div className="md:hidden fixed left-0 right-0 bottom-0 z-50 p-4 bg-gradient-to-t from-black/20 backdrop-blur-md">
//                     <div className="max-w-3xl mx-auto flex gap-2">
//                       <button
//                         onClick={handleSaveAndClose}
//                         className="flex-1 px-4 py-3 rounded-[16px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-semibold"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={handleCancel}
//                         className="px-4 py-3 rounded-[16px] border border-white/10 text-white/90"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* top-right small close */}
//               <div className="absolute top-4 right-4 z-20 hidden md:block">
//                 <button
//                   onClick={handleCancel}
//                   className="p-2 rounded-md hover:bg-white/5 transition-colors"
//                   aria-label="Close settings"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }

// /* -------------------------
//    Helper components below
//    ------------------------- */

// function categorySubtitle(id) {
//   switch (id) {
//     case "appearance":
//       return "Theme, background, colors";
//     case "typography":
//       return "Fonts & sizes";
//     case "voice":
//       return "TTS and voices";
//     case "chat":
//       return "Behavior & memory";
//     case "performance":
//       return "Animations & effects";
//     default:
//       return "";
//   }
// }
// function categoryTitle(id) {
//   switch (id) {
//     case "appearance":
//       return "Appearance";
//     case "typography":
//       return "Typography";
//     case "voice":
//       return "Voice & Speech";
//     case "chat":
//       return "Chat Behavior";
//     case "performance":
//       return "Performance";
//     default:
//       return "";
//   }
// }
// function categoryDescription(id) {
//   switch (id) {
//     case "appearance":
//       return "Control theme, background, and visual accessibility options.";
//     case "typography":
//       return "Choose font family and size tailored for readability.";
//     case "voice":
//       return "Text-to-speech, voices, and playback options.";
//     case "chat":
//       return "Short-term / long-term memory, reply brevity, and focus mode.";
//     case "performance":
//       return "Animations, confetti, and sound effects.";
//     default:
//       return "";
//   }
// }

// /* -------------------------
//    Panels: Appearance / Typography / Voice / Chat / Performance
//    Each panel receives draft and setDraftKey
//    ------------------------- */

// function AppearancePanel({ draft, setDraftKey }) {
//   return (
//     <section className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Theme */}
//         <div className="bg-white/3 p-4 rounded-2xl">
//           <label className="block text-sm font-medium mb-2">Theme</label>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setDraftKey("theme", "light")}
//               className={`px-3 py-2 rounded-[12px] ${draft.theme === "light" ? "bg-white/10" : "bg-white/3"}`}
//             >
//               Light
//             </button>
//             <button
//               onClick={() => setDraftKey("theme", "dark")}
//               className={`px-3 py-2 rounded-[12px] ${draft.theme === "dark" ? "bg-white/10" : "bg-white/3"}`}
//             >
//               Dark
//             </button>
//           </div>
//         </div>

//         {/* Background */}
//         <div className="bg-white/3 p-4 rounded-2xl">
//           <label className="block text-sm font-medium mb-2">Background</label>
//           <div className="flex gap-2 flex-wrap">
//             {[
//               { id: "doodles", label: "Doodles" },
//               { id: "gradient1", label: "Gradient 1" },
//               { id: "gradient2", label: "Gradient 2" },
//               { id: "gradient3", label: "Gradient 3" },
//               { id: "gradient4", label: "Gradient 4" },
//             ].map((bg) => (
//               <button
//                 key={bg.id}
//                 onClick={() => setDraftKey("background", bg.id)}
//                 className={`w-28 h-12 rounded-lg flex items-center justify-center text-xs font-medium ${draft.background === bg.id ? "ring-2 ring-offset-2 ring-indigo-400" : "hover:brightness-95"}`}
//                 style={{
//                   background:
//                     bg.id === "doodles"
//                       ? "url('/assets/bg_doodles.png') center/cover"
//                       : bg.id === "gradient1"
//                       ? "linear-gradient(90deg,#60a5fa,#7c3aed,#ec4899)"
//                       : bg.id === "gradient2"
//                       ? "linear-gradient(90deg,#34d399,#06b6d4,#7c3aed)"
//                       : bg.id === "gradient3"
//                       ? "linear-gradient(90deg,#fb923c,#ef4444,#ec4899)"
//                       : "linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)",
//                 }}
//                 aria-pressed={draft.background === bg.id}
//               >
//                 {bg.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Bedtime / Focus Toggles */}
//       <div className="flex gap-4">
//         <Toggle
//           label="Bedtime Mode"
//           checked={!!draft.bedtimeMode}
//           onChange={(v) => setDraftKey("bedtimeMode", v)}
//           help="Soft-neumorphic presentation for low-light reading."
//         />
//         <Toggle
//           label="Focus Mode"
//           checked={!!draft.focusMode}
//           onChange={(v) => setDraftKey("focusMode", v)}
//           help="Maximize focus: simplified UI and reduced animations."
//         />
//       </div>
//     </section>
//   );
// }

// function TypographyPanel({ draft, setDraftKey }) {
//   return (
//     <section className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white/3 p-4 rounded-2xl">
//           <label className="block text-sm font-medium mb-2">Font Family</label>
//           <select
//             value={draft.fontFamily}
//             onChange={(e) => setDraftKey("fontFamily", e.target.value)}
//             className="w-full p-2 rounded-lg bg-transparent border border-white/6"
//           >
//             <option value="standard">Standard (Sans)</option>
//             <option value="lexend">Lexend (Dyslexia-friendly)</option>
//             <option value="times">Times New Roman</option>
//           </select>
//         </div>

//         <div className="bg-white/3 p-4 rounded-2xl">
//           <label className="block text-sm font-medium mb-2">Font Size</label>
//           <div className="flex gap-2">
//             {["XS", "S", "M", "L", "XL"].map((sz) => (
//               <button
//                 key={sz}
//                 onClick={() => setDraftKey("fontSize", sz)}
//                 className={`px-3 py-2 rounded-[12px] ${draft.fontSize === sz ? "bg-white/10" : "bg-white/3"}`}
//               >
//                 {sz}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function VoicePanel({ draft, setDraftKey, availableVoices }) {
//   return (
//     <section className="space-y-4">
//       <div className="bg-white/3 p-4 rounded-2xl">
//         <label className="block text-sm font-medium mb-2">Enable TTS</label>
//         <Toggle
//           label=""
//           checked={!!draft.ttsEnabled}
//           onChange={(v) => setDraftKey("ttsEnabled", v)}
//         />

//         <div className="mt-4">
//           <label className="block text-sm font-medium mb-2">Voice</label>
//           <select
//             value={draft.selectedVoice || ""}
//             onChange={(e) => setDraftKey("selectedVoice", e.target.value)}
//             disabled={!draft.ttsEnabled}
//             className="w-full p-2 rounded-lg bg-transparent border border-white/6"
//           >
//             <option value="">Default</option>
//             {availableVoices.map((v) => (
//               <option key={v.name || v} value={v.name || v}>
//                 {v.name || v}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="bg-white/3 p-4 rounded-2xl">
//         <label className="block text-sm font-medium mb-2">Playback Controls</label>
//         <div className="flex gap-2 items-center">
//           <button className="px-3 py-2 rounded-[12px] bg-white/6">Test Voice</button>
//           <div className="text-sm text-muted-foreground/70">Volume / rate controls coming</div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function ChatPanel({ draft, setDraftKey }) {
//   return (
//     <section className="space-y-4">
//       <div className="bg-white/3 p-4 rounded-2xl">
//         <label className="block text-sm font-medium mb-2">Reply Brevity</label>
//         <div className="flex gap-2">
//           <button onClick={() => setDraftKey("brevity", "concise")} className={`px-3 py-2 rounded-[12px] ${draft.brevity === "concise" ? "bg-white/10" : "bg-white/3"}`}>Concise</button>
//           <button onClick={() => setDraftKey("brevity", "balanced")} className={`px-3 py-2 rounded-[12px] ${draft.brevity === "balanced" ? "bg-white/10" : "bg-white/3"}`}>Balanced</button>
//           <button onClick={() => setDraftKey("brevity", "detailed")} className={`px-3 py-2 rounded-[12px] ${draft.brevity === "detailed" ? "bg-white/10" : "bg-white/3"}`}>Detailed</button>
//         </div>
//         <p className="text-xs text-muted-foreground/70 mt-2">When enabled, “tell me more” / “be brief” are interpreted semantically by the RAG layer.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white/3 p-4 rounded-2xl">
//           <label className="block text-sm font-medium mb-2">Short-term Memory</label>
//           <Toggle checked={!!draft.shortTermMemory} onChange={(v) => setDraftKey("shortTermMemory", v)} />
//           <p className="text-xs text-muted-foreground/70 mt-2">Activates contextual short-term memory for follow-ups without storing the entire chat.</p>
//         </div>

//         <div className="bg-white/3 p-4 rounded-2xl">
//           <label className="block text-sm font-medium mb-2">Long-term Memory</label>
//           <Toggle checked={!!draft.longTermMemory} onChange={(v) => setDraftKey("longTermMemory", v)} />
//           <p className="text-xs text-muted-foreground/70 mt-2">Used for retrieving older context when explicitly requested.</p>
//         </div>
//       </div>
//     </section>
//   );
// }

// function PerformancePanel({ draft, setDraftKey }) {
//   return (
//     <section className="space-y-4">
//       <div className="bg-white/3 p-4 rounded-2xl">
//         <label className="block text-sm font-medium mb-2">Animations</label>
//         <Toggle checked={!!draft.animationsEnabled} onChange={(v) => setDraftKey("animationsEnabled", v)} />
//       </div>

//       <div className="bg-white/3 p-4 rounded-2xl">
//         <label className="block text-sm font-medium mb-2">Sound Effects</label>
//         <Toggle checked={!!draft.soundEffects} onChange={(v) => setDraftKey("soundEffects", v)} />
//       </div>

//       <div className="bg-white/3 p-4 rounded-2xl">
//         <label className="block text-sm font-medium mb-2">Confetti / Celebrations</label>
//         <Toggle checked={!!draft.confetti} onChange={(v) => setDraftKey("confetti", v)} />
//       </div>
//     </section>
//   );
// }

// /* -------------------------
//    Small UI primitives
//    ------------------------- */

// function Toggle({ label, checked, onChange, help }) {
//   return (
//     <div className="flex items-center justify-between">
//       <div>
//         {label && <div className="text-sm font-medium">{label}</div>}
//         {help && <div className="text-xs text-muted-foreground/70 mt-1">{help}</div>}
//       </div>
//       <button
//         role="switch"
//         aria-checked={checked}
//         onClick={() => onChange(!checked)}
//         className={`w-12 h-7 rounded-full p-1 transition-colors ${checked ? "bg-indigo-500" : "bg-white/6"}`}
//       >
//         <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
//       </button>
//     </div>
//   );
// }
