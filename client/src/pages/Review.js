import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import OrderContext from '../context/OrderContext';

const ReviewPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { customer } = useContext(OrderContext);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reviews', {
                orderId,
                customerId: customer?._id,
                rating,
                comment
            });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            alert('Failed to submit review');
        }
    };

    if (submitted) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>
                <h2 style={{ color: '#C8102E' }}>Thank You!</h2>
                <p>Your feedback is very valuable to us.</p>
                <div style={{ marginTop: '30px' }}>
                    <button
                        onClick={() => navigate('/menu')}
                        style={{
                            padding: '12px 24px', backgroundColor: '#F4A300', color: 'white',
                            border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px',
                            marginRight: '10px'
                        }}
                    >
                        Back to Menu
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px', backgroundColor: '#1A2332', color: 'white',
                            border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
                        }}
                    >
                        Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '50px auto' }}>
            <h2 style={{ color: '#C8102E', textAlign: 'center' }}>Rate Our Food & Service</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Rating:</label>
                    <div style={{ fontSize: '24px', display: 'flex', gap: '10px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                style={{ cursor: 'pointer', color: star <= rating ? '#F4A300' : '#ddd' }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Comments (Optional):</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what you liked or how we can improve..."
                        style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: '100%', padding: '12px', backgroundColor: '#C8102E', color: 'white',
                        border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px'
                    }}
                >
                    Submit Review
                </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                    onClick={() => navigate('/menu')}
                    style={{ backgroundColor: 'transparent', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Skip & Go to Menu
                </button>
            </div>
        </div>
    );
};

export default ReviewPage;
