const Router = require('express');
const router = new Router();
const manufacturerOneController = require('../controllers/manufacturerController.js');
const manufacturerTwoController = require('../controllers/manufacturerTwoController.js');
const manufacturerThreeController = require('../controllers/manufacturerThreeController.js');
const authMiddleware = require('../middleware/auth-middlewares.js');

router.get('/one', manufacturerOneController.getAll);
router.post('/one', manufacturerOneController.create);
router.delete('/one/:id', manufacturerOneController.delmanufacturer);
router.get('/two',  manufacturerTwoController.getAll);
router.post('/two',  manufacturerTwoController.create);
router.delete('/two/:id', manufacturerTwoController.delmanufacturer);
router.get('/three', manufacturerThreeController.getAll);
router.post('/three',  manufacturerThreeController.create);
router.delete('/three/:id', manufacturerThreeController.delmanufacturer);

module.exports = router;
