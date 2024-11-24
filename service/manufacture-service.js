const { ManufacturerOne } = require('../models/models.js');
const uuid = require('uuid');
const path = require('path');

class ManufactureService {
    async createManufacturer(data, logo) {
        const {name} = data;
        let imgFileName = uuid.v4() + ".jpg";
        logo.mv(path.resolve(__dirname, '..', 'static', imgFileName));

        const manufacture = await ManufacturerOne.create({name, logo:imgFileName });
        return manufacture;
    }

    async getAllManufacturer() {
        const manufacture = await ManufacturerOne.findAll();
        return manufacture;
    }
    async delManufacturer(id) {
        const manufacture = await ManufacturerOne.destroy({ where: { id } });
        return manufacture;
    }
    

}

module.exports = new ManufactureService();
