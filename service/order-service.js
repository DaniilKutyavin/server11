const {
  Order,
  Basket,
  BasketProduct,
  OrderProduct,
  Product,
  User,
  UserGift,
  OrderGuest,
} = require("../models/models.js");
const ApiError = require("../error/ApiError.js");
const { Op } = require("sequelize");

class OrderService {
  // Method to create an order
  async hasRecentGift(userId) {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentGift = await UserGift.findOne({
      where: {
        userId,
        createdAt: { [Op.gte]: oneDayAgo }, // Проверяем любой подарок
      },
    });

    return !!recentGift;
  }

  // Method to create an order
  async createOrder(userId, phone, fio, city, email, comment, giftId, paymentMethod) {
    // Check if the selected gift was taken in the last 24 hours
    if (giftId) {
      const hasRecentGift = await this.hasRecentGift(userId, giftId);
      if (hasRecentGift) {
        throw ApiError.badRequest("Подарок уже был взят за последние 24 часа.");
      }
    }

    const basket = await Basket.findOne({
      where: { userId },
      include: [{ model: BasketProduct, as: "basket_products" }],
    });

    if (!basket || !basket.basket_products || basket.basket_products.length === 0) {
      throw ApiError.badRequest("Корзина пуста");
    }

    const order = await Order.create({ userId, phone, fio, city, email, comment, giftId, paymentMethod });

    for (const basketProduct of basket.basket_products) {
      await OrderProduct.create({
        orderId: order.id,
        productId: basketProduct.productId,
        quantity: basketProduct.quantity,
        price: basketProduct.price,
      });
    }

    // Record the gift in the UserGift model
    if (giftId) {
      await UserGift.create({ userId, giftId });
    }

    await BasketProduct.destroy({ where: { basketId: basket.id } });
    return order;
  }

  // Method to check gift availability
  async getGiftAvailability(userId) {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const hasRecentGift = await this.hasRecentGift(userId);

    return {
      available: !hasRecentGift,
      message: hasRecentGift
        ? "Вы уже брали подарок за последние 24 часа."
        : "Подарок доступен.",
    };
  }

  async getAllOrders() {
    return await Order.findAll({
      where: { status: "Ожидает подтверждения" },
      include: [
        {
          model: OrderProduct,
          include: [Product], // Include the Product model to fetch product details
        },
        User, // Include User details as well
      ],
    });
  }
  async updateOrder(orderId, updateData) {
    const order = await Order.findByPk(orderId, { include: [OrderProduct] });
    if (!order) {
      throw ApiError.notFound("Order not found");
    }

    // Update order details
    if (updateData.phone ) {
      order.phone = updateData.phone;
    }
    if (updateData.fio ) {
      order.fio = updateData.fio;
    }
    if (updateData.city) {
      order.city = updateData.city;
    }
    if (updateData.status) {
      order.status = updateData.status;
    }
    if (updateData.email ) {
      order.email = updateData.email;
    }
    if (updateData.comment ) {
      order.comment = updateData.comment;
    }
    if (updateData.paymentMethod ) {
      order.paymentMethod = updateData.paymentMethod;
    }

    await order.save();

    // Update order items
    // Adjusted from items to orderProducts
    if (updateData.orderProducts && Array.isArray(updateData.orderProducts)) {
      for (const item of updateData.orderProducts) {
        const orderProduct = await OrderProduct.findOne({
          where: { id: item.id }, // Fetching by the item's ID
        });

        if (!orderProduct) {
          throw ApiError.notFound(
            `Product with ID ${item.id} not found in order`
          );
        }

        orderProduct.quantity = item.quantity;
        orderProduct.price = item.price;
        await orderProduct.save();
      }
    }

    return order;
  }

  // Get orders for a specific user
  async getOrdersByUser(userId) {
    return await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderProduct,
          include: [{ model: Product }],
        },
      ],
    });
  }

  // Get details of a specific order by order ID
  async getOrderById(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderProduct,
          include: [{ model: Product }],
        },
      ],
    });

    if (!order) {
      throw ApiError.notFound("Order not found");
    }

    return order;
  }
  async createGuestOrder(orderData) {
    try {
      // Проверьте, что все обязательные поля присутствуют
      if (!orderData.name || !orderData.phone || !orderData.city || !orderData.email) {
        throw new Error('Все обязательные поля должны быть заполнены');
      }
  
      // Проверьте, что данные заказа корректны
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Некорректные данные заказа');
      }
  
      // Вычислите полную стоимость заказа
      const totalPrice = orderData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
      // Создайте новый заказ
      const newOrder = await OrderGuest.create({
        items: orderData.items,
        totalPrice: totalPrice,
        name: orderData.name,
        phone: orderData.phone,
        city: orderData.city,
        email: orderData.email,
        paymentMethod: orderData.paymentMethod,
        promoCode: orderData.promoCode,
        comment: orderData.comment,
        giftId: orderData.giftId,
      });
  
      return newOrder;
    } catch (err) {
      throw new Error('Ошибка при создании заказа: ' + err.message);
    }
  }
  // Получение всех заказов (опционально)
  async getAllGuestOrders(){
    try {
      return await OrderGuest.findAll();
    } catch (err) {
      throw new Error('Ошибка при получении заказов: ' + err.message);
    }
  };
}

module.exports = new OrderService();
