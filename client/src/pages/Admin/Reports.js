import { useState, useEffect } from 'react';
import api from '../../api';

const Reports = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        completedOrders: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/admin/reports');
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching reports:', err);
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) return <div>Loading reports...</div>;

    return (
        <div>
            <h2 style={{ color: '#1A2332', marginBottom: '30px' }}>Store Reports</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                {/* Total Orders Card */}
                <div style={{
                    backgroundColor: 'white', padding: '20px', borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center'
                }}>
                    <h3 style={{ color: '#666', fontSize: '16px' }}>Total Orders</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#1E90FF', margin: '10px 0' }}>{stats.totalOrders}</p>
                </div>

                {/* Completed Orders Card */}
                <div style={{
                    backgroundColor: 'white', padding: '20px', borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center'
                }}>
                    <h3 style={{ color: '#666', fontSize: '16px' }}>Completed Orders</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#32CD32', margin: '10px 0' }}>{stats.completedOrders}</p>
                </div>

                {/* Total Revenue Card */}
                <div style={{
                    backgroundColor: 'white', padding: '20px', borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center'
                }}>
                    <h3 style={{ color: '#666', fontSize: '16px' }}>Total Revenue</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#F4A300', margin: '10px 0' }}>₹{stats.totalRevenue.toFixed(2)}</p>
                </div>

                {/* Overall Rating Card */}
                <div style={{
                    backgroundColor: 'white', padding: '20px', borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center'
                }}>
                    <h3 style={{ color: '#666', fontSize: '16px' }}>Overall Rating</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#F4A300', margin: '10px 0' }}>
                        {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'} / 5
                    </p>
                </div>
            </div>

            {/* Placeholder for future charts */}
            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', textAlign: 'center', color: '#888' }}>
                <p>Detailed sales charts and analytics coming soon...</p>
            </div>
        </div>
    );
};

export default Reports;
