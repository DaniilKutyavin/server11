// routes/formOneRouter.js
const Router = require("express");
const router = new Router();
const formOneController = require("../controllers/formOneController");
const authMiddleware = require("../middleware/auth-middlewares"); // If authentication is required

router.post("/", formOneController.create); // Create a new form
router.get("/", formOneController.getAll); // Get all forms
router.get("/:id", formOneController.getOne); // Get a specific form by ID
router.put("/:id", authMiddleware, formOneController.update); // Update a specific form by ID
router.delete("/:id", authMiddleware, formOneController.delete); // Delete a specific form by ID

module.exports = router;
