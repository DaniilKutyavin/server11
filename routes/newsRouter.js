const Router = require('express');
const router = new Router();
const NewsController = require('../controllers/newController.js');
const authMiddleware = require('../middleware/auth-middlewares.js');
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.get('/', NewsController.getAll);
router.get('/:id', NewsController.getOne);
router.post('/', checkRole("Admin"),NewsController.create);
router.put('/:id',checkRole("Admin"), NewsController.updatenews);
router.delete('/:id',checkRole("Admin"), NewsController.delnews);

module.exports = router;
