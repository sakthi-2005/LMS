import React, { useState } from 'react';
import Spinner from './Spinner';

export function InlineSpinnerDemo() {
  const [loading, setLoading] = useState(false);

  const fakeRequest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2500);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <button onClick={fakeRequest} style={{
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        borderRadius: 5,
        border: 'none',
        backgroundColor: '#00c6ff',
        color: '#fff',
        cursor: 'pointer',
      }}>
        🔄 Start Fake Request
      </button>
<br />
<br />
      {loading && (
        <span style={{display: 'inline-flex'}}>
          <Spinner size={24} borderColor="rgba(0, 198, 255, 0.3)" borderTopColor="#00c6ff" />
        </span>
      )}
    </div>
  );
}
