const FeedbackService = require("../service/feedback-service");

class FeedbackController {
  async create(req, res) {
    try {
      const form = await FeedbackService.createForm(req.body);
      res.status(201).json(form);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const forms = await FeedbackService.getAllForms();
      res.status(200).json(forms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await FeedbackService.deleteForm(req.params.id);
      res.status(204).json({ message: "Form deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FeedbackController();