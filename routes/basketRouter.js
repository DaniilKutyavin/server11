const Router = require("express");
const router = new Router();
const BasketController = require("../controllers/basketController.js");
const authMiddleware = require("../middleware/auth-middlewares.js");

router.post("/add", authMiddleware, BasketController.addProductToBasket);
router.get("/get", authMiddleware, BasketController.getBasket);
router.put("/update", authMiddleware, BasketController.updateBasketItem);
router.delete(
  "/remove/:productId",
  authMiddleware,
  BasketController.removeProductFromBasket
);

module.exports = router;
