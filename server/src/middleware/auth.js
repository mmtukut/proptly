// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const supabase = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

const authMiddleware = async (req, res, next) => {
  try {
    // Get JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Error processing authentication'
    });
  }
};

// Middleware to check if user is an agent
const isAgent = async (req, res, next) => {
  try {
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'approved')
      .single();

    if (error || !agent) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access restricted to approved agents'
      });
    }

    req.agent = agent;
    next();
  } catch (error) {
    console.error('Agent check error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Error checking agent status'
    });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access restricted to administrators'
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  isAgent,
  isAdmin
};
