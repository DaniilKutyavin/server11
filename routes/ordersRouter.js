const Router = require("express");
const router = new Router();
const OrdersController = require("../controllers/orderController.js");
const authMiddleware = require("../middleware/auth-middlewares.js");
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.post("/", authMiddleware, OrdersController.createOrder);

router.get("/", checkRole("Admin"), OrdersController.getAllOrders);

router.put("/:id", checkRole("Admin"), OrdersController.updateOrder);

router.get("/orders/user", authMiddleware, OrdersController.getOrdersByUser); // Get orders for authenticated user
router.get("/order/:orderId", checkRole("Admin"), OrdersController.getOrderById);
router.post("/check-gift-availability", authMiddleware, OrdersController.getGiftAvailability);

router.post('/guest', OrdersController.createGuestOrder);
router.get('/guest', checkRole("Admin"), OrdersController.getAllGuestOrders);

module.exports = router;
