
import React from 'react';
import { ExamConfig, Page, StudentAnswers } from '../types';
import GlitchText from './GlitchText';

interface ReviewScreenProps {
  examConfig: ExamConfig;
  studentAnswers: StudentAnswers;
  setPage: (page: Page) => void;
  setCurrentQuestion: (index: number) => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ examConfig, studentAnswers, setPage, setCurrentQuestion }) => {
  const handleEditAnswer = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
    setPage('exam');
  };
  
  const handleSubmit = () => {
    setPage('result');
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-white">
        <header className="text-center mb-8">
          <GlitchText text="Review Your Answers" className="text-3xl sm:text-4xl md:text-5xl font-orbitron text-glow-cyan" />
        </header>
        
        <main className="space-y-3 p-4 border-2 border-cyan-400 rounded-lg neon-glow-cyan max-h-[60vh] overflow-y-auto">
          {Array.from({ length: examConfig.totalQuestions }).map((_, index) => {
            const studentAns = studentAnswers[index] || '---';

            return (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-900 bg-opacity-70 rounded-md">
                <div className="flex-1 pr-4">
                  <p className="font-semibold">Question {index + 1}</p>
                  <p className="text-fuchsia-400">Your Answer: {studentAns}</p>
                </div>
                <button onClick={() => handleEditAnswer(index)} className="px-4 py-1 text-sm bg-fuchsia-600 rounded btn-neon">Edit</button>
              </div>
            );
          })}
        </main>
        
        <footer className="mt-8 text-center flex flex-col items-center space-y-4">
            <button
                onClick={handleSubmit}
                className="w-full max-w-xs py-3 bg-green-500 text-black font-bold text-lg rounded-lg btn-neon transition-transform duration-200 hover:scale-105"
            >
                Submit Exam
            </button>
             <button
                onClick={() => setPage('exam')}
                className="text-cyan-400 hover:text-cyan-300"
            >
                ← Back to Last Question
            </button>
        </footer>
      </div>
    </div>
  );
};

export default ReviewScreen;