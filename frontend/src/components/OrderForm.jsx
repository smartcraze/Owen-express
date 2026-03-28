import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const OrderForm = ({ cart, removeFromCart, setCart }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const grouped = cart.reduce((acc, item) => {
        const found = acc.find(i => i._id === item._id);
        found ? found.quantity += 1 : acc.push({ ...item, quantity: 1 });
        return acc;
    }, []);

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const increaseQty = (item) => setCart([...cart, item]);
    const decreaseQty = (item) => {
        const idx = cart.findLastIndex ? cart.findLastIndex(c => c._id === item._id) : [...cart].reverse().findIndex(c => c._id === item._id);
        const actualIdx = cart.findLastIndex ? idx : cart.length - 1 - idx;
        removeFromCart(actualIdx);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!name || !address || !phone) return setError('Please fill all fields');
        if (!/^[6-9]\d{9}$/.test(phone)) return setError('Please enter a valid 10-digit Indian phone number starting with 6-9');
        navigate('/payment', { state: { cart: grouped, total, address: { name, address, phone } } });
    };

    return (
        <div className="max-w-5xl mx-auto my-8 sm:my-12 px-4 relative z-10">
            {/* Ambient glows removed based on user feedback */}

            <button onClick={() => navigate('/menu')} className="relative z-20 px-6 py-2.5 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:text-red-600 hover:-translate-y-0.5 mb-8 flex items-center gap-2">
                ← Continue Browsing
            </button>

            <div className="bg-white/70 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white overflow-hidden relative z-20 grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/50">
                
                {/* Left Side: Cart Items */}
                <div className="col-span-3 bg-white/30 p-8 sm:p-10">
                    <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-8 tracking-tight">
                        <FaShoppingCart className="text-red-500" /> Order Summary
                    </h2>

                    {cart.length === 0 ? (
                        <div className="text-center py-16 px-6 bg-white/50 rounded-3xl border border-white">
                            <p className="text-xl font-bold text-gray-500 mb-6">Your cart is empty.</p>
                            <button onClick={() => navigate('/menu')} className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 px-8 rounded-2xl font-bold hover:shadow-[0_8px_25px_-5px_rgba(220,38,38,0.5)] hover:-translate-y-0.5 transition-all">Browse Menu</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {grouped.map((item, idx) => (
                                <div key={idx} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 hover:bg-white/80 border border-white/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                    <div className="mb-4 sm:mb-0">
                                        <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                                        <p className="text-sm font-semibold text-gray-500">₹{item.price} each</p>
                                    </div>
                                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                                            <button onClick={() => decreaseQty(item)}
                                                className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center font-bold">
                                                <FaMinus size={10} />
                                            </button>
                                            <span className="font-black text-gray-800 w-5 text-center">{item.quantity}</span>
                                            <button onClick={() => increaseQty(item)}
                                                className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center font-bold">
                                                <FaPlus size={10} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-black text-xl text-gray-900 w-16 text-right">₹{item.price * item.quantity}</span>
                                            <button className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                                                onClick={() => {
                                                    const indices = cart.reduce((acc, c, i) => c._id === item._id ? [...acc, i] : acc, []);
                                                    indices.forEach((_, i) => removeFromCart(indices[indices.length - 1 - i]));
                                                }}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-8 bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200/50 shadow-inner flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-500 uppercase tracking-widest">Total</span>
                                <span className="font-black text-4xl bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">₹{total}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Address Form */}
                <div className="col-span-2 bg-gradient-to-br from-red-600 to-orange-500 p-8 sm:p-10 text-white relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                    <div className="relative z-10 flex-1">
                        <h3 className="text-2xl mb-8 font-black tracking-tight">Delivery Details</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full">
                            <div className="group relative">
                                <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} 
                                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all backdrop-blur-sm" />
                            </div>
                            <div className="group relative">
                                <textarea placeholder="Complete Delivery Address" required value={address} onChange={(e) => setAddress(e.target.value)} 
                                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all backdrop-blur-sm min-h-[120px] resize-none" />
                            </div>
                            <div className="group relative">
                                <input type="tel" placeholder="Phone Number (10 digits)" required pattern="[0-9]{10}" value={phone} onChange={(e) => setPhone(e.target.value)} 
                                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all backdrop-blur-sm" />
                            </div>
                            
                            {error && <p className="text-red-200 text-sm font-bold bg-black/20 p-3 rounded-lg backdrop-blur-sm">{error}</p>}
                            
                            <div className="mt-8">
                                <button type="submit" disabled={cart.length === 0} 
                                    className="w-full bg-white text-red-600 py-4 px-8 rounded-2xl font-black text-lg hover:shadow-[0_8px_30px_rgb(255,255,255,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                                    Proceed to Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
