import React from 'react';
import './Button.css';

export default function Button({ children, type = 'button', variant = 'primary', disabled = false, onClick, className = '' }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
