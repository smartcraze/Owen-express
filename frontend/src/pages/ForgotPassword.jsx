import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { API_URL } from '../config';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setMsg(''); setError('');
        try {
            const res = await fetch(`${API_URL}/api/users/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) setMsg(data.message);
            else setError(data.message || 'Something went wrong');
        } catch {
            setError('Failed to send request. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-yellow-50 to-red-50">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-yellow-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4 shadow-lg">
                        <FaEnvelope className="text-white text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-600">Forgot Password</h2>
                    <p className="text-gray-500 mt-2">Enter your email and we'll send a reset link</p>
                </div>

                {msg ? (
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
                        ✅ {msg}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="email" placeholder="Email Address" value={email}
                                onChange={e => setEmail(e.target.value)} required
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition" />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50">
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <a href="/login" className="text-red-600 font-semibold hover:underline text-sm">← Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
