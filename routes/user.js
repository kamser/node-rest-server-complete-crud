const {Router} = require('express');
const { check } = require('express-validator');
const { usersGet, usersPut, usersPost, usersDelete, usersGetMultipleQuery } = require('../controller/user');
const { isValidRole, isExistEmail, isExistUserById } = require('../helpers/db-validators');
const { verifyRequiredFields } = require('../middlewares/valid-required-fields');

const router = Router();

//Para las rutas aqui los paths se dejan a lo mas basico, ya que
// en el metodo routes del servidor se define el path para acceder a
//estos endpoints
router.get('/', usersGet); //No se ejecuta la funcion, se esta enviando la referencia de esta para que se ejecute cuando se le requiera y no cuando se inicia el servidor

//En este caso, este ejemplo es para cuando se hace una peticion con multiples parametros, pero todos opcionales
//Para este caso, no se debe modificar la url como se hizo con el put, ya que estos parametros pueden o no venir.
//La logica donde se extraen estos parametros está en el controlador.
//ejemplo de la url: http://localhost:8080/api/users/multiple?key=344&name=keylor&age=27
router.get('/multiple', usersGetMultipleQuery);

//Primer parametro es el pad para el api y el segundo es el controlador
//Para el metodo put, que normalmente trae parametros en la url, para extraerle esos parametros
//lo que se hace es poner: :nombreParametro en el url que llama al put, por ejemplo el de abajo
//express va a reconocer como parametro los que vayan depues de los dos puntos despues del slash.
//Para extraer los parametros, eso se hace en el controlador, ir al controller.
//--------------------------------------------------
//Para el put tambien se le pueden hacer validaciones asi como al post para verificar lo que se 
//este enviando atravez del body del request. La forma de recolectar errores de validacion es igual
//a la que se uso en el post, donde se envia un vector de validaciones como segundo parametro a la
//ruta del put
//router.put('/:id', usersPut ); //put sin validaciones
router.put('/:id', [
    check('id', 'It is not a valid id').isMongoId(), //el valor del el paquete del validator lo toma o del request o del parametro del url, como lo es en este caso
    check('id').custom(id => isExistUserById(id)),
    check('role').custom(role => isValidRole(role)),
    verifyRequiredFields,
], usersPut ); //put CON validaciones


//Para usar el express-validator los metodos o middlewares de chequeo se
//utilizan en las rutas, estos middlewares se tienen que mandar como segundo parametro 
//del router y ahí es donde, por debajo, express se va a encargar de hacer las verificaciones
//router.post('/', usersPost);  //post sin middlewares de verificacion
router.post('/', [
    check('name', 'The name is mandatory').not().isEmpty(), 
    check('password', 'The password has to be more than 6 letters length.').isLength({min:6}),
    check('mail', 'The email is not valid').isEmail(), //aqui se está verificando que el campo mail de user tenga forma de un correo
    check('mail').custom(mail => isExistEmail(mail)),
    //check('role', 'It is not a valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(role => isValidRole(role)),
    verifyRequiredFields,
], usersPost); //post con middlewares de verificacion

router.delete('/:id',[
    check('id', 'It is not a valid id').isMongoId(), //el valor del el paquete del validator lo toma o del request o del parametro del url, como lo es en este caso
    check('id').custom(id => isExistUserById(id)),
    verifyRequiredFields,
] ,usersDelete);

module.exports = router;