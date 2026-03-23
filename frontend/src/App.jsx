import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUtensils, FaEnvelope, FaPhone } from 'react-icons/fa';
import { API_URL } from './config';
import Home from './pages/Home';
import Showcase from './pages/Showcase';
import Search from './pages/Search';
import Payment from './components/Payment';
import OrderForm from './components/OrderForm';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import OrderHistory from './pages/OrderHistory';
import ProtectedRoute from './components/ProtectedRoute';

function Header({ cartCount, isLoggedIn, onLogout }) {
    const nav = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navBtn = "bg-transparent border-none text-base font-medium text-gray-800 cursor-pointer px-4 py-2 rounded-xl hover:text-red-600 hover:bg-yellow-100 transition-all";

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white shadow-sm py-4'}`}>
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => nav('/')}>
                    <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <FaUtensils className="text-white text-sm" />
                    </div>
                    <h1 className="text-2xl font-black text-red-600">Owen Express</h1>
                </div>

                <nav className="flex gap-2 items-center">
                    {isLoggedIn ? (
                        <>
                            <button className={navBtn} onClick={() => nav('/')}>Home</button>
                            <button className={navBtn} onClick={() => nav('/menu')}>Menu</button>
                            <button className={navBtn} onClick={() => nav('/orders')}>My Orders</button>
                            <button className={navBtn} onClick={() => nav('/search')}><FaSearch className="text-lg" /></button>
                            <button className={`relative ${navBtn}`} onClick={() => nav('/order-summary')}>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                        {cartCount}
                                    </span>
                                )}
                                <FaShoppingCart className="text-lg" />
                            </button>
                            <button className="ml-2 px-5 py-2 text-sm font-semibold text-red-600 border-2 border-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all" onClick={onLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className={navBtn} onClick={() => nav('/')}>Home</button>
                            <button className={navBtn} onClick={() => nav('/login')}>Login</button>
                            <button className="ml-2 px-5 py-2 text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 hover:shadow-lg transition-all" onClick={() => nav('/signup')}>Sign Up</button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

function App() {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user && user !== 'undefined' && user !== 'null') {
                try {
                    const res = await fetch(`${API_URL}/api/users/verify`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        localStorage.setItem('user', JSON.stringify(data.user));
                        setIsLoggedIn(true);
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                } catch {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        verifyToken();
    }, []);

    const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));
    const clearCart = () => setCart([]);
    const handleLogout = () => {
        setIsLoggedIn(false);
        setCart([]);
        ['token', 'user', 'cart'].forEach(k => localStorage.removeItem(k));
        window.location.href = '/';
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#fff5f0' }}>
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce">
                    <FaUtensils className="text-white text-xl" />
                </div>
                <p className="font-bold text-lg text-red-600">Loading...</p>
            </div>
        </div>
    );

    return (
        <Router>
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff5f0' }}>
                <Header cartCount={cart.length} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                    <Routes>
                        <Route path="/" element={<Showcase isLoggedIn={isLoggedIn} />} />
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/search" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Search cart={cart} setCart={setCart} /></ProtectedRoute>} />
                        <Route path="/orders" element={<ProtectedRoute isLoggedIn={isLoggedIn}><OrderHistory /></ProtectedRoute>} />
                        <Route path="/menu" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Home cart={cart} setCart={setCart} /></ProtectedRoute>} />
                        <Route path="/order-summary" element={<ProtectedRoute isLoggedIn={isLoggedIn}><OrderForm cart={cart} removeFromCart={removeFromCart} /></ProtectedRoute>} />
                        <Route path="/payment" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Payment clearCart={clearCart} /></ProtectedRoute>} />
                    </Routes>
                </main>

                <footer className="bg-gray-900 text-white py-12 px-8 mt-10">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center">
                                    <FaUtensils className="text-white text-sm" />
                                </div>
                                <h3 className="text-xl font-black text-red-500">Owen Express</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">Premium food delivery bringing authentic Indian flavors to your doorstep.</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
                            <a href="/" className="block text-gray-400 hover:text-green-400 text-sm mb-2 transition-colors">Home</a>
                            <a href="/menu" className="block text-gray-400 hover:text-green-400 text-sm mb-2 transition-colors">Menu</a>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h4>
                            <p className="text-gray-400 text-sm mb-2 flex items-center gap-2"><FaEnvelope className="text-red-500" /> owenexpress@gmail.com</p>
                            <p className="text-gray-400 text-sm flex items-center gap-2"><FaPhone className="text-red-500" /> +91 9876543210</p>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-6 mt-8 text-center">
                        <p className="text-gray-400 text-sm">Made by Vipul Patial</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
