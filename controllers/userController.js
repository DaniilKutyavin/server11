const ApiError = require("../error/ApiError.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Event } = require("../models/models.js");
const userService = require("../service/user-service.js");
const { validationResult } = require("express-validator");
const fs = require("fs"); 

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.badRequest("Ошибка при валидации", errors.array())
        );
      }
      const { email, password, name, role } = req.body;
      const userData = await userService.registration(
        email,
        password,
        name,
        role
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { email, password, confirmPassword } = req.body;
      const userId = req.user.id; // ID пользователя из токена

      const updatedUser = await userService.updateUser(
        userId,
        email,
        password,
        confirmPassword
      );
      return res.json(updatedUser);
    } catch (e) {
      next(e);
    }
  }
  async exportUsersToCSV(req, res, next) {
    try {
      const filePath = await userService.exportUsersToCSV(); // Вызываем метод из UserService

      // Отправляем файл пользователю
      res.download(filePath, "users.csv", (err) => {
        if (err) {
          next(ApiError.internal("Ошибка при скачивании файла"));
        } else {
          // Удаляем файл после успешной отправки
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Ошибка при удалении файла:", unlinkErr);
            } else {
              console.log(`Файл ${filePath} успешно удален.`);
            }
          });
        }
      });
    } catch (e) {
      next(e); // В случае ошибки переходим к обработчику ошибок
    }
  }
  async resetPassword(req, res, next) {
    try {
      const { email } = req.body;
      const response = await userService.resetPassword(email);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
  
  async changePassword(req, res, next) {
    try {
      const { resetToken, newPassword } = req.body;
      const response = await userService.changePassword(resetToken, newPassword);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}
module.exports = new UserController();
