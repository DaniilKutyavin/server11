const Router = require("express");
const router = new Router();
const ProductController = require("../controllers/productController.js");
const checkRole = require("../middleware/checkRoleMiddleware.js");
const authMiddleware = require("../middleware/auth-middlewares.js");
const { body } = require("express-validator");

router.post("/szr", ProductController.createSZR);
router.post("/udo", ProductController.createUDO);
router.post("/pos", ProductController.createPOS);
router.get("/:id", ProductController.getOne);
router.delete("/:id", checkRole("Admin"), ProductController.del);
router.get("/type/:id", ProductController.getAllByType);
router.put("/:id", ProductController.update);
router.get(
  "/manufacturer/:manufacturerName",
  ProductController.getManufacturer
);

module.exports = router;
