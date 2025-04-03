// Simple chat model for intent prediction
const chatModel = {
  intents: {
    SEARCH: 'search',
    INQUIRE: 'inquire',
    COMPARE: 'compare',
    GENERAL: 'general'
  },

  patterns: {
    search: [
      'show', 'find', 'search', 'looking for', 'available', 'properties in',
      'houses in', 'apartments in', 'any property'
    ],
    inquire: [
      'tell me about', 'more information', 'details about', 'features of',
      'price of', 'location of', 'when'
    ],
    compare: [
      'compare', 'difference between', 'better', 'versus', 'vs',
      'which one', 'which is'
    ]
  },

  buildModel() {
    // In a real implementation, this would load and initialize a machine learning model
    console.log('Chat model initialized');
  },

  predict(message) {
    const text = message.toLowerCase();
    
    // Check each intent's patterns
    for (const [intent, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        if (text.includes(pattern)) {
          return {
            intent: this.intents[intent.toUpperCase()],
            confidence: 0.8
          };
        }
      }
    }

    // Default to general intent
    return {
      intent: this.intents.GENERAL,
      confidence: 0.6
    };
  }
};

module.exports = chatModel; 