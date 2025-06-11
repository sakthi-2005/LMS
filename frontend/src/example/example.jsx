import React, { useState } from 'react';

export default function FancyLoadingDemo() {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = () => setLoadingCount(count => count + 1);
  const hideLoading = () => setLoadingCount(count => Math.max(count - 1, 0));
  const loading = loadingCount > 0;

  const fakeRequest = () => {
    showLoading();
    setTimeout(() => {
      hideLoading();
    }, 2500);
  };

  return (
    <>
      {/* Safe way to inject keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {loading && (
        <div style={styles.overlay}>
          <div style={styles.spinner}></div>
          <div style={styles.text}>Please wait...</div>
        </div>
      )}

      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button style={styles.button} onClick={fakeRequest}>
          🔄 Start Fake Request
        </button>
        <p style={{ marginTop: '1rem' }}>
          You can click multiple times to simulate parallel requests.
        </p>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    color: '#fff',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '6px solid rgba(255, 255, 255, 0.2)',
    borderTopColor: '#00c6ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  text: {
    marginTop: '1rem',
    fontSize: '1.2rem',
    fontFamily: 'Arial, sans-serif',
    opacity: 0.9,
  },
  button: {
    fontSize: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#00c6ff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'background-color 0.3s',
  },
};
