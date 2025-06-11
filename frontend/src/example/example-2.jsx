import React, { useState } from 'react';

export default function ButtonLoaderDemo() {
  const [loading, setLoading] = useState(false);

  const fakeRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay
  };

  return (
    <>
      {/* Spinner keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button
          onClick={fakeRequest}
          disabled={loading}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? (
            <div style={{
              width: '20px',
              height: '20px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
          ) : (
            'Start Request'
          )}
        </button>

        <p style={{ marginTop: '1rem' }}>
          Click the button to simulate an async request.
        </p>
      </div>
    </>
  );
}
