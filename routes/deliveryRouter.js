const Router = require('express');
const router = new Router();
const DeliveryController = require('../controllers/deliveryController.js');
const authMiddleware = require('../middleware/auth-middlewares.js');

router.post('/', DeliveryController.create);

router.get('/', DeliveryController.getAll);

router.put('/', DeliveryController.update);


module.exports = router;
