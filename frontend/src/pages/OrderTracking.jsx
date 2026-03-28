import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClipboardCheck, FaUtensils, FaMotorcycle, FaHome, FaPhone, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { API_URL } from '../config';

const STAGES = [
    { id: 0, label: 'Order Placed', sublabel: 'We received your order', icon: FaClipboardCheck, duration: 4000, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', activeBg: 'bg-blue-500' },
    { id: 1, label: 'Preparing', sublabel: 'Chef is cooking your food', icon: FaUtensils, duration: 8000, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', activeBg: 'bg-orange-500' },
    { id: 2, label: 'Out for Delivery', sublabel: 'Rider is on the way', icon: FaMotorcycle, duration: 8000, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', activeBg: 'bg-purple-500' },
    { id: 3, label: 'Delivered', sublabel: 'Enjoy your meal!', icon: FaHome, duration: null, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200', activeBg: 'bg-green-500' },
];

const RIDER = { name: 'Rahul Kumar', phone: '+91 98765 43210', rating: 4.8, vehicle: 'Bike • MH 02 AB 1234' };

const OrderTracking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [stage, setStage] = useState(0);
    const [eta, setEta] = useState(28);
    const [realStatus, setRealStatus] = useState(null);

    const saved = localStorage.getItem('activeOrder');
    const orderData = location.state || (saved ? JSON.parse(saved) : null);
    const { cart = [], total = 0, address = {}, paymentMethod = 'upi', orderId } = orderData || {};
    const hasOrder = !!orderData;

    const STATUS_TO_STAGE = { pending: 0, accepted: 0, preparing: 1, out_for_delivery: 2, delivered: 3 };

    // Poll real order status every 5 seconds
    useEffect(() => {
        if (!orderId) return;
        const poll = async () => {
            try {
                const res = await fetch(`${API_URL}/api/orders/${orderId}/status`);
                const data = await res.json();
                if (data.status) {
                    setRealStatus(data.status);
                    if (STATUS_TO_STAGE[data.status] !== undefined) setStage(STATUS_TO_STAGE[data.status]);
                }
            } catch { }
        };
        poll();
        const interval = setInterval(poll, 5000);
        return () => clearInterval(interval);
    }, [orderId]);

    useEffect(() => {
        if (!hasOrder) return;
        let timeout;
        const advance = (current) => {
            if (current < STAGES.length - 1) {
                timeout = setTimeout(() => {
                    setStage(current + 1);
                    advance(current + 1);
                }, STAGES[current].duration);
            }
        };
        advance(0);

        // countdown ETA
        const etaInterval = setInterval(() => {
            setEta(prev => prev > 1 ? prev - 1 : 0);
        }, 60000);

        return () => { clearTimeout(timeout); clearInterval(etaInterval); };
    }, []);

    const currentStage = STAGES[stage];
    const Icon = currentStage.icon;
    const delivered = stage === 3;

    if (realStatus === 'rejected') return (
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-black text-red-600 mb-2">Order Rejected</h2>
            <p className="text-gray-500 mb-6">Sorry, the restaurant couldn't accept your order at this time.</p>
            <button onClick={() => { localStorage.removeItem('activeOrder'); navigate('/menu'); }}
                className="bg-red-600/80 backdrop-blur-sm border border-red-400/50 text-white py-3 px-8 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-900/30">
                Order Again
            </button>
        </div>
    );

    if (orderId && realStatus === 'pending') return (
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h2 className="text-2xl font-black text-yellow-600 mb-2">Waiting for Confirmation</h2>
            <p className="text-gray-500 mb-2">Your order has been placed and is waiting for restaurant approval.</p>
            <p className="text-xs text-gray-400">This page will update automatically...</p>
        </div>
    );

    if (!hasOrder) return (
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">No Active Order</h2>
            <p className="text-gray-500 mb-6">You haven't placed any order yet. Browse our menu and place an order!</p>
            <button onClick={() => navigate('/menu')}
                className="bg-red-600/80 backdrop-blur-sm border border-red-400/50 text-white py-3 px-8 rounded-2xl font-bold hover:bg-red-600 hover:scale-105 transition-all shadow-lg shadow-red-900/30">
                Browse Menu
            </button>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 relative z-10">
            {/* Ambient background glows removed based on user feedback */}

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                {!delivered && (
                    <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:text-red-600 transition-all text-sm">
                        ← Home
                    </button>
                )}
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight relative inline-block">
                    <span className="text-gray-900">Track</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">Order</span>
                    <div className="absolute -bottom-1 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 rounded-full"></div>
                </h1>
            </div>

            {/* Status Card */}
            <div className={`relative bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 mb-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all duration-700`}>
                <div className={`absolute inset-0 ${currentStage.bg} opacity-50 mix-blend-multiply transition-colors duration-700`}></div>
                <div className={`absolute top-0 left-0 w-2 h-full ${currentStage.activeBg} transition-colors duration-700`}></div>
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-20 h-20 rounded-[1.5rem] ${currentStage.activeBg} flex items-center justify-center shadow-lg transition-colors duration-700 shrink-0`}>
                        <Icon className="text-white text-4xl drop-shadow-md animate-bounce" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Current Status</p>
                        <h2 className={`text-3xl font-black ${currentStage.color} tracking-tight leading-none mb-1 shadow-sm`}>{currentStage.label}</h2>
                        <p className="text-gray-500 font-medium">{currentStage.sublabel}</p>
                    </div>
                    {!delivered && (
                        <div className="ml-auto text-right bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0 min-w[100px]">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">ETA</p>
                            <p className="text-4xl font-black text-gray-900 leading-none">{eta}</p>
                            <p className="text-xs font-bold text-gray-400">mins</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white">
                <h3 className="font-black text-gray-900 mb-8 text-sm uppercase tracking-widest border-b border-gray-100/80 pb-4">Order Progress</h3>
                <div className="relative pl-2">
                    {STAGES.map((s, i) => {
                        const SIcon = s.icon;
                        const done = i <= stage;
                        const active = i === stage;
                        return (
                            <div key={s.id} className="flex items-start gap-4 relative">
                                {/* Line */}
                                {i < STAGES.length - 1 && (
                                    <div className="absolute left-5 top-10 w-0.5 h-10 bg-gray-100">
                                        <div className={`w-full transition-all duration-700 ${done && i < stage ? 'h-full bg-green-400' : 'h-0'}`} />
                                    </div>
                                )}
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${done ? `${s.activeBg} text-white shadow-md` : 'bg-gray-100 text-gray-300'} ${active ? 'ring-4 ring-offset-2 ring-opacity-30 ' + s.activeBg.replace('bg-', 'ring-') : ''}`}>
                                    <SIcon size={14} />
                                </div>
                                {/* Text */}
                                <div className={`pb-8 ${i === STAGES.length - 1 ? 'pb-0' : ''}`}>
                                    <p className={`font-bold text-sm ${done ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</p>
                                    <p className={`text-xs ${done ? 'text-gray-500' : 'text-gray-300'}`}>{s.sublabel}</p>
                                    {active && !delivered && (
                                        <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" /> In progress
                                        </span>
                                    )}
                                    {done && i < stage && (
                                        <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                            ✓ Done
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>



            {/* Order Summary & Address Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
                {/* Order Summary */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white h-full">
                    <h3 className="font-black text-gray-900 mb-6 text-sm uppercase tracking-widest flex items-center gap-2 border-b border-gray-100/80 pb-4">
                        <FaClipboardCheck className="text-gray-400" /> Order Details
                    </h3>
                    <div className="space-y-3 mb-6">
                        {cart.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-gray-600">{item.name} {item.quantity > 1 && <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md ml-2 text-xs">x{item.quantity}</span>}</span>
                                <span className="font-black text-gray-900">₹{item.price * (item.quantity || 1)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200/60 pt-5 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-600 uppercase tracking-widest text-xs">Total</span>
                            <span className="font-black text-3xl bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">₹{total}</span>
                        </div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 flex justify-between">
                            <span>Payment Method</span>
                            <span className="text-gray-800 bg-gray-100 px-2 py-1 rounded-md">{paymentMethod}</span>
                        </p>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-[2rem] p-8 shadow-[0_8px_30px_-5px_rgba(220,38,38,0.4)] border border-red-500/50 text-white h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                    <FaMapMarkerAlt className="absolute -bottom-6 -right-6 text-9xl text-white/10 rotate-[-15deg]" />
                    
                    <h3 className="font-black text-white/90 mb-6 text-sm uppercase tracking-widest flex items-center gap-2 border-b border-white/20 pb-4 relative z-10">
                        <FaMapMarkerAlt className="text-white" /> Delivering To
                    </h3>
                    <div className="relative z-10">
                        <p className="font-black text-2xl mb-1">{address.name || 'User'}</p>
                        <p className="text-sm text-white/80 font-medium mb-4 leading-relaxed max-w-[90%]">{address.address || 'Address not provided'}</p>
                        <p className="inline-flex items-center gap-2 text-sm font-bold bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                            <FaPhone className="text-white/80" size={12} /> {address.phone || '9876543210'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Delivered CTA */}
            {delivered && (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center animate-fadeIn">
                    <h3 className="text-xl font-black text-green-700 mb-1">Order Delivered!</h3>
                    <p className="text-gray-500 text-sm mb-4">Hope you enjoyed your meal</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => navigate('/orders')}
                            className="px-6 py-2.5 bg-white border-2 border-green-400 text-green-700 rounded-xl font-bold text-sm hover:bg-green-50 transition-all">
                            Rate Order
                        </button>
                        <button onClick={() => { localStorage.removeItem('activeOrder'); navigate('/'); }}
                            className="px-6 py-2.5 bg-red-600/80 backdrop-blur-sm border border-red-400/50 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-900/30">
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
