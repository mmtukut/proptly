// src/routes/properties.js
const express = require('express');
const router = express.Router();
const PropertyController = require('../controllers/PropertyController');
const { authMiddleware, isAgent } = require('../middleware/auth');

// Public routes
// GET /properties - Get all properties
router.get('/', PropertyController.getAllProperties);

// GET /properties/:id - Get property by ID
router.get('/:id', PropertyController.getPropertyById);

// Protected routes (require authentication)
// POST /properties - Create new property
router.post('/', authMiddleware, isAgent, PropertyController.createProperty);

// PUT /properties/:id - Update property
router.put('/:id', authMiddleware, isAgent, PropertyController.updateProperty);

// DELETE /properties/:id - Delete property
router.delete('/:id', authMiddleware, isAgent, PropertyController.deleteProperty);

// GET /properties/agent/:agentId - Get properties by agent
router.get('/agent/:agentId', authMiddleware, PropertyController.getPropertiesByAgent);

// GET /properties/agency/:agencyId - Get properties by agency
router.get('/agency/:agencyId', authMiddleware, PropertyController.getPropertiesByAgency);

module.exports = router;
