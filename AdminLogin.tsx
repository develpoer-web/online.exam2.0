
import React, { useState } from 'react';
import { Page } from '../types';
import { ADMIN_ID, ADMIN_PASS } from '../constants';
import GlitchText from './GlitchText';

interface AdminLoginProps {
  setPage: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setPage, setIsAdmin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === ADMIN_ID && password === ADMIN_PASS) {
      setIsAdmin(true);
      setPage('adminDashboard');
      setError('');
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };
  
  const inputStyles = "w-full p-3 bg-gray-800 border-2 border-fuchsia-500 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
           <GlitchText text="ADMIN ACCESS" className="text-3xl font-orbitron text-glow-magenta" />
        </header>
        <form onSubmit={handleLogin} className="space-y-6 p-6 border-2 border-fuchsia-500 rounded-lg neon-glow-magenta">
          <div>
            <label htmlFor="admin-id" className="block text-sm font-medium text-cyan-300 mb-2">Admin ID</label>
            <input
              type="text"
              id="admin-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className={inputStyles}
              placeholder="Enter Admin ID"
            />
          </div>
          <div>
            <label htmlFor="admin-pass" className="block text-sm font-medium text-cyan-300 mb-2">Password</label>
            <input
              type="password"
              id="admin-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyles}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-sm animate-pulse">{error}</p>}
          <button type="submit" className="w-full py-3 bg-fuchsia-600 text-white font-bold rounded-lg btn-neon transition-all hover:bg-fuchsia-500">
            AUTHENTICATE
          </button>
        </form>
         <button onClick={() => setPage('studentHome')} className="mt-6 text-cyan-400 hover:text-cyan-300 w-full text-center">
            ← Back to Student Portal
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
