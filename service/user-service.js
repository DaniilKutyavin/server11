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
const jwt = require('jsonwebtoken')
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

    setImmediate(async () => {
      try {
          await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`, promokod);
      } catch (error) {
          console.error("Ошибка отправки письма активации:", error);
      }
  });
  
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
    const userData = users.map(user => ({
        name: user.name || '',       // Полное имя
        email: user.email || ''      // Электронная почта
    }));

    // Преобразуем данные в CSV формат
    const csv = parse(userData);

    // Добавляем BOM для поддержки кириллицы
    const csvWithBom = '\uFEFF' + csv;

    // Сохраняем CSV в файл
    const filePath = path.join(__dirname, '../static/users.csv');
    fs.writeFileSync(filePath, csvWithBom, { encoding: 'utf8' });
    return filePath; // Возвращаем путь к файлу
}

async resetPassword(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw ApiError.badRequest("Пользователь с таким email не найден");
  }

  // Генерация токена
  const payload = { id: user.id, email: user.email };
  const resetToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '15m' });

  // Формирование ссылки
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Отправка письма
  await mailService.sendResetPasswordMail(email, resetLink);

  return { message: "Ссылка для сброса пароля отправлена на почту." };
}

async changePassword(resetToken, newPassword) {
  try {
    // Проверка токена
    const userData = jwt.verify(resetToken, process.env.SECRET_KEY);
    if (!userData) {
      throw ApiError.badRequest("Недействительный или истёкший токен");
    }

    // Поиск пользователя по ID из токена
    const user = await User.findByPk(userData.id);
    if (!user) {
      throw ApiError.badRequest("Пользователь не найден");
    }

    // Хэширование нового пароля
    const hashedPassword = await bcrypt.hash(newPassword, 5);
    user.password = hashedPassword;

    // Сохранение изменений
    await user.save();

    return { message: "Пароль успешно обновлён." };
  } catch (error) {
    throw ApiError.badRequest("Ошибка при изменении пароля: " + error.message);
  }
}
}

module.exports = new UserService();
