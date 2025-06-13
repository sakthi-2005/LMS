import React from 'react';
import './Spinner.css';

export default function Spinner({ size = 30, borderColor = 'rgba(0,0,0,0.1)', borderTopColor = '#007bff' }) {
  const style = {
    width: size,
    height: size,
    borderColor: borderColor,
    borderTopColor: borderTopColor,
  };

  return <div className="spinner" style={style} />;
}
