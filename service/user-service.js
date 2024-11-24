const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const { User, TokenSchema,Basket } = require("../models/models");

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
    const user = await User.create({
      name,
      email,
      role,
      password: hashPassword,
      activationLink,
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
}

module.exports = new UserService();
