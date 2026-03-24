import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaFire, FaLeaf, FaDrumstickBite, FaBolt, FaUserTie, FaSeedling, FaArrowRight, FaSync } from 'react-icons/fa';
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
            .catch(() => setLoading(false));
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
                        <span className="text-orange-300">
                            Extraordinary
                        </span>
                    </h1>

                    <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        Experience authentic Indian flavors crafted with passion, delivered fresh to your doorstep.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate(isLoggedIn ? '/menu' : '/login')}
                            className="px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg">
                            {isLoggedIn ? 'Explore Full Menu' : 'Get Started'} <FaArrowRight />
                        </button>
                        {!isLoggedIn && (
                            <button onClick={() => navigate('/signup')}
                                className="px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 hover:shadow-lg transition-all">
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
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                        Featured <span className="text-red-600">Specials</span>
                    </h2>
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
                            <div key={item._id} className="relative h-[430px]" style={{ perspective: '1000px' }}>
                                <div className="relative w-full h-full transition-transform duration-500"
                                    style={{ transformStyle: 'preserve-3d', transform: flipped[item._id] ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

                                    {/* Front */}
                                    <div className="absolute w-full h-full bg-white rounded-xl overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer border border-yellow-100"
                                        style={{ backfaceVisibility: 'hidden' }}
                                        onClick={() => toggleFlip(item._id)}>
                                        <div className="relative w-full h-52 overflow-hidden bg-gray-100">
                                            {item.image
                                                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
                                            }
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                {item.isChefSpecial && (
                                                    <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                                                        <FaStar size={9} /> Special
                                                    </span>
                                                )}
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${item.type === 'veg' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                                    {item.type === 'veg' ? <FaLeaf size={9} /> : <FaDrumstickBite size={9} />}
                                                    {item.type === 'veg' ? 'Veg' : 'Non-Veg'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                                            <p className="text-gray-600 mb-3 text-sm">{item.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold text-red-600">₹{item.price}</span>
                                            </div>
                                        </div>
                                        <hr className="border-yellow-100 w-full" />
                                        <div className="px-5 pb-2 pt-3">
                                            <p className="text-base font-semibold text-gray-900 text-center flex items-center justify-center gap-1">
                                                <FaSync size={10} /> Click to see ingredients
                                            </p>
                                        </div>
                                    </div>

                                    {/* Back */}
                                    <div className="absolute w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl shadow-lg cursor-pointer p-6 flex flex-col justify-center"
                                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                        onClick={() => toggleFlip(item._id)}>
                                        <h3 className="text-2xl font-bold text-red-600 mb-4 text-center">Ingredients</h3>
                                        <div className="bg-white/80 rounded-lg p-4 flex-1 overflow-auto">
                                            <p className="text-gray-800 leading-relaxed">{item.ingredients || 'Fresh ingredients selected daily'}</p>
                                        </div>
                                        <p className="text-base font-semibold text-gray-900 mt-3 text-center flex items-center justify-center gap-1">
                                            <FaSync size={10} /> Click to flip back
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && featuredItems.length > 0 && (
                    <div className="text-center mt-10">
                        <button onClick={() => navigate(isLoggedIn ? '/menu' : '/login')}
                            className="px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto shadow-lg">
                            View Full Menu <FaArrowRight />
                        </button>
                    </div>
                )}
            </section>

            {/* Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: FaBolt, title: 'Fast Delivery', desc: 'Hot food delivered in under 30 minutes', color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
                    { icon: FaUserTie, title: 'Expert Chefs', desc: 'Authentic recipes by experienced chefs', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
                    { icon: FaSeedling, title: 'Fresh Ingredients', desc: 'Locally sourced, daily fresh ingredients', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' }
                ].map(({ icon: Icon, title, desc, color, bg, border }) => (
                    <div key={title} className={`bg-white rounded-2xl p-6 text-center shadow-md border ${border} hover:shadow-xl hover:-translate-y-1 transition-all`}>
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
