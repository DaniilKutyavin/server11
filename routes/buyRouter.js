const Router = require('express');
const router = new Router();
const ProductBuyController = require('../controllers/buyController');

router.post('/', ProductBuyController.create);
router.get('/', ProductBuyController.getAll);
router.get('/:id', ProductBuyController.getById);
router.delete('/:id', ProductBuyController.delete);

module.exports = router;
