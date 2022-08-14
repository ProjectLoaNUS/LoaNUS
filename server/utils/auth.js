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

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    getUser: getUser,
    JWT_EXPIRES_IN: JWT_EXPIRES_IN,
    JWT_SECRET: JWT_SECRET
};