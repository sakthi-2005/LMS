import React, { useState } from 'react';
import axios from 'axios';

export default function MultipleLoadingStatesDemo() {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [inlineLoading, setInlineLoading] = useState(false);

  const [buttonData, setButtonData] = useState(null);
  const [inlineData, setInlineData] = useState(null);

  const fetchButtonData = async () => {
    setButtonLoading(true);
    try {
      const res = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
      setButtonData(res.data);
    } catch (err) {
      alert('Button request failed');
    } finally {
      setButtonLoading(false);
    }
  };

  const fetchFullScreenData = async () => {
    setFullScreenLoading(true);
    try {
      await axios.get('https://jsonplaceholder.typicode.com/posts/2');
      alert('Full-screen request completed!');
    } catch {
      alert('Full-screen request failed!');
    } finally {
      setFullScreenLoading(false);
    }
  };

  const fetchInlineData = async () => {
    setInlineLoading(true);
    try {
      const res = await axios.get('https://jsonplaceholder.typicode.com/posts/3');
      setInlineData(res.data);
    } catch {
      alert('Inline request failed!');
    } finally {
      setInlineLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
      {/* Fullscreen Loader */}
      {fullScreenLoading && (
        <div style={styles.fullScreenOverlay}>
          <div style={styles.spinner}></div>
        </div>
      )}

      {/* Button Loading Spinner */}
      <button
        onClick={fetchButtonData}
        disabled={buttonLoading}
        style={{ ...styles.button, marginBottom: 20 }}
      >
        {buttonLoading ? (
          <div style={styles.miniSpinner}></div>
        ) : (
          'Load via Button'
        )}
      </button>

      {buttonData && (
        <div style={styles.card}>
          <strong>Button Response:</strong>
          <p>{buttonData.title}</p>
        </div>
      )}

      {/* Inline Loader Section */}
      <div style={styles.card}>
        <button onClick={fetchInlineData} disabled={inlineLoading} style={styles.button}>
          {inlineLoading ? 'Loading...' : 'Load Inline'}
        </button>

        {inlineLoading && <div style={{ marginTop: 10 }}>⏳ Fetching content...</div>}

        {inlineData && (
          <div style={{ marginTop: 10 }}>
            <strong>Inline Content:</strong>
            <p>{inlineData.body}</p>
          </div>
        )}
      </div>

      {/* Full-screen trigger */}
      <button onClick={fetchFullScreenData} style={{ ...styles.button, marginTop: 30 }}>
        Trigger Full-Screen Loader
      </button>
    </div>
  );
}

const styles = {
  button: {
    padding: '10px 15px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  miniSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  fullScreenOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '6px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  card: {
    marginTop: 20,
    padding: 15,
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

// Global CSS
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleTag);
