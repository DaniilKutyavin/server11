const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const tokenService = require("./token-service");
const mailService = require('./mail-service');
const UserDto = require("../dtos/user-dto");
const { User, TokenSchema,Basket } = require("../models/models");
const { parse } = require('json2csv');
const path = require('path');  // Make sure to import path
const fs = require('fs')
const generatePromoCode = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let promoCode = '';
  for (let i = 0; i < length; i++) {
    promoCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return promoCode;
};
class UserService {
  
  async registration(email, password, name, role) {
    if (!email || !password) {
      throw ApiError.badRequest("Некорректный email или password");
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.badRequest("Пользователь с таким email уже существует");
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const activationLink = uuid.v4();
    const promokod = generatePromoCode();
    const user = await User.create({
      name,
      email,
      role,
      password: hashPassword,
      activationLink,
      promokod
    });
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`, promokod);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await Basket.create({ userId: userDto.id }); 
    await tokenService.saveToken(
      TokenSchema,
      "userId",
      userDto.id,
      tokens.refreshToken
    );

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await User.findOne({ where: { activationLink } });
    if (!user) {
      throw ApiError.badRequest("Неккоректная ссылка активации");
    }

    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.badRequest("Пользователь с таким email не найден");
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.badRequest("Неверный пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(
      TokenSchema,
      "userId",
      userDto.id,
      tokens.refreshToken
    );

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(TokenSchema, refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(TokenSchema, refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findByPk(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(
      TokenSchema,
      "userId",
      userDto.id,
      tokens.refreshToken
    );

    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await User.findAll();
    return users;
  }

  async updateUser(userId, email, password, confirmPassword) {
    // Проверка на совпадение пароля и подтверждения
    if (password !== confirmPassword) {
      throw ApiError.badRequest("Пароль и подтверждение не совпадают");
    }

    // Проверка, существует ли пользователь с таким ID
    const user = await User.findByPk(userId);
    if (!user) {
      throw ApiError.badRequest("Пользователь не найден");
    }

    // Проверка, не занят ли новый email другим пользователем
    if (email !== user.email) {
      const emailTaken = await User.findOne({ where: { email } });
      if (emailTaken) {
        throw ApiError.badRequest("Пользователь с таким email уже существует");
      }
      user.email = email;
    }

    // Обновление пароля
    if (password) {
      user.password = await bcrypt.hash(password, 5);
    }

    await user.save();

    const userDto = new UserDto(user);
    return userDto;
  }

  async exportUsersToCSV() {
    // Получаем всех пользователей
    const users = await User.findAll();

    // Формируем данные для CSV
    const userData = users.map(user => {
      const nameParts = user.name.split(' ');  // Разделяем имя и фамилию по пробелу

      // Преобразуем данные в нужный формат
      return {
        first_name: nameParts[0] || '', // Имя
        last_name: nameParts[1] || '',  // Фамилия (если есть)
        display_name: user.role || 'unknown',  // Роль пользователя как группа
        email: user.email                // Электронная почта
      };
    });

    // Преобразуем данные в CSV формат
    const csv = parse(userData);

    // Сохраняем CSV в файл
    const filePath = path.join(__dirname, '../static/users.csv');
    fs.writeFileSync(filePath, csv);

    return filePath;  // Возвращаем путь к файлу
}
}

module.exports = new UserService();
