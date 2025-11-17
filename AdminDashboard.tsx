
import React, { useState } from 'react';
import { ExamConfig, Page } from '../types';
import GlitchText from './GlitchText';

interface AdminDashboardProps {
  examConfig: ExamConfig;
  setExamConfig: (config: ExamConfig) => void;
  setPage: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ examConfig, setExamConfig, setPage, setIsAdmin }) => {
  const [formData, setFormData] = useState<ExamConfig>(examConfig);
  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['time', 'totalMarks', 'totalQuestions', 'cutMarkPerWrongAnswer', 'fixedPenalty'].includes(name);
    
    if (name === 'correctAnswers') {
        setFormData(prev => ({ ...prev, [name]: value.toUpperCase().replace(/[^A-D]/g, '') }));
    } else {
        setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
    }
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isActive: e.target.checked }));
  };

  const handleSave = () => {
    if (formData.correctAnswers.length !== formData.totalQuestions) {
        setSaveMessage(`Error: Correct answers count (${formData.correctAnswers.length}) must match total questions (${formData.totalQuestions}).`);
        setTimeout(() => setSaveMessage(''), 4000);
        return;
    }

    setExamConfig(formData);
    setSaveMessage('Configuration saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };
  
  const handleLogout = () => { setIsAdmin(false); setPage('studentHome'); };

  const inputStyles = "w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500";
  const labelStyles = "block text-sm text-gray-300 mb-1";

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <header className="flex justify-between items-center mb-8">
          <GlitchText text="ADMIN DASHBOARD" className="text-2xl sm:text-3xl font-orbitron text-glow-cyan" />
          <button onClick={handleLogout} className="text-sm text-fuchsia-400 hover:text-fuchsia-300">Logout</button>
        </header>

        <div className="space-y-6 p-4 sm:p-6 border border-cyan-400 rounded-lg neon-glow-cyan bg-black bg-opacity-30">
          <h2 className="text-xl font-orbitron text-glow-cyan border-b-2 border-cyan-500 pb-2">Exam Settings</h2>
          
          <div>
            <label className={labelStyles}>Exam Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputStyles} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Time (Minutes)</label>
              <input type="number" name="time" value={formData.time} onChange={handleChange} className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Total Marks</label>
              <input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleChange} className={inputStyles} />
            </div>
             <div>
                <label className={labelStyles}>Cut Mark (per wrong)</label>
                <input type="number" step="0.01" name="cutMarkPerWrongAnswer" value={formData.cutMarkPerWrongAnswer} onChange={handleChange} className={inputStyles} />
              </div>
              <div>
                <label className={labelStyles}>Fixed Penalty</label>
                <input type="number" step="0.1" name="fixedPenalty" value={formData.fixedPenalty} onChange={handleChange} className={inputStyles} />
              </div>
          </div>
          
          <div>
            <label className={labelStyles}>Total Questions</label>
            <input type="number" name="totalQuestions" value={formData.totalQuestions} onChange={handleChange} className={inputStyles} />
          </div>

          <div>
            <label htmlFor="correctAnswers" className={labelStyles}>Correct Answers String (e.g., ABCDA)</label>
            <textarea
              id="correctAnswers"
              name="correctAnswers"
              value={formData.correctAnswers}
              onChange={handleChange}
              className={`${inputStyles} font-mono`}
              rows={2}
              placeholder="Enter the correct answer sequence without spaces"
              maxLength={formData.totalQuestions}
            />
            <p className="text-xs text-gray-400 mt-1">
                Length: {formData.correctAnswers.length} / {formData.totalQuestions}
            </p>
          </div>
          

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
            <span className="font-bold text-lg text-white">Exam Status: {formData.isActive ? 'Active' : 'Locked'}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleToggle} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-fuchsia-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div className="flex justify-end items-center gap-4 pt-4">
             {saveMessage && <p className={`text-sm animate-pulse ${saveMessage.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{saveMessage}</p>}
            <button onClick={handleSave} className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-lg btn-neon hover:bg-cyan-500">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;