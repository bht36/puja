import React from 'react';

export const Button = ({ 
  children, 
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 bg-red-500 text-white font-medium rounded-2xl hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
