import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#1c5bde]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-[#1c5bde]/10 border border-[#1c5bde]/10">
          <Link
            to="/signin"
            className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to sign in
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#1c5bde] to-[#1c5bde]/80 bg-clip-text text-transparent">
              Reset your password
            </h2>
            <p className="text-neutral-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </motion.div>

          {emailSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 p-4 rounded-xl border border-green-100"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Reset link sent!
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    Check your email for instructions to reset your password.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#1c5bde]/20 
                             focus:outline-none focus:ring-2 focus:ring-[#1c5bde]/20 focus:border-[#1c5bde]
                             pl-11 transition-all"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full px-4 py-3 rounded-xl bg-[#1c5bde] text-white 
                         hover:bg-[#1c5bde]/90 transition-all font-medium disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 