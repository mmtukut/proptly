import React from 'react';

export const Switch = ({ checked, onCheckedChange }) => {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <span className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                    className="sr-only"
                />
                <span
                    className={`block w-10 h-6 rounded-full ${
                        checked ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                ></span>
                <span
                    className={`dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                        checked ? 'transform translate-x-4' : ''
                    }`}
                ></span>
            </span>
        </label>
    );
};
