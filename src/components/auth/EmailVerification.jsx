import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EmailVerification = () => {
  const navigate = useNavigate();
  const { currentUser, checkEmailVerification, resendVerificationEmail, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const checkVerification = async () => {
      if (currentUser) {
        const isVerified = await checkEmailVerification();
        if (isVerified) {
          toast.success('Email verified successfully!');
          navigate('/profile');
        }
      }
    };

    const interval = setInterval(checkVerification, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [currentUser, checkEmailVerification, navigate]);

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      await resendVerificationEmail();
      setVerificationSent(true);
      setCountdown(60); // Start 60 second countdown
      
      // Countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error resending verification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Verify your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification email to<br />
            <span className="font-medium text-gray-900">{currentUser?.email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={loading || countdown > 0}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : countdown > 0 ? (
              `Resend email in ${countdown}s`
            ) : (
              'Resend verification email'
            )}
          </button>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign out
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Waiting for verification
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerification; 