const Router = require('express');
const router = new Router();
const GiftController = require('../controllers/giftController.js');
const authMiddleware = require('../middleware/auth-middlewares.js');

router.post('/', GiftController.create);

router.get('/', GiftController.getAll);

router.put('/', GiftController.update);


module.exports = router;
