const DeliveryService = require('../service/delivery-service.js');
const ApiError = require('../error/ApiError.js');

class DeliveryController {
    async create(req, res, next) {
        try {
            const delivery = await DeliveryService.createDelivery(req.body);
            return res.json(delivery);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
 

    async getAll(req, res, next) {
        try {
            const delivery = await DeliveryService.getAllDelivery();
            res.status(200).json(delivery);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async update(req, res, next) {
        try {
            const updatedDelivery = await DeliveryService.updateDelivery(req.body);
            return res.json(updatedDelivery);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new DeliveryController(); 
