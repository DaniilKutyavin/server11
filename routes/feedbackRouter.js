
const Router = require("express");
const router = new Router();
const feedbackController = require("../controllers/feedbackController.js");
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.post("/", feedbackController.create); 
router.get("/", checkRole("Admin", "Employee"),feedbackController.getAll); 
router.delete("/:id",checkRole("Admin", "Employee"), feedbackController.delete); 

module.exports = router;
