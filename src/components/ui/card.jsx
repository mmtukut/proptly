import React from 'react';

export const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => {
    return <div className={`border-b pb-4 mb-4 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }) => {
    return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
};

export const CardContent = ({ children, className = '' }) => {
    return <div className={`${className}`}>{children}</div>;
};

export const CardDescription = ({ children, className = '' }) => {
    return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
};
