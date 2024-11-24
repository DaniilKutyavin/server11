const { ProductBuy, ProductBuyInfo } = require('../models/models');
const ApiError = require('../error/ApiError.js');

class ProductBuyService {
    async create(data) {
        const { name, price_one, price_two, category , info } = data;
        const productBuy = await ProductBuy.create({ name,price_one, price_two,category });
        
        if (info) {
            info.forEach(async (item) => {
                await ProductBuyInfo.create({
                    name: item.name,
                    productBuyId: productBuy.id
                });
            });
        }
        return productBuy;
    }

    async getAll() {
        return await ProductBuy.findAll({
            include: [{ model: ProductBuyInfo, as: 'info' }]
        });
    }

    async getById(id) {
        return await ProductBuy.findByPk(id, {
            include: [{ model: ProductBuyInfo, as: 'info' }]
        });
    }

    async delete(id) {
        const productBuy = await ProductBuy.findByPk(id);
        if (!productBuy) {
            throw ApiError.badRequest('ProductBuy not found');
        }
        await productBuy.destroy();
        return { message: 'ProductBuy deleted' };
    }
}

module.exports = new ProductBuyService();
