import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, BedDouble, Bath, Square, ArrowLeft, School, 
  Hospital, ShoppingBag, Share2, Heart, ChevronLeft, 
  ChevronRight, User, Zap, Droplet, Wind, Thermometer, 
  Signal, Road, Shield, Tree, ShoppingCart, Bus, Wifi, Tv, 
  Mountain, Utensils, Car, X, Check, Home, FileText, Coffee,
  TrendingUp, Users, Clock, Eye, Calendar, Phone, MessageSquare, Brain, ChevronUp, ChevronDown, MessageSquareText
} from 'lucide-react';
import { properties, filterProperties } from '../data/properties.data';
import { infrastructureData } from '../data/infrastructure';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useAIChat } from '../contexts/AIChatContext';

const PropertyDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [property, setProperty] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is360View, setIs360View] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [recentViewers, setRecentViewers] = useState(0);
  const [timeOnMarket, setTimeOnMarket] = useState('');
  const [similarProperties, setSimilarProperties] = useState([]);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [aiMetrics, setAiMetrics] = useState({
    questionsAnswered: Math.floor(Math.random() * 50) + 100,
    activeUsers: Math.floor(Math.random() * 5) + 3,
    avgResponseTime: '30 sec'
  });
  const { messages, isTyping, sendMessage, setCurrentProperty } = useAIChat();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const currentProperty = properties.find(p => p.id === parseInt(id));
    if (currentProperty) {
      setProperty(currentProperty);
      // Simulate social proof data
      setViewCount(Math.floor(Math.random() * 50) + 100);
      setRecentViewers(Math.floor(Math.random() * 5) + 3);
      setTimeOnMarket('2 days');
      // Simulate similar properties
      setSimilarProperties(properties.slice(0, 3));
    }
  }, [id]);

  useEffect(() => {
    if (property) {
      setCurrentProperty(property);
    }
  }, [property, setCurrentProperty]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    sendMessage(inputValue, property);
    setInputValue('');
  };

  const handleQuestionClick = (question) => {
    sendMessage(question, property);
    setShowFAQ(false);
  };

  // Social Proof Section
  const SocialProofBar = () => (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center text-sm text-blue-800">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{viewCount} people viewed this property</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{recentViewers} people viewing now</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Listed {timeOnMarket} ago</span>
        </div>
      </div>
    </div>
  );

  // Urgency Banner
  const UrgencyBanner = () => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Calendar className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            This property is in high demand! Schedule a viewing now to avoid missing out.
          </p>
        </div>
      </div>
    </div>
  );

  // Quick Action Buttons
  const QuickActions = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 z-50">
      <div className="container mx-auto flex justify-between items-center gap-4">
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900">₦{property?.price?.toLocaleString()}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowContactForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Phone className="h-5 w-5" />
            Schedule Viewing
          </button>
          <button
            onClick={() => {
              if (!currentUser) {
                toast.error('Please sign in to save properties');
                return;
              }
              setIsLiked(!isLiked);
            }}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
              isLiked 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  // Similar Properties Section
  const SimilarProperties = () => (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4">Similar Properties You Might Like</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        {similarProperties.map((prop) => (
          <Link 
            key={prop.id} 
            to={`/property/${prop.id}`}
            className="group"
          >
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={prop.images[0]} 
                alt={prop.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white font-semibold">{prop.title}</p>
                <p className="text-white/90">₦{prop.price.toLocaleString()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  const handleImageNavigation = useCallback((direction) => {
    setActiveImageIndex((prev) => {
      if (direction === 'next') {
        return prev === property.images.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? property.images.length - 1 : prev - 1;
    });
  }, [property?.images?.length]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  }, [property]);

  // Common questions based on property type
  const commonQuestions = [
    {
      question: `What's the neighborhood like around ${property?.location}?`,
      category: 'Location'
    },
    {
      question: `Are there any upcoming developments near this ${property?.type}?`,
      category: 'Future Value'
    },
    {
      question: 'What are the payment terms and options?',
      category: 'Financial'
    },
    {
      question: 'Is the price negotiable?',
      category: 'Price'
    },
    {
      question: `What's included in the ${property?.type} price?`,
      category: 'Features'
    }
  ];

  // Property-specific questions based on features
  const propertySpecificQuestions = [
    ...(property?.features?.pool ? [{
      question: 'How is the pool maintained?',
      category: 'Amenities'
    }] : []),
    ...(property?.features?.security ? [{
      question: 'What security features are included?',
      category: 'Security'
    }] : []),
    ...(property?.type === 'apartment' ? [{
      question: 'What are the service charges?',
      category: 'Costs'
    }] : [])
  ];

  const allQuestions = [...commonQuestions, ...propertySpecificQuestions];

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-20">
      {/* Back Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-gray-50 transition-all"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Social Proof and Urgency */}
        <SocialProofBar />
        <UrgencyBanner />

        {/* Image Gallery Section */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="relative h-[60vh]">
            <img 
              src={property.images[activeImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4">
              <button
                onClick={() => handleImageNavigation('prev')}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleImageNavigation('next')}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-gray-50 transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute top-4 right-4 flex space-x-3">
              <button 
                onClick={() => setIs360View(!is360View)}
                className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-gray-50 transition-all"
              >
                {is360View ? 'View Photos' : '360° Tour'}
              </button>
              <button 
                onClick={handleShare}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-all"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2 p-4 overflow-x-auto">
            {property.images.map((image, index) => (
              <button
                key={index}
                className={`flex-shrink-0 ${
                  activeImageIndex === index ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`}
                  className="h-16 w-24 object-cover rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-xl text-gray-600 flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5" />
                {property.location}
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y">
                <div className="text-center">
                  <BedDouble className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-semibold">{property.bedrooms} Beds</p>
                </div>
                <div className="text-center">
                  <Bath className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-semibold">{property.bathrooms} Baths</p>
                </div>
                <div className="text-center">
                  <Square className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-semibold">{property.squareFeet} sq ft</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">About This Property</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Features and Amenities */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location and Neighborhood */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Location & Neighborhood</h2>
              <div className="h-64 rounded-lg overflow-hidden mb-4">
                <Map
                  initialViewState={{
                    longitude: property.coordinates[0],
                    latitude: property.coordinates[1],
                    zoom: 14
                  }}
                  style={{ width: '100%', height: '100%' }}
                  mapStyle="https://api.maptiler.com/maps/streets/style.json?key=eR1q55vlOs32zTmwF4KS"
                >
                  <Marker
                    longitude={property.coordinates[0]}
                    latitude={property.coordinates[1]}
                  >
                    <MapPin className="h-8 w-8 text-blue-500" />
                  </Marker>
                </Map>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Agent Form */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Schedule a Viewing</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue="I'm interested in scheduling a viewing of this property."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Schedule Viewing
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <SimilarProperties />
      </div>

      {/* AI Assistant Button */}
      <AnimatePresence>
        {!showAIChat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 flex flex-col items-end gap-3 pb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 text-sm"
            >
              <div className="flex items-center gap-2 text-gray-600 border-r pr-3">
                <Users className="w-4 h-4" />
                <span>{aiMetrics.activeUsers} viewing</span>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAIChat(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
            >
              <MessageSquareText className="w-5 h-5" />
              <span className="font-medium">Ask About This Property</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {showAIChat && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] lg:w-[450px] 
                     bg-white shadow-2xl flex flex-col z-50"
            style={{
              maxHeight: '100vh',
              height: 'auto',
              marginBottom: '80px'
            }}
          >
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h3 className="font-semibold text-gray-900">Property Assistant</h3>
                <p className="text-sm text-gray-500">
                  {aiMetrics.questionsAnswered}+ questions answered
                </p>
              </div>
              <button 
                onClick={() => setShowAIChat(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FAQ Section */}
            <div className="border-b">
              <button
                onClick={() => setShowFAQ(!showFAQ)}
                className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Common Questions</span>
                </div>
                {showFAQ ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {showFAQ && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-3 space-y-2">
                      {allQuestions.map((q, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuestionClick(q.question)}
                          className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2"
                        >
                          <span className="w-16 text-xs text-gray-500 shrink-0">
                            {q.category}
                          </span>
                          <span className="text-gray-700">{q.question}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSendMessage}
              className="p-4 border-t bg-white sticky bottom-0"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything about this property..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                    ${!inputValue.trim() || isTyping
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  <MessageSquareText className="w-4 h-4" />
                  {isTyping ? 'Thinking...' : 'Send'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg transition-transform duration-300
        ${showAIChat ? 'transform translate-x-0 md:translate-x-[400px] lg:translate-x-[450px]' : ''}`}>
        <QuickActions />
      </div>
    </div>
  );
};

export default PropertyDetailView;
