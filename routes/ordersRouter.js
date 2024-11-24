const Router = require("express");
const router = new Router();
const OrdersController = require("../controllers/orderController.js");
const authMiddleware = require("../middleware/auth-middlewares.js");

router.post("/", authMiddleware, OrdersController.createOrder);

router.get("/", OrdersController.getAllOrders);

router.put("/:id", OrdersController.updateOrder);

router.get("/orders/user", authMiddleware, OrdersController.getOrdersByUser); // Get orders for authenticated user
router.get("/order/:orderId", OrdersController.getOrderById);
router.post("/check-gift-availability", authMiddleware, OrdersController.getGiftAvailability);

router.post('/guest', OrdersController.createGuestOrder);
router.get('/guest', OrdersController.getAllGuestOrders);

module.exports = router;
