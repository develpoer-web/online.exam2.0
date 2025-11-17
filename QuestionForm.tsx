
import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuestionFormProps {
    question: Question | null;
    onSave: (questionData: Omit<Question, 'id'> | Question) => void;
    onCancel: () => void;
}

const defaultFormState = {
    prompt: '',
    options: { A: '', B: '', C: '', D: '' },
    correctAnswer: 'A' as 'A' | 'B' | 'C' | 'D',
};

const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSave, onCancel }) => {
    const [formData, setFormData] = useState(defaultFormState);

    useEffect(() => {
        if(question) {
            setFormData({
                prompt: question.prompt,
                options: question.options,
                correctAnswer: question.correctAnswer
            });
        } else {
            setFormData(defaultFormState);
        }
    }, [question]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            options: { ...prev.options, [name]: value }
        }));
    };
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, correctAnswer: e.target.value as 'A'|'B'|'C'|'D' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.prompt || Object.values(formData.options).some(opt => !opt)) return;
        
        if(question) {
            onSave({ ...question, ...formData });
        } else {
            onSave(formData);
        }
    };
    
    const inputStyles = "w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500";
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg border border-fuchsia-500 neon-glow-magenta w-full max-w-lg">
                <h2 className="text-2xl font-orbitron text-glow-cyan mb-4">{question ? 'Edit Question' : 'Add New Question'}</h2>
                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Question Prompt</label>
                        <input type="text" name="prompt" value={formData.prompt} onChange={handleTextChange} className={inputStyles} placeholder="e.g., What is CSS?" required/>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Option A</label>
                            <input type="text" name="A" value={formData.options.A} onChange={handleOptionChange} className={inputStyles} required />
                        </div>
                         <div>
                            <label className="block text-sm text-gray-300 mb-1">Option B</label>
                            <input type="text" name="B" value={formData.options.B} onChange={handleOptionChange} className={inputStyles} required />
                        </div>
                         <div>
                            <label className="block text-sm text-gray-300 mb-1">Option C</label>
                            <input type="text" name="C" value={formData.options.C} onChange={handleOptionChange} className={inputStyles} required />
                        </div>
                         <div>
                            <label className="block text-sm text-gray-300 mb-1">Option D</label>
                            <input type="text" name="D" value={formData.options.D} onChange={handleOptionChange} className={inputStyles} required />
                        </div>
                    </div>

                     <div>
                        <label className="block text-sm text-gray-300 mb-1">Correct Answer</label>
                        <select value={formData.correctAnswer} onChange={handleSelectChange} className={inputStyles}>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-lg btn-neon hover:bg-cyan-500">Save</button>
                </div>
            </form>
        </div>
    );
};

export default QuestionForm;
