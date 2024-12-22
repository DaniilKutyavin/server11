const Router = require('express');
const router = new Router();
const ContactController = require('../controllers/contactController.js');
const authMiddleware = require('../middleware/auth-middlewares.js');
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.post('/info',checkRole("Admin"), ContactController.createinfo);

router.get('/info', ContactController.getAllinfo);

router.put('/info/:id',checkRole("Admin"), ContactController.updateinfo);

router.delete('/info/:id',checkRole("Admin"), ContactController.delinfo);

router.post('/user',checkRole("Admin"), ContactController.createuser);

router.get('/user', ContactController.getAlluser);

router.put('/user/:id',checkRole("Admin"), ContactController.updateuser);

router.delete('/user/:id', checkRole("Admin"),ContactController.deluser);


module.exports = router;
