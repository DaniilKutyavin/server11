const {
  Product,
  Advantage,
  Desc,
  Specifications,
  Keeping,
  Stability,
  Productivity,
  ManufacturerOne,
  ManufacturerTwo,
  ManufacturerThree,
  ProductBuy,
} = require("../models/models.js");
const uuid = require("uuid");
const path = require("path");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError.js");
const sequelize = require('../db');
const fs = require("fs");

class ProductService {
  async createProductSZR(data, img, certificate, presentation) {
    const {
      name,
      price,
      price_two,
      type,
      desc_header,
      description,
      description_low,
      htmlTable,
      weight,
      culture,
      category,
      waiting,
      manufacturer,
      expenditure,
      shelf,
      conditions,
      packaging,
      adva,
      desc,
    } = data; 

    let imgFileName = uuid.v4() + path.extname(img.name); 
    img.mv(path.resolve(__dirname, "..", "static", imgFileName));

    let certificateFileName = null;
    if (certificate) {
      certificateFileName = uuid.v4() + path.extname(certificate.name);
      certificate.mv(path.resolve(__dirname, "..", "static", certificateFileName));
    }

    let presentationFileName = null;
    if (presentation) {
      presentationFileName = uuid.v4() + path.extname(presentation.name);
      presentation.mv(path.resolve(__dirname, "..", "static", presentationFileName));
    }

    const product = await Product.create({ 
      img: imgFileName,
      certificate: certificateFileName,
      presentation: presentationFileName,
      name,
      price,
      price_two,
      type,
      htmlTable,
      desc_header,
      description,
      description_low,
      weight,
      culture,
      category,
      waiting,
      manufacturer,
      expenditure,
      shelf,
      conditions,
      packaging,
    });

    if (adva) {
      let parsedAdva = JSON.parse(adva);
      await Promise.all(
        parsedAdva.map((i) => {
          return Advantage.create({
            text: i.text,
            productId: product.id,
          });
        })
      );
    }

    if (desc) {
      let parsedDesc = JSON.parse(desc);
      await Promise.all(
        parsedDesc.map((i) => {
          return Desc.create({
            title: i.title,
            text: i.text,
            productId: product.id,
          });
        })
      );
    }

    return product;
  }

  async createProductUDO(data, img, certificate, presentation) {
    const {
      name,
      price,
      price_two,
      type,
      desc_header,
      description,
      description_low,
      weight,
      culture,
      fertilizers,
      manufacturer,
      way,
      ground,
      descTwo,
      adva,
      specif,
      keep,
    } = data;

    let imgFileName = uuid.v4() + path.extname(img.name); 
    img.mv(path.resolve(__dirname, "..", "static", imgFileName));

    let certificateFileName = null;
    if (certificate) {
      certificateFileName = uuid.v4() + path.extname(certificate.name);
      certificate.mv(path.resolve(__dirname, "..", "static", certificateFileName));
    }

    let presentationFileName = null;
    if (presentation) {
      presentationFileName = uuid.v4() + path.extname(presentation.name);
      presentation.mv(path.resolve(__dirname, "..", "static", presentationFileName));
    }

    const product = await Product.create({
      img: imgFileName,
      certificate: certificateFileName,
      presentation: presentationFileName,
      name,
      price,
      price_two,
      type,
      desc_header,
      description,
      manufacturer,
      description_low,
      weight,
      culture,
      fertilizers,
      way,
      ground,
      descTwo,
    });

    if (adva) {
      let parsedAdva = JSON.parse(adva);
      await Promise.all(
        parsedAdva.map((i) => {
          return Advantage.create({
            text: i.text,
            productId: product.id,
          });
        })
      );
    }

    if (specif) {
      let parsedSpecif = JSON.parse(specif);
      await Promise.all(
        parsedSpecif.map((i) => {
          return Specifications.create({
            text: i.text,
            productId: product.id,
          });
        })
      );
    }

    if (keep) {
      let parsedKeep = JSON.parse(keep);
      await Promise.all(
        parsedKeep.map((i) => {
          return Keeping.create({
            text: i.text,
            productId: product.id,
          });
        })
      );
    }
    return product;
  }

