import { useState, useEffect, useCallback } from 'react';
import { ExamConfig } from '../types';
import { DEFAULT_EXAM_CONFIG } from '../constants';

const LOCAL_STORAGE_KEY = 'examConfig';

export const useExamConfig = (): [ExamConfig, (newConfig: ExamConfig) => void] => {
  const [config, setConfig] = useState<ExamConfig>(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      const savedConfig = item ? JSON.parse(item) : {};
      // Merge saved config with defaults to prevent missing properties
      return { ...DEFAULT_EXAM_CONFIG, ...savedConfig };
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return DEFAULT_EXAM_CONFIG;
    }
  });

  const setAndStoreConfig = useCallback((newConfig: ExamConfig) => {
    try {
      setConfig(newConfig);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, []);

  // Ensure localStorage is initialized on first load if it doesn't exist
  useEffect(() => {
    if (!window.localStorage.getItem(LOCAL_STORAGE_KEY)) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_EXAM_CONFIG));
    }
  }, []);


  return [config, setAndStoreConfig];
};