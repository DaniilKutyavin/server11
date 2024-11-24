const { ManufacturerTwo } = require('../models/models.js');
const uuid = require('uuid');
const path = require('path');

class ManufactureServiceTwo {
    async createManufacturerTwo(data, logo) {
        const {name} = data;
        let imgFileName = uuid.v4() + ".jpg";
        logo.mv(path.resolve(__dirname, '..', 'static', imgFileName));

        const manufacture = await ManufacturerTwo.create({name, logo:imgFileName });
        return manufacture;
    }

    async getAllManufacturerTwo() {
        const manufacture = await ManufacturerTwo.findAll();
        return manufacture;
    }
    async delManufacturerTwo(id) {
        const manufacture = await ManufacturerTwo.destroy({ where: { id } });
        return manufacture;
    }

}

module.exports = new ManufactureServiceTwo();
