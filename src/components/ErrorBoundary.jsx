import React from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Something went wrong
                            </h2>
                            <p className="text-gray-600 mb-8">
                                We're sorry, but there was an error loading this page.
                            </p>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 