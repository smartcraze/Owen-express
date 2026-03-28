import React, { useState } from 'react';
import { FaStar, FaShoppingCart, FaCheck, FaClock, FaFire } from 'react-icons/fa';

const ItemList = ({ items, addToCart, removeFromCart, cart = [] }) => {
    const [flipped, setFlipped] = useState({});
    const toggleFlip = (id) => setFlipped(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-3 sm:p-5">
            {items.map(item => {
                const inCart = cart.some(c => c._id === item._id);
                return (
                    <div key={item._id || item.id} className="relative h-[440px] group" style={{ perspective: '1500px' }}>
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
                                                <FaFire size={12} className="text-yellow-200" /> Special
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
                                        {addToCart && (
                                            inCart ? (
                                                <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2.5 px-5 rounded-xl font-bold text-sm hover:from-red-500 hover:to-rose-600 transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:-translate-y-0.5 group/btn"
                                                    onClick={e => { e.stopPropagation(); removeFromCart && removeFromCart(item); }}>
                                                    <FaCheck size={14} className="group-hover/btn:hidden drop-shadow-sm" />
                                                    <span className="group-hover/btn:hidden">Added</span>
                                                    <span className="hidden group-hover/btn:inline">Remove</span>
                                                </button>
                                            ) : (
                                                <button className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 px-5 rounded-xl font-bold text-sm hover:from-red-500 hover:to-orange-500 transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5"
                                                    onClick={e => { e.stopPropagation(); addToCart(item); }}>
                                                    <FaShoppingCart size={14} className="drop-shadow-sm" /> Add
                                                </button>
                                            )
                                        )}
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
                );
            })}
        </div>
    );
};

export default ItemList;
