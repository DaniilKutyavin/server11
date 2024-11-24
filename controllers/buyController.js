const ProductBuyService = require('../service/buy-service');
const ApiError = require('../error/ApiError');

class ProductBuyController {
    async create(req, res, next) {
        try {
            const { name, price_one, price_two, category, info } = req.body;
            const productBuy = await ProductBuyService.create({ name, price_one, price_two, category, info });
            return res.json(productBuy);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const products = await ProductBuyService.getAll();
            return res.json(products);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await ProductBuyService.getById(id);
            if (!product) {
                return next(ApiError.notFound('ProductBuy not found'));
            }
            return res.json(product);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await ProductBuyService.delete(id);
            return res.json(result);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new ProductBuyController();
