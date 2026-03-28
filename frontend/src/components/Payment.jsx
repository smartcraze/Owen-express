import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaCheckCircle } from 'react-icons/fa';
import { API_URL } from '../config';
import confetti from 'canvas-confetti';

const paymentOptions = [
    { id: 'upi', name: 'UPI Payment', icon: FaMobileAlt },
    { id: 'credit', name: 'Credit Card', icon: FaCreditCard },
    { id: 'cod', name: 'Cash on Delivery', icon: FaMoneyBillWave }
];

const Payment = ({ clearCart }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState('upi');
    const [paid, setPaid] = useState(false);
    
    const { cart = [], address = {}, total = 0 } = location.state || {};

    if (!cart.length && !paid) {
        navigate('/menu');
        return null;
    }

    const handlePay = async () => {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        let user = { email: '' };
        try { if (userStr) user = JSON.parse(userStr) || user; } catch { }

        const fire = () => {
            clearCart();
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#ef4444', '#f97316', '#facc15', '#22c55e'] });
            const orderData = { cart, total, address, paymentMethod: selected, placedAt: Date.now() };
            localStorage.setItem('activeOrder', JSON.stringify(orderData));
            navigate('/track', { state: orderData });
        };

        try {
            const res = await fetch(`${API_URL}/api/orders/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: address.name, address: address.address, phone: address.phone, email: user?.email || '', cart, total, paymentMethod: selected })
            });
            const data = await res.json();
            const orderId = data.order?._id;
            clearCart();
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#ef4444', '#f97316', '#facc15', '#22c55e'] });
            const orderData = { cart, total, address, paymentMethod: selected, placedAt: Date.now(), orderId };
            localStorage.setItem('activeOrder', JSON.stringify(orderData));
            navigate('/track', { state: orderData });
        } catch { fire(); }
    };

    return (
        <div className="max-w-3xl mx-auto my-8 sm:my-12 px-4 sm:px-0 relative z-10">
            {/* Ambient background glows removed based on user feedback */}

            <button onClick={() => navigate('/order-summary')} className="relative z-20 px-6 py-2.5 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:text-red-600 hover:-translate-y-0.5 mb-8 flex items-center gap-2">
                ← Back to Order
            </button>
            
            <div className="bg-white/70 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white overflow-hidden relative z-20">
                {!paid ? (
                    <>
                        <div className="bg-gradient-to-r from-orange-600 via-red-500 to-red-600 p-8 sm:py-10 relative overflow-hidden text-center flex flex-col items-center">
                            <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                            <h2 className="text-3xl sm:text-4xl font-black text-white relative z-10 drop-shadow-sm inline-block tracking-tight mb-2">
                                Secure <span className="text-yellow-300">Checkout</span>
                                <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-white opacity-50 rounded-full mx-auto"></div>
                            </h2>
                        </div>
                        
                        <div className="p-8 sm:p-10">
                            <div className="grid gap-5 mb-10">
                                {paymentOptions.map(option => {
                                    const Icon = option.icon;
                                    return (
                                        <div key={option.id}
                                            className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-5 group overflow-hidden ${
                                                selected === option.id 
                                                    ? 'border-transparent shadow-[0_8px_30px_rgb(234,88,12,0.15)] -translate-y-1' 
                                                    : 'border-transparent bg-white/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-white/80'
                                            }`}
                                            onClick={() => setSelected(option.id)}>
                                            
                                            {selected === option.id && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50/50 to-orange-100/50 z-0"></div>
                                            )}
                                            {selected === option.id && (
                                                <div className="absolute inset-0 border-2 border-orange-400 rounded-2xl z-10"></div>
                                            )}

                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 relative z-20 transition-all ${selected === option.id ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                                                <Icon className={`text-2xl ${selected === option.id ? 'text-white' : 'text-gray-500'}`} />
                                            </div>

                                            <span className={`text-xl font-bold relative z-20 transition-colors ${selected === option.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {option.name}
                                            </span>
                                            {selected === option.id && <FaCheckCircle className="ml-auto text-orange-500 text-2xl relative z-20 animate-bounce" />}
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-6 rounded-2xl mb-8 border border-gray-200/60 shadow-inner">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-500 uppercase tracking-widest">Total Amount</span>
                                    <span className="text-4xl font-black text-gray-900 tracking-tight">₹{total}</span>
                                </div>
                            </div>
                            
                            <button className="w-full relative overflow-hidden group bg-gradient-to-r from-red-600 to-orange-500 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-[0_8px_25px_-5px_rgba(220,38,38,0.5)] hover:shadow-[0_12px_30px_-5px_rgba(220,38,38,0.6)] hover:-translate-y-1" onClick={handlePay}>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                <span className="relative z-10 flex flex-col items-center justify-center">
                                    <span>Proceed to Pay</span>
                                </span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-12">
                        <div className="text-7xl mb-6 text-green-500">
                            <FaCheckCircle className="inline-block" />
                        </div>
                        <h2 className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold text-4xl mb-4">Payment Successful!</h2>
                        <p className="text-gray-600 text-lg mb-8">Your order has been placed and will be delivered soon.</p>
                        <button onClick={() => navigate('/')} className="bg-red-600/80 backdrop-blur-sm border border-red-400/50 text-white py-4 px-10 rounded-2xl font-bold hover:bg-red-600 hover:scale-105 transition-all shadow-lg shadow-red-900/30">Back to Home</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;
