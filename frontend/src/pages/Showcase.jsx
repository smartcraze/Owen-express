import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaFire, FaBolt, FaUserTie, FaSeedling, FaArrowRight, FaClock } from 'react-icons/fa';
import { API_URL } from '../config';

const Showcase = ({ isLoggedIn }) => {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/api/items`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const chefSpecials = data.filter(item => item.isChefSpecial);
                    setFeaturedItems(chefSpecials.length > 0 ? chefSpecials.slice(0, 3) : data.slice(0, 3));
                }
                setLoading(false);
            })
            .catch(() => {
                setFeaturedItems([]);
                setLoading(false);
            });
    }, []);

    const toggleFlip = (id) => setFlipped(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <div className="space-y-20">
            {/* Hero */}
            <section className="relative min-h-[60vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl shadow-xl"
                style={{ background: '#111' }}>
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0" style={{ backgroundImage: "url('/images/backimg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.75 }} />
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-8">
                        <FaFire className="text-orange-300 text-sm" />
                        <span className="text-white text-sm font-semibold">Premium Indian Cuisine</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white">
                        Taste the{' '}
                        <span className="text-orange-300 ">
                            Extraordinary
                        </span>
                    </h1>

                    <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        Experience authentic Indian flavors crafted with passion, delivered fresh to your doorstep.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate(isLoggedIn ? '/menu' : '/login')}
                            className="px-8 py-4 bg-red-600/80 backdrop-blur-md border border-red-400/60 text-white font-bold rounded-2xl hover:bg-red-600 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-800/40">
                            {isLoggedIn ? 'Explore Full Menu' : 'Get Started'} <FaArrowRight />
                        </button>
                        {!isLoggedIn && (
                            <button onClick={() => navigate('/signup')}
                                className="px-8 py-4 bg-red-600/80 backdrop-blur-md border border-red-400/60 text-white font-bold rounded-2xl hover:bg-red-600 hover:scale-105 transition-all shadow-xl shadow-red-800/40">
                                Create Account
                            </button>
                        )}
                    </div>

                    <div className="flex justify-center gap-6 sm:gap-12 mt-10 sm:mt-16">
                        {[['50+', 'Menu Items'], ['4.9', 'Star Rating'], ['30min', 'Delivery']].map(([val, label]) => (
                            <div key={label} className="text-center">
                                <p className="text-2xl font-black text-orange-300">{val}</p>
                                <p className="text-white/70 text-xs mt-1 uppercase tracking-wider">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Chef's Specials */}
            <section>
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-amber-500 px-4 py-2 rounded-full mb-4">
                        <FaStar className="text-white text-sm" />
                        <span className="text-white text-sm font-semibold">Chef's Selection</span>
                    </div>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 relative inline-block">
                            Featured <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">Specials</span>
                            <div className="absolute -bottom-1 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 rounded-full"></div>
                        </h2>
                    </div>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">Handpicked dishes crafted with the finest ingredients</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-red-600"></div>
                        <p className="mt-4 text-gray-600">Loading delicious items...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-3 sm:p-5">
                        {featuredItems.map(item => (
                            <div key={item._id} className="relative h-[440px] group" style={{ perspective: '1500px' }}>
                                <div className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                                     style={{ transformStyle: 'preserve-3d', transform: flipped[item._id] ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

                                    {/* Front */}
                                    <div className="absolute w-full h-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-white/80 transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col"
                                         style={{ backfaceVisibility: 'hidden' }}
                                         onClick={() => toggleFlip(item._id)}>

                                        {/* Image */}
                                        <div className="relative w-full h-52 shrink-0 overflow-hidden bg-gray-50/50">
                                            {item.image
                                                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                                : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium bg-gradient-to-br from-gray-100 to-gray-200/50">No Image</div>
                                            }
                                            {/* Overlay gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/60 pointer-events-none" />

                                            {/* Top badges */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg font-black uppercase tracking-wider shadow-lg border border-white/20 backdrop-blur-md ${item.type === 'veg' ? 'bg-gradient-to-r from-green-500/95 to-emerald-600/95 text-white' : 'bg-gradient-to-r from-red-500/95 to-rose-600/95 text-white'}`}>
                                                    <span className="w-2 h-2 rounded-sm border-[1.5px] border-white/90 flex items-center justify-center">
                                                        <span className="w-1 h-1 rounded-full bg-white" />
                                                    </span>
                                                    {item.type === 'veg' ? 'Veg' : 'Non-Veg'}
                                                </span>
                                            </div>
                                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                                {item.isChefSpecial && (
                                                    <span className="bg-gradient-to-r from-orange-400/95 to-amber-600/95 backdrop-blur-md border border-white/20 text-white text-[11px] px-2.5 py-1.5 rounded-lg font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                                                        <FaStar size={12} className="text-yellow-200" /> Special
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex-1 flex flex-col pt-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-black text-gray-900 mb-1.5 leading-tight group-hover:text-red-600 transition-colors drop-shadow-sm">{item.name}</h3>
                                                <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                                            </div>

                                            {/* Price + Cart */}
                                            <div className="flex justify-between items-end mb-4 pt-3 border-t border-gray-100/80">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price</span>
                                                    <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 leading-none">₹{item.price}</span>
                                                </div>
                                                <button onClick={e => { e.stopPropagation(); navigate(isLoggedIn ? '/menu' : '/login'); }}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 px-6 rounded-xl font-bold text-sm hover:from-red-500 hover:to-orange-500 transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5">
                                                    Order <FaArrowRight size={12} className="drop-shadow-sm" />
                                                </button>
                                            </div>

                                            {/* Time badges */}
                                            {(item.prepTime || item.deliveryTime) && (
                                                <div className="flex justify-between gap-4 w-full">
                                                    {item.prepTime && (
                                                        <span className="flex items-center justify-center gap-1.5 text-xs text-orange-700 font-bold bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200/60 px-2.5 py-1.5 rounded-lg shadow-sm flex-1">
                                                            <FaClock size={10} className="text-orange-500" /> {item.prepTime}m prep
                                                        </span>
                                                    )}
                                                    {item.deliveryTime && (
                                                        <span className="flex items-center justify-center gap-1.5 text-xs text-blue-700 font-bold bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/60 px-2.5 py-1.5 rounded-lg shadow-sm flex-1">
                                                            <FaClock size={10} className="text-blue-500" /> {item.deliveryTime}m delivery
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Flip hint */}
                                        <div className="w-full bg-gray-50/80 backdrop-blur-sm border-t border-gray-100/80 px-4 py-2.5 text-center group-hover:bg-red-50/60 transition-colors duration-300">
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold group-hover:text-red-500 transition-colors">Tap for ingredients</p>
                                        </div>
                                    </div>

                                    {/* Back */}
                                    <div className="absolute w-full h-full rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer overflow-hidden border border-white/20"
                                         style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                         onClick={() => toggleFlip(item._id)}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-rose-600" />
                                        {/* Decorative elements */}
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
                                        
                                        <div className="relative z-10 p-8 flex flex-col h-full">
                                            <h3 className="text-3xl font-black text-white mb-2 leading-tight drop-shadow-md">{item.name}</h3>
                                            <p className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-4">Ingredients & Details</p>
                                            
                                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex-1 overflow-auto border border-white/20 shadow-inner">
                                                <p className="text-white/95 leading-relaxed text-sm font-medium">{item.ingredients || 'Fresh ingredients selected daily. Carefully prepared with our signature blend of authentic spices and herbs to deliver an unforgettable dining experience.'}</p>
                                            </div>
                                            
                                            <button className="mt-6 w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg">
                                                Tap to flip back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && featuredItems.length > 0 && (
                    <div className="text-center mt-10">
                        <button onClick={() => navigate(isLoggedIn ? '/menu' : '/login')}
                            className="px-8 py-4 bg-red-600/80 backdrop-blur-sm border border-red-400/50 text-white font-bold rounded-2xl hover:bg-red-600 hover:scale-105 transition-all flex items-center gap-2 mx-auto shadow-lg shadow-red-900/30">
                            View Full Menu <FaArrowRight />
                        </button>
                    </div>
                )}
            </section>

            {/* Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: FaBolt, title: 'Fast Delivery', desc: 'Hot food delivered in under 30 minutes', color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', glow: 'hover:shadow-yellow-200/60' },
                    { icon: FaUserTie, title: 'Expert Chefs', desc: 'Authentic recipes by experienced chefs', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', glow: 'hover:shadow-red-200/60' },
                    { icon: FaSeedling, title: 'Fresh Ingredients', desc: 'Locally sourced, daily fresh ingredients', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200', glow: 'hover:shadow-green-200/60' }
                ].map(({ icon: Icon, title, desc, color, bg, border, glow }) => (
                    <div key={title} className={`bg-white rounded-2xl p-6 text-center shadow-md border ${border} hover:shadow-xl ${glow} hover:-translate-y-1 transition-all`}>
                        <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4 border ${border}`}>
                            <Icon className={`${color} text-2xl`} />
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg mb-2">{title}</h3>
                        <p className="text-gray-500 text-sm">{desc}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Showcase;
