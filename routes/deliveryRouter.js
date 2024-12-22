const Router = require('express');
const router = new Router();
const DeliveryController = require('../controllers/deliveryController.js');
const authMiddleware = require('../middleware/auth-middlewares.js');
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.post('/',checkRole("Admin"), DeliveryController.create);

router.get('/', DeliveryController.getAll);

router.put('/',checkRole("Admin"), DeliveryController.update);


module.exports = router;
