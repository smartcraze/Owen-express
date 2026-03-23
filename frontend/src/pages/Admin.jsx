import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaEdit, FaTrash, FaPlus, FaLeaf, FaDrumstickBite } from 'react-icons/fa';
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
    const [editingId, setEditingId] = useState(null);
    const [status, setStatus] = useState({ msg: '', ok: true });
    const navigate = useNavigate();

    useEffect(() => {
        let user = null;
        try {
            user = JSON.parse(localStorage.getItem('user'));
        } catch {
            navigate('/');
            return;
        }
        if (!user || !user.isAdmin) {
            navigate('/');
            return;
        }
        fetchItems();
    }, [navigate]);

    const fetchItems = () => {
        fetch(`${API_URL}/api/items`)
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(() => setStatus({ msg: 'Failed to load items', ok: false }));
    };

    const showStatus = (msg, ok = true) => {
        setStatus({ msg, ok });
        setTimeout(() => setStatus({ msg: '', ok: true }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                setName(''); setDescription(''); setPrice(''); setIngredients('');
                setType('veg'); setIsChefSpecial(false); setImage(null); setEditingId(null);
                document.getElementById('imageInput').value = '';
                fetchItems();
            } else {
                showStatus('Failed to save item', false);
            }
        } catch {
            showStatus('Failed to save item', false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            const response = await fetch(`${API_URL}/api/items/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showStatus('Item deleted!', true);
                fetchItems();
            } else {
                showStatus('Failed to delete item', false);
            }
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setName(''); setDescription(''); setPrice(''); setIngredients('');
        setType('veg'); setIsChefSpecial(false); setImage(null);
        document.getElementById('imageInput').value = '';
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#fff5f0' }}>
            <div className="p-10 max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">Admin Panel</h1>
                    <p className="text-gray-600 text-lg">Manage your restaurant menu items</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-10">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            {editingId ? <><FaEdit /> Edit Food Item</> : <><FaPlus /> Add New Food Item</>}
                        </h2>
                    </div>
                    <div className="p-8">
                        {status.msg && (
                            <div className={`mb-4 p-3 rounded-lg text-sm font-semibold ${status.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {status.msg}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <input type="text" placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} required
                                className="p-4 border-2 border-gray-200 rounded-xl text-base focus:border-orange-500 focus:outline-none transition-colors" />
                            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required
                                className="p-4 border-2 border-gray-200 rounded-xl text-base min-h-[100px] resize-y focus:border-orange-500 focus:outline-none transition-colors" />
                            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01"
                                className="p-4 border-2 border-gray-200 rounded-xl text-base focus:border-orange-500 focus:outline-none transition-colors" />
                            <textarea placeholder="Ingredients (e.g., Rice, Chicken, Spices, Yogurt)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} required
                                className="p-4 border-2 border-gray-200 rounded-xl text-base min-h-[100px] resize-y focus:border-orange-500 focus:outline-none transition-colors" />
                            <div className="flex gap-3 items-center p-4 bg-gray-50 rounded-xl">
                                <span className="font-semibold text-gray-700">Type:</span>
                                <button type="button" onClick={() => setType('veg')}
                                    className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 border transition-all ${type === 'veg' ? 'bg-green-200 text-green-700 border-green-300 scale-110' : 'bg-green-100 text-green-700 border-green-200 opacity-60'}`}>
                                    <FaLeaf size={9} /> Veg
                                </button>
                                <button type="button" onClick={() => setType('non-veg')}
                                    className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 border transition-all ${type === 'non-veg' ? 'bg-red-200 text-red-700 border-red-300 scale-110' : 'bg-red-100 text-red-700 border-red-200 opacity-60'}`}>
                                    <FaDrumstickBite size={9} /> Non-Veg
                                </button>
                            </div>
                            <label className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors">
                                <input type="checkbox" checked={isChefSpecial} onChange={(e) => setIsChefSpecial(e.target.checked)} className="w-5 h-5 cursor-pointer" />
                                <span className="flex items-center gap-2 font-semibold text-orange-600"><FaStar /> Chef's Special</span>
                            </label>
                            <input type="file" id="imageInput" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required={!editingId}
                                className="p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 transition-colors" />
                            <div className="flex gap-3 mt-2">
                                <button type="submit" className="flex-1 p-4 bg-gradient-to-r from-orange-600 to-red-600 text-white border-none rounded-xl text-lg font-bold cursor-pointer hover:shadow-lg transition-all">
                                    {editingId ? 'Update Item' : 'Add Item'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={handleCancel} className="flex-1 p-4 bg-gray-500 text-white border-none rounded-xl text-lg font-bold cursor-pointer hover:bg-gray-600 transition-all">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div>
                    <h2 className="mb-6 text-3xl font-bold text-gray-800">Manage Items</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map(item => (
                            <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                                <div className="relative">
                                    {item.image && (
                                        <img src={`${API_URL}/uploads/${item.image}`} alt={item.name} className="w-full h-48 object-cover" />
                                    )}
                                    {item.isChefSpecial && (
                                        <div className="absolute top-2 right-2 bg-orange-500 text-white p-2 rounded-full">
                                            <FaStar />
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                                    <p className="font-bold text-orange-500 text-2xl mb-4">₹{item.price}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                            <FaEdit /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
