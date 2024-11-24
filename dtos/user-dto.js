module.exports = class UserDto {
    name;
    email;
    id;
    isActivated;
    role;

    constructor(model){
        this.name = model.name
        this.email = model.email
        this.id = model.id
        this.isActivated = model.isActivated
        this.role = model.role
    }
}