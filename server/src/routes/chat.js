const express = require('express');
const router = express.Router();
const supabase = require('../database');

router.post('/', async (req, res) => {
    try {
        const { message, propertyId } = req.body;

        if (!message) {
            return res.status(400).json({
                error: 'Missing message',
                message: 'Message content is required'
            });
        }

        // Store user message
        const { data: userMessage, error: userMessageError } = await supabase
            .from('chat_messages')
            .insert([{
                message: message,
                type: 'user',
                property_id: propertyId || null
            }])
            .select()
            .single();

        if (userMessageError) {
            console.error('Error storing user message:', userMessageError);
            return res.status(500).json({
                error: 'Database error',
                message: 'Error storing message'
            });
        }

        // Generate AI response
        const aiResponse = "Thank you for your message. An agent will get back to you shortly.";

        // Store AI response
        const { data: aiMessage, error: aiMessageError } = await supabase
            .from('chat_messages')
            .insert([{
                message: aiResponse,
                type: 'ai',
                property_id: propertyId || null
            }])
            .select()
            .single();

        if (aiMessageError) {
            console.error('Error storing AI response:', aiMessageError);
        }

        res.json({
            success: true,
            data: {
                userMessage,
                aiResponse: aiMessage || { message: aiResponse }
            }
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});

router.get('/messages', async (req, res) => {
    try {
        const { propertyId } = req.query;

        const query = supabase
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: true });

        if (propertyId) {
            query.eq('property_id', propertyId);
        }

        const { data: messages, error } = await query;

        if (error) {
            console.error('Error fetching messages:', error);
            return res.status(500).json({
                error: 'Database error',
                message: 'Error fetching messages'
            });
        }

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error('Chat history error:', error);
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;