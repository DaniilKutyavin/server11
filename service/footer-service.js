const { Footer} = require('../models/models.js');
const uuid = require('uuid');
const path = require('path');
const { Op } = require('sequelize');
const ApiError = require('../error/ApiError.js');

class DeliveryService {
    async createDelivery(data) {
        const { telephoneOne, telephoneTwo, Email, time} = data;
       
        
        const footer = await Footer.create({ telephoneOne, telephoneTwo, Email,time});
        return footer;
    }

    async getAllDelivery() {
        return await Footer.findAll();
    }
  

    async updateDelivery(data) {
        // Обновляем только одну запись
        const footer = await Footer.findOne();
        if (!footer) {
            throw ApiError.badRequest('Delivery record not found');
        }

        // Обновляем запись
        await Footer.update(data, { where: { id: footer.id } });

        // Возвращаем обновленную запись
        return await Footer.findOne();
    }

    
    
}

module.exports = new DeliveryService();
