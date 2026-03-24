import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { API_URL } from '../config';
import { signInWithGoogle } from '../firebase';

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user && user !== 'undefined' && user !== 'null') navigate('/');
    }, [navigate]);

    const handleGoogleLogin = async () => {
        setError('');
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
                setIsLoggedIn(true);
                navigate('/');
            } else {
                setError(data.message || 'Google login failed');
            }
        } catch (err) {
            setError('Google login failed: ' + err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsLoggedIn(true);
                navigate(data.user.isAdmin ? '/admin' : '/');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-yellow-50 to-red-50">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-yellow-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4 shadow-lg">
                        <FaSignInAlt className="text-white text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-600">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Login to continue your food journey!</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" placeholder="Email Address" value={email}
                            onChange={e => setEmail(e.target.value)} required
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition" />
                    </div>
                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="password" placeholder="Password" value={password}
                            onChange={e => setPassword(e.target.value)} required
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition" />
                    </div>
{error && <p className="text-red-500 text-sm text-center -mt-2">{error}</p>}
                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-4">
                    <div className="flex items-center gap-3 my-4">
                        <hr className="flex-1 border-gray-300" />
                        <span className="text-gray-400 text-sm">OR</span>
                        <hr className="flex-1 border-gray-300" />
                    </div>
                    <button type="button" onClick={handleGoogleLogin}
                        className="w-full py-3 border-2 border-gray-300 rounded-lg flex items-center justify-center gap-3 font-semibold text-gray-700 hover:bg-gray-50 transition">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" /> Continue with Google
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <span onClick={() => navigate('/signup')} className="text-red-600 font-semibold cursor-pointer hover:text-red-700 hover:underline transition">
                            Sign up here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
