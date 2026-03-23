import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaEdit, FaTrash, FaPlus, FaLeaf, FaDrumstickBite, FaImage, FaTimes, FaUtensils } from 'react-icons/fa';
import { API_URL } from '../config';

const Admin = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [type, setType] = useState('veg');
    const [isChefSpecial, setIsChefSpecial] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editingImage, setEditingImage] = useState('');
    const [status, setStatus] = useState({ msg: '', ok: true });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let user = null;
        try { user = JSON.parse(localStorage.getItem('user')); } catch { navigate('/'); return; }
        if (!user || !user.isAdmin) { navigate('/'); return; }
        fetchItems();
    }, [navigate]);

    const fetchItems = () => {
        fetch(`${API_URL}/api/items`)
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(() => showStatus('Failed to load items', false));
    };

    const showStatus = (msg, ok = true) => {
        setStatus({ msg, ok });
        setTimeout(() => setStatus({ msg: '', ok: true }), 3000);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('ingredients', ingredients);
            formData.append('type', type);
            formData.append('isChefSpecial', isChefSpecial);
            if (image) formData.append('image', image);

            const url = editingId ? `${API_URL}/api/items/${editingId}` : `${API_URL}/api/items`;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, { method, body: formData });
            if (response.ok) {
                showStatus(editingId ? 'Item updated!' : 'Item added!', true);
                resetForm();
                fetchItems();
            } else {
                const err = await response.json().catch(() => ({}));
                showStatus(err.error || 'Failed to save item', false);
            }
        } catch {
            showStatus('Failed to save item', false);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            const response = await fetch(`${API_URL}/api/items/${id}`, { method: 'DELETE' });
            if (response.ok) { showStatus('Item deleted!', true); fetchItems(); }
            else showStatus('Failed to delete item', false);
        } catch {
            showStatus('Failed to delete item', false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price);
        setIngredients(item.ingredients || '');
        setType(item.type || 'veg');
        setIsChefSpecial(item.isChefSpecial || false);
        setImage(null);
        setImagePreview(null);
        setEditingImage(item.image || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setName(''); setDescription(''); setPrice(''); setIngredients('');
        setType('veg'); setIsChefSpecial(false);
        setImage(null); setImagePreview(null); setEditingImage('');
        const input = document.getElementById('imageInput');
        if (input) input.value = '';
    };

    const currentPreview = imagePreview || (editingImage || null);
    const vegCount = items.filter(i => i.type === 'veg').length;
    const nonVegCount = items.filter(i => i.type === 'non-veg').length;
    const specialCount = items.filter(i => i.isChefSpecial).length;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#fff5f0' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
                        <p className="text-orange-100 text-sm mt-0.5">Owen Express — Menu Management</p>
                    </div>
                    <div className="flex gap-6 text-center">
                        <div className="bg-white/20 rounded-xl px-5 py-2.5">
                            <div className="text-2xl font-bold">{items.length}</div>
                            <div className="text-xs text-orange-100">Total Items</div>
                        </div>
                        <div className="bg-white/20 rounded-xl px-5 py-2.5">
                            <div className="text-2xl font-bold text-green-300">{vegCount}</div>
                            <div className="text-xs text-orange-100">Veg</div>
                        </div>
                        <div className="bg-white/20 rounded-xl px-5 py-2.5">
                            <div className="text-2xl font-bold text-red-200">{nonVegCount}</div>
                            <div className="text-xs text-orange-100">Non-Veg</div>
                        </div>
                        <div className="bg-white/20 rounded-xl px-5 py-2.5">
                            <div className="text-2xl font-bold text-yellow-300">{specialCount}</div>
                            <div className="text-xs text-orange-100">Specials</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8 items-start">
                {/* Form Panel */}
                <div className="w-96 flex-shrink-0 sticky top-6">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className={`px-6 py-4 flex items-center justify-between ${editingId ? 'bg-blue-600' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                {editingId ? <><FaEdit size={16} /> Edit Item</> : <><FaPlus size={16} /> Add New Item</>}
                            </h2>
                            {editingId && (
                                <button onClick={resetForm} className="text-white/80 hover:text-white transition-colors">
                                    <FaTimes size={18} />
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            {status.msg && (
                                <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${status.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    <span>{status.ok ? '✓' : '✕'}</span> {status.msg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <input type="text" placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} required
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-orange-400 focus:outline-none bg-gray-50 focus:bg-white transition-all" />

                                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm resize-none focus:border-orange-400 focus:outline-none bg-gray-50 focus:bg-white transition-all" />

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                                    <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01"
                                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-orange-400 focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                                </div>

                                <textarea placeholder="Ingredients (e.g., Rice, Chicken, Spices)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} required rows={2}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm resize-none focus:border-orange-400 focus:outline-none bg-gray-50 focus:bg-white transition-all" />

                                {/* Type Toggle */}
                                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                                    <button type="button" onClick={() => setType('veg')}
                                        className={`py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${type === 'veg' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-green-600'}`}>
                                        <FaLeaf size={11} /> Veg
                                    </button>
                                    <button type="button" onClick={() => setType('non-veg')}
                                        className={`py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${type === 'non-veg' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-red-600'}`}>
                                        <FaDrumstickBite size={11} /> Non-Veg
                                    </button>
                                </div>

                                {/* Chef Special */}
                                <label className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border-2 transition-all ${isChefSpecial ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-100 hover:border-orange-200'}`}>
                                    <input type="checkbox" checked={isChefSpecial} onChange={(e) => setIsChefSpecial(e.target.checked)} className="w-4 h-4 accent-orange-500 cursor-pointer" />
                                    <span className={`text-sm font-semibold flex items-center gap-2 ${isChefSpecial ? 'text-orange-600' : 'text-gray-500'}`}>
                                        <FaStar size={13} /> Chef's Special
                                    </span>
                                </label>

                                {/* Image Upload */}
                                <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors ${currentPreview ? 'border-orange-300' : 'border-gray-200 hover:border-orange-300'}`}>
                                    {currentPreview ? (
                                        <div className="relative">
                                            <img src={currentPreview} alt="Preview" className="w-full h-40 object-cover" />
                                            <label htmlFor="imageInput" className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center cursor-pointer group">
                                                <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity">
                                                    Change Image
                                                </span>
                                            </label>
                                            {editingId && !imagePreview && (
                                                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-md font-medium">Current</span>
                                            )}
                                        </div>
                                    ) : (
                                        <label htmlFor="imageInput" className="flex flex-col items-center justify-center h-28 cursor-pointer text-gray-300 hover:text-orange-400 transition-colors">
                                            <FaImage size={28} className="mb-1.5" />
                                            <span className="text-xs font-medium">Click to upload image</span>
                                        </label>
                                    )}
                                    <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} required={!editingId} className="hidden" />
                                </div>

                                <button type="submit" disabled={loading}
                                    className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-all ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'} ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}>
                                    {loading ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FaUtensils className="text-orange-500" /> Menu Items
                            <span className="text-sm font-normal text-gray-400 ml-1">({items.length})</span>
                        </h2>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <FaUtensils size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium">No items yet</p>
                            <p className="text-sm">Add your first menu item using the form</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {items.map(item => (
                                <div key={item._id} className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-2 ${editingId === item._id ? 'border-blue-400' : 'border-transparent'}`}>
                                    <div className="relative">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-44 object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                        ) : null}
                                        <div className={`w-full h-44 bg-gradient-to-br from-orange-50 to-red-50 items-center justify-center flex-col text-gray-300 ${item.image ? 'hidden' : 'flex'}`}>
                                            <FaImage size={36} className="mb-2" />
                                            <span className="text-xs">No Image</span>
                                        </div>

                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 flex gap-1.5">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${item.type === 'veg' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                {item.type === 'veg' ? <FaLeaf size={9} /> : <FaDrumstickBite size={9} />}
                                                {item.type === 'veg' ? 'Veg' : 'Non-Veg'}
                                            </span>
                                        </div>
                                        {item.isChefSpecial && (
                                            <div className="absolute top-2 right-2 bg-orange-500 text-white p-1.5 rounded-full shadow-md">
                                                <FaStar size={12} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className="font-bold text-gray-800 text-base leading-tight">{item.name}</h3>
                                            <span className="text-orange-500 font-bold text-lg whitespace-nowrap">₹{item.price}</span>
                                        </div>
                                        <p className="text-gray-500 text-xs line-clamp-2 mb-4">{item.description}</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(item)}
                                                className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1.5 border border-blue-100 hover:border-blue-600">
                                                <FaEdit size={11} /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(item._id)}
                                                className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-1.5 border border-red-100 hover:border-red-600">
                                                <FaTrash size={11} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
