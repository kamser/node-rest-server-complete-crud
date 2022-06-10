//Aqui lo que va son funciones que se exportan y se usan como callbacks en las routes,
//estas funciones tienen la logica de negocio
const {response} = require('express');

//Aqui es donde se le va a dar uso al modelo de user
//que crea la tabla de usuario en la peticion de post
const User = require('../models/user'); 

//Para encriptacion de la contraseña (1)
const bcryptjs = require('bcryptjs');






const usersGet = async(req, res = response) => {
    const {limit = 5, form = 0} = req.query; //Esto sirve para paginacion de los resultados
    const query = {state: true};
    /*const users = await User.find(query)         //select de todos los usuarios
                            .skip(Number(form)) //filtra los usuarios desde el number que represente form y form se castea a int
                            .limit(Number(limit)); //limita la cantidad de resultados y castea limit, ya que los parametros
                                                    //opcionales que llegan atravez del query vienen en forma de string.*/

    /*const totalUsers = await User.countDocuments(query); //La query es un filtro que se le aplica al select, donde solo va a seleccionar
                                                            //los documentos que tengan ese campo con el valor seteado.*/

    //forma de ejecutar dos promesas, que no tienen nada que ver entre si; es decir, que una no depende de que la otra se haga primero, 
    //es pormedio del metodo all del objeto promise, de esa forma y como en este caso, la obtencion de usuarios y el numero total de 
    //usuarios no estan relacionadas entre si, se puede usar esta funcionalidad
    //El metodo all retorna un arreglo de promesas, por lo que hay que hacer desestructuracion vector y no de objeto
    //El metodo all recibe un arreglo de promesas.
    //OJO: si las promesas no son independientes entre si y ocupan que una se resuelva antes que otra, este metodo no se hace y
    //se resolveria como la implementacion normal de arriba.
    const [users, totalUsers ] = await Promise.all([
        User.find(query)            //Primera promesa
            .skip(Number(form))
            .limit(Number(limit)),
        User.countDocuments(query), //Segunda promesa
    ])
    res.json({
        msg: 'Get from the API - Controller',
        users,
        totalUsers
    });
}

//Para ejemplo de extraccion de multiples variables opcionales (son las que vienen despues del
//signo ? en el url). la forma de extraerlos es por medio de req, pero en lugar de params, se usa 
//el atributo query que es donde vendrian todos los parametros que se decidan enviar de forma opcional
//por el url
const usersGetMultipleQuery = (req, res = response) => {
    const query = req.query;

    res.json({
        msg: 'Get from the API - Controller',
        query
    });
}


/*
forma del post basica
const usersPost = (req, res = response) => {
    //De esta forma es como se extrae informacion de lo que venga en una peticion post
    const body = req.body;
    //res.send('Hello World');
    res.json({
        msg: 'Post from the API - Controller',
        body,
    });
}*/

const usersPost = async(req, res = response) => {

    

    //Un consejo a seguir es siempre desestructurar
    //lo que se quire del body, dado que en el pueden
    //venir datos que quizas no se ocupen y se manipule
    //informacion peligrosa. Lo mejor siempre es solo 
    //usar lo que se ocupe
    //const body = req.body;  //mala implementacion
    const {name, mail, password, role} = req.body; //buena practica.
    //En la siguiente linea pasan varias cosas, además de crear una instancia del
    //usuario, se está creando un objeto de tipo documento de mongo y como el body es 
    //el objeto que trae los datos que son mandados por el post, lo que se hace al mandarle el 
    //body es que mongoose por debajo va a mapear las variables que se llamen igual a lo que se espera
    //en el modelo, lo que encuente lo mapea automaticamente, lo que no calce con el nombre de una columna,
    //simplemente lo ignora.
    //const user = new User(body); //mala implementacion
    const user = new User({name, mail, password, role}); //buena implementacion, donde solo se envian los datos requeridos


    //Encriptacion de la contraseña
    //Se genera el salt
    const salt = bcryptjs.genSaltSync(); //por defecto tiene 10 de numero de vueltas.
    //Se general el hash
    user.password = bcryptjs.hashSync(password, salt);


    //Para gravar el usuario en la base de datos se hace:
    await user.save();
    //En esta linea es donde puede fallar si los requrimientos del
    //schema del modelo no se cumple. Por ejemplo, si lo que se envia por el
    //post no tiene el atributo role o password, al ser estos requieridos, va a
    //dar un error al querer insertar.

    

    res.json({
        msg: 'Post from the API - Controller',
        user,
    });
}

//Para extraer los parametros que se traen de la url, lo que se hace es
//algo parecido con lo del post, pero en lugar del body, lo que se va a 
//extraer del req es el atributo params
//-------------------------------
//
const usersPut = async(req, res = response) => {
    const {id} = req.params; //El nombre id es el mismo que se puso en el url de las rutas. DEBE ser el mismo
    //Se procede a extraer todo lo que no se necesite que se grabe
    const {_id,password, google, mail, ...rest} = req.body;

    //validar contra la base de datos
    if(password){
        //Encriptacion de la contraseña
        //Se genera el salt
        const salt = bcryptjs.genSaltSync(); //por defecto tiene 10 de numero de vueltas.
        //Se general el hash
        rest.password = bcryptjs.hashSync(password, salt);
    }

    //El siguiente es un metodo de mongoose que busca el documento por
    //el id que le llega en el primer parametro y actualiza todos los campos
    //del documento que hagan match con los atributos del objeto que se envia como
    //segundo parametro
    const user = await User.findByIdAndUpdate(id, rest);
    res.json({
        msg: 'Put from the API - Controller',
        user
    });
}

const usersDelete = async(req, res = response) => {
    const {id} = req.params;
    //Borrado fisico de la basde de datos, no es la forma recomendable
    //Porque se pierde la tazabilidad del usuario y sus datos.
    //const user = await User.findByIdAndDelete(id);

    //En lugar de hacer el borrado fisico, se recomienda el borrado
    //virtual, como el siguiente.
    //El segundo parametro es un objeto que representa los atributos que
    //se le van a cambiar al documento.
    const user = await User.findByIdAndUpdate(id, {state:false});
    res.json({
        msg: 'Delete from the API - Controller',
        user
    });
}




module.exports = {
    usersGet,
    usersPut,
    usersDelete,
    usersPost,
    usersGetMultipleQuery
}

