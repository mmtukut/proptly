// This file handles sentiment analysis, entity recognition, and context management

// Simple NLP utilities for chat processing
const contexts = new Map();

const nlpUtils = {
    generateContextAwareResponse(userId, message) {
        // Get user context
        const userContext = contexts.get(userId) || [];

        // Simple sentiment analysis
        const sentiment = this.analyzeSentiment(message);

        // Extract entities
        const entities = this.extractEntities(message);

        return {
            context: userContext,
            sentiment,
            entities
        };
    },

    analyzeSentiment(text) {
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'beautiful', 'perfect', 'love', 'like'];
        const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'hate', 'dislike'];

        const words = text.toLowerCase().split(/\s+/);
        let score = 0;

        words.forEach(word => {
            if (positiveWords.includes(word)) score++;
            if (negativeWords.includes(word)) score--;
        });

        return {
            sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
            score
        };
    },

    extractEntities(text) {
        const entities = [];
        
        // Enhanced price patterns
        const pricePatterns = [
            // Match ₦X million/m
            /₦\s*\d+(?:\.\d+)?\s*(?:million|m)\b/gi,
            // Match X million/m naira
            /\d+(?:\.\d+)?\s*(?:million|m)\s*naira\b/gi,
            // Match NGN X million/m
            /ngn\s*\d+(?:\.\d+)?\s*(?:million|m)\b/gi,
            // Match regular prices with currency symbols
            /(?:₦|ngn)?\s*\d+(?:,\d{3})*(?:\.\d+)?\b/gi,
            // Match prices with the word 'naira'
            /\d+(?:,\d{3})*(?:\.\d+)?\s*naira\b/gi
        ];

        // Process each price pattern
        pricePatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(price => {
                    // Clean up the price text
                    const cleanPrice = price.trim().replace(/\s+/g, ' ');
                    // Only add if we haven't already found this price
                    if (!entities.some(e => e.type === 'price' && e.text === cleanPrice)) {
                        entities.push({
                            type: 'price',
                            text: cleanPrice
                        });
                    }
                });
            }
        });

        // Location patterns with common Nigerian locations
        const locationKeywords = ['in', 'at', 'near', 'around', 'within'];
        const commonLocations = [
            'lekki', 'ikeja', 'victoria island', 'vi', 'ikoyi', 'ajah', 'gbagada',
            'yaba', 'surulere', 'magodo', 'maryland', 'ogba', 'agege', 'festac',
            'lagos', 'abuja', 'port harcourt', 'ibadan', 'kano'
        ];
        
        const words = text.toLowerCase().split(/\s+/);
        words.forEach((word, index) => {
            // Check for location keywords followed by a place
            if (locationKeywords.includes(word) && words[index + 1]) {
                const possibleLocation = words[index + 1];
                if (commonLocations.includes(possibleLocation)) {
                    entities.push({
                        type: 'location',
                        text: possibleLocation
                    });
                }
            }
            // Also check if the word itself is a known location
            if (commonLocations.includes(word)) {
                entities.push({
                    type: 'location',
                    text: word
                });
            }
        });

        // Property type patterns with common Nigerian property types
        const propertyTypes = [
            'apartment', 'house', 'villa', 'duplex', 'bungalow', 'flat', 'studio',
            'terrace', 'mansion', 'penthouse', 'self-contain', 'mini flat'
        ];
        
        words.forEach(word => {
            if (propertyTypes.includes(word)) {
                entities.push({
                    type: 'propertyType',
                    text: word
                });
            }
        });

        return entities;
    },

    updateContext(userId, message) {
        let userContext = contexts.get(userId) || [];
        userContext = [...userContext, message].slice(-5); // Keep last 5 messages
        contexts.set(userId, userContext);
    }
};

module.exports = nlpUtils;
