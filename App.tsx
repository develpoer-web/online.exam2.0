
import React, { useState, useEffect } from 'react';
import { Page, StudentAnswers } from './types';
import { useExamConfig } from 'useExamConfig';
import StudentHome from 'StudentHome';
import AdminLogin from 'AdminLogin';
import AdminDashboard from 'AdminDashboard';
import ExamScreen from 'ExamScreen';
import ResultScreen from 'ResultScreen';
import ReviewScreen from 'ReviewScreen';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('studentHome');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [examConfig, setExamConfig] = useExamConfig();
  
  // Lifted state for exam flow
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswers>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(examConfig.time * 60);

  useEffect(() => {
    if (page === 'studentHome') {
      setTimeLeft(examConfig.time * 60);
      setStudentAnswers({});
      setCurrentQuestion(0);
      return;
    }

    if (page !== 'exam' && page !== 'review') return;
    
    if (timeLeft <= 0) {
      setPage('result');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, page, setPage, examConfig.time]);

  const startExam = () => {
      setTimeLeft(examConfig.time * 60);
      setStudentAnswers({});
      setCurrentQuestion(0);
      setPage('exam');
  };

  const renderPage = () => {
    switch (page) {
      case 'studentHome':
        return <StudentHome setPage={setPage} examConfig={examConfig} startExam={startExam} />;
      case 'exam':
        return <ExamScreen 
                    examConfig={examConfig} 
                    setPage={setPage} 
                    studentAnswers={studentAnswers}
                    setStudentAnswers={setStudentAnswers}
                    currentQuestion={currentQuestion}
                    setCurrentQuestion={setCurrentQuestion}
                    timeLeft={timeLeft}
                />;
      case 'review':
        return <ReviewScreen
                    examConfig={examConfig}
                    studentAnswers={studentAnswers}
                    setPage={setPage}
                    setCurrentQuestion={setCurrentQuestion}
                />;
      case 'result':
        return <ResultScreen 
                    examConfig={examConfig} 
                    studentAnswers={studentAnswers} 
                    setPage={setPage}
                />;
      case 'adminLogin':
        return <AdminLogin setPage={setPage} setIsAdmin={setIsAdmin} />;
      case 'adminDashboard':
        return isAdmin ? (
          <AdminDashboard examConfig={examConfig} setExamConfig={setExamConfig} setPage={setPage} setIsAdmin={setIsAdmin} />
        ) : (
          <AdminLogin setPage={setPage} setIsAdmin={setIsAdmin} />
        );
      default:
        return <StudentHome setPage={setPage} examConfig={examConfig} startExam={startExam} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full">
        <div className="relative z-10">
            {renderPage()}
        </div>
    </div>
  );
};

export default App;
