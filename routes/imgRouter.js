const Router = require("express");
const router = new Router();
const GlavImgController = require("../controllers/glawimgContoller"); // Verify this path
const authMiddleware = require("../middleware/auth-middlewares");

router.post("/", GlavImgController.create);
router.get("/", GlavImgController.getAll);
router.put("/:id", authMiddleware, GlavImgController.update);
router.delete("/:id", authMiddleware, GlavImgController.delete);

module.exports = router;
