const CartService = require("../service/cartinfo-service.js");
const ApiError = require("../error/ApiError.js");

class CartController {
  async create(req, res, next) {
    try {
      const delivery = await CartService.createCart(req.body);
      return res.json(delivery);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const delivery = await CartService.getAllCart();
      res.status(200).json(delivery);
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async update(req, res, next) {
    try {
      const updatedDelivery = await CartService.updateCart(req.body);
      return res.status(200).json(updatedDelivery);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new CartController();
