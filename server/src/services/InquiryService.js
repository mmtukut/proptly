// src/services/InquiryService.js
const Inquiry = require('../models/Inquiry');
    
class InquiryService {
  static async getAllInquiries() {
    return Inquiry.findAll();
  }

  static async getInquiryById(id) {
    return Inquiry.findById(id);
  }

  static async createInquiry(inquiry) {
    return Inquiry.create(inquiry);
  }

  static async updateInquiry(id, inquiry) {
    return Inquiry.update(id, inquiry);
  }

  static async deleteInquiry(id) {
    return Inquiry.delete(id);
  }
}

module.exports = InquiryService;
