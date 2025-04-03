// src/routes/agencies.js
const express = require('express');
const router = express.Router();
const AgencyController = require('../controllers/AgencyController');
const { authMiddleware, isAdmin } = require('../middleware/auth');

// Public routes
// GET /agencies - Get all agencies
router.get('/', AgencyController.getAllAgencies);

// GET /agencies/:id - Get agency by ID
router.get('/:id', AgencyController.getAgencyById);

// Protected routes (require admin)
// POST /agencies - Create new agency
router.post('/', authMiddleware, isAdmin, AgencyController.createAgency);

// PUT /agencies/:id - Update agency
router.put('/:id', authMiddleware, isAdmin, AgencyController.updateAgency);

// DELETE /agencies/:id - Delete agency
router.delete('/:id', authMiddleware, isAdmin, AgencyController.deleteAgency);

module.exports = router;
