import React from 'react';

export const LoadingSpinner = ({ size = 'md', light = false }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700 ${
          light ? 'border-t-white' : 'border-t-blue-600'
        }`}
      />
    </div>
  );
};

export const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50">
    <LoadingSpinner size="lg" />
  </div>
); 