const Router = require('express');
const router = new Router();
const FooterController = require('../controllers/footerController.js');
const authMiddleware = require('../middleware/auth-middlewares.js');
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.post('/',checkRole("Admin"), FooterController.create);

router.get('/', FooterController.getAll);

router.put('/',checkRole("Admin"), FooterController.update);


module.exports = router;
