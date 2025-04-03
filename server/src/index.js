// src/index.js
const express = require('express');
const cors = require('cors');
const supabase = require('./database');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const propertyRoutes = require('./routes/properties');
const agencyRoutes = require('./routes/agencies');
const agentRoutes = require('./routes/agents');
const inquiryRoutes = require('./routes/inquiries');
const chatRoutes = require('./routes/chat');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Use routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/properties', propertyRoutes);
app.use('/agencies', agencyRoutes);
app.use('/agents', agentRoutes);
app.use('/inquiries', inquiryRoutes);
app.use('/api/chat', chatRoutes);

// Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

async function testDatabaseConnection() {
    try {
        const { data, error } = await supabase.from('Users').select('*').limit(1);
        if (error) {
          console.error('Database connection failed:', error);
        } else {
          console.log('Database connection successful!:', data);
        }
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

testDatabaseConnection();

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
