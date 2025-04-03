// src/controllers/AuthController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

class AuthController {
  static async signup(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: 'Missing fields',
          message: 'Email, password, firstName, and lastName are required'
        });
      }

      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({
          error: 'User exists',
          message: 'A user with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in database
      const { data: user, error: dbError } = await supabase
        .from('users')
        .insert([{
          email,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          role: 'user'
        }])
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({
          error: 'Database error',
          message: dbError.message
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        error: 'Server error',
        message: error.message
      });
    }
  }

  static async signin(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: 'Missing fields',
          message: 'Email and password are required'
        });
      }

      // Get user from database
      const { data: user, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (dbError || !user) {
        return res.status(401).json({
          error: 'Auth error',
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          error: 'Auth error',
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Signed in successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({
        error: 'Server error',
        message: error.message
      });
    }
  }

  static async signout(req, res) {
    // With JWT, we don't need to do anything server-side
    // The client should just remove the token
    res.json({
      message: 'Signed out successfully'
    });
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: 'Missing field',
          message: 'Email is required'
        });
      }

      // Get user from database
      const { data: user, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (dbError || !user) {
        return res.status(400).json({
          error: 'User not found',
          message: 'User with this email does not exist'
        });
      }

      // Generate JWT token for password reset
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send password reset email
      // You should implement your own email sending logic here
      // For example, using a library like nodemailer
      res.json({
        message: 'Password reset email sent',
        token
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        error: 'Server error',
        message: error.message
      });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          error: 'Missing fields',
          message: 'Token and new password are required'
        });
      }

      // Verify JWT token
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        return res.status(400).json({
          error: 'Invalid token',
          message: 'Invalid or expired token'
        });
      }

      // Get user from database
      const { data: user, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.id)
        .single();

      if (dbError || !user) {
        return res.status(400).json({
          error: 'User not found',
          message: 'User with this ID does not exist'
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('id', user.id);

      if (updateError) {
        console.error('Database error:', updateError);
        return res.status(500).json({
          error: 'Database error',
          message: updateError.message
        });
      }

      res.json({
        message: 'Password updated successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        error: 'Server error',
        message: error.message
      });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          error: 'Missing token',
          message: 'Please provide a verification token'
        });
      }

      // Verify JWT token
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        return res.status(400).json({
          error: 'Invalid token',
          message: 'Invalid or expired token'
        });
      }

      // Get user from database
      const { data: user, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.id)
        .single();

      if (dbError || !user) {
        return res.status(400).json({
          error: 'User not found',
          message: 'User with this ID does not exist'
        });
      }

      // Update email verified status in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ email_verified: true })
        .eq('id', user.id);

      if (updateError) {
        console.error('Database error:', updateError);
        return res.status(500).json({
          error: 'Database error',
          message: updateError.message
        });
      }

      res.json({
        message: 'Email verified successfully'
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({
        error: 'Server error',
        message: error.message
      });
    }
  }
}

module.exports = AuthController;
