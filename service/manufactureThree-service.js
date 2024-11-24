const { ManufacturerThree } = require('../models/models.js');
const uuid = require('uuid');
const path = require('path');

class ManufactureServiceThree {
    async createManufacturerThree(data, logo) {
        const {name} = data;
        let imgFileName = uuid.v4() + ".jpg";
        logo.mv(path.resolve(__dirname, '..', 'static', imgFileName));

        const manufacture = await ManufacturerThree.create({name, logo:imgFileName });
        return manufacture;
    }

    async getAllManufacturerThree() {
        const manufacture = await ManufacturerThree.findAll();
        return manufacture;
    }

    async delManufacturerThree(id) {
        const manufacture = await ManufacturerThree.destroy({ where: { id } });
        return manufacture;
    }

}

module.exports = new ManufactureServiceThree();
