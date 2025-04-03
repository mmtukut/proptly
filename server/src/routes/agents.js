// src/routes/agents.js
const express = require('express');
const router = express.Router();
const AgentController = require('../controllers/AgentController');
const { authMiddleware, isAdmin } = require('../middleware/auth');

// Public routes
// GET /agents - Get all agents
router.get('/', AgentController.getAllAgents);

// GET /agents/:id - Get agent by ID
router.get('/:id', AgentController.getAgentById);

// Protected routes
// POST /agents/apply - Apply to be an agent
router.post('/apply', authMiddleware, AgentController.applyAsAgent);

// PUT /agents/:id - Update agent profile
router.put('/:id', authMiddleware, AgentController.updateAgent);

// DELETE /agents/:id - Delete agent
router.delete('/:id', authMiddleware, isAdmin, AgentController.deleteAgent);

// GET /agents/agency/:agencyId - Get agents by agency
router.get('/agency/:agencyId', authMiddleware, AgentController.getAgentsByAgency);

// PUT /agents/:id/status - Update agent status (approve/reject)
router.put('/:id/status', authMiddleware, isAdmin, AgentController.updateAgentStatus);

module.exports = router;
