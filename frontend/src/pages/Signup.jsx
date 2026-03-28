import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { API_URL } from '../config';
import { signInWithGoogle } from '../firebase';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user && user !== 'undefined' && user !== 'null') navigate('/');
    }, [navigate]);

    const handleGoogleSignup = async () => {
        setError('');
        setGoogleLoading(true);
        try {
            const result = await signInWithGoogle();
            const { displayName, email } = result.user;
            const res = await fetch(`${API_URL}/api/users/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: displayName, email })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
            } else {
                setError(data.message || 'Google signup failed');
            }
        } catch (err) {
            setError(err?.message || 'Google signup failed. Try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address');
        if (password.length < 6) return setError('Password must be at least 6 characters long');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Account created! Redirecting to login...');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[85vh] relative overflow-hidden py-12 px-4 w-full">
            {/* Premium Ambient Background Removed based on user feedback */}
            
            <div className="bg-white/60 backdrop-blur-3xl p-10 sm:p-12 rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] w-full max-w-md border border-white relative z-10 transition-all hover:shadow-[0_20px_60px_-15px_rgba(220,38,38,0.15)] group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-[2.5rem] pointer-events-none"></div>

                <div className="text-center mb-10 relative z-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-red-500/30 transform group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
                        <FaUserPlus className="text-white text-3xl drop-shadow-md" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tight"><span className="text-gray-900">Create</span> <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">Account</span></h2>
                    <p className="text-gray-500 font-medium mt-3">Join us for a premium food experience</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-20">
                    <div className="relative group/input">
                        <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-red-500 transition-colors z-10" />
                        <input type="text" placeholder="Full Name" value={name}
                            onChange={e => setName(e.target.value)} required
                            className="w-full pl-14 pr-5 py-4 bg-white/50 backdrop-blur-sm border border-white/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-800 font-medium placeholder-gray-400 shadow-sm" />
                    </div>
                    <div className="relative group/input">
                        <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-red-500 transition-colors z-10" />
                        <input type="email" placeholder="Email Address" value={email}
                            onChange={e => setEmail(e.target.value)} required
                            className="w-full pl-14 pr-5 py-4 bg-white/50 backdrop-blur-sm border border-white/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-800 font-medium placeholder-gray-400 shadow-sm" />
                    </div>
                    <div className="relative group/input">
                        <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-red-500 transition-colors z-10" />
                        <input type="password" placeholder="Password" value={password}
                            onChange={e => setPassword(e.target.value)} required
                            className="w-full pl-14 pr-5 py-4 bg-white/50 backdrop-blur-sm border border-white/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-800 font-medium placeholder-gray-400 shadow-sm" />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-100 text-center animate-fadeIn">{error}</p>}
                    {success && <p className="text-green-600 text-sm font-bold bg-green-50 p-3 rounded-xl border border-green-100 text-center animate-fadeIn">{success}</p>}
                    
                    <button type="submit" disabled={loading}
                        className="w-full py-4 mt-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-lg rounded-2xl hover:shadow-[0_8px_25px_-5px_rgba(220,38,38,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                        {loading ? 'Creating Account...' : 'Sign Up Securely'}
                    </button>
                </form>

                <div className="mt-8 relative z-20">
                    <div className="flex items-center gap-4 my-6 opacity-70">
                        <hr className="flex-1 border-gray-300" />
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Or Continue With</span>
                        <hr className="flex-1 border-gray-300" />
                    </div>
                    <button type="button" onClick={handleGoogleSignup} disabled={googleLoading || typeof googleLoading === 'undefined'}
                        className="w-full py-4 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-60 shadow-sm">
                        {googleLoading ? <span className="w-5 h-5 border-2 border-gray-400 border-t-red-600 rounded-full animate-spin" /> : <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 drop-shadow-sm" />}
                        {googleLoading ? 'Signing up...' : 'Google'}
                    </button>
                </div>

                <div className="mt-8 text-center relative z-20">
                    <p className="text-gray-500 font-medium">
                        Already explicitly have an account?{' '}
                        <span onClick={() => navigate('/login')} className="text-red-600 font-black cursor-pointer hover:text-orange-500 transition-colors">
                            Login here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
