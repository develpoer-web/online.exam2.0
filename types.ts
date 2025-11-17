
export interface ExamConfig {
  title: string;
  time: number; // in minutes
  totalMarks: number;
  totalQuestions: number;
  isActive: boolean;
  // New flexible scoring options
  cutMarkPerWrongAnswer: number;
  fixedPenalty: number;
  // Admin-defined string of correct answers, e.g., "ABCDA"
  correctAnswers: string;
}

export type Page = 'studentHome' | 'exam' | 'review' | 'result' | 'adminLogin' | 'adminDashboard';

export type StudentAnswers = { [key: number]: string };

// Fix: Add Question interface to resolve missing type error.
export interface Question {
  id: string;
  prompt: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}
