import React from 'react';

const StoreQR = () => {
    // For mobile scanning to work, we must use the local network IP instead of 'localhost'
    const baseUrl = "http://10.191.0.230:3000";

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ color: '#1A2332', marginBottom: '10px' }}>Ali Halal Restaurant</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>Ask customers to scan this QR to see the menu & order</p>

            <div style={{ padding: '20px', border: '5px solid #F4A300', borderRadius: '20px', display: 'inline-block', backgroundColor: '#fff' }}>
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${baseUrl}`}
                    alt="Store QR Code"
                    style={{ width: '250px', height: '250px' }}
                />
            </div>

            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', fontSize: '14px', border: '1px solid #eee' }}>
                    <strong>Link:</strong> {baseUrl}
                </div>

                <button
                    onClick={handlePrint}
                    style={{
                        padding: '12px', backgroundColor: '#F4A300', color: 'white',
                        border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    Print QR Code
                </button>
            </div>

            <p style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
                Place this QR on your tables or at the entrance.
            </p>
        </div>
    );
};

export default StoreQR;
