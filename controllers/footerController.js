const FooterService = require('../service/footer-service.js');
const ApiError = require('../error/ApiError.js');

class FooterController {
    async create(req, res, next) {
        try {
            const footer = await FooterService.createDelivery(req.body);
            return res.json(footer);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
 

    async getAll(req, res, next) {
        try {
            const footer = await FooterService.getAllDelivery();
            res.status(200).json(footer);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async update(req, res, next) {
        try {
            const updatedFooter = await FooterService.updateDelivery(req.body);
            return res.json(updatedFooter);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new FooterController(); 
