const { Feedback } = require("../models/models.js");
class FormOneService {
  async createForm(data) {
    return await Feedback.create(data);
  }

  async getAllForms() {
    return await Feedback.findAll();
  }

  async deleteForm(id) {
    const form = await Feedback.findByPk(id);
    if (!form) throw new Error("Form not found");
    return await form.destroy();
  }
}

module.exports = new FormOneService();
