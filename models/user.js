const {Schema, model} = require('mongoose');


//De esta forma se crea la forma de las colecciones o tablas para
//la base de datos de Mongo. En este caso se está definiendo los
//atributos o columnas que va a tener la tabla o documento.
const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is mandatory']
    },
    mail: {
        type: String,
        required: [true, 'The mail is mandatory'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password is mandatory']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

//Para quitar informacion del objeto una vez este es ingresado a la base de datos
//se debe hacer una sobreescritura de un metodo de mongoose para quitar campos 
//sensibles como la contraseña o la version del documento, para no exponerlos
//por medio de respuestas de los endpoints

//Se sobreescribe el metodo toJSON de mongoose
UserSchema.methods.toJSON = function(){  //DEBE ser una funcion normal y no de flecha OJO
    const{__v, password, ...user} = this.toObject(); //Se desestructura el contenido de la instancia y se le quitan los campos que no
                                                    //se desean exponer, en este caso __v y password. A los que si se quiere exponer
                                                    //se les envuelve en un objeto que tenga todo lo restante a los campos que
                                                    //se quitaron
    return user;
}

//Una vez se definieron los atributos del documento
//se procede a exportar el modelo, dandole el nombre 
//al documento o tabla en el primer parametro y en el segundo
//pasandole el objeto con las columnas que se creo previamente
module.exports = model('User', UserSchema);