  async createProductPOS(data, img, certificate, presentation) {
    const {
      name,
      price,
      price_two,
      type,
      desc_header,
      description,
      description_low,
      manufacturer,
      weight,
      category,
      descThree,
      adva,
      stabil,
      productiv,
    } = data;
    let imgFileName = uuid.v4() + path.extname(img.name); 
    img.mv(path.resolve(__dirname, "..", "static", imgFileName));

    let certificateFileName = null;
    if (certificate) {
      certificateFileName = uuid.v4() + path.extname(certificate.name);
      certificate.mv(path.resolve(__dirname, "..", "static", certificateFileName));
    }

    let presentationFileName = null;
    if (presentation) {
      presentationFileName = uuid.v4() + path.extname(presentation.name);
      presentation.mv(path.resolve(__dirname, "..", "static", presentationFileName));
    }

    const product = await Product.create({
      img: imgFileName,
      certificate: certificateFileName,
      presentation: presentationFileName,
      name,
      price,
      price_two,
      type,
      desc_header,
      description,
      manufacturer,
      description_low,
      category,
      weight,
      descThree,
    });

    if (adva) {
      let parsedAdva = JSON.parse(adva);
      await Promise.all(
        parsedAdva.map((i) => {
          return Advantage.create({
            text: i.text,
            productId: product.id,
          });
        })
      );
    }

    if (stabil) {
      let parsedStabil = JSON.parse(stabil);
      await Promise.all(
        parsedStabil.map((i) => {
          return Stability.create({
            text: i.text,
            productId: product.id,
          });
        })
      );
    }

    if (productiv) {
      let parsedProductiv = JSON.parse(productiv);
      await Promise.all(
        parsedProductiv.map((i) => {
          return Productivity.create({
            text: i.text,
            productId: product.id,
          });
        })
      );
    }

    return product;
  }

  async getProductById(id) {
    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: Advantage,
          as: "adva",
        },
        {
          model: Desc,
          as: "desc",
        },
        {
          model: Specifications,
          as: "specif",
        },
        {
          model: Keeping,
          as: "keep",
        },
        {
          model: Stability,
          as: "stabil",
        },

