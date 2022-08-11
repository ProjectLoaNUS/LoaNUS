const getUser = async (userId) => {
    const UserModel = require("../models/Users");
    let user;
    try {
        user = await UserModel.findById(userId);
    } catch (error) {
        console.log(error);
    }
    return user;
};

module.exports = {
    getUser: getUser
};