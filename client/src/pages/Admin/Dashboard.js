import { useState, useEffect } from 'react';
import api from '../../api';
import io from 'socket.io-client';
import MenuManagement from './MenuManagement';
import Reports from './Reports';
import ReviewManagement from './ReviewManagement';
import StoreQR from './StoreQR';

const socket = io(process.env.REACT_APP_BACKEND_URL || `http://${window.location.hostname}:5001`);

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [waiterCalls, setWaiterCalls] = useState([]);
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'menu', 'reports', 'reviews', 'qr'

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/admin/orders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrders();

        // Listen for new orders
        socket.on('newOrder', (order) => {
            setOrders((prev) => [order, ...prev]);
            // Play sound or alert here
        });

        // Listen for waiter calls
        socket.on('waiterCall', (data) => {
            setWaiterCalls((prev) => [...prev, data]);
            alert(`Table ${data.tableNumber} is calling the waiter!`);
        });

        return () => {
            socket.off('newOrder');
            socket.off('waiterCall');
        };
    }, []);

    const updateStatus = async (id, status, prepTime) => {
        try {
            const res = await api.put(`/admin/orders/${id}/status`, { status, preparationTime: prepTime });

            if (status === 'Completed' || status === 'Cancelled') {
                setOrders((prev) => prev.filter(o => o._id !== id));
            } else {
                setOrders((prev) => prev.map(o => o._id === id ? res.data : o));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const dismissWaiterCall = (index) => {
        setWaiterCalls((prev) => prev.filter((_, i) => i !== index));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#FFA500'; // Orange
            case 'Preparing': return '#1E90FF'; // Blue
            case 'Ready': return '#32CD32'; // Green
            case 'Completed': return '#808080'; // Gray
            default: return '#000';
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F8F9FA' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', backgroundColor: '#1A2332', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <h3>Admin Panel</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li
                        onClick={() => setCurrentView('dashboard')}
                        style={{
                            padding: '10px 0', borderBottom: '1px solid #333', cursor: 'pointer',
                            color: currentView === 'dashboard' ? '#F4A300' : 'white'
                        }}
                    >
                        Dashboard
                    </li>
                    <li
                        onClick={() => setCurrentView('menu')}
                        style={{
                            padding: '10px 0', borderBottom: '1px solid #333', cursor: 'pointer',
                            color: currentView === 'menu' ? '#F4A300' : 'white'
                        }}
                    >
                        Menu Management
                    </li>
                    <li
                        onClick={() => setCurrentView('reports')}
                        style={{
                            padding: '10px 0', borderBottom: '1px solid #333', cursor: 'pointer',
                            color: currentView === 'reports' ? '#F4A300' : 'white'
                        }}
                    >
                        Reports
                    </li>
                    <li
                        onClick={() => setCurrentView('reviews')}
                        style={{
                            padding: '10px 0', borderBottom: '1px solid #333', cursor: 'pointer',
                            color: currentView === 'reviews' ? '#F4A300' : 'white'
                        }}
                    >
                        Reviews
                    </li>
                    <li
                        onClick={() => setCurrentView('qr')}
                        style={{
                            padding: '10px 0', borderBottom: '1px solid #333', cursor: 'pointer',
                            color: currentView === 'qr' ? '#F4A300' : 'white'
                        }}
                    >
                        Store QR
                    </li>
                </ul>

                {/* Waiter Calls Section */}
                <div style={{ marginTop: 'auto', borderTop: '1px solid #555', paddingTop: '20px' }}>
                    <h4 style={{ color: '#F4A300' }}>Waiter Calls ({waiterCalls.length})</h4>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {waiterCalls.map((call, idx) => (
                            <div key={idx} style={{
                                backgroundColor: '#C8102E', padding: '10px', marginBottom: '10px',
                                borderRadius: '5px', fontSize: '14px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Table {call.tableNumber}</span>
                                    <button
                                        onClick={() => dismissWaiterCall(idx)}
                                        style={{
                                            background: 'white', color: '#C8102E', border: 'none',
                                            borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        ✓
                                    </button>
                                </div>
                                <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.8 }}>
                                    {new Date(call.time).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ color: '#1A2332' }}>
                        {currentView === 'dashboard' && 'Live Orders'}
                        {currentView === 'menu' && 'Menu Management'}
                        {currentView === 'reports' && 'Reports'}
                        {currentView === 'reviews' && 'Customer Reviews'}
                        {currentView === 'qr' && 'Store QR Code'}
                    </h2>
                    <button onClick={() => window.location.href = '/'} style={{ padding: '10px', backgroundColor: '#ddd', border: 'none' }}>Logout</button>
                </header>

                {currentView === 'dashboard' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {orders.map((order) => (
                            <div key={order._id} style={{
                                backgroundColor: 'white', padding: '15px', borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                borderLeft: `5px solid ${getStatusColor(order.status)}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Table: {order.tableNumber}</span>
                                    <span style={{ fontSize: '12px', color: '#666' }}>{new Date(order.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <div style={{ margin: '8px 0', padding: '8px', backgroundColor: '#F0F4F8', borderRadius: '4px', borderLeft: '3px solid #1A2332' }}>
                                    <div style={{ fontWeight: 'bold', color: '#1A2332', fontSize: '14px' }}>
                                        👤 {order.customer?.name || 'Walk-in Customer'}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
                                        📞 {order.customer?.phoneNumber || 'N/A'}
                                    </div>
                                </div>
                                <p style={{ fontSize: '12px', color: '#888', margin: '5px 0' }}>Order ID: {order._id.slice(-6).toUpperCase()}</p>
                                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Payment:</span>
                                    <span style={{
                                        fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold',
                                        backgroundColor: order.paymentMethod === 'Online' ? '#E3F2FD' : '#F5F5F5',
                                        color: order.paymentMethod === 'Online' ? '#1976D2' : '#616161',
                                        border: `1px solid ${order.paymentMethod === 'Online' ? '#BBDEFB' : '#E0E0E0'}`
                                    }}>
                                        {order.paymentMethod === 'Online' ? '💳 ONLINE UPI' : '💵 CASH'}
                                    </span>
                                </div>
                                <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #eee' }} />

                                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{item.quantity}x {item.item?.itemName || 'Unknown Item'}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                                    Total: ₹{order.totalAmount.toFixed(2)}
                                </div>

                                <div style={{ marginTop: '15px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                    {order.status === 'Pending' && (
                                        <button
                                            onClick={() => {
                                                const time = prompt("Enter prep time in minutes:", "15");
                                                if (time) updateStatus(order._id, 'Preparing', time);
                                            }}
                                            style={{ flex: 1, backgroundColor: '#1E90FF', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            Accept & Cook
                                        </button>
                                    )}
                                    {order.status === 'Preparing' && (
                                        <button
                                            onClick={() => updateStatus(order._id, 'Ready')}
                                            style={{ flex: 1, backgroundColor: '#32CD32', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            Mark Ready
                                        </button>
                                    )}
                                    {order.status === 'Ready' && (
                                        <button
                                            onClick={() => updateStatus(order._id, 'Completed')}
                                            style={{ flex: 1, backgroundColor: '#808080', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            Complete
                                        </button>
                                    )}
                                    <button
                                        onClick={() => updateStatus(order._id, 'Cancelled')}
                                        style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {currentView === 'menu' && <MenuManagement />}
                {currentView === 'reports' && <Reports />}
                {currentView === 'reviews' && <ReviewManagement />}
                {currentView === 'qr' && <StoreQR />}
            </div>
        </div>
    );
};

export default AdminDashboard;
