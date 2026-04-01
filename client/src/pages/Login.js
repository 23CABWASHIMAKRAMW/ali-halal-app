import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderContext from '../context/OrderContext';
import api from '../api';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const { loginCustomer } = useContext(OrderContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/customer/login', { phoneNumber, tableNumber, name });
            loginCustomer(res.data.customer, res.data.tableNumber);
            navigate('/menu');
        } catch (err) {
            console.error('Login error:', err);
            if (err.response) {
                setError(err.response.data.msg || 'Login failed. Please try again.');
            } else if (err.request) {
                setError('Network error: Cannot reach server. Please check your connection.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
            <h2 style={{ color: '#F4A300' }}>Welcome to Ali Halal Restaurant</h2>
            <p>Please enter your details to order.</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                <input
                    type="text"
                    placeholder="Table Number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#F4A300',
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                >
                    Verify & Start
                </button>
            </form>
        </div>
    );
};

export default Login;
