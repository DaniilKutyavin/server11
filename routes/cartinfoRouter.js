const Router = require("express");
const router = new Router();
const CartController = require("../controllers/cartinfoController.js");
const authMiddleware = require("../middleware/auth-middlewares.js");
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.post("/",checkRole("Admin"), CartController.create);

router.get("/", CartController.getAll);

router.put("/",checkRole("Admin"), CartController.update);

module.exports = router;
