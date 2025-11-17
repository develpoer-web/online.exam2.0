
import React, { useMemo, useEffect } from 'react';
import { ExamConfig, Page, StudentAnswers } from '../types';
import GlitchText from './GlitchText';

interface ResultScreenProps {
  examConfig: ExamConfig;
  studentAnswers: StudentAnswers;
  setPage: (page: Page) => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ examConfig, studentAnswers, setPage }) => {

  const results = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    const answeredCount = Object.keys(studentAnswers).length;

    for (let i = 0; i < examConfig.totalQuestions; i++) {
      if (studentAnswers[i] && studentAnswers[i] === examConfig.correctAnswers[i]) {
        correct++;
      } else if (studentAnswers[i]) {
        wrong++;
      }
    }

    const cutMark = wrong * examConfig.cutMarkPerWrongAnswer;
    const finalScore = examConfig.totalMarks - (wrong + cutMark + examConfig.fixedPenalty);

    return {
      correct,
      wrong,
      cutMark: cutMark.toFixed(2),
      fixedPenalty: examConfig.fixedPenalty.toFixed(2),
      finalScore: finalScore.toFixed(2),
      notAnswered: examConfig.totalQuestions - answeredCount,
    };
  }, [examConfig, studentAnswers]);

  // Effect to show a notification with the result as a simulation of a push notification
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notificationTitle = `ফলাফল প্রকাশিত হয়েছে!`;
      const notificationBody = `আপনার চূড়ান্ত স্কোর: ${results.finalScore}`;
      
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(notificationTitle, {
          body: notificationBody,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
        });
      });
    }
  }, [results.finalScore]);


  const ResultRow: React.FC<{ label: string; value: string | number; colorClass: string }> = ({ label, value, colorClass }) => (
    <div className={`flex justify-between items-center p-3 bg-gray-900 bg-opacity-70 rounded-md border-l-4 ${colorClass}`}>
      <span className="text-lg">{label}</span>
      <span className="text-2xl font-bold font-orbitron">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md md:max-w-2xl text-white">
        <header className="text-center mb-8">
          <GlitchText text="ফলাফল" className="text-4xl md:text-5xl font-orbitron text-glow-cyan" />
        </header>

        <main className="space-y-4 p-4 border-2 border-fuchsia-500 rounded-lg neon-glow-magenta mb-8">
          <ResultRow label="মোট সঠিক উত্তর" value={results.correct} colorClass="border-green-400 text-green-300" />
          <ResultRow label="মোট ভুল উত্তর" value={results.wrong} colorClass="border-red-400 text-red-300" />
          <ResultRow label="উত্তর দেওয়া হয়নি" value={results.notAnswered} colorClass="border-yellow-400 text-yellow-300" />
          <ResultRow label="কাটা মার্ক (ভুলের জন্য)" value={results.cutMark} colorClass="border-orange-400 text-orange-300" />
          <ResultRow label="নির্দিষ্ট জরিমানা" value={results.fixedPenalty} colorClass="border-purple-400 text-purple-300" />
          
          <div className="pt-4 mt-4 border-t-2 border-cyan-500 border-dashed">
             <ResultRow label="চূড়ান্ত স্কোর" value={results.finalScore} colorClass="border-cyan-400 text-cyan-300 text-glow-cyan" />
          </div>
        </main>

        <div className="p-4 border-2 border-cyan-400 rounded-lg neon-glow-cyan">
            <h3 className="text-2xl font-orbitron text-glow-cyan mb-4 text-center">উত্তর পর্যালোচনা</h3>
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                {Array.from({ length: examConfig.totalQuestions }).map((_, index) => {
                    const studentAns = studentAnswers[index] || 'N/A';
                    const correctAns = examConfig.correctAnswers[index];
                    const isCorrect = studentAns === correctAns;

                    return (
                        <div key={index} className={`p-3 rounded-lg bg-gray-900 bg-opacity-40 border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                            <p className="font-semibold text-gray-300 mb-2">প্রশ্ন {index + 1}</p>
                            <div className="text-sm space-y-1">
                                <p>আপনার উত্তর: <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{studentAns}</span></p>
                                {!isCorrect && <p>সঠিক উত্তর: <span className="font-bold text-cyan-400">{correctAns}</span></p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        <footer className="mt-8 text-center">
            <button
                onClick={() => setPage('studentHome')}
                className="w-full max-w-xs py-3 bg-cyan-500 text-black font-bold text-lg rounded-lg btn-neon transition-transform duration-200 hover:scale-105"
            >
                হোমে ফিরে যান
            </button>
        </footer>
      </div>
    </div>
  );
};

export default ResultScreen;