const {Schema, model} = require('mongoose');


//De esta forma se crea la forma de las colecciones o tablas para
//la base de datos de Mongo. En este caso se está definiendo los
//atributos o columnas que va a tener la tabla o documento.
const RoleSchema = Schema({
    role: {
        type: String,
        required: [true, 'The role is mandatory'],
    }
});

//Una vez se definieron los atributos del documento
//se procede a exportar el modelo, dandole el nombre 
//al documento o tabla en el primer parametro y en el segundo
//pasandole el objeto con las columnas que se creo previamente
module.exports = model('Role', RoleSchema);