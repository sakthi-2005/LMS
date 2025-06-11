import React, { useState } from 'react';
import Spinner from './Spinner';

export function ButtonLoaderDemo() {
  const [loading, setLoading] = useState(false);

  const fakeRequest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
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
        {loading ? <Spinner size={20} borderColor="rgba(255,255,255,0.3)" borderTopColor="#fff" /> : 'Start Request'}
      </button>
      <p style={{ marginTop: '1rem' }}>Click the button to simulate an async request.</p>
    </div>
  );
}
