const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const PropertyService = require('../src/services/PropertyService');
const nlpUtils = require('../utils/nlpUtils');
const chatModel = require('../models/chatModel');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Access your API key as an environment variable
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables");
    throw new Error("Missing GEMINI_API_KEY");
}

console.log("Initializing Gemini API with key length:", apiKey.length);

// Initialize Gemini with proper configuration
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
    },
    safetySettings: [
        {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
    ]
});

// Initialize the chat model
chatModel.buildModel();

// Helper function to format property details in Markdown
const formatPropertyMarkdown = (property) => {
  return `
🏠 **${property.title}**
📍 **Location:** ${property.location}
💰 **Price:** ₦${property.price.toLocaleString()}
🏗️ **Type:** ${property.type}
🛏️ **Bedrooms:** ${property.bedrooms || 'N/A'}
🚿 **Bathrooms:** ${property.bathrooms || 'N/A'}
✨ **Amenities:** ${property.amenities ? property.amenities.join(', ') : 'N/A'}
📊 **Status:** ${property.status || 'Available'}

<button class="view-details" data-property-id="${property.id}" data-property-title="${property.title}">📋 View Details</button> | 
<button class="chat-about" data-property-id="${property.id}" data-property-title="${property.title}">💬 Chat about this property</button>
`;
};

// Helper function to format the AI response with property cards
const formatAIResponse = (message, properties = []) => {
  let formattedResponse = message;

  // Add property cards if there are properties
  if (properties.length > 0) {
    formattedResponse += '\n\n**Matching Properties:**\n';
    formattedResponse += properties.map(property => formatPropertyMarkdown(property)).join('\n---\n');
  }

  return formattedResponse;
};

router.post('/', async (req, res) => {
    try {
        console.log("Received chat request:", {
            messageLength: req.body.message?.length,
            userId: req.body.userId,
            propertyId: req.body.propertyId,
            conversationHistory: req.body.conversationHistory?.length || 0
        });

        const { message, userId = 'default-user', propertyId } = req.body;

        if (!message) {
            console.error("Error: Message is missing in the request body");
            return res.status(400).json({ error: "Message is required" });
        }

        // Step 1: Analyze the message using our NLP utilities
        console.log("Starting NLP analysis...");
        let nlpAnalysis;
        try {
            nlpAnalysis = nlpUtils.generateContextAwareResponse(userId, message);
            console.log("NLP Analysis completed:", {
                sentiment: nlpAnalysis.sentiment,
                entitiesCount: nlpAnalysis.entities.length,
                entities: nlpAnalysis.entities
            });
        } catch (nlpError) {
            console.error("NLP Analysis error:", nlpError);
            nlpAnalysis = { sentiment: { sentiment: 'neutral' }, entities: [] };
        }

        // Step 2: Get intent prediction from our model
        console.log("Starting intent prediction...");
        let intentPrediction;
        try {
            intentPrediction = await chatModel.predict(message);
            console.log("Intent prediction completed:", intentPrediction);
        } catch (intentError) {
            console.error("Intent prediction error:", intentError);
            intentPrediction = { intent: 'general', confidence: 0.5 };
        }

        // Step 3: Filter properties based on entities
        let relevantProperties = [];
        try {
            const filters = {
                location: nlpAnalysis.entities.find(e => e.type === 'location')?.text,
                propertyType: nlpAnalysis.entities.find(e => e.type === 'propertyType')?.text
            };

            // Handle price separately to ensure proper formatting
            const priceEntity = nlpAnalysis.entities.find(e => e.type === 'price');
            if (priceEntity) {
                filters.maxPrice = priceEntity.text;
            }

            console.log("Applying filters:", filters);
            
            if (propertyId) {
                // If propertyId is provided, only include that specific property
                const property = await PropertyService.getPropertyById(propertyId);
                if (property) {
                    relevantProperties = [property];
                }
            } else {
                relevantProperties = await PropertyService.filterProperties(filters);
            }
            
            console.log(`Found ${relevantProperties.length} matching properties`);
        } catch (dbError) {
            console.error("Database error:", dbError);
            // Don't throw error, continue with empty properties array
            relevantProperties = [];
        }

        // Step 4: Create an enhanced prompt for Gemini
        const parts = [{
            text: `You are FastFind AI, a friendly and knowledgeable real estate assistant. Your role is to engage in natural conversations while providing detailed property information.

Key Personality Traits:
- Friendly and conversational
- Proactive in offering additional relevant information
- Asks follow-up questions to better understand user needs
- Provides detailed explanations and insights
- Maintains context throughout the conversation

Context:
${JSON.stringify(nlpAnalysis.context)}

User Sentiment: ${nlpAnalysis.sentiment.sentiment}
Detected Entities: ${JSON.stringify(nlpAnalysis.entities)}
Intent: ${intentPrediction.intent}

Available Properties:
${relevantProperties.map(p => `- ${p.title} (${p.location}) - ₦${p.price.toLocaleString()}`).join('\n')}

Instructions:
1. Respond conversationally, as if having a real chat
2. Provide detailed property insights beyond basic facts
3. Include relevant market insights when appropriate
4. Ask follow-up questions to better understand user needs
5. Suggest related properties or features they might be interested in

User Query: ${message}
Assistant: Let me help you with that...`
        }];

        // Step 5: Generate AI response using Gemini
        console.log("Sending request to Gemini API...");
        let aiResponse = "";
        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts }]
            });
            const response = await result.response;
            aiResponse = response.text();
            console.log("Received response from Gemini API");
        } catch (geminiError) {
            console.error("Gemini API error:", {
                error: geminiError.message,
                stack: geminiError.stack
            });
            
            // Create a fallback response using filtered properties
            if (relevantProperties.length > 0) {
                aiResponse = `I found ${relevantProperties.length} properties that might interest you:\n\n` +
                    relevantProperties.map(p => `- ${p.title} in ${p.location} for ₦${p.price.toLocaleString()}`).join('\n');
            } else {
                aiResponse = "I apologize, but I couldn't find any properties matching your criteria. Would you like to broaden your search or look for different features?";
            }
        }

        // Update context with AI's response
        nlpUtils.updateContext(userId, {
            role: 'assistant',
            content: aiResponse
        });

        // Send response to client
        res.json({
            message: formatAIResponse(aiResponse, relevantProperties),
            analysis: {
                sentiment: nlpAnalysis.sentiment,
                entities: nlpAnalysis.entities,
                intent: intentPrediction
            },
            properties: relevantProperties,
            suggestions: [
                "Find properties under ₦5M",
                "Show luxury homes",
                "Properties near schools",
                "Commercial spaces",
                "2 bedroom apartments",
                "Properties with pool"
            ]
        });

    } catch (error) {
        console.error("Chat API error:", {
            error: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({ 
            error: "Error processing chat request",
            details: error.message
        });
    }
});

// Get all properties
router.get('/properties', (req, res) => {
  res.json(properties);
});

// Get specific property
router.get('/properties/:id', (req, res) => {
  const property = properties.find(p => p.id.toString() === req.params.id);
  if (property) {
    res.json(property);
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

module.exports = router;