import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL || `http://${window.location.hostname}:5001`);

const OrderStatus = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrder();

        // Listen for updates
        socket.on('orderStatusUpdate', (updatedOrder) => {
            if (updatedOrder._id === id) {
                setOrder(updatedOrder);
            }
        });

        return () => {
            socket.off('orderStatusUpdate');
        };
    }, [id]);

    if (!order) return <div style={{ padding: '20px' }}>Loading order status...</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#FFA500';
            case 'Preparing': return '#1E90FF';
            case 'Ready': return '#32CD32';
            case 'Completed': return '#808080';
            default: return '#000';
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', maxWidth: '500px', margin: '50px auto' }}>
            <h2 style={{ color: '#C8102E' }}>Order Status</h2>
            <div style={{
                padding: '20px', border: '2px solid #F4A300', borderRadius: '10px',
                backgroundColor: '#FFF8E1'
            }}>
                <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(order.status) }}>
                    {order.status}
                </p>
                {order.preparationTime && order.status === 'Preparing' && (
                    <p>Estimated Prep Time: {order.preparationTime} minutes</p>
                )}
                {order.status === 'Ready' && (
                    <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#DFF2BF', color: '#4F8A10', borderRadius: '5px' }}>
                        Your food is ready to serve!
                    </div>
                )}
                {order.status === 'Completed' && (
                    <div style={{ marginTop: '20px' }}>
                        <button
                            onClick={() => window.location.href = `/review/${order._id}`}
                            style={{
                                padding: '12px 24px', backgroundColor: '#F4A300', color: 'white',
                                border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px'
                            }}
                        >
                            Please Leave a Review
                        </button>
                    </div>
                )}
            </div>
            <div style={{ marginTop: '30px' }}>
                <h4>Order Summary</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {order.items.map((item, index) => (
                        <li key={index} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                            {item.quantity}x {item.item.itemName} - ₹{item.price}
                        </li>
                    ))}
                </ul>
                <h3>Total: ₹{order.totalAmount.toFixed(2)}</h3>
            </div>
        </div>
    );
};

export default OrderStatus;
