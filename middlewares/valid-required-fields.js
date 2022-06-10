//Para la realizacion de validaciones
const { validationResult } = require('express-validator');

const verifyRequiredFields = (req, res, next) => {
    //Aqui se está trayendo el vector de errores que ha recolectado
    //de las validaciones incorrectas
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    //esta es la funcion callback que le llega como parametro
    //lo que hace es que si para una de las validaciones no 
    //encontro nada, siga con la siguiente middleware hasta que se termine
    //Esta es una caracteristica tipica que tienen los middlewares
    next();
}

module.exports = {verifyRequiredFields};