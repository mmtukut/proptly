import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { 
  Phone,
  Mail, 
  Star, 
  Clock, 
  Globe, 
  Award,
  CheckCircle,
  Languages as LanguagesIcon,
  Briefcase,
  Calendar,
  MessageSquare,
  X,
  MessageCircle
} from 'lucide-react';

const AgentProfileModal = ({ isOpen, onClose, ownerDetails }) => {
  console.log('AgentProfileModal rendered with details:', ownerDetails);
  
  if (!ownerDetails) return null;

  // Add error boundary for image loading
  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.src = '/images/agents/default-avatar.jpg';
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-xl"
        >
          {/* Header Section */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={ownerDetails.avatar}
                alt={ownerDetails.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{ownerDetails.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{ownerDetails.rating} ({ownerDetails.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Joined {ownerDetails.joinedYear}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Properties Listed</p>
              <p className="text-xl font-bold text-blue-600">{ownerDetails.totalProperties}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-xl font-bold text-green-600">{ownerDetails.responseTime}</p>
            </div>
          </div>

          {/* Languages & Specializations */}
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <LanguagesIcon className="w-5 h-5 text-blue-500" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {ownerDetails.languages?.map(lang => (
                  <span key={lang} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {ownerDetails.specializations?.map(spec => (
                  <span key={spec} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <p className="text-gray-600 leading-relaxed">{ownerDetails.about}</p>
          </div>

          {/* Achievements & Certifications */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements
              </h3>
              <ul className="space-y-2">
                {ownerDetails.achievements?.map(achievement => (
                  <li key={achievement} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Certifications
              </h3>
              <ul className="space-y-2">
                {ownerDetails.certifications?.map(cert => (
                  <li key={cert} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-xl hover:bg-blue-700 transition-colors">
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
            <button className="flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 px-4 rounded-xl hover:bg-green-700 transition-colors">
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-2.5 px-4 rounded-xl hover:bg-emerald-600 transition-colors">
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default AgentProfileModal; 