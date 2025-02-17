const ProductService = require("../service/product-service.js");
const ApiError = require("../error/ApiError.js");
const fs = require('fs');

class ProductController {
  async createSZR(req, res, next) {
    try {
      const { img, certificate, presentation } = req.files;
      const product = await ProductService.createProductSZR(
        req.body,
        img,
        certificate || null,
        presentation || null
      );
      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  } 

  async createUDO(req, res, next) {
    try {
      const { img, certificate, presentation } = req.files;
      const product = await ProductService.createProductUDO(
        req.body,
        img,
        certificate || null,
        presentation|| null
      );
      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async createPOS(req, res, next) {
    try {
      const { img, certificate, presentation } = req.files;
      const product = await ProductService.createProductPOS(
        req.body,
        img,
        certificate || null,
        presentation || null
      );
      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async del(req, res, next) {
    try {
      const product = await ProductService.deleteProduct(req.params.id);
      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAllByType(req, res, next) {
    try {
      const products = await ProductService.fetchProductsByTypeAndStatus(
        req.params.id
      );
      return res.json(products);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAllByTypeAdm(req, res, next) {
    try {
      const products = await ProductService.fetchProductsByTypeAndStatusAdm(
        req.params.id
      );
      return res.json(products);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { img, certificate, presentation } = req.files || {};
      const updatedProduct = await ProductService.updateProduct(
        id,
        req.body,
        img,
        certificate || null,
        presentation || null
      );
      return res.json(updatedProduct);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getManufacturer(req, res) {
    const { manufacturerName } = req.params; // Assuming the manufacturer name is passed as a route parameter

    try {
      const manufacturerInfo = await ProductService.getManufacturerInfo(
        manufacturerName
      );
      return res.json(manufacturerInfo);
    } catch (error) {
      // Log the error for debugging
      console.error("Error fetching manufacturer info:", error);

      if (error instanceof ApiError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getAllProductCounts(req, res, next) {
    try {
      const counts = await ProductService.getProductCountsByTypes();
      return res.json(counts);
    } catch (error) {
      next(error);
    }
  }
  async generateYmlFeed(req, res, next) {
    try {
      const filePath = await ProductService.generateYmlFeed();
      
      console.log(`File created at: ${filePath}`);  
      
      res.setHeader("Content-Type", "application/xml");
      res.download(filePath, "feed.xml", (err) => {
        if (err) {
          return next(ApiError.badRequest(err.message));
        }
        console.log("File successfully served:", filePath);
      });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new ProductController();
