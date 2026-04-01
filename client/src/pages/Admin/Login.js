import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Simple login for prototype
            const res = await api.post('/admin/login', { username, password });
            localStorage.setItem('adminToken', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Admin login error:', err);
            if (err.response && err.response.status === 401) {
                setError('Invalid credentials');
            } else if (!err.response) {
                setError('Network error: Cannot reach server');
            } else {
                setError('An error occurred during login');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
            <h2 style={{ color: '#1A2332' }}>Admin Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ padding: '10px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px' }}
                />
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#1A2332', color: 'white',
                        border: 'none', padding: '12px', fontSize: '18px', cursor: 'pointer', borderRadius: '5px'
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
