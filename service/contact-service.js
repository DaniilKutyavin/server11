const { Contacts, Contacts_User} = require('../models/models.js');
const uuid = require('uuid');
const path = require('path');
const { Op } = require('sequelize');
const ApiError = require('../error/ApiError.js');

class ContactService {
    async createinfo(data) {
        const { name, adress, telephone, email} = data;
       
        
        const info = await Contacts.create({  name, adress, telephone, email });
        return info;
    }

    async getAllinfo() {
        return await Contacts.findAll();
    }
  

    async updateinfo(id, data) {
        const info = await Contacts.findOne({ where: { id } });
        if (!info) {
            throw ApiError.badRequest('info not found');
        }

        const updatedData = { ...data };

        await info.update(updatedData);

        return info;
    }

    async delinfo(id) {
        const info = await Contacts.destroy({ where: { id } });
        return info;
    }

    async createuser(img, data) {
        const { name, post} = data;

        let imgFileName = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, '..', 'static', imgFileName));

        const info = await Contacts_User.create({  name, post, img:imgFileName});
        return info;
    }

    async getAlluser() {
        return await Contacts_User.findAll();
    }
  

    async updateuser(id, data) {
        const info = await Contacts_User.findOne({ where: { id } });
        if (!info) {
            throw ApiError.badRequest('user not found');
        }

        const updatedData = { ...data };

        await info.update(updatedData);

        return info;
    }

    async deluser(id) {
        const info = await Contacts_User.destroy({ where: { id } });
        return info;
    }
    
    
}

module.exports = new ContactService();
