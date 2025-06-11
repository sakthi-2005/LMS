import React, { useState } from 'react';
import Spinner from './Spinner';

export function FullscreenSpinnerDemo() {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = () => setLoadingCount(c => c + 1);
  const hideLoading = () => setLoadingCount(c => Math.max(c - 1, 0));
  const loading = loadingCount > 0;

  const fakeRequest = () => {
    showLoading();
    setTimeout(() => hideLoading(), 2500);
  };

  return (
    <>
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          color: '#fff',
        }}>
          <Spinner size={60} borderColor="rgba(255,255,255,0.2)" borderTopColor="#00c6ff" />
          <div style={{ marginTop: 16, fontSize: '1.2rem', opacity: 0.9, fontFamily: 'Arial, sans-serif' }}>
            Please wait...
          </div>
        </div>
      )}

      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button
          style={{
            fontSize: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#00c6ff',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'background-color 0.3s',
          }}
          onClick={fakeRequest}
        >
          🔄 Start Fake Request
        </button>
        <p style={{ marginTop: '1rem' }}>
          Click multiple times to simulate parallel requests.
        </p>
      </div>
    </>
  );
}
