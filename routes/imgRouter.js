const Router = require("express");
const router = new Router();
const GlavImgController = require("../controllers/glawimgContoller"); // Verify this path
const authMiddleware = require("../middleware/auth-middlewares");
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.post("/",checkRole("Admin"), GlavImgController.create);
router.get("/", GlavImgController.getAll);
router.put("/:id",checkRole("Admin"), authMiddleware, GlavImgController.update);
router.delete("/:id",checkRole("Admin"), authMiddleware, GlavImgController.delete);

module.exports = router;
