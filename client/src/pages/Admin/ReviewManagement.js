import { useState, useEffect } from 'react';
import api from '../../api';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/admin/reviews');
            setReviews(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to dismiss this review?')) return;
        try {
            await api.delete(`/admin/reviews/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to dismiss review');
        }
    };

    if (loading) return <div>Loading reviews...</div>;

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div>
            <h2 style={{ color: '#1A2332', marginBottom: '20px' }}>Customer Reviews</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} style={{
                            backgroundColor: 'white', padding: '20px', borderRadius: '10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)', position: 'relative',
                            borderLeft: `5px solid ${review.rating >= 4 ? '#32CD32' : review.rating >= 3 ? '#FFA500' : '#C8102E'}`
                        }}>
                            {/* Red Cross Dismiss Button */}
                            <button
                                onClick={() => handleDelete(review._id)}
                                style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    background: 'transparent', color: 'red', border: '1px solid red',
                                    borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '14px', fontWeight: 'bold'
                                }}
                                title="Dismiss Review"
                            >
                                ✕
                            </button>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ color: '#F4A300', fontSize: '18px' }}>
                                    {renderStars(review.rating)}
                                </div>
                                <span style={{ fontSize: '12px', color: '#888' }}>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <p style={{ fontStyle: 'italic', color: '#444', marginBottom: '10px' }}>
                                "{review.comment || 'No comment provided.'}"
                            </p>

                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />

                            <div style={{ fontSize: '12px', color: '#666' }}>
                                <strong>Order:</strong> #{review.order?._id.slice(-6).toUpperCase()} |
                                <strong> Table:</strong> {review.order?.tableNumber}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;
