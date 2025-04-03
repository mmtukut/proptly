// src/controllers/UserController.js
const UserService = require('../services/UserService');
            
class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: { code: 500, message: err.message } });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: { code: 404, message: 'User not found' } });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: { code: 500, message: err.message } });
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.userId, req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: { code: 500, message: err.message } });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.userId);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: { code: 500, message: err.message } });
    }
  }
}

module.exports = UserController;
