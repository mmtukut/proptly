import React from 'react';

export const Tabs = ({ value, onValueChange, children }) => {
    const tabs = React.Children.toArray(children);

    return (
        <div>
            <div className="flex space-x-4 border-b mb-4">
                {tabs.map((tab) =>
                    React.cloneElement(tab, {
                        active: tab.props.value === value,
                        onClick: () => onValueChange(tab.props.value),
                    })
                )}
            </div>
            {tabs.find((tab) => tab.props.value === value)?.props.children}
        </div>
    );
};


export const TabsList = ({ children, value, onValueChange }) => {
    const triggers = React.Children.toArray(children);

    return (
        <div className="flex space-x-4 border-b mb-4">
            {triggers.map((trigger) =>
                React.cloneElement(trigger, {
                    active: trigger.props.value === value,
                    onClick: () => onValueChange(trigger.props.value),
                })
            )}
        </div>
    );
};


export const TabsTrigger = ({ children, active, ...props }) => {
    return (
        <button
            {...props}
            className={`px-4 py-2 ${
                active ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
        >
            {children}
        </button>
    );
};

export const TabsContent = ({ children }) => {
    return <div>{children}</div>;
};
