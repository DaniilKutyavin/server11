const Router = require('express');
const router = new Router();
const GiftController = require('../controllers/giftController.js');
const authMiddleware = require('../middleware/auth-middlewares.js');
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.post('/',checkRole("Admin"), GiftController.create);

router.get('/', GiftController.getAll);

router.put('/',checkRole("Admin"), GiftController.update);


module.exports = router;
