const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController.js");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth-middlewares.js");
const checkRole = require("../middleware/checkRoleMiddleware.js");

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 20 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.post("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);
router.put(
  "/update",
  authMiddleware, // Middleware для проверки авторизации
  body("email").optional().isEmail(),
  body("password").optional().isLength({ min: 8, max: 20 }),
  body("confirmPassword").optional().isLength({ min: 8, max: 20 }),
  userController.updateUser
);
router.get("/export",checkRole("Admin"), authMiddleware, userController.exportUsersToCSV)
router.post("/reset-password", userController.resetPassword);
router.post("/change-password", body("password").isLength({ min: 8, max: 20 }).withMessage("Пароль должен быть от 8 до 20 символов."), userController.changePassword);

module.exports = router;
