const ManufacturerService = require('../service/manufactureThree-service.js');
const ApiError = require('../error/ApiError.js');

class ManufacturerControllerThree {
    async create(req, res, next) {
        try {
            const { logo } = req.files;
            const manufacture = await ManufacturerService.createManufacturerThree(req.body,logo);
            return res.json(manufacture);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const manufacture = await ManufacturerService.getAllManufacturerThree();
            return res.json(manufacture);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delmanufacturer(req, res, next) {
        try {
            const manufacture = await ManufacturerService.delManufacturerThree(req.params.id);
            return res.json(manufacture);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


}

module.exports = new ManufacturerControllerThree();
