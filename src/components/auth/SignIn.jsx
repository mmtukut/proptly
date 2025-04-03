import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, 
  CheckCircle2, ArrowRight 
} from 'lucide-react';
import logo from '../../assets/images/logo.png'
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

const SignIn = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, profile } = await login(formData.email, formData.password);
      
      if (!user) {
        throw new Error('Login failed - no user returned');
      }

      toast.success('Successfully signed in!');
      
      // Determine where to redirect based on profile status
      if (!profile.email_verified) {
        navigate('/verify-email');
      } else if (!profile.full_name) {
        navigate('/complete-profile');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const { user, profile } = await googleLogin();
      
      if (!user) {
        throw new Error('Google login failed - no user returned');
      }

      toast.success('Successfully signed in with Google!');
      
      // Determine where to redirect based on profile status
      if (!profile?.full_name) {
        navigate('/complete-profile');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Pop-up was blocked. Please allow pop-ups for this site.');
      } else {
        toast.error(error.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#1c5bde]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-[#1c5bde]/10 border border-[#1c5bde]/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-block mb-6">
              <img 
                src={logo}
                alt="FastFind360 Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#1c5bde] to-[#1c5bde]/80 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-neutral-600">Sign in to your FastFind360 account</p>
          </motion.div>

          {/* Sign In Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#1c5bde]/20 
                             focus:outline-none focus:ring-2 focus:ring-[#1c5bde]/20 focus:border-[#1c5bde]
                             pl-11 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password"
                    className="text-sm text-[#1c5bde] hover:text-[#1c5bde]/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#1c5bde]/20 
                             focus:outline-none focus:ring-2 focus:ring-[#1c5bde]/20 focus:border-[#1c5bde]
                             pl-11 pr-11 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="h-4 w-4 rounded border-[#1c5bde]/20 text-[#1c5bde] focus:ring-[#1c5bde]/20"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-neutral-600">
                  Remember me
                </label>
              </div>

              {/* Sign In Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-[#1c5bde] text-white 
                         hover:bg-[#1c5bde]/90 transition-all font-medium disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>

            {/* Social Sign In */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1c5bde]/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 rounded-xl
                         border border-[#1c5bde]/20 text-neutral-700 bg-white 
                         hover:bg-[#1c5bde]/5 transition-all disabled:opacity-50"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                {loading ? 'Connecting...' : 'Continue with Google'}
              </button>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-[#1c5bde] hover:text-[#1c5bde]/80 transition-colors">
              Get Started
            </Link>
          </p>
        </div>

        {/* Right Column - Features */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1c5bde]/5 rounded-2xl p-8 border border-[#1c5bde]/10"
          >
            <h2 className="text-xl font-bold mb-6 text-neutral-800">Account Benefits</h2>
            <div className="space-y-6">
              {[
                {
                  title: "Smart Property Management",
                  description: "Save properties and manage your saved in one place"
                },
                {
                  title: "Search History Tracking",
                  description: "Keep track of your property searches and preferences"
                },
                {
                  title: "Real-time Notifications",
                  description: "Get instant updates on saved properties and inquiries"
                },
                {
                  title: "Personalized Dashboard",
                  description: "Access your saved properties, history, and preferences"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="mt-1">
                    <CheckCircle2 className="h-5 w-5 text-[#1c5bde]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-800 mb-1">{feature.title}</h3>
                    <p className="text-sm text-neutral-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 