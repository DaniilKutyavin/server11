const { Form_one } = require("../models/models.js");
class FormOneService {
  async createForm(data) {
    return await Form_one.create(data);
  }

  async getAllForms() {
    return await Form_one.findAll();
  }

  async getFormById(id) {
    return await Form_one.findByPk(id);
  }

  async updateForm(id, data) {
    const form = await Form_one.findByPk(id);
    if (!form) throw new Error("Form not found");
    return await form.update(data);
  }

  async deleteForm(id) {
    const form = await Form_one.findByPk(id);
    if (!form) throw new Error("Form not found");
    return await form.destroy();
  }
}

module.exports = new FormOneService();
