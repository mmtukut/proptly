import React, { createContext, useContext, useState, useCallback } from 'react';

const AIChatContext = createContext();

export const AIChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);

  const sendMessage = useCallback(async (message, property = null) => {
    setIsTyping(true);
    setMessages(prev => [...prev, { type: 'user', content: message }]);

    try {
      // Here we'll format the message with property context if available
      const contextualMessage = property 
        ? `[Property Context: ${property.title}, ${property.location}, Price: ₦${property.price}] ${message}`
        : message;

      // Simulate AI response (replace with actual backend call)
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({
          type: 'assistant',
          content: `I understand you're asking about ${property?.title || 'properties'}. Let me help you with that...`,
          property: property
        }), 1000)
      );

      setMessages(prev => [...prev, response]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'system', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const value = {
    messages,
    isTyping,
    currentProperty,
    setCurrentProperty,
    sendMessage,
    clearMessages
  };

  return (
    <AIChatContext.Provider value={value}>
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};
