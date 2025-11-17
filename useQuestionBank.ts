
import { useState, useEffect, useCallback } from 'react';
import { Question } from '../types';
import { DEFAULT_QUESTION_BANK } from '../constants';

const LOCAL_STORAGE_KEY = 'questionBank';

export const useQuestionBank = (): [
  Question[],
  (question: Omit<Question, 'id'>) => void,
  (question: Question) => void,
  (id: string) => void
] => {
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return item ? JSON.parse(item) : DEFAULT_QUESTION_BANK;
    } catch (error) {
      console.error("Error reading questions from localStorage", error);
      return DEFAULT_QUESTION_BANK;
    }
  });

  useEffect(() => {
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions));
    } catch (error) {
        console.error("Error writing questions to localStorage", error);
    }
  }, [questions]);

  useEffect(() => {
    if (!window.localStorage.getItem(LOCAL_STORAGE_KEY)) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_QUESTION_BANK));
    }
  }, []);
  
  const addQuestion = useCallback((questionData: Omit<Question, 'id'>) => {
    const newQuestion: Question = {
      id: `q${new Date().getTime()}`,
      ...questionData,
    };
    setQuestions(prev => [...prev, newQuestion]);
  }, []);
  
  const updateQuestion = useCallback((updatedQuestion: Question) => {
    setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  }, []);


  return [questions, addQuestion, updateQuestion, deleteQuestion];
};
