import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderContext from '../context/OrderContext';
import api from '../api';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, customer, tableNumber, clearCart, setCurrentOrder } = useContext(OrderContext);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (!customer || !tableNumber) {
            alert("Session expired. Please login again.");
            navigate('/login');
            return;
        }

        const orderData = {
            customerId: customer._id,
            tableNumber,
            items: cart.map(item => ({
                item: item._id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount,
            paymentMethod
        };

        try {
            const res = await api.post('/orders', orderData);
            setCurrentOrder(res.data);
            clearCart();
            navigate(`/order/${res.data._id}`);
        } catch (err) {
            console.error("Order failed", err);
            alert("Failed to place order. Please try again.");
        }
    };

    if (cart.length === 0) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Your cart is empty. <button onClick={() => navigate('/menu')}>Go to Menu</button></div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid #F4A300', paddingBottom: '10px' }}>Your Cart</h2>
            <div>
                {cart.map((item) => (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                        <div style={{ flex: 1 }}>
                            <h4>{item.itemName}</h4>
                            <p>₹{item.price.toFixed(2)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                            <button onClick={() => removeFromCart(item._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h4 style={{ marginBottom: '10px' }}>Table Number: {tableNumber}</h4>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Payment Method:</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ marginLeft: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
                    >
                        <option value="Cash">Pay at Counter (Cash)</option>
                        <option value="Online">Online UPI (GPay/PhonePe)</option>
                    </select>
                </div>

                {paymentMethod === 'Online' && (
                    <div style={{
                        backgroundColor: '#fff', padding: '15px', borderRadius: '8px',
                        border: '1px dashed #F4A300', marginTop: '10px', textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>Scan to pay or use button below</p>
                        {/* Real UPI QR - Updated with user provided details */}
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=8072224023@ibl%26pn=Washim%20Akram%20W%26am=${totalAmount.toFixed(2)}%26cu=INR`}
                            alt="UPI QR Code"
                            style={{ width: '150px', height: '150px', marginBottom: '10px' }}
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a
                                href={`phonepe://pay?pa=8072224023@ibl&pn=Washim%20Akram%20W&am=${totalAmount.toFixed(2)}&cu=INR`}
                                style={{
                                    textDecoration: 'none', backgroundColor: '#5f259f', color: 'white',
                                    padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold',
                                    flex: '1', textAlign: 'center'
                                }}
                            >
                                Pay with PhonePe
                            </a>
                            <a
                                href={`upi://pay?pa=8072224023@ibl&pn=Washim%20Akram%20W&am=${totalAmount.toFixed(2)}&cu=INR`}
                                style={{
                                    textDecoration: 'none', backgroundColor: '#1a73e8', color: 'white',
                                    padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold',
                                    flex: '1', textAlign: 'center'
                                }}
                            >
                                Pay with GPay
                            </a>
                        </div>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                            Please wait on this page after payment.
                        </p>
                    </div>
                )}
            </div>

            <button
                onClick={handleCheckout}
                style={{
                    width: '100%', marginTop: '30px', backgroundColor: '#C8102E', color: 'white',
                    border: 'none', padding: '15px', fontSize: '18px', borderRadius: '5px', cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                {paymentMethod === 'Online' ? 'I Have Paid - Place Order' : 'Confirm Order'}
            </button>
        </div>
    );
};

export default Cart;
