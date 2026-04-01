import { useState, useEffect } from 'react';
import api from '../../api';

const MenuManagement = () => {
    const [menuData, setMenuData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newItem, setNewItem] = useState({
        categoryId: '',
        itemName: '',
        price: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);

    const fetchMenu = async () => {
        try {
            const res = await api.get('/menu');
            setMenuData(res.data); // Array of { category, items }
            // Extract categories for the dropdown
            setCategories(res.data.map(group => group.category));
            setLoading(false);
        } catch (err) {
            console.error('Error fetching menu:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/menu', newItem);
            alert('Item added successfully!');
            setNewItem({ categoryId: '', itemName: '', price: '', description: '' });
            fetchMenu(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Failed to add item');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/menu/${id}`);
            fetchMenu(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Failed to delete item');
        }
    };

    if (loading) return <div>Loading menu...</div>;

    return (
        <div>
            <h2 style={{ color: '#1A2332' }}>Menu Management</h2>

            {/* Add New Item Form */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Add New Item</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <select
                        name="categoryId"
                        value={newItem.categoryId}
                        onChange={handleChange}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="itemName"
                        placeholder="Item Name"
                        value={newItem.itemName}
                        onChange={handleChange}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <input
                        type="number"
                        name="price"
                        step="0.01"
                        placeholder="Price"
                        value={newItem.price}
                        onChange={handleChange}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={newItem.description}
                        onChange={handleChange}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <button
                        type="submit"
                        style={{
                            gridColumn: 'span 2',
                            backgroundColor: '#F4A300', color: 'white', border: 'none',
                            padding: '10px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
                        }}
                    >
                        Add Item
                    </button>
                </form>
            </div>

            {/* Existing Menu List */}
            <div>
                {menuData.map((group) => (
                    <div key={group.category._id} style={{ marginBottom: '20px' }}>
                        <h3 style={{ borderBottom: '2px solid #ddd', paddingBottom: '5px' }}>{group.category.categoryName}</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Name</th>
                                    <th style={{ padding: '10px' }}>Price</th>
                                    <th style={{ padding: '10px' }}>Description</th>
                                    <th style={{ padding: '10px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {group.items.map(item => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{item.itemName}</td>
                                        <td style={{ padding: '10px' }}>₹{item.price.toFixed(2)}</td>
                                        <td style={{ padding: '10px' }}>{item.description}</td>
                                        <td style={{ padding: '10px' }}>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuManagement;
