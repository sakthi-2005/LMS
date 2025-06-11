import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Module-scoped variables (not stateful)
let requestCounter = 0;
let globalSetLoading = () => {};

function setupInterceptors(setLoading) {
  globalSetLoading = setLoading;

  axios.interceptors.request.use(config => {
    requestCounter++;
    globalSetLoading(true);
    return config;
  }, error => {
    requestCounter--;
    if (requestCounter === 0) globalSetLoading(false);
    return Promise.reject(error);
  });

  axios.interceptors.response.use(response => {
    requestCounter--;
    if (requestCounter === 0) globalSetLoading(false);
    return response;
  }, error => {
    requestCounter--;
    if (requestCounter === 0) globalSetLoading(false);
    return Promise.reject(error);
  });
}

export default function GlobalAxiosLoadingExample() {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    setupInterceptors(setLoading);
  }, []);

  const fetchPost = async () => {
    try {
      const res = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
      setPost(res.data);
    } catch (e) {
      alert('Error!');
    }
  };

  const fetchAnother = async () => {
    try {
      const res = await axios.get('https://jsonplaceholder.typicode.com/posts/2');
      console.log(res.data);
    } catch (e) {
      console.log('Another failed');
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <button onClick={fetchPost} style={styles.button}>
          Fetch Post
        </button>
        <button onClick={fetchAnother} style={{ ...styles.button, marginLeft: 10 }}>
          Fetch Another
        </button>

        {loading && (
          <div style={{ marginTop: '1rem' }}>
            <div style={styles.spinner}></div>
            <div style={{ color: '#555', marginTop: 8 }}>Loading in progress...</div>
          </div>
        )}

        {post && (
          <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '400px', marginInline: 'auto' }}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  spinner: {
    width: '30px',
    height: '30px',
    border: '4px solid rgba(0,0,0,0.1)',
    borderTopColor: '#007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
};
