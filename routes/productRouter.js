const Router = require("express");
const router = new Router();
const ProductController = require("../controllers/productController.js");
const checkRole = require("../middleware/checkRoleMiddleware.js");
const authMiddleware = require("../middleware/auth-middlewares.js");
const { body } = require("express-validator");

router.post("/szr",checkRole("Admin"), ProductController.createSZR);
router.post("/udo", checkRole("Admin"),ProductController.createUDO);
router.post("/pos",checkRole("Admin"), ProductController.createPOS);
router.get("/:id", ProductController.getOne);
router.delete("/:id", checkRole("Admin"), ProductController.del);
router.get("/type/:id", ProductController.getAllByType);
router.get("/typeadm/:id",checkRole("Admin"), ProductController.getAllByTypeAdm);
router.put("/:id",checkRole("Admin"), ProductController.update);
router.get(
  "/manufacturer/:manufacturerName",
  ProductController.getManufacturer
);
router.get("/tt/counts", ProductController.getAllProductCounts);

module.exports = router;
