import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import OrderContext from '../context/OrderContext';
import api from '../api';

const Menu = () => {
    const [menuData, setMenuData] = useState([]);
    const { addToCart, cart, tableNumber } = useContext(OrderContext);
    const [loading, setLoading] = useState(true);

    const handleCallWaiter = async () => {
        if (!tableNumber) {
            alert("Please login first to call a waiter.");
            return;
        }
        try {
            await api.post('/waiter/call', { tableNumber });
            alert("Waiter called! Someone will be with you shortly.");
        } catch (err) {
            console.error(err);
            alert("Failed to call waiter. Please try again.");
        }
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await api.get('/menu');
                setMenuData(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching menu:', err);
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (loading) return <div>Loading menu...</div>;

    return (
        <div style={{ padding: '20px', paddingBottom: '80px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#C8102E' }}>Menu</h2>
                <Link to="/cart" style={{ textDecoration: 'none' }}>
                    <div style={{ position: 'relative', fontSize: '24px' }}>
                        🛒
                        {totalItems > 0 && (
                            <span style={{
                                position: 'absolute', top: '-10px', right: '-10px',
                                backgroundColor: '#C8102E', color: 'white',
                                borderRadius: '50%', padding: '2px 6px', fontSize: '12px'
                            }}>
                                {totalItems}
                            </span>
                        )}
                    </div>
                </Link>
            </header>

            {menuData.map((categoryGroup) => (
                <div key={categoryGroup.category._id} id={`cat-${categoryGroup.category._id}`} style={{ marginBottom: '30px' }}>
                    <h3 style={{ borderBottom: '2px solid #F4A300', paddingBottom: '5px' }}>{categoryGroup.category.categoryName}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {categoryGroup.items.map((item) => (
                            <div key={item._id} style={{
                                border: '1px solid #ddd', borderRadius: '8px', padding: '15px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 10px 0' }}>{item.itemName}</h4>
                                    <p style={{ fontSize: '14px', color: '#666', margin: '0 0 10px 0' }}>{item.description}</p>
                                    <p style={{ fontWeight: 'bold', color: '#C8102E' }}>₹{item.price.toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={() => addToCart(item)}
                                    style={{
                                        marginTop: '10px', backgroundColor: '#F4A300', color: 'white',
                                        border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer'
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <a href="#top" style={{ color: '#F4A300' }}>Back to Top</a>
            </div>

            {/* Call Waiter Floating Button */}
            <button
                onClick={handleCallWaiter}
                style={{
                    position: 'fixed', bottom: '20px', left: '20px',
                    backgroundColor: '#C8102E', color: 'white',
                    border: 'none', borderRadius: '50%', width: '60px', height: '60px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', fontSize: '24px', cursor: 'pointer',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Call Waiter"
            >
                🔔
            </button>
        </div>
    );
};

export default Menu;
