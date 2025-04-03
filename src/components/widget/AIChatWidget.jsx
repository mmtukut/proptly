import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Send, Loader2, MessageCircle, User, X, Minimize2, Maximize2, Building2, MapPin, Banknote, Home, MessageSquareText, Mic, MicOff, DollarSign, Crown, Star, Shield, Building } from 'lucide-react';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeUsers, setActiveUsers] = useState(Math.floor(Math.random() * 15) + 5);
  const [questionsAnswered, setQuestionsAnswered] = useState(Math.floor(Math.random() * 500) + 1000);
  const [satisfaction, setSatisfaction] = useState(98);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const messagesEndRef = useRef(null);
  const suggestionsRef = useRef(null);
  const chatRef = useRef(null);
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  // Categories for suggestions
  const categories = [
    { id: 'all', label: 'All', icon: MessageCircle },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'price', label: 'Price', icon: DollarSign },
    { id: 'amenities', label: 'Amenities', icon: Star }
  ];

  // Enhanced suggestions with categories
  const suggestions = {
    all: [
      { text: "Show all available properties", icon: Building },
      { text: "Properties under ₦50M", icon: Banknote }
    ],
    location: [
      { text: "Properties in Maitama", icon: MapPin },
      { text: "Homes near schools in Asokoro", icon: Building }
    ],
    price: [
      { text: "Luxury properties above ₦200M", icon: Crown },
      { text: "Affordable homes under ₦50M", icon: Home }
    ],
    amenities: [
      { text: "Properties with swimming pools", icon: Building2 },
      { text: "Homes with 24/7 security", icon: Shield }
    ]
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        type: 'assistant',
        content: `👋 Hello! I'm your AI assistant. I've helped ${questionsAnswered.toLocaleString()}+ users find their perfect property with ${satisfaction}% satisfaction rate.

Here's how I can help:
• Find properties matching your preferences
• Answer questions about locations and neighborhoods
• Provide detailed property insights
• Compare different properties

What would you like to know?`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, questionsAnswered, satisfaction]);

  useEffect(() => {
    window.handlePropertyChat = (propertyId, propertyTitle) => {
      const message = `Tell me more about "${propertyTitle}"`;
      setInputMessage('');
      setMessages(prev => [...prev, {
        type: 'user',
        content: message,
        timestamp: new Date()
      }]);
      
      handleSubmit(
        { preventDefault: () => {} },
        message,
        propertyId
      );
      
      setIsOpen(true);
      setIsMinimized(false);
    };

    return () => {
      delete window.handlePropertyChat;
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatPropertySection = (property) => {
    if (!property) return '';
    
    const features = property.features || [];
    const title = property.title?.replace(/[\[\]]/g, '') || 'Property'; // Remove brackets from title
    
    return `
      <div class="property-card bg-white rounded-lg p-4 mb-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div class="flex items-start gap-4">
          <img src="${property.image || '/placeholder.jpg'}" alt="${title}" class="w-24 h-24 rounded-lg object-cover" />
          <div class="flex-1">
            <h3 class="font-semibold text-lg mb-1">${title}</h3>
            <div class="flex items-center gap-2 text-gray-600 mb-2">
              <span class="flex items-center gap-1">
                <i class="fas fa-map-marker-alt"></i>
                ${property.location || 'Location not specified'}
              </span>
              <span class="text-green-600 font-semibold">₦${(property.price || 0).toLocaleString()}</span>
            </div>

          </div>
        </div>
      </div>
    `;
  };

  const formatMessage = (text, properties = []) => {
    if (!text) return '';
    
    if (Array.isArray(properties) && properties.length > 0) {
      const propertyCards = properties.map(formatPropertySection).join('');
      text = text.replace('[PROPERTY_SECTION]', propertyCards);
    }

    const processedText = text
    .replace(
      /<button class="view-details" data-property-id="([^"]+)" data-property-title="([^"]+)">📋 View Details<\/button>/g,
      `<a href="/properties/$1" class="inline-flex items-center px-3 py-1 mr-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200">
        <span class="mr-1">📋</span> View Details
      </a>`
    )
      .replace(
        /<button class="chat-about" data-property-id="([^"]+)" data-property-title="([^"]+)">💬 Chat about this property<\/button>/g,
        `<button onclick="handlePropertyChat('$1', '$2')" class="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full hover:bg-green-200">
          <span class="mr-1">💬</span> Chat
        </button>`
      )
      .replace(
        /(₦\d{1,3}(,\d{3})*(\.\d{1,2})?)/g,
        '<span class="text-green-600 font-semibold">$1</span>'
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong>$1</strong>'
      )
      .replace(/\n/g, '<br />')
      .replace(
        /[\[\]]/g,
        ''
      );

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: processedText }}
        className="prose prose-sm max-w-none"
        onClick={(e) => {
          if (e.target.closest('a[href^="/properties/"]')) {
            e.preventDefault();
            const link = e.target.closest('a[href^="/properties/"]');
            const href = link.getAttribute('href');
            navigate(href);
          }
        }}
      />
    );
  };

  const handleSuggestionClick = (suggestion) => {
    handleSubmit({ preventDefault: () => {} }, suggestion.text);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-NG';
      
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice input is not supported in your browser');
    }
  };

  const handleSubmit = async (e, suggestionText = null, propertyId = null) => {
    e.preventDefault();
    const messageText = suggestionText || inputMessage;
    if (!messageText.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, {
      type: 'user',
      content: messageText,
      timestamp: new Date()
    }]);
    
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try { 
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          userId: 'user123',
          propertyId: propertyId,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle both successful and error responses from the server
      if (data.error) {
        console.error('Server error:', data.error);
        throw new Error(data.message || 'Failed to get response from AI');
      }

      // Add AI response to chat
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: data.message,
          analysis: data.analysis,
          properties: data.properties || [],
          timestamp: new Date()
        }]);
      }, 500);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Add friendly error message to chat
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `I apologize for the technical hiccup! I'm here to help you with any questions about our properties. Could you please try asking your question again? I'll make sure to provide you with detailed information about what you're looking for.`,
        timestamp: new Date()
      }]);

    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const MessageContent = ({ message }) => {
    return formatMessage(message.content, message.properties);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 flex flex-col items-end gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-3 rounded-xl shadow-lg hover:bg-blue-600 transition-colors flex items-center gap-2 group"
        >
          <MessageSquareText className="w-5 h-5" />
          <span className="font-medium">Ask AI Asst.</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={chatRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed ${isMinimized ? 'bottom-4 right-4 w-auto h-auto' : 'bottom-4 right-4 w-96 h-[600px]'} 
                 bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 bg-blue-500 text-white rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareText className="w-5 h-5" />
          <span className="font-medium">FastFind AI Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-600 rounded"
          >
            {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-blue-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 ${
                    msg.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.type === 'assistant' && (
                    <div className="flex-shrink-0">
                      <MessageSquareText className="w-8 h-8 text-blue-500" />
                    </div>
                  )}
                  
                  <motion.div
                    className={`relative max-w-[80%] rounded-2xl p-4 ${
                      msg.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white shadow-md'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <MessageContent message={msg} />
                    
                    {msg.type === 'assistant' && msg.analysis && (
                      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                        <div>Sentiment: {msg.analysis.sentiment.sentiment}</div>
                        {msg.analysis.entities?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {msg.analysis.entities.map((entity, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600"
                              >
                                {entity.type}: {entity.text}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {msg.type === 'user' && (
                    <div className="flex-shrink-0">
                      <User className="w-8 h-8 text-blue-500" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-gray-500"
              >
                <MessageSquareText className="w-8 h-8 text-blue-500" />
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="p-4 border-t border-gray-100">
            <div className="text-sm text-gray-500 mb-2">Suggestions:</div>
            <div 
              ref={suggestionsRef}
              className="flex flex-col gap-2"
            >
              <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 
                       ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                       rounded-full text-sm transition-colors whitespace-nowrap`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestions[selectedCategory]?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 
                      rounded-full text-sm text-gray-700 transition-colors whitespace-nowrap"
                  >
                    <suggestion.icon className="w-4 h-4" />
                    {suggestion.text}
                  </button>
                )) || null}
              </div>
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-200 bg-white rounded-b-lg"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading || isListening}
              />
              <motion.button
                type="button"
                onClick={handleVoiceInput}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full flex items-center justify-center
                  ${isListening 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
              >
                {isListening ? (
                  <div className="relative">
                    <MicOff className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </div>
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !inputMessage.trim() || isListening}
                className={`px-4 py-2 rounded-full bg-blue-500 text-white flex items-center gap-2 
                  ${(isLoading || !inputMessage.trim() || isListening) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-600'
                  }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default AIChatWidget;