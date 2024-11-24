const { Form_two } = require("../models/models.js");
class FormTwoService {
  async createForm(data) {
    return await Form_two.create(data);
  }

  async getAllForms() {
    return await Form_two.findAll();
  }

  async getFormById(id) {
    return await Form_two.findByPk(id);
  }

  async updateForm(id, data) {
    const form = await Form_two.findByPk(id);
    if (!form) throw new Error("Form not found");
    return await form.update(data);
  }

  async deleteForm(id) {
    const form = await Form_two.findByPk(id);
    if (!form) throw new Error("Form not found");
    return await form.destroy();
  }
}

module.exports = new FormTwoService();
