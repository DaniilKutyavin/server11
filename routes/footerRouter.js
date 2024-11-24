const Router = require('express');
const router = new Router();
const FooterController = require('../controllers/footerController.js');
const authMiddleware = require('../middleware/auth-middlewares.js');

router.post('/', FooterController.create);

router.get('/', FooterController.getAll);

router.put('/', FooterController.update);


module.exports = router;
