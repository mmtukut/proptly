import React, { useState } from 'react';

export const Select = ({ value, onValueChange, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (val) => {
        onValueChange(val);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            {React.Children.map(children, (child) => {
                if (child.type === SelectTrigger) {
                    return React.cloneElement(child, {
                        isOpen,
                        onClick: () => setIsOpen(!isOpen),
                    });
                }

                if (child.type === SelectContent && isOpen) {
                    return React.cloneElement(child, {
                        onSelect: handleSelect,
                    });
                }

                return null;
            })}
        </div>
    );
};

export const SelectTrigger = ({ children, isOpen, onClick }) => {
    return (
        <button
            className={`w-full border border-gray-300 rounded-lg py-2 px-3 text-left ${
                isOpen ? 'ring-2 ring-blue-600' : ''
            }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export const SelectValue = ({ value, placeholder = 'Select...' }) => {
    return <span>{value || placeholder}</span>;
};

export const SelectContent = ({ children, onSelect }) => {
    return (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {React.Children.map(children, (child) =>
                React.cloneElement(child, { onSelect })
            )}
        </div>
    );
};

export const SelectItem = ({ value, children, onSelect }) => {
    return (
        <div
            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            onClick={() => onSelect(value)}
        >
            {children}
        </div>
    );
};
