const Router = require('express');
const router = new Router();
const manufacturerOneController = require('../controllers/manufacturerController.js');
const manufacturerTwoController = require('../controllers/manufacturerTwoController.js');
const manufacturerThreeController = require('../controllers/manufacturerThreeController.js');
const authMiddleware = require('../middleware/auth-middlewares.js');
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.get('/one', manufacturerOneController.getAll);
router.post('/one',checkRole("Admin"), manufacturerOneController.create);
router.delete('/one/:id',checkRole("Admin"), manufacturerOneController.delmanufacturer);
router.get('/two',  manufacturerTwoController.getAll);
router.post('/two',checkRole("Admin"),  manufacturerTwoController.create);
router.delete('/two/:id',checkRole("Admin"), manufacturerTwoController.delmanufacturer);
router.get('/three', manufacturerThreeController.getAll);
router.post('/three',checkRole("Admin"),  manufacturerThreeController.create);
router.delete('/three/:id',checkRole("Admin"), manufacturerThreeController.delmanufacturer);

module.exports = router;
