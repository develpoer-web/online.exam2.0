
import React, { useState, useEffect } from 'react';
import { ExamConfig, Page, StudentAnswers } from '../types';

interface ExamScreenProps {
  examConfig: ExamConfig;
  setPage: (page: Page) => void;
  studentAnswers: StudentAnswers;
  setStudentAnswers: (answers: StudentAnswers) => void;
  currentQuestion: number;
  setCurrentQuestion: (questionIndex: number) => void;
  timeLeft: number;
}

const ExamScreen: React.FC<ExamScreenProps> = ({ 
    examConfig, setPage, studentAnswers, 
    setStudentAnswers, currentQuestion, setCurrentQuestion, timeLeft
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
      setSelectedOption(null);
  }, [currentQuestion]);

  const handleAnswer = (option: string) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const newAnswers = { ...studentAnswers, [currentQuestion]: option };
    setStudentAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < examConfig.totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setPage('review');
      }
    }, 800);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((currentQuestion + 1) / examConfig.totalQuestions) * 100;
  const options = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black bg-opacity-70">
      <div className="w-full max-w-md md:max-w-lg">
        <header className="flex justify-between items-center mb-2 p-3 border-2 border-fuchsia-500 rounded-lg neon-glow-magenta">
          <div className="text-lg font-orbitron">প্রশ্ন: {currentQuestion + 1}/{examConfig.totalQuestions}</div>
           <button onClick={() => setPage('review')} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Review</button>
          <div className="text-2xl font-bold text-glow-cyan">{formatTime(timeLeft)}</div>
        </header>

        <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4 border border-cyan-500">
            <div className="bg-cyan-400 h-2 rounded-full neon-glow-cyan transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <main className="bg-gray-900 bg-opacity-50 p-6 sm:p-8 rounded-lg border border-cyan-400">
          <div className="grid grid-cols-2 gap-4 justify-items-center">
            {options.map(option => {
              let buttonClass = 'border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-900';
              if (selectedOption === option) {
                const isCorrect = examConfig.correctAnswers[currentQuestion] === option;
                buttonClass = isCorrect ? 'bg-green-500 border-green-400 text-white neon-glow-cyan' : 'bg-red-500 border-red-400 text-white neon-glow-magenta';
              } else if(selectedOption) {
                  buttonClass = 'border-2 border-gray-600 text-gray-600';
              }
              
              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedOption}
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-4xl font-bold transition-all duration-300 ${buttonClass}`}
                  aria-label={`Option ${option}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamScreen;