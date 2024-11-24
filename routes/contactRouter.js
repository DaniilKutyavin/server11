const Router = require('express');
const router = new Router();
const ContactController = require('../controllers/contactController.js');
const authMiddleware = require('../middleware/auth-middlewares.js');

router.post('/info', ContactController.createinfo);

router.get('/info', ContactController.getAllinfo);

router.put('/info/:id', ContactController.updateinfo);

router.delete('/info/:id', ContactController.delinfo);

router.post('/user', ContactController.createuser);

router.get('/user', ContactController.getAlluser);

router.put('/user/:id', ContactController.updateuser);

router.delete('/user/:id', ContactController.deluser);


module.exports = router;
