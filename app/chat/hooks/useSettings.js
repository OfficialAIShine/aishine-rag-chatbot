import { useState, useEffect } from 'react';
import { DEFAULT_BUBBLE_COLOR } from '../utils/constants';

export const useSettings = () => {
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState('M');
  const [fontFamily, setFontFamily] = useState('standard');
  const [background, setBackground] = useState('moon');
  const [fontWeight, setFontWeight] = useState('regular');
  const [soundEffects, setSoundEffects] = useState(true);
  const [bedtimeMode, setBedtimeMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [ttsSettings, setTtsSettings] = useState({ rate: 1.0, pitch: 1.0, volume: 1.0 });
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
        const s = JSON.parse(savedSettings);
        setTheme(s.theme || 'system');
        setFontSize(s.fontSize || 'M');
        setFontFamily(s.fontFamily || 'standard');
        setBackground(s.background || 'moon');
        setFontWeight(s.fontWeight || 'regular');
        setSoundEffects(s.soundEffects !== undefined ? s.soundEffects : true);
        setBedtimeMode(s.bedtimeMode || false);
        setAnimationsEnabled(s.animationsEnabled !== undefined ? s.animationsEnabled : true);
        setTtsEnabled(s.ttsEnabled !== undefined ? s.ttsEnabled : true);
        if (s.ttsSettings) setTtsSettings(s.ttsSettings);
        setBubbleColor(s.bubbleColor || DEFAULT_BUBBLE_COLOR);
        setAutoScroll(s.autoScroll !== undefined ? s.autoScroll : true);
      } catch (error) {
        console.error('[SETTINGS] Error loading settings:', error);
      }
    }
    setIsLoaded(true);

    // Auto-enable bedtime mode at night
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) setBedtimeMode(true);
  }, []);

  // ── Apply theme ────────────────────────────────────────────────────────────
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
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', applyTheme);
      return () => mq.removeEventListener('change', applyTheme);
    }
  }, [theme, bedtimeMode]);

  // ── Apply font family ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fontMap = {
      standard: "'Inter', system-ui, sans-serif",
      lexend:   "'Lexend', sans-serif",
      times:    "'Times New Roman', Times, serif"
    };
    document.documentElement.style.fontFamily = fontMap[fontFamily] || fontMap.standard;
  }, [fontFamily]);

  // ── Apply font weight ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const weightMap = { regular: '400', bold: '700', italic: '400' };
    document.documentElement.style.fontWeight = weightMap[fontWeight] || '400';
    document.documentElement.style.fontStyle  = fontWeight === 'italic' ? 'italic' : 'normal';
  }, [fontWeight]);

  // ── Persist settings ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('aiShineSettings', JSON.stringify({
      theme, fontSize, fontFamily, background, fontWeight,
      soundEffects, bedtimeMode, animationsEnabled,
      ttsEnabled, ttsSettings, selectedVoice: selectedVoice?.name,
      bubbleColor, autoScroll
    }));
  }, [
    theme, fontSize, fontFamily, background, fontWeight,
    soundEffects, bedtimeMode, animationsEnabled,
    ttsEnabled, ttsSettings, selectedVoice, isLoaded, bubbleColor, autoScroll
  ]);

  return {
    theme, setTheme,
    fontSize, setFontSize,
    fontFamily, setFontFamily,
    background, setBackground,
    fontWeight, setFontWeight,
    soundEffects, setSoundEffects,
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