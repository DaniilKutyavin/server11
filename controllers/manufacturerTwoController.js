const ManufacturerService = require('../service/manufactureTwo-service.js');
const ApiError = require('../error/ApiError.js');

class ManufacturerControllerTwo {
    async create(req, res, next) {
        try {
            const { logo } = req.files;
            const manufacture = await ManufacturerService.createManufacturerTwo(req.body,logo);
            return res.json(manufacture);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const manufacture = await ManufacturerService.getAllManufacturerTwo();
            return res.json(manufacture);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async delmanufacturer(req, res, next) {
        try {
            const manufacture = await ManufacturerService.delManufacturerTwo(req.params.id);
            return res.json(manufacture);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new ManufacturerControllerTwo();
