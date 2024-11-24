const { Basket, BasketProduct, Product } = require("../models/models.js");
const ApiError = require("../error/ApiError.js");

class BasketService {
  // Method to add a product to the basket
  async addProductToBasket(userId, productId, quantity) {
    let basket = await Basket.findOne({ where: { userId } });

    if (!basket) {
      // Create a new basket for the user if it doesn't exist
      basket = await Basket.create({ userId });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      throw ApiError.badRequest("Product not found");
    }

    const basketProduct = await BasketProduct.findOne({
      where: { basketId: basket.id, productId },
    });

    if (basketProduct) {
      basketProduct.quantity += quantity;
      await basketProduct.save();
    } else {
      await BasketProduct.create({
        basketId: basket.id,
        productId,
        quantity,
        price: product.price,
      });
    }
  }

  // Method to get the basket contents
  async getBasket(userId) {
    const basket = await Basket.findOne({
      where: { userId },
      include: {
        model: BasketProduct,
        include: Product,
      },
    });

    if (!basket) {
      throw ApiError.badRequest("Basket not found");
    }

    return basket;
  }

  // Method to clear the basket
  async clearBasket(userId) {
    const basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      throw ApiError.notFound("Basket not found");
    }

    await BasketProduct.destroy({ where: { basketId: basket.id } });
  }

  async updateBasketItem(userId, productId, quantity) {
    let basket = await Basket.findOne({ where: { userId } });
    if (!basket) throw ApiError.badRequest("Basket not found");

    const basketProduct = await BasketProduct.findOne({
      where: { basketId: basket.id, productId },
    });

    if (basketProduct) {
      basketProduct.quantity = quantity;
      await basketProduct.save();
    } else {
      throw ApiError.badRequest("Product not found in basket");
    }
  }

  async removeProductFromBasket(userId, productId) {
    const basket = await Basket.findOne({ where: { userId } });

    if (!basket) {
      throw ApiError.notFound("Basket not found");
    }

    const basketProduct = await BasketProduct.findOne({
      where: { basketId: basket.id, productId },
    });

    if (!basketProduct) {
      throw ApiError.notFound("Product not found in basket");
    }

    // Remove the product from the basket
    await basketProduct.destroy();
  }
}

module.exports = new BasketService();
