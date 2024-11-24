const { Infocart } = require("../models/models.js");
const uuid = require("uuid");
const path = require("path");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError.js");

class CartService {
  async createCart(data) {
    const { desc } = data;

    const cart = await Infocart.create({ desc });
    return cart;
  }

  async getAllCart() {
    return await Infocart.findAll();
  }

  async updateCart(data) {
    const { id, desc } = data;

    // Проверка наличия id
    if (!id) {
      throw ApiError.badRequest("ID не указан");
    }

    // Ищем запись по ID
    const cart = await Infocart.findOne({ where: { id } });

    if (!cart) {
      throw ApiError.badRequest("Запись с таким ID не найдена");
    }

    // Обновляем запись
    await Infocart.update({ desc }, { where: { id } });

    // Возвращаем обновленную запись
    return await Infocart.findOne({ where: { id } });
  }
}

module.exports = new CartService();
