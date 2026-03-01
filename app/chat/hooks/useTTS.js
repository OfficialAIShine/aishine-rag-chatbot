import { useState, useEffect } from 'react';

export const useTTS = (ttsSettings, selectedVoice) => {
  const [speaking, setSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en-'));
      setAvailableVoices(englishVoices);
    };
    
    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    // CRITICAL: Cancel any ongoing speech first
    window.speechSynthesis.cancel();
    
    // Small delay to ensure cancellation completes
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply settings
      utterance.rate = ttsSettings.rate;
      utterance.pitch = ttsSettings.pitch;
      utterance.volume = ttsSettings.volume;
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en-'));
        if (englishVoice) utterance.voice = englishVoice;
      }
      
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        setSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const cancel = () => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return {
    speaking,
    speak,
    cancel,
    availableVoices
  };
};