const GlavImgService = require("../service/glavimg-service.js");
const ApiError = require("../error/ApiError.js");

class GlavImgController {
  async create(req, res, next) {
    try {
      const { img } = req.files;
      const glavImg = await GlavImgService.createGlavImg(img);
      return res.json(glavImg);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const glavImgs = await GlavImgService.getAllGlavImg();
      res.status(200).json(glavImgs);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async update(req, res, next) {
    try {
      const { img } = req.files || {};
      const { id } = req.params;
      const updatedGlavImg = await GlavImgService.updateGlavImg(id, img);
      return res.json(updatedGlavImg);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await GlavImgService.deleteGlavImg(id);
      return res.json(result);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new GlavImgController();
