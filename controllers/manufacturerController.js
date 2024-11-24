const ManufacturerService = require('../service/manufacture-service.js');
const ApiError = require('../error/ApiError.js');

class ManufacturerController {
    async create(req, res, next) {
        try {
            const { logo } = req.files;
            const manufacture = await ManufacturerService.createManufacturer(req.body,logo);
            return res.json(manufacture);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const manufacture = await ManufacturerService.getAllManufacturer();
            return res.json(manufacture);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delmanufacturer(req, res, next) {
        try {
            const manufacture = await ManufacturerService.delManufacturer(req.params.id);
            return res.json(manufacture);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new ManufacturerController();
