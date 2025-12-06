import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import logo from '../components/shklogo.jpg';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay for realism
    setTimeout(() => {
        setIsLoading(false);
        if (email && password) {
            onLogin();
            navigate('/cms');
        }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      <div className="bg-white w-full max-w-sm rounded-sm shadow-2xl overflow-hidden z-10">
        <div className="p-8">
          <div className="text-center mb-8">
             <img 
               src={logo}
               alt="SHK Rhein-Neckar" 
               className="h-20 w-auto mx-auto mb-4" 
             />
             <p className="text-brand-steel text-xs uppercase tracking-widest mt-1">Internal CMS</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:border-brand-copper outline-none transition"
                placeholder="editor@shk-rhein-neckar.de"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:border-brand-copper outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-brand-dark text-white py-3 rounded-sm font-bold uppercase text-xs tracking-wider hover:bg-brand-copper transition flex items-center justify-center group"
            >
              {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
              )}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
            <p className="text-[10px] uppercase font-bold text-gray-400">Authorized Personnel Only</p>
        </div>
      </div>
      
      <button 
        className="mt-8 text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white transition cursor-pointer z-10" 
        onClick={() => navigate('/')}
      >
        ← Back to Magazine
      </button>
    </div>
  );
};

export default Login;