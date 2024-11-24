const { News } = require('../models/models.js');
const uuid = require('uuid');
const path = require('path');

class NewsService {
    async createNews(data, img) {
        const {title, description} = data;
        let imgFileName = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, '..', 'static/news', imgFileName));

        const news = await News.create({title,description, img:imgFileName });
        return news;
    }

    async getAllNews() {
        const news = await News.findAll();
        return news;
    }

    async getOne(id) {
        const news = await News.findOne({ where: { id } });
        return news;
    }

    async delnews(id) {
        const news = await News.destroy({ where: { id } });
        return news;
    }
    
    async updatenews(id, data) {
        const news = await News.findOne({ where: { id } });
        if (!news) {
            throw ApiError.badRequest('info not found');
        }

        const updatedData = { ...data };

        await news.update(updatedData);

        return news;
    }

}

module.exports = new NewsService();
