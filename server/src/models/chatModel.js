// Simplified chat model without TensorFlow
class ChatModel {
    constructor() {
        this.intents = {
            'property_search': ['find', 'house', 'apartment', 'property', 'rent', 'buy'],
            'price_info': ['price', 'cost', 'expensive', 'cheap', 'affordable'],
            'location_info': ['where', 'location', 'area', 'neighborhood'],
            'amenities': ['school', 'hospital', 'park', 'restaurant', 'shop']
        };
    }

    buildModel() {
        // No initialization needed for simple implementation
        return true;
    }

    predict(text) {
        const words = text.toLowerCase().split(' ');
        const scores = {};

        // Calculate scores for each intent
        Object.keys(this.intents).forEach(intent => {
            scores[intent] = this.intents[intent].filter(keyword => 
                words.includes(keyword)
            ).length;
        });

        // Find intent with highest score
        const maxIntent = Object.entries(scores).reduce((max, [intent, score]) => 
            score > max.score ? {intent, score} : max,
            {intent: 'unknown', score: 0}
        );

        return {
            intent: maxIntent.intent,
            confidence: maxIntent.score > 0 ? maxIntent.score / words.length : 0
        };
    }
}

module.exports = new ChatModel();
