const Router = require("express");
const router = new Router();
const CartController = require("../controllers/cartinfoController.js");
const authMiddleware = require("../middleware/auth-middlewares.js");

router.post("/", CartController.create);

router.get("/", CartController.getAll);

router.put("/", CartController.update);

module.exports = router;
