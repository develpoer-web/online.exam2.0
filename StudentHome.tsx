
import React from 'react';
import { ExamConfig, Page } from '../types';
import GlitchText from './GlitchText';
import NotificationManager from './NotificationManager';

interface StudentHomeProps {
  setPage: (page: Page) => void;
  examConfig: ExamConfig;
  startExam: () => void;
}

const NeonBox: React.FC<{ title: string; value: string | number; color: 'cyan' | 'magenta' }> = ({ title, value, color }) => (
  <div className={`border-2 ${color === 'cyan' ? 'border-cyan-400' : 'border-fuchsia-500'} p-4 text-center rounded-lg ${color === 'cyan' ? 'neon-glow-cyan' : 'neon-glow-magenta'} w-full`}>
    <h3 className="text-lg md:text-xl font-orbitron">{title}</h3>
    <p className={`text-2xl md:text-3xl font-bold ${color === 'cyan' ? 'text-cyan-300' : 'text-fuchsia-400'} text-glow-${color}`}>{value}</p>
  </div>
);

const StudentHome: React.FC<StudentHomeProps> = ({ setPage, examConfig, startExam }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <header className="text-center mb-8 md:mb-12">
        <GlitchText text={examConfig.title} className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-glow-cyan" />
      </header>
      
      <main className="w-full max-w-sm md:max-w-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NeonBox title="সময়" value={`${examConfig.time} মিনিট`} color="cyan" />
            <NeonBox title="মোট প্রশ্ন" value={examConfig.totalQuestions} color="magenta" />
            <NeonBox title="মোট মার্ক" value={examConfig.totalMarks} color="cyan" />
        </div>

        {examConfig.isActive ? (
          <button 
            onClick={startExam} 
            className="w-full py-4 bg-cyan-500 text-black font-bold text-xl rounded-lg btn-neon transition-transform duration-200 hover:scale-105"
          >
            পরীক্ষা শুরু করুন
          </button>
        ) : (
          <div className="w-full py-4 bg-gray-700 text-gray-400 font-bold text-xl rounded-lg text-center">
            পরীক্ষাটি এখন লক করা আছে
          </div>
        )}
        
        <NotificationManager />

      </main>

      <footer className="absolute bottom-4 right-4">
        <button 
          onClick={() => setPage('adminLogin')} 
          className="text-sm text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
        >
          🔐 অ্যাডমিন লগইন
        </button>
      </footer>
    </div>
  );
};

export default StudentHome;