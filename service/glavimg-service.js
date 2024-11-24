const { GlavImg } = require("../models/models.js");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError.js");

class GlavImgService {
  async createGlavImg(img) {
    const imgFileName = uuid.v4() + path.extname(img.name);
    img.mv(path.resolve(__dirname, "..", "static", imgFileName));

    const glavImg = await GlavImg.create({ img: imgFileName });
    return glavImg;
  }

  async getAllGlavImg() {
    return await GlavImg.findAll();
  }

  async updateGlavImg(id, img) {
    const glavImg = await GlavImg.findByPk(id);
    if (!glavImg) {
      throw ApiError.notFound("GlavImg not found");
    }

    if (img) {
      const imgFileName = uuid.v4() + path.extname(img.name);
      img.mv(path.resolve(__dirname, "..", "static", imgFileName));
      glavImg.img = imgFileName;
    }

    await glavImg.save();
    return glavImg;
  }

  async deleteGlavImg(id) {
    const glavImg = await GlavImg.findByPk(id);
    if (!glavImg) {
      throw ApiError.notFound("GlavImg not found");
    }

    await glavImg.destroy();
    return { message: "GlavImg deleted successfully" };
  }
}

module.exports = new GlavImgService();
