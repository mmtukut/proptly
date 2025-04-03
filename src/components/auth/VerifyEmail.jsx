import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast'; // Import toast here


const VerifyEmail = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleResendVerification = async () => {
        try {
            await user.sendEmailVerification();
            toast.success('Verification email sent!');
        } catch (error) {
            console.error('Error sending verification email:', error);
            toast.error('Failed to send verification email');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verify your email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We've sent a verification email to {user?.email}
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Please check your email and click the verification link to continue.
                        </p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={handleResendVerification}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Resend verification email
                        </button>

                        <button
                            onClick={() => navigate('/signin')}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back to sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail; 