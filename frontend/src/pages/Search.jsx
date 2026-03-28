import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import ItemList from '../components/ItemList';
import { API_URL } from '../config';

const Search = ({ cart, setCart }) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

    useEffect(() => {
        fetch(`${API_URL}/api/items`)
            .then(res => res.json())
            .then(setMenuItems)
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = menuItems.filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredItems(filtered);
        } else {
            setFilteredItems([]);
        }
    }, [searchQuery, menuItems]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery });
        }
    };

    const addToCart = (item) => {
        if (!cart.find(c => c._id === item._id)) setCart([...cart, item]);
    };

    return (
        <div className="min-h-[70vh] relative z-10 px-4">
            {/* Ambient glows removed based on user feedback */}

            <div className="text-center mb-12 py-8">
                <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight relative inline-block">
                    <span className="text-gray-900">Search</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">Menu</span>
                    <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 rounded-full"></div>
                </h1>
                
                <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8 relative">
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 p-2 rounded-[2rem] shadow-sm flex items-center">
                        <FaSearch className="text-gray-400 text-xl ml-6 mr-4" />
                        <input
                            type="text"
                            placeholder="Discover your next favorite dish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent py-4 text-xl text-gray-800 font-medium placeholder-gray-400 outline-none w-full"
                            autoFocus
                        />
                        <button type="submit" onClick={handleSearch} className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest hidden sm:block">
                            Search
                        </button>
                    </div>
                </form>

                {searchQuery && (
                    <p className="text-gray-500 text-lg mb-4">
                        {filteredItems.length > 0 
                            ? `Found ${filteredItems.length} result(s) for "${searchQuery}"`
                            : `No results found for "${searchQuery}"`
                        }
                    </p>
                )}
            </div>

            {filteredItems.length > 0 ? (
                <ItemList items={filteredItems} addToCart={addToCart} />
            ) : searchQuery ? (
                <div className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white max-w-2xl mx-auto">
                    <p className="text-2xl font-bold text-gray-500 mb-2 tracking-tight"> No dishes found</p>
                    <p className="text-gray-400 font-medium">Try searching with different keywords</p>
                    <button 
                        onClick={() => navigate('/menu')}
                        className="mt-8 px-8 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-black rounded-2xl hover:shadow-[0_8px_25px_-5px_rgba(220,38,38,0.5)] hover:-translate-y-0.5 transition-all outline-none"
                    >
                        Browse Full Menu
                    </button>
                </div>
            ) : (
                <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/50 max-w-2xl mx-auto">
                    <p className="text-2xl font-black text-gray-400 tracking-tight"> Type to discover delicious food...</p>
                </div>
            )}
        </div>
    );
};

export default Search;
