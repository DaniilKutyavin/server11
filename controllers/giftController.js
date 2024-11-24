const GiftService = require('../service/gift-service.js');
const ApiError = require('../error/ApiError.js');

class GiftController {
    async create(req, res, next) {
        try {
            const { imgOne, imgTwo, imgThree } = req.files;
            const gift = await GiftService.createGift(req.body, imgOne, imgTwo, imgThree);
            return res.json(gift);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
 

    async getAll(req, res, next) {
        try {
            const gift = await GiftService.getAllGift();
            res.status(200).json(gift);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async update(req, res, next) {
        try {
            const { imgOne, imgTwo, imgThree } = req.files || {};
            const updatedGift = await GiftService.updateGift(req.body, imgOne, imgTwo, imgThree);
            return res.json(updatedGift);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new GiftController(); 
