import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ItemList from '../components/ItemList';
import { API_URL } from '../config';
import { FaLeaf, FaDrumstickBite, FaStar, FaSlidersH, FaTimes } from 'react-icons/fa';

const Home = ({ cart, setCart }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [showNonVeg, setShowNonVeg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('default');
    const [maxPrice, setMaxPrice] = useState(1000);
    const [priceRange, setPriceRange] = useState(1000);
    const [chefOnly, setChefOnly] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/items`)
            .then(res => res.json())
            .then(data => {
                setMenuItems(data);
                const max = Math.max(...data.map(i => i.price), 1000);
                setMaxPrice(max);
                setPriceRange(max);
                setLoading(false);
            })
            .catch(() => {
                setMenuItems([]);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let items = showNonVeg === null ? menuItems : menuItems.filter(item => item.type === (showNonVeg ? 'non-veg' : 'veg'));
        if (searchQuery) items = items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (chefOnly) items = items.filter(item => item.isChefSpecial);
        items = items.filter(item => item.price <= priceRange);
        if (sortBy === 'price-asc') items = [...items].sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
        else if (sortBy === 'name') items = [...items].sort((a, b) => a.name.localeCompare(b.name));
        setFilteredItems(items);
    }, [searchQuery, menuItems, showNonVeg, sortBy, priceRange, chefOnly]);

    const addToCart = (item) => {
        if (!cart.find(c => c._id === item._id)) setCart([...cart, item]);
    };

    const removeFromCart = (item) => {
        const idx = cart.findIndex(c => c._id === item._id);
        if (idx !== -1) setCart(cart.filter((_, i) => i !== idx));
    };

    const resetFilters = () => { setSortBy('default'); setPriceRange(maxPrice); setChefOnly(false); setShowNonVeg(null); };
    const activeFilters = sortBy !== 'default' || priceRange < maxPrice || chefOnly;

    const FilterPanel = () => (
        <div className="bg-white/70 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] border border-white p-6 space-y-8 sticky top-32">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-black text-gray-900 text-xl flex items-center gap-3 tracking-tight"><FaSlidersH className="text-red-500" /> Filters</h3>
                {activeFilters && (
                    <button onClick={resetFilters} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all flex items-center gap-1">
                        <FaTimes /> Reset
                    </button>
                )}
            </div>

            {/* Chef's Special */}
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Special</p>
                <button onClick={() => setChefOnly(!chefOnly)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold w-full transition-all border ${chefOnly ? 'bg-gradient-to-r from-orange-50 to-red-50 text-red-600 border-orange-200 shadow-[0_4px_15px_-3px_rgba(234,88,12,0.15)]' : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-50 hover:border-gray-100'}`}>
                    <FaStar className={`text-lg ${chefOnly ? 'text-orange-500 drop-shadow-sm' : 'text-gray-300'}`} /> Chef's Special
                </button>
            </div>

            {/* Price Range */}
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Max Price</p>
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-medium text-gray-400">₹0</span>
                    <span className="font-black text-red-600 border border-red-100 bg-red-50 px-3 py-1 rounded-lg">₹{priceRange}</span>
                    <span className="text-xs font-medium text-gray-400">₹{maxPrice}</span>
                </div>
                <div className="relative pt-2">
                    <input type="range" min={0} max={maxPrice} value={priceRange}
                        onChange={e => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 hover:accent-orange-500 transition-all" />
                </div>
            </div>

            {/* Sort */}
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Sort By</p>
                <div className="flex flex-col gap-2">
                    {[['default','Default sort'],['price-asc','Price: Low to High'],['price-desc','Price: High to Low'],['name','Name: A to Z']].map(([val, label]) => (
                        <button key={val} onClick={() => setSortBy(val)}
                            className={`text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${sortBy === val ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white border-transparent shadow-[0_8px_20px_-6px_rgba(220,38,38,0.4)] hover:-translate-y-0.5' : 'bg-transparent text-gray-500 border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-800'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative">
            {/* Ambient glows removed based on user feedback */}

            {/* Top bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
                <button className="self-start lg:self-center px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm flex items-center gap-2" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
                <div className="text-center flex-1">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight relative inline-block">
                        <span className="text-gray-900">Explore</span>{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">Menu</span>
                        <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 rounded-full"></div>
                    </h1>
                </div>
                {/* Veg/Non-veg toggle */}
                <div className="flex flex-wrap items-center justify-center gap-3 bg-transparent self-end lg:self-center">
                    <button onClick={() => setShowNonVeg(null)}
                        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 border-2 ${showNonVeg === null ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-400 shadow-[0_4px_15px_-3px_rgba(234,179,8,0.4)]' : 'bg-white text-gray-500 border-transparent hover:border-gray-200 hover:shadow-sm'}`}>
                        All
                    </button>
                    <button onClick={() => setShowNonVeg(false)}
                        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 border-2 ${showNonVeg === false ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-[0_4px_15px_-3px_rgba(34,197,94,0.4)]' : 'bg-white text-gray-500 border-transparent hover:border-gray-200 hover:shadow-sm'}`}>
                        <div className={`w-[14px] h-[14px] border-[1.5px] flex items-center justify-center ${showNonVeg === false ? 'border-white' : 'border-green-600'}`}>
                            <div className={`w-[6px] h-[6px] rounded-full ${showNonVeg === false ? 'bg-white' : 'bg-green-600'}`}></div>
                        </div>
                        Veg
                    </button>
                    <button onClick={() => setShowNonVeg(true)}
                        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 border-2 ${showNonVeg === true ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-500 shadow-[0_4px_15px_-3px_rgba(239,68,68,0.4)]' : 'bg-white text-gray-500 border-transparent hover:border-gray-200 hover:shadow-sm'}`}>
                        <div className={`w-[14px] h-[14px] border-[1.5px] flex items-center justify-center ${showNonVeg === true ? 'border-white' : 'border-red-600'}`}>
                            <div className={`w-[6px] h-[6px] rounded-full ${showNonVeg === true ? 'bg-white' : 'bg-red-600'}`}></div>
                        </div>
                        Non-Veg
                    </button>
                </div>
                {/* Mobile filter toggle */}
                <button className="lg:hidden flex justify-center items-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-sm font-bold text-white shadow-lg shadow-gray-900/20 active:scale-95 transition-all"
                    onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <FaSlidersH className="text-orange-400" /> Filters {activeFilters && <span className="bg-red-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-800">!</span>}
                </button>
            </div>

            <div className="flex gap-6">
                {/* Left Sidebar — desktop always visible, mobile drawer */}
                <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
                    <FilterPanel />
                </aside>

                {/* Right Content */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-red-600"></div>
                            <p className="mt-4 text-gray-600">Loading menu...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-2xl text-gray-600 mb-2">No items found</p>
                            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <ItemList items={filteredItems} addToCart={addToCart} removeFromCart={removeFromCart} cart={cart} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