        {
          model: Productivity,
          as: "productiv",
        },
      ],
    });
    return product;
  }

  async deleteProduct(id) {
    const product = await Product.destroy({ where: { id } });
    return product;
  }

  async fetchProductsByTypeAndStatus(typeId) {
    const products = await Product.findAll({
      where: {
        type: typeId,
        status: true,
      },
    });
    return products;
  }

  async fetchProductsByTypeAndStatusAdm(typeId) {
    const products = await Product.findAll({
      where: {
        type: typeId,
      },
    });
    return products;
  }

  async updateProduct(id, data, img, certificate, presentation) {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw ApiError.badRequest("Product not found");
    }

    const updatedData = { ...data };

    if (img) {
      const imgFileName = uuid.v4() + path.extname(img.name);
      img.mv(path.resolve(__dirname, "..", "static", imgFileName));
      updatedData.img = imgFileName;
    }

    if (certificate) {
      const certificateFileName = uuid.v4() + path.extname(certificate.name);
      certificate.mv(
        path.resolve(__dirname, "..", "static", certificateFileName)
      );
      updatedData.certificate = certificateFileName;
    }

    if (presentation) {
      const presentationFileName = uuid.v4() + path.extname(presentation.name);
      presentation.mv(
        path.resolve(__dirname, "..", "static", presentationFileName)
      );
      updatedData.presentation = presentationFileName;
    }

    await product.update(updatedData);

    return product;
  }

  async getManufacturerInfo(manufacturerName) {
    let manufacturer;

    console.log(`Searching for manufacturer: ${manufacturerName}`);

    // Try to find the manufacturer in ManufacturerOne
    manufacturer = await ManufacturerOne.findOne({
      where: { name: manufacturerName },
    });
    if (manufacturer) {
      console.log(`Found in ManufacturerOne: ${manufacturer}`);
      return manufacturer;
    }

    // Try to find the manufacturer in ManufacturerTwo
    manufacturer = await ManufacturerTwo.findOne({
      where: { name: manufacturerName },
    });
    if (manufacturer) {
      console.log(`Found in ManufacturerTwo: ${manufacturer}`);
      return manufacturer;
    }

    // Try to find the manufacturer in ManufacturerThree
    manufacturer = await ManufacturerThree.findOne({
      where: { name: manufacturerName },
    });
    if (manufacturer) {
      console.log(`Found in ManufacturerThree: ${manufacturer}`);
      return manufacturer;
    }

    // If no manufacturer is found, throw an error
    throw ApiError.badRequest("Manufacturer not found");
  }

  async getProductCountsByTypes() {
    const counts = await Product.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: {
        status: true,
      },
      group: ['type'],
    });
  
    // Count the rows in ProductBuy table
    const productBuyCounts = await ProductBuy.count(); // This will return the total number of rows in ProductBuy
  
    return counts.map((item) => ({
      type: item.type,
      count: parseInt(item.dataValues.count, 10),
      productBuyCount: productBuyCounts || 0,  // Use the count of rows from ProductBuy table
    }));
  }

  async generateYmlFeed() {
    const categoryMapping = {
      Гербициды: 1,
      Инсектициды: 2,
      Фунгициды: 3,
      Протравители: 4,
      Адьюванты: 5,
      "Регуляторы роста": 6,
      Десиканты: 7,
      "Фумиганты и родентициды": 8,
  
      "Азотные N": 9,
      "Фосфорные P": 10,
      "Калийные K": 11,
      "Комплексные N+P+K": 12,
      Водорастворимые: 13,
      Жидкие: 14,
  
      Подсолнечник: 15,
      Рапс: 16,
      Кукуруза: 17,
      Пшеница: 18,
      Ячмень: 19,
      Нут: 20,
      Горох: 21,
      Горчица: 22,
      Соя: 23,
    };
  
    const products = await Product.findAll({
      where: { status: true },
      include: [
        { model: Advantage, as: "adva" },
        { model: Desc, as: "desc" },
      ],
    });
  
    const ymlFeed = `<?xml version="1.0" encoding="UTF-8"?>
    <yml_catalog date="${new Date().toISOString()}">
      <shop>
        <name>Asatag</name>
        <company>Asatag LLC</company>
        <url>https://asatag.com</url>
        <platform>Custom Platform</platform>
        <version>1.0</version>
        <currencies>
          <currency id="RUB" rate="1"/>
        </currencies>
        <categories>
          ${Object.entries(categoryMapping)
            .map(
              ([name, id]) => `
          <category id="${id}">${name}</category>`
            )
            .join("\n")}
        </categories>
        <offers>
          ${products
            .map((product) => {
              // Собираем массив всех категорий из product.category и fertilizers
              const allCategories = [];
  
              if (product.category) {
                allCategories.push(...product.category.split(";").map((c) => c.trim()));
              }
  
              if (product.fertilizers) {
                allCategories.push(...product.fertilizers.split(";").map((c) => c.trim()));
              }
  
              // Убираем дубли и создаем offer для каждой категории
              return [...new Set(allCategories)]
                .map((categoryName) => {
                  const categoryId = categoryMapping[categoryName] || 1; // Определяем categoryId или ставим 1
  
                  return `
            <offer id="${product.id}-${categoryId}" available="true">
              <name>${product.name}</name>
              <vendor>${product.manufacturer || "Не указан"}</vendor>
              <url>https://asatag.com/product/${product.id}</url>
              <price>${product.price}</price>
              <currencyId>RUB</currencyId>
              <categoryId>${categoryId}</categoryId>
              <picture>https://asatag.com/api/${product.img}</picture>
              <description><![CDATA[${product.description || "Описание отсутствует"}]]></description>
              <sales_notes>Необходима предоплата.</sales_notes> 
            </offer>`;
                })
                .join("\n");
            })
            .join("\n")}
        </offers>
      </shop>
    </yml_catalog>`;
  
    const filePath = path.join(__dirname, "../static/feed.yml");
    fs.writeFileSync(filePath, ymlFeed);
    return filePath;
  }
}

module.exports = new ProductService();
