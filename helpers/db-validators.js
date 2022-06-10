const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async(role = '') => {
    const existRole = await Role.findOne({role});
    if(!existRole){
        throw new Error(`The role ${role} is not defined in the db.`);
    }
}


//Verificacion de si el correo existe:
const isExistEmail = async(mail = '') => {
    const existEmail = await User.findOne({mail});
    if(existEmail){
        /*return res.status(400).json({
            msg: 'This email already exist.'
        });*/
        throw new Error(`The email ${mail} already exist in the db.`);
    }
}

//Verificacion de si el usuario existe:
const isExistUserById = async(id) => {
    const existUserId = await User.findById(id);
    if(!existUserId){
        throw new Error(`The user id ${id} does not exist in the db.`);
    }
}



module.exports = {
    isValidRole,
    isExistEmail,
    isExistUserById
};