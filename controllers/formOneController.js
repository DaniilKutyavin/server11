// controllers/formOneController.js
const formOneService = require("../service/formOne-service");

class FormOneController {
  async create(req, res) {
    try {
      const form = await formOneService.createForm(req.body);
      res.status(201).json(form);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const forms = await formOneService.getAllForms();
      res.status(200).json(forms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const form = await formOneService.getFormById(req.params.id);
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }
      res.status(200).json(form);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updatedForm = await formOneService.updateForm(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedForm);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await formOneService.deleteForm(req.params.id);
      res.status(204).json({ message: "Form deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FormOneController();
