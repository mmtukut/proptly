// src/services/UserService.js
const User = require('../models/User');

class UserService {
  static async getAllUsers() {
    return User.findAll();
  }

  static async getUserById(id) {
    return User.findById(id);
  }

  static async createUser(user) {
    return User.create(user);
  }

  static async updateUser(id, user) {
    return User.update(id, user);
  }

  static async deleteUser(id) {
    return User.delete(id);
  }
}

module.exports = UserService;
