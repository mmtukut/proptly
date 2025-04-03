import React from 'react';

export const Button = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-blue-600 text-blue-600 hover:bg-blue-100',
    };

    return (
        <button className={`${baseClasses} ${variants[variant]}`} {...props}>
            {children}
        </button>
    );
};
