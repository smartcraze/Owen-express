import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaMapMarkerAlt, FaPhone, FaUser, FaClock, FaStar } from 'react-icons/fa';
import { API_URL } from '../config';

const btnStyle = "bg-red-600/80 backdrop-blur-sm border border-red-400/50 text-white py-3 px-8 rounded-2xl font-bold hover:bg-red-600 hover:scale-105 transition-all shadow-lg shadow-red-900/30";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratingModal, setRatingModal] = useState({ show: false, orderId: null, rating: 0, review: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        
        if (!userStr || userStr === 'undefined' || userStr === 'null') {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return navigate('/login');
        }
        
        try {
            const user = JSON.parse(userStr);
            if (!user || !user.email) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                return navigate('/login');
            }

            const token = localStorage.getItem('token');
            fetch(`${API_URL}/api/orders/user/${user.email}`)
                .then(res => res.json())
                .then(data => {
                    setOrders(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch(() => {
                    setOrders([]);
                    setLoading(false);
                });
        } catch {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    if (loading) return <div className="text-center py-20 text-xl">Loading orders...</div>;

    const submitRating = async () => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${ratingModal.orderId}/rate`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: ratingModal.rating, review: ratingModal.review })
            });
            if (res.ok) {
                setOrders(orders.map(o => o._id === ratingModal.orderId ? { ...o, rating: ratingModal.rating, review: ratingModal.review } : o));
                setRatingModal({ show: false, orderId: null, rating: 0, review: '' });
            }
        } catch {
            setRatingModal({ show: false, orderId: null, rating: 0, review: '' });
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 sm:py-12 relative z-10 px-4">
            {/* Ambient glows removed based on user feedback */}

            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight relative inline-block">
                    <span className="text-gray-900">My</span>{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">Orders</span>
                    <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 rounded-full"></div>
                </h1>
                <p className="text-gray-500 text-lg font-medium">Track and review your past culinary experiences</p>
            </div>
            
            {orders.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-3xl rounded-[2rem] p-16 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white text-center">
                    <div className="text-7xl mb-6 opacity-40 mix-blend-luminosity">🛍️</div>
                    <p className="text-2xl font-bold text-gray-500 mb-8 tracking-tight">You haven't placed any orders yet.</p>
                    <button onClick={() => navigate('/menu')} className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 px-10 rounded-2xl font-black text-lg hover:shadow-[0_8px_25px_-5px_rgba(220,38,38,0.5)] hover:-translate-y-1 transition-all">Browse Menu</button>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order, idx) => (
                        <div key={order._id || idx} className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 border-b border-gray-100 pb-6 gap-4">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 mb-1 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Order #{orders.length - idx}
                                    </h3>
                                    <div className="flex items-center text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 inline-flex mt-2">
                                        <FaClock className="mr-2 text-gray-400" />
                                        <p className="text-sm">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border border-orange-100 sm:min-w-[150px]">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                    <p className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent leading-none">₹{order.total}</p>
                                    <p className="text-[10px] text-orange-800/60 mt-2 uppercase font-bold tracking-widest bg-orange-200/50 inline-block px-2 py-0.5 rounded-md">{order.paymentMethod}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center text-sm uppercase tracking-widest border-b border-gray-100 pb-2">
                                        <FaShoppingBag className="mr-2 text-red-500" /> Items
                                    </h4>
                                    <div className="space-y-3">
                                        {order.cart?.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center group">
                                                <span className="font-semibold text-gray-700">{item.name} {item.quantity > 1 && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-md text-gray-500 ml-2">x{item.quantity}</span>}</span>
                                                <span className="font-black text-gray-900 group-hover:text-red-500 transition-colors">₹{item.price * (item.quantity || 1)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center text-sm uppercase tracking-widest border-b border-gray-100 pb-2">
                                        <FaMapMarkerAlt className="mr-2 text-red-500" /> Delivery
                                    </h4>
                                    <div className="space-y-3 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="flex items-center">
                                            <FaUser className="mr-3 text-gray-400" /> <span className="font-bold text-gray-800">{order.name}</span>
                                        </p>
                                        <p className="flex items-start">
                                            <FaMapMarkerAlt className="mr-3 mt-1 text-gray-400 shrink-0" /> <span>{order.address}</span>
                                        </p>
                                        <p className="flex items-center">
                                            <FaPhone className="mr-3 text-gray-400" /> {order.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6 mt-6">
                                {order.rating ? (
                                    <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Rating</p>
                                        <div className="flex gap-1 mb-2">
                                            {[1,2,3,4,5].map(star => (
                                                <FaStar key={star} className={`text-xl ${star <= order.rating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                        {order.review && <p className="text-sm text-gray-700 font-medium italic">"{order.review}"</p>}
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setRatingModal({ show: true, orderId: order._id, rating: 0, review: '' })}
                                        className="w-full sm:w-auto bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 text-gray-700 py-3 px-8 rounded-xl font-bold hover:shadow-md hover:border-orange-300 hover:text-orange-600 transition-all text-sm uppercase tracking-widest"
                                    >
                                        Rate Experience
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {ratingModal.show && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setRatingModal({ show: false, orderId: null, rating: 0, review: '' })}>
                    <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.2)]" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-black mb-6 text-gray-900 text-center tracking-tight">Rate Your Experience</h3>
                        
                        <div className="flex justify-center gap-3 mb-8 bg-gray-50 py-4 rounded-xl border border-gray-100">
                            {[1,2,3,4,5].map(star => (
                                <FaStar 
                                    key={star}
                                    className={`text-4xl cursor-pointer transition-all duration-300 hover:scale-110 ${star <= ratingModal.rating ? 'text-yellow-400 drop-shadow-md' : 'text-gray-200'}`}
                                    onClick={() => setRatingModal({...ratingModal, rating: star})}
                                />
                            ))}
                        </div>
                        
                        <textarea 
                            placeholder="Tell us what you loved... (optional)"
                            className="w-full border-2 border-gray-100 rounded-xl p-4 mb-8 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all resize-none font-medium text-gray-700 bg-white"
                            rows="4"
                            value={ratingModal.review}
                            onChange={e => setRatingModal({...ratingModal, review: e.target.value})}
                        />
                        
                        <div className="flex gap-4">
                            <button onClick={() => setRatingModal({ show: false, orderId: null, rating: 0, review: '' })} className="flex-1 bg-white border-2 border-gray-200 text-gray-600 py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">Cancel</button>
                            <button onClick={submitRating} disabled={!ratingModal.rating} className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white py-3.5 rounded-xl font-bold hover:shadow-[0_8px_25px_-5px_rgba(220,38,38,0.5)] transition-all disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed">Submit Rating</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
