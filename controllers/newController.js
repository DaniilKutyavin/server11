const NewsService = require('../service/new-service.js');
const ApiError = require('../error/ApiError.js');

class NewsController {
    async create(req, res, next) {
        try {
            const { img } = req.files;
            const news = await NewsService.createNews(req.body,img);
            return res.json(news);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const news = await NewsService.getAllNews();
            return res.json(news);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const news = await NewsService.getOne(req.params.id);
            return res.json(news);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updatenews(req, res, next) {
        try {
            const { id } = req.params;
            const updatednews = await NewsService.updatenews(id, req.body);
            return res.json(updatednews);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delnews(req, res, next) {
        try {
            const news = await NewsService.delnews(req.params.id);
            return res.json(news);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new NewsController();
