import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SavedProperties from '../components/property/SavedProperties';
import { 
  Home,
  Heart,
  History,
  Settings,
  Bell,
  User,
  Search,
  MapPin,
  Building,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'saved';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (error) throw error;
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser, navigate]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'saved', label: 'Saved Properties', icon: Heart },
    { id: 'history', label: 'Search History', icon: History },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {currentUser.displayName}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your properties and preferences
              </p>
            </div>
            <button className="bg-[#1c5bde] text-white px-4 py-2 rounded-xl 
                           hover:bg-[#1c5bde]/90 transition-colors flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span className="font-medium">Notifications</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-6 mt-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl 
                         transition-colors relative
                         ${activeTab === tab.id 
                           ? 'text-[#1c5bde] bg-[#1c5bde]/5 font-medium' 
                           : 'text-gray-600 hover:text-gray-900'}`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-[1px] left-0 right-0 h-0.5 
                             bg-[#1c5bde] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SavedProperties />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {userProfile?.searchHistory?.map((search, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm 
                                          border border-gray-100 flex items-center 
                                          justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#1c5bde]/5 p-3 rounded-lg">
                      <Search className="h-5 w-5 text-[#1c5bde]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {search.query}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(search.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="text-[#1c5bde] hover:bg-[#1c5bde]/5 p-2 
                                   rounded-lg transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {/* Add other tab content here */}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard; 