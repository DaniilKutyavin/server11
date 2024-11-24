const { Delivery} = require('../models/models.js');
const uuid = require('uuid');
const path = require('path');
const { Op } = require('sequelize');
const ApiError = require('../error/ApiError.js');

class DeliveryService {
    async createDelivery(data) {
        const { title, title_small, description_one, description_two, time_start,time_end, telephone} = data;
       
        
        const delivery = await Delivery.create({  title, title_small, description_one, description_two, time_start,time_end, telephone });
        return delivery;
    }

    async getAllDelivery() {
        return await Delivery.findAll();
    }
  

    async updateDelivery(data) {
        // Обновляем запись, так как у нас только одна запись, можно не искать по ID
        const delivery = await Delivery.findOne(); // Assuming only one record exists
        if (!delivery) {
            throw ApiError.badRequest('Delivery record not found');
        }
    
        // Обновляем запись
        await Delivery.update(data, { where: { id: delivery.id } });
    
        // Возвращаем обновленную запись
        return await Delivery.findOne();
    }

    
    
}

module.exports = new DeliveryService();
