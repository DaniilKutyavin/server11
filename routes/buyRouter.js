const Router = require('express');
const router = new Router();
const ProductBuyController = require('../controllers/buyController');
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.post('/',checkRole("Admin"), ProductBuyController.create);
router.get('/', ProductBuyController.getAll);
router.get('/:id', ProductBuyController.getById);
router.delete('/:id',checkRole("Admin"), ProductBuyController.delete);

module.exports = router;
