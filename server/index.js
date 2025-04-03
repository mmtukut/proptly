require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const propertyRoutes = require('./src/routes/properties');
const agencyRoutes = require('./src/routes/agencies');
const agentRoutes = require('./src/routes/agents');
const inquiryRoutes = require('./src/routes/inquiries');
const chatRoutes = require('./api/chat'); // Updated path to use the AI chat implementation

// Enable CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Add JSON parsing middleware

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/chat', chatRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Test database connection
const supabase = require('./src/database');
console.log('Initializing Supabase with URL:', process.env.SUPABASE_URL ? 'URL is set' : 'URL is not set');
console.log('API Key status:', process.env.SUPABASE_KEY ? 'Key is set' : 'Key is not set');

// Test database connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('properties').select('count');
    if (error) throw error;
    console.log('Database connection test successful');
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
}

testConnection();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // Chat message handling
  socket.on('chat message', (data) => {
    io.emit('chat message', data);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});