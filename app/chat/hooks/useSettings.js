import { useState, useEffect } from 'react';
import { DEFAULT_BUBBLE_COLOR } from '../utils/constants';

export const useSettings = () => {
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState('M');
  const [fontFamily, setFontFamily] = useState('standard');
  const [background, setBackground] = useState('moon');
  const [fontWeight, setFontWeight] = useState('regular');
  const [soundEffects, setSoundEffects] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [bedtimeMode, setBedtimeMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [ttsSettings, setTtsSettings] = useState({
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  });
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bubbleColor, setBubbleColor] = useState(DEFAULT_BUBBLE_COLOR);
  const [autoScroll, setAutoScroll] = useState(true);

  // ── Load settings on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const savedSettings = localStorage.getItem('aiShineSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setTheme(settings.theme || 'system');
        setFontSize(settings.fontSize || 'M');
        setFontFamily(settings.fontFamily || 'standard');
        setBackground(settings.background || 'moon');
        setFontWeight(settings.fontWeight || 'regular');
        setSoundEffects(settings.soundEffects !== undefined ? settings.soundEffects : true);
        setBedtimeMode(settings.bedtimeMode || false);
        setAnimationsEnabled(settings.animationsEnabled !== undefined ? settings.animationsEnabled : true);
        setTtsEnabled(settings.ttsEnabled !== undefined ? settings.ttsEnabled : true);
        if (settings.ttsSettings) setTtsSettings(settings.ttsSettings);
        setBubbleColor(settings.bubbleColor || DEFAULT_BUBBLE_COLOR);
        setAutoScroll(settings.autoScroll !== undefined ? settings.autoScroll : true);
      } catch (error) {
        console.error('[SETTINGS] Error loading settings:', error);
      }
    }

    setIsLoaded(true);

    // Auto-enable bedtime mode at night
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      setBedtimeMode(true);
    }
  }, []);

  // ── Apply theme (dark/light) ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const applyTheme = () => {
      let shouldBeDark = theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (bedtimeMode) {
        shouldBeDark = true;
        root.style.filter = 'sepia(20%) brightness(0.9)';
      } else {
        root.style.filter = '';
      }

      setIsDarkMode(shouldBeDark);
      root.classList.toggle('dark', shouldBeDark);
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme, bedtimeMode]);

  // ── Apply font family to document root ─────────────────────────────────────
  // FIX: fontFamily was stored in state but never written to the DOM.
  // Applying to :root means all text in the app inherits it automatically.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fontMap = {
      standard: "'Inter', system-ui, sans-serif",
      lexend:   "'Lexend', sans-serif",
      times:    "'Times New Roman', Times, serif"
    };

    document.documentElement.style.fontFamily = fontMap[fontFamily] || fontMap.standard;
  }, [fontFamily]);

  // ── Apply font weight + style to document root ──────────────────────────────
  // FIX: fontWeight was stored in state but never written to the DOM.
  // Italic is a font-style, not a font-weight — handled separately.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const weightMap = {
      regular: '400',
      bold:    '700',
      italic:  '400'  // italic is a style, not a weight
    };

    document.documentElement.style.fontWeight = weightMap[fontWeight] || '400';
    document.documentElement.style.fontStyle  = fontWeight === 'italic' ? 'italic' : 'normal';
  }, [fontWeight]);

  // ── Save settings on change ─────────────────────────────────────────────────
  // Guard: don't persist until initial load is complete (avoids overwriting saved state with defaults)
  useEffect(() => {
    if (!isLoaded) return;

    const settings = {
      theme,
      fontSize,
      fontFamily,
      background,
      fontWeight,
      soundEffects,
      bedtimeMode,
      animationsEnabled,
      ttsEnabled,
      ttsSettings,
      selectedVoice: selectedVoice?.name,
      bubbleColor,
      autoScroll
    };
    localStorage.setItem('aiShineSettings', JSON.stringify(settings));
  }, [
    theme, fontSize, fontFamily, background, fontWeight,
    soundEffects, bedtimeMode, animationsEnabled, ttsEnabled,
    ttsSettings, selectedVoice, isLoaded, bubbleColor, autoScroll
  ]);

  return {
    theme, setTheme,
    fontSize, setFontSize,
    fontFamily, setFontFamily,
    background, setBackground,
    fontWeight, setFontWeight,
    soundEffects, setSoundEffects,
    focusMode, setFocusMode,
    bedtimeMode, setBedtimeMode,
    animationsEnabled, setAnimationsEnabled,
    ttsEnabled, setTtsEnabled,
    ttsSettings, setTtsSettings,
    selectedVoice, setSelectedVoice,
    isDarkMode,
    isLoaded,
    bubbleColor, setBubbleColor,
    autoScroll, setAutoScroll
  };
};