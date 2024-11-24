const basketService = require("../service/basket-service");
const ApiError = require("../error/ApiError");

class BasketController {
  async addProductToBasket(req, res, next) {
    try {
      const { productId, quantity } = req.body;
      await basketService.addProductToBasket(req.user.id, productId, quantity);
      res.status(200).json({ message: "Product added to basket" });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getBasket(req, res, next) {
    try {
      const basket = await basketService.getBasket(req.user.id);
      res.status(200).json(basket);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async clearBasket(req, res, next) {
    try {
      await basketService.clearBasket(req.user.id);
      res.status(200).json({ message: "Basket cleared" });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async updateBasketItem(req, res, next) {
    try {
      const { productId, quantity } = req.body;
      await basketService.updateBasketItem(req.user.id, productId, quantity);
      res.status(200).json({ message: "Basket item updated" });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async removeProductFromBasket(req, res, next) {
    try {
      const productId = req.params.productId; // Get productId from request body
      await basketService.removeProductFromBasket(req.user.id, productId);
      res.status(200).json({ message: "Product removed from basket" });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new BasketController();
