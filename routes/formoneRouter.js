// routes/formOneRouter.js
const Router = require("express");
const router = new Router();
const formOneController = require("../controllers/formOneController");
const authMiddleware = require("../middleware/auth-middlewares"); // If authentication is required
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.post("/", formOneController.create); // Create a new form
router.get("/", checkRole("Admin"),formOneController.getAll); // Get all forms
router.get("/:id", formOneController.getOne); // Get a specific form by ID
router.put("/:id",checkRole("Admin"), formOneController.update); // Update a specific form by ID
router.delete("/:id",checkRole("Admin"), formOneController.delete); // Delete a specific form by ID

module.exports = router;
