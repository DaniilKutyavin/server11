const { Gift } = require("../models/models.js");
const uuid = require("uuid");
const path = require("path");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError.js");

class GiftService {
  async createGift(data, img1, img2, img3) {
    const {
      description,
      nameOne,
      priceOne,
      nameTwo,
      priceTwo,
      nameThree,
      priceThree,
    } = data;

    let imgFileName1 = uuid.v4() + ".jpg";
    img1.mv(path.resolve(__dirname, "..", "static", imgFileName1));

    let imgFileName2 = uuid.v4() + path.extname(img2.name);
    img2.mv(path.resolve(__dirname, "..", "static", imgFileName2));

    let imgFileName3 = uuid.v4() + path.extname(img3.name);
    img3.mv(path.resolve(__dirname, "..", "static", imgFileName3));

    const gift = await Gift.create({
      description,
      nameOne,
      priceOne,
      nameTwo,
      priceTwo,
      nameThree,
      priceThree,
      imgOne: imgFileName1,
      imgTwo: imgFileName2,
      imgThree: imgFileName3,
    });
    return gift;
  }

  async getAllGift() {
    return await Gift.findAll();
  }

  async updateGift(data, img1, img2, img3) {
    const gift = await Gift.findOne();
    if (!gift) {
      throw ApiError.badRequest("Gift record not found");
    }

    // Check for new images and update file names if provided
    const updateData = { ...data };

    if (img1) {
      const imgFileName1 = uuid.v4() + path.extname(img1.name);
      img1.mv(path.resolve(__dirname, "..", "static", imgFileName1));
      updateData.imgOne = imgFileName1;
    }

    if (img2) {
      const imgFileName2 = uuid.v4() + path.extname(img2.name);
      img2.mv(path.resolve(__dirname, "..", "static", imgFileName2));
      updateData.imgTwo = imgFileName2;
    }

    if (img3) {
      const imgFileName3 = uuid.v4() + path.extname(img3.name);
      img3.mv(path.resolve(__dirname, "..", "static", imgFileName3));
      updateData.imgThree = imgFileName3;
    }

    // Update the gift data
    await Gift.update(updateData, { where: { id: gift.id } });

    // Return the updated record
    return await Gift.findOne();
  }
}

module.exports = new GiftService();
