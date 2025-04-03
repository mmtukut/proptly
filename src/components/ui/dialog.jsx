import React, { useState } from 'react';

export const Dialog = ({ trigger, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div onClick={() => setIsOpen(true)}>{trigger}</div>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        {children}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
