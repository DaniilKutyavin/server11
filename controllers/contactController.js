const ContactService = require('../service/contact-service.js');
const ApiError = require('../error/ApiError.js');

class ContactController {
    async createinfo(req, res, next) {
        try {
            const info = await ContactService.createinfo(req.body);
            return res.json(info);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
 

    async getAllinfo(req, res, next) {
        try {
            const info = await ContactService.getAllinfo();
            res.status(200).json(info);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async updateinfo(req, res, next) {
        try {
            const { id } = req.params;
            const updatedinfo = await ContactService.updateinfo(id, req.body);
            return res.json(updatedinfo);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delinfo(req, res, next) {
        try {
            const info = await ContactService.delinfo(req.params.id);
            return res.json(info);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async createuser(req, res, next) {
        try {
            const { img} = req.files;
            const user = await ContactService.createuser(img, req.body);
            return res.json(user);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
 

    async getAlluser(req, res, next) {
        try {
            const user = await ContactService.getAlluser();
            res.status(200).json(user);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async updateuser(req, res, next) {
        try {
            const { id } = req.params;
            const updateduser = await ContactService.updateuser(id, req.body);
            return res.json(updateduser);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deluser(req, res, next) {
        try {
            const user = await ContactService.deluser(req.params.id);
            return res.json(user);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


}

module.exports = new ContactController(); 
