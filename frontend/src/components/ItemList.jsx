import React, { useState } from 'react';
import { FaLeaf, FaStar, FaDrumstickBite, FaSync, FaShoppingCart } from 'react-icons/fa';

import { API_URL } from '../config';

const ItemList = ({ items, addToCart }) => {
    const [flipped, setFlipped] = useState({});
    const toggleFlip = (id) => setFlipped(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-3 sm:p-5">
            {items.map(item => (
                <div key={item._id || item.id} className="relative h-[430px]" style={{ perspective: '1000px' }}>
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
                                    {addToCart && (
                                        <button className="bg-red-600 text-white py-2 px-4 rounded-full font-bold hover:bg-red-700 hover:shadow-lg transition-all text-sm flex items-center gap-1.5"
                                            onClick={(e) => { e.stopPropagation(); addToCart(item); }}>
                                            <FaShoppingCart size={12} /> Add to Cart
                                        </button>
                                    )}
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
                                <p className="text-gray-800 leading-relaxed">{item.ingredients || 'Ingredients information not available'}</p>
                            </div>
                            <p className="text-base font-semibold text-gray-900 mt-3 text-center flex items-center justify-center gap-1">
                                <FaSync size={10} /> Click to flip back
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemList;
