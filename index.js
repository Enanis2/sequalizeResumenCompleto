//https://sequelize.org/docs/v6/core-concepts/model-basics/
//! TITULOS
//| FORMATOS
//Ctr+k + Ctr+,


//ç----- IMPORTS -----

const Express = require("express"); //Require es como un import.
const { Sequelize, DataTypes, Op, BelongsTo } = require("sequelize"); //Importo la clase sequalize y el DataType
//[./img/dataType.png]
const server = express() //Es un constructor, entonces server tiene los metodos de express, cpomo get, post, etc
const PORT = 3000

//const sequelize = new Sequelize('sqlite::memory:') //Construyo un objeto de tipo Sequalize usando sqlLite en mi RAM (No lo Usamos)
const sequelize = new Sequelize('Sequelize' /* Base De Datos */, 'root' /* Nombre De Usuario */, "" /* Password */, {
    host: 'localhost', //Host
    dialect: 'mysql', //Lenguaje de programación
    logging: false //No muestra por consola las consultas realizadas, si no estuviera en false te las mostraría
})

//ç----- MODELO -----

//Un modelo REPRESENTA una tabla, no es la tabla en si
const User /* Nombre de la constante */ = sequelize.define( //Defino un modelo
    'user', //Nombre del modelo
    {
    //Campos
        id: { //Nombre campo
            type: DataTypes.INTEGER, //Tipo de dato (Saco del objeto DataTypes un atributo static que me interesa)
            allowNull: false, //NotNull
            primaryKey: true,
            autoIncrement: true,
            //Para clave foranea ver "Asociaciones"
        },
        lastName: {
            type: DataTypes.STRING,
            unique: true,
        },
        admin: {
            type: DataTypoes.BOOLEAN,
            defaultValue: 'false',
            validate: { //Otras configuraciones
                len: [4, 6] //Longitud entre 4 y 6
            }
        },
    },
    {
        //Otras opciones
        timestamps: false, //Sequelize por defecto guarda los campos "createdAt" y "updatedAt" con DataTypes.DATE. False la deshabilita
        freezeTableName: true, //Para que sequelize no trate de pluralizarlo y use el nombre del modelo
        tableName: 'Usuarios' //Nombre de la tabla. Cuando no se especifica el nombre de la tabla Sequelize pluraliza automáticamente el nombre del modelo
    },
)
// [./img/nombres.png]
// [./img/expNombres.png]
console.log(User) //.define tambien retorna el modelo en si, por lo que puedo mostrarlo

//ç----- Validations y Constraints -----
//Ambas hacen lo mismo, revisar que lo que entra en la BD satisfaga los criterios esperados
const constraintsYvalidaciones = sequelize.define(
    'constraintsYvalidaciones', 
    {
        //Las constraints son a nivel de SQL
        constraints: {type: DataTypes.TEXT,
            unique: true, //Constraint. UNIQUE
            primaryKey: true, //Constraint. PRIMARY KEY
            foreignKey: true, //Constraint. FORERIGN KEY
            defaultValue: 'Ejemplo', //Constraint. DEFAULT
            //CHECK no existe, conceptualmente se podría decir que son las validaciones
            allowNull: false, //Constraint y Validation, es la uncia ya que sequelize revisa que los datos ingresados no sean NULL . NOT NULL
        },
        //Las validaciones son a niviel de Sequelize, JS. Hay varias por defecto y podes crear nuevas
        validacionesDefault:{type: DataTypes.TEXT,
            validate: { //Clausula obligatoria
                isEmail: true, //Activo la clausula isEmail
                isUrl: false, //Desactivo la clausula IsUrl, no es que le digo que revise que NO sea una Url
                isIn: [['Hola', 'Chau']], //Le pregunto si el valor está entre alguno de los valores ingresados. Se pone una lista dentro de otra porque isIn se espera un argumento, pero si paso una lista sola, se interpreta como dos argumentos distintos, no una lista como argumento porque sequelize espera una lista de argumentos para pasarle al validador [./img/explicacionIsIn.png]
                
                //Se les puede poner ademas un mensaje personalizado en lugar del default
                isEmail: {//Las llaves ya le dicen a sequelize que quiero activarlo, asi que no hace falta ponerle true
                    msg: "Tiene que ser un Email"
                },
                //Si esa validation espera argumentos
                isIn: {
                    args: [[1, 2]],
                    msg: "Tiene que estar entre 1 y 2"
                }
                //Si bien a isEmail normalmente le paso un true, no hace falta ponerlo como args porque en realidad ese true le dice a sequelize que lo active, no es un argumento que le paso a la validacion en si, los argumentos de IsIn si van a la validacion

                //[./img/todasLasValidations.png]
            }
        },
        validacionesPropias:{type: DataTypes.INTEGER,
            validate: {
                esPar(value) { //value es por default el valor del campo en donde está el validate, en este caso "validacionesPropias"
                    if (value % 2 != 0) {
                        throw new Error("Solo Pares Permitidos") //throw devuelve una excepcion, que frena por completo la ejecucion del programa (salvo que esté en un try, catch, en ese caso salta al catch). Se lanza la excepcion new Error() para mayor claridad
                    }
                },
                esMayorQueOtro(value) {
                    if (value > this.validacionesDefault) { //El this le dice "De este objeto, agarrá validacionesDefault"
                        throw new Error("Solo valores mayores a " + this.validacionesDefault)
                    }
                }
            }
        }
    },
    //Validaciones de modelo. Normalmente tambien se pueden hacer en un campo, pero es mejor a nivel de codigo hacerlo acá
    //Se pueden hacer validaciones a nivel de modelo, que se ejecutan al crear una instancia del modelo
    {
        validate: {
            validacionesOconstraints_NoLasDos() {
                if ((this.constraints === true) === (this.validacionesDefault === true)) { //Si una existe y la otra tambien, o ninguna existe
                    throw new Error("Una o la otra")
                }
            }
        }
    }
)

//ç----- Asociaciones -----

//Para definir asociaciones se utilizan los sig metodos en conjunto para definir todas las relaciones (1x1 1xM NxM). Para cada relacion se utilizan SIEMPRE dos metodos
hasOne(); //Tiene Uno
belongsTo(); //Pertenece a
hasMany(); //Tiene muchos
belongsToMany(); //Pertenece a muchos

a.hasOne(b); //Cada A tiene un B. FK en B
b.belongsTo(a); //Cada B pertenece a un A. FK en B
a.hasMany(b); //Cada a tiee muchos B. FK en b
a.belongsToMany(b, {through: c}); //Cada A tiene muchos B y cada B pertenece a muchos A. FK en C

//--- 1x1 ---

//Se usan
hasOne();
belongsTo();

const persona = sequelize.define(
    'persona',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        nombre: DataTypes.STRING
    }
)

const DNI = sequelize.define(
    'DNI',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        numero: DataTypes.INTEGER,
        emision: DataTypes.DATE
    }
)

//Primero se revisa cual de los dos es la fuerte, osea, que sin una la otra no puede existir. En la debil va la FK
persona.hasOne(DNI)
DNI.belongsTo(persona)
//Esto crea en la tabla DNI una FK que hace referencia a la primaryKey de persona y el nombre default es: primaryKey+id. Por default ese valor puede ser NULL, osea que puede haber un DNI no asociado a nadie. Cómo cambiarlo se explicará mas abajo en Otras Opciones
//--- 1xM ---

//Se usan
hasMany();
belongsTo();

const alumno = sequelize.define(
    'alumnos',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        nombre: DataTypes.STRING
    }
);

const lapiz = sequelize.define(
    'lapiz',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        marca: DataTypes.STRING,
        fabricado: DataTypes.DATE
    }
)

//La FK va en la que es 1, lo contrario no se puede porque no se puede guardar mas de un dato en cada posicion
alumno.hasMany(lapiz);
lapiz.belongsTo(alumno);
//Esto crea en la tabla lapiz una FK que hace referencia a la primaryKey de alumno y el nombre default es: primaryKey+id. Por default ese valor puede ser NULL, osea que puede haber un lapiz no asociado a ningun alumno. Para cambiarlo ver "Otras Opciones"
//--- NxM ---

//Se usan
belongsToMany();
belongsToMany();

const alumno = sequelize.define(
    'alumnos',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        nombre: DataTypes.STRING
    }
);

const profe = sequelize.define(
    'profe',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        nombre: DataTypes.STRING
    }
);

//La FK no puede ir en ninguna tabla, porque en ambas se necesitaría poner mas de un dato en cada lugar. Por eso se crea una tabla intermedia
alumno.belongsToMany(profe, { through: "alumnos_profes" });
profe.belongsToMany(alumno, { through: "alumnos_profes" });
//Esto crea una tabla intermedia llamada "alumnos_profes" con las dos FK que hacen referencia a las primaryKey de alumno y de lapiz. Sus nombres default son: primaryKey+id.

//Tambien se puede pasar un modelo ya creado.
const alumnos_profes = sequelize.define(
    'alumnos_profes',
    {
        alumnos_profesId: { //Si quiero que tenga una clave no compuesta hago esto, si no, no lo hago
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        /*alumnoId:{ //No es necesario definirlo, el belongsToMany la crea automáticamente
            type: DataTypes.INTEGER,
            references: { //Esta es la forma de hacerla foranea
                model: alumno, //Si nos equivocamos y lo ponemos en plural tambien sirve
                key: 'id'
            }
        },
        profeId:{ //No es necesario definirlo, el belongsToMany la crea automáticamente
            type: DataTypes.INTEGER,
            references: {
                model: profe, //Si nos equivocamos y lo ponemos en plural tambien sirve
                key: 'id'
            }
        },*/
        otroCampo:{ //Ventaja de crear el modelo, podemos agregar mas campos
            type: DataTypes.INTEGER,
            references: {
                model: profe, //Si nos equivocamos y lo ponemos en plural tambien sirve
                key: 'id'
            }
        }
    }
)

alumno.belongsToMany(profe, { through: alumnos_profes, foreignKey: 'IdDelAlumno' }); //Cambio la FK que hace referencia a alumno
profe.belongsToMany(alumno, { through: alumnos_profes }); //La FK que hace referencia a profe queda igual: profeId
//--- Otras Opciones ---
//Se pueden configurar cosas en las relaciones pasando un objeto como segundo parametro

a.hasOne(b, {
    onDelete /* Que hacer con los regstros de b cuando se borra un registro de a */: CASCADE /* Borra los registros de b */ /* SET NULL: Setea en null los valores de la FK en b (Este campo no puede ser NOT NULL) */ /* RESTRICT: No te deja hacer la operación */ /* SET DEFAULT: Setea en el valor por defecto los valores de la FK en b */,
    onUpdate /* Que hacer con los regstros de b cuando se cambia un registro de a */: CASCADE /* Cambia los registros de b al nuevo valor en a */ /* SET NULL: Setea en null los valores de la FK en b (Este campo no puede ser NOT NULL) */ /* RESTRICT: No te deja hacer la operación */ /* SET DEFAULT: Setea en el valor por defecto los valores de la FK en b */,
    //En 1x1 y 1xM onDelete y onUpdate están seteados por default en SET NULL y CASCADE respectivamente. En MxN ambos están seteados en CASCADE

    foreignKey: 'otroNombreDeCampo', //Cambia el nombre del campo de la clave foranea
    //Se las puede tratar como atributos normales
    foreignKey: {
        name: 'otroNombreDeCampo',
        type: DataTypes.FLOAT,
        allowNull: false //Esto es lo que impide que haya un DNI no asignado a nadie o un lapiz sin dueño
    }, 
    as: 'NombreRelacion', //Cambia el nombre de la relacion, cambia el include, cambia por ende el getB que ahora se convierte en getNombreRelacion y ademas el nombre del campo de la fk como NombreRelacion + ClavePrincipal de la tabla a la que referencia. sirve para tener dos referencias a la otra tabla
});
b.belongsTo(a, {/* Las mismas configuraciones que arriba son posibles, pero no es necesario ponerlo en ambas */});

a.belongsToMany(b, { //BelongsToMany crea además una clave unica para la tabla intermedia
    through: c,
    uniqueKey: 'ClaveC', //Cambio el nombre de la constraint en sql
})

//Puedo hacer que mi FK apunte a un campo que no sea mi PK. Este campo tiene que estar definido como Unique
a.belongsTo(b, {
    targetKey: 'Nombre', //La clave foranea ahora en lugar de apuntar a la PK, apunta a mi campo Nombre.
}),

b.hasOne(a, {
    sourceKey: 'Nombre', //La clave foranea ahora en lugar de apuntar a la PK, apunta a mi campo Nombre.
})
b.hasMany(a, {
    sourceKey: 'Nombre', //La clave foranea ahora en lugar de apuntar a la PK, apunta a mi campo Nombre.
})

//[./img/sourceOtarget.png]
//[./img/FK_en_no_PK_MxN.png]

a.belongsToMany(b, {
    through: 'Intermedia',
    foreignKey: 'ID_A', //Cambia el nombre de la FK de a
    otherKey: 'ID_B', //Cambia el nombre de la FK de b
})
b.belongsToMany(a, {
    through: 'Intermedia',
    foreignKey: 'ID_B', //Cambia el nombre de la FK de b
    otherKey: 'ID_A', //Cambia el nombre de la FK de a
}) //Hace falta pasarlo en ambas relaciones, sino hay riesgo de errores [./img/explicaciónDosFK.png]

//ç----- CRUD simples. Instancias -----

//Como User es una clase, puedo hacerle instancias con .create

//--- Operadores. Where ---
/*
| FORMATO:
[op.//Operador] : 'valor',
*/
findAll/*EXPLICADO DESPUES*/({
    where: { //SELECT * WHERE
        campo: 10, //campo = 10                                                   el : sirve como = en este caso. Sintaxis mas amigable
        [op.or]: [{campo: 10},{campo2: 20}], //campo = 10 OR campo2 = 20          el : sirve como = en este caso. Usado para comparar dos campos distintos. Sintaxis mas amigable
        [op.and]: [{campo: 10},{campo2: 20}],  //campo = 10 AND campo2 = 20       el : sirve como = en este caso. Usado para comparar dos campos distintos. Sintaxis mas amigable
        //Las comas al final de las clausulas del where actúan como AND, entonces la linea anterior es equivalente a
        campo: 10,
        campo2: 20,

        campo: [1, 2, 3], //campo IN [1, 2, 3]                                    el : sirve como IN en este caso. Sintaxis mas amigable

        //Clausulas de un campo específico
        campo: { //SELECT * WHERE campo
            [op.and]: [2, 3], //campo = 2 AND campo = 3   Solo valido para comparar dos opciones del mismo campo
            [op.or]: [2, 3], //campo = 2 OR campo = 3     Solo valido para comparar dos opciones del mismo campo
            [op.eq]: 1, //= 1
            [op.ne]: 1, //!= 1
            [op.is]: null, //IS NULL (Valido con NULL, TRUE y FALSE)
            [op.not]: true, //IS NOT TRUE (Valido con NULL, TRUE y FALSE)

            [op.gt]: 1, //> 1                          Greater Than
            [op.gte]: 1, //>= 1                        Greater Than Equal
            [op.lt]: 1, //< 1                          Lower Than
            [op.lte]: 1, //<= 1                        Lower Than Equal


            [op.between]: [2, 3], //BETWEEN 2 AND 3
            [op.notBetween]: [2, 3], //NOT BETWEEN 2 AND 3
            [op.in]: [2, 3, 4, 5], //IN [2, 3, 4, 5]            Version con el campo del operador de la L3 en where: {}
            [op.notIn]: [2, 3, 4, 5], //NOT IN [2, 3, 4, 5]
            // [./img/operadores.png]

            // Se pueden hacer combinaciones logicas con los operadores pasandoles un objeto
            [op.and]: { 
                [op.gt]: 3,
                [op.ne]: 4,
            } //SELECT * WHERE campo > 3 AND campo != 4
        },
        //Tambien se pueden hacer combinaciones fuera del campo, en el where puro
        [op.or]: [
            {
                id: {
                    [op.between]: [2, 5]
                }
            },
            {
                admin: {
                    [op.eq]: true
                }
            }
        ], //SELECT * WHERE id BETWEEN 2 AND 5 OR admin = true
        [op.or]: [
            {id: {[op.between]: [2, 3]}},
            {admin: {[op.eq]: true}}
        ]
    }
})
/*En resumen: 
En la parte de where, ":" equivale a "=" y "," equivale a "AND".
En la parte de campo, "," equivale a "AND" solo al cambiar de operador

En la parte de where, a los operadores se les pasa una lista con objetos con los campos [{},{}]
En la parte de campo, a los operadores se les pasa una lista [] salvo casos como el and o el or

*/

//--- INSERT ---

//| Formato:
const nombreInstancia = await Modelo.create({
    campo: 'Valor',
    campo2: 'Value'},
    { fields: ['campo'] }, //Campo que quiero que se aguegue el valor a la BD, si no pongo nada son todos, si pongo uno el resto son NULL
);

//Ejemplo:
const us1 = await User.create({
    lastName: 'Bosnia',
    admin: true},
    { fields: ['lastName'] }, //Esta sola se agrega a la BD, la otra no para evitrar hackeos
);

//--- SELECT ---

//- FindAll() - devuelve todo lo que coincida
await User.findAll(); //SELECT * FROM User

await User.findAll({ 
    attributes: ['id', 'LastName'],
}); //SELECT id, lastname FROM User

//Agregaciones (COUNT(), SUM(), AVG(), MIN(), MAX())

await User.count();
await User.count({
    where: {
        admin: true
    }, //Trae la cantidad de usuarios con admin en true

    //Podes agrupar (goup by) con la clausula group
    group: 'lastName', //Trae la cantidad de usuarios que tienen admin en true agrupados por apellido

    //Podes ordenar (order by) con la clausula order. OJO, HAY MAS COSAS DE ORDER QUE SINCERAMENTE NO NTIENDO, NO CREO QUE TOME NADA DE ESO, PERO POR LAS DUDAS ESTÁN ACÁ https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#ordering-and-grouping  https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/#ordering-eager-loaded-associations
    //| Formato
    //order: [['campo', 'DESC o ASC'],['otro campo opcional', 'DESC o ASC']. Primero ordena por la primera cclausula, si hay dos iguales, ordena por la segunda
    order: ['name', 'DESC']
});

await User.max('id');
await User.min('id', {where: 
    {
        id: {
            [op.gt]: 5
        }
    }
});

//Limite de registros
//Podes poner un limite de filas o un espaciado entre la primera y la primera que selecciona
await User.findAll({
    limit: '10', //Trae 10 filas
    offset: '3' //Espaciado de 3 antes de empezar a traer
});

//Tambien se pueden pasar como atributos de un select

await User.findAll({
    attributes: ['id', [sequelize.fn('COUNT', sequelize.col('id')), 'Cant_id']]
}); //SELECT id, count(id) AS Cant_Id FROM User           Ponerle un apodo (AS) es obligatorio

//Otras Funciones

await User.findAll({
    attributes: ['id', [sequelize.fn('char_lenght', sequelize.col('lastName')), 'Long']]
}); //SELECT id, char_lenght("lastName") AS Cant_Id FROM User           Ponerle un apodo (AS) es obligatorio

//Where
await User.findAll({
    where: {
        id: 2,
        admin: true
    }
});

//sequelize.fn se puede usar en where tambien, con sequelize.where

await User.findAll({
    where: sequelize.where(sequelize.fn('char_length', sequelize.col('lastName')), 7),
}); //select * where char_lenght(lastName) == 7

// [./img/ejemploDificilOperadores.png]

//| Formato
await User.findAll({
    attributes: ['clave', 'clave2'],
    where: {
        //CONDICIONES
    }
});
//- findByPk -
//Es como el findAll() pero solo trae un valor, definido por la primary key ingresada por parámetros
//|Formato
await modelo.findByPk(valor)
//Ejemplo
await User.findByPk(123)
//- FindOne -
//Es como el findAll() pero solo trae el primer valor, si solo tenemos un registro con ese valor conviene antes que el findAll aunque ambos traigan uno solo ya que el primero trae un objeto {} y el segundo un objeto con una lista de un solo elemento {[]}
//|formato
await modelo.finOne(valor)
//Ejemplo
await User.findOne('Lautaro')

//--- UPDATE ---

//| FORMATO
await User.update(
    { campo: 'valor a asignar', campo2: 'valor a asignar'},
    {
        where: {
            //CONDICIONES
        }
    }
);

//Ejemplo
await User.update(
    { lastName: 'Rabinovich'},
    {
        where: {
            lastname: 'Rabi'
        }
    }
);

//--- DELETE ---

//|Formato
await User.destroy({
    where: {
        campo: 'valor',
    }, //<-- No va la coma
    //o
    truncate: true
});

await User.destroy({
    where: {
        lastName: 'Rabinovich',
    }
});    

//ç----- CRUD con Asociaciones -----

const capitan = sequelize.define(
    'Capitan',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        nombre: DataTypes.STRING
    }
)

const barco = sequelize.define(
    'Barco',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        espacio: DataTypes.DOUBLE
    }
)
capitan.hasOne(barco, {
    as: 'Líder'
})
barco.belongsTo(capitan)

//--- SELECT ---

//Carga anticipada vs Carga diferida
//La carga anticipada trae tanto el registro, como los registros referenciados o los que lo referencian
const capitanCrack = await capitan.findOne({
    where: {
        nombre: 'Jack Sparrow'
    },
    include: 'Líder', //Alias Relación
    // o
    include: {
        model: 'Barco', //Nombre Modelo
        as: 'Líder', //Alias Relación
    },
    // o, si no se definio un alias
    include: barco, //Nombre de la constante 
    // o
    include: 'Barco' //Nombre del modelo
})
console.log('Nombre: ' + capitanCrack.nombre)
console.log('id: ' + capitanCrack.id)
console.log('Espacio Barco: ' + capitanCrack.Barco/* Nombre del modelo */.espacio)
console.log('id barco: ' + capitanCrack.Barco.id)

//Otras configuraciones de la carga anticipada

const capitanesCONbarco = await capitan.findAll({
    where: {
        '$Barco.espacio$' :{ [op.gt]:3 } //Me trae los capitanes cuyos barcos tengan un espacio mayor a tres. No define el required en true. Los signos $ le dicen a sequelize que estás hablando de un registro de un modelo incluido, no del modelo propio
    },
    include: { //Todo lo que configure acá hace que no me traiga los capitanes cuyos barcos tno cumplan estas características
        model: barco, //Tre los barcos de lso capitanes. LEFT JOIN
        required: true, //Los capitanes sin barco no te los trae. INNER JOIN
        right: true, //Trae los barcos y los capitanes de los barcos que los tengan. RIGHT JOIn
        paranoid: false, //Carga los registros eliminados lógicamante
        where: { //Solo los que su barco tiene un espacio mayor a 3. Define el required en true automaticamente. Es lo mismo que el where de 6 lineas mas arriba
            espacio : {
                [op.gt] : 3
            },
            id: Sequelize.col('Capitan.id') //Cualdo el id coincida con el id de su capitan (Ejemplo)
        }
    }
})
//[./img/tiposJoin.png]

//Include anidado
const timon = sequelize.define(
    'Timon',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        modelo: DataTypes.STRING,
        año: DataTypes.DATE
    }
);
barco.hasOne(timon);
timon.belongsTo(barco);

const capitanesConBarcosConTimones = await capitan.findAll({
    include: {
        model: barco,
        include: {
            model:timon
        }
    }
})

//Incluir Multiples Modelos

const barcosConTimonesYCapitanes = await barco.findAll({
    include: [ timon, //Le paso una lista
        {
            model: capitan,
            as: 'Líder'
        },
    ]
})

//La carga diferida trae solo el registro pedido, y con un getter se puede obtener el registro referenciado
const capitanCrack = await capitan.findOne({
    where: {
        nombre: 'Jack Sparrow'
    }
})
console.log('Nombre: ' + capitanCrack.nombre)
console.log('id: ' + capitanCrack.id)
//Ahora quiero saber los datos del barco
const barcoDelCapi = await capitanCrack.getBarco() //Metodo creado por sequelize.
//[./img/métodosInstancias.png] 
//[./img/nombresMetodos.png]
//Los metodos creados por sequelize tambien aceptan argumentos como los buscadores normales
const barcoDelCapi = await capitanCrack.getBarco({
    attributes: ['espacio'],
    where: {
        espacio : {
            [op.gt] : 3
        }
    }
})
console.log('espacio: ' + barcoDelCapi.espacio)
console.log('id: ' + barcoDelCapi.id)

//Peculiaridades de NxM

const alumno = sequelize.define(
    'alumnos',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        nombre: DataTypes.STRING
    }
);

const profe = sequelize.define(
    'profe',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        nombre: DataTypes.STRING
    }
);

alumno.belongsToMany(profe, { through: "alumnos_profes" });
profe.belongsToMany(alumno, { through: "alumnos_profes" });

const profes = profe.findAll({
    include:
    {
        model: alumno,
        through: { attributes : [] } //Defino que atributos de la tabla intermedia quiero que me traiga, si no lo pongo me trae todos
    }
});

const profes2 = profe.findAll();
const alumnosProfes = profes2.getAlumnos({ joinTableAttributes: [] }); //Defino que atributos de la tabla intermedia quiero que me traiga, si no lo pongo me trae todos

//Pongamos que ahora queremos agregarle un alumno a un profe y que su tabla intermedia la definimos nosotros, y no la creó sequelize automaticamente

const alumnos_profes = sequelize.define(
    'alumnos_profes',
    {
        horas:{
            type: DataTypes.INTEGER
        },
    }
);

alumno.belongsToMany(profe, { through: alumnos_profes });
profe.belongsToMany(alumno, { through: alumnos_profes });

const MarcosCosta = await profe.create({nombre: 'MarcosCosta'});
const Lautaro = await alumno.create({nombre: 'Lautaro'});
await MarcosCosta.addAlumno(Lautaro, { through: { horas: 100 }}); //Agrega a marcos costa el alumno Lautaro y además el valor del campo extra de la tabla intermedia lo define en 100

//--- CREATE ---

await barco.create({
    espacio: 2.2,
    capitanId: 2
});

//Creación anidada

const barcoTimon = barco.hasMany(timon) //Me guardo el return, osea, me guardo la información de la relación.
capitan.hasOne(barco, {as: 'Navío'}) //NO me guardo el return porque pudo usar el alias de la relacion
//Las relaciones las hago así, porque al crear un capitan, lemvoy a poner el barco, y al barco el timon, necesito guardarme los datos en ese orden

await capitan.create(
    {
        nombre: 'Jack Esparrago',
        Navío: { //Definida por el alias
            espacio: 10,
            timons: [ //Plural (en ingles) porque es un hasMany. Minuscula automatica de sequelize
                {
                modelo: 'asdhkfkas',
                año: '12-4-2009'
                },
                { 
                modelo: 'ashkafjsdf',
                año: '12-5-2009'
                },

            ]
        }
    },
    {
        include: {
            association: 'Navío', //Le paso nlos datos de la asociacion
            include: [barcoTimon], //Le paso nlos datos de la asociacion (En un array porque es hasMany)
            //o
            include: [{ association: barcoTimon }]
        }
    }
);

//--- UPDETE y DELETE ---

await barco.update(
    { espacio: 10 },
    {
        where: {
            id: 2,
        }
    }
);

await barco.destroy({
    where: {
        id: 2,
    }
});


//ç----- FINAL -----
const startServer = async () => {
    try {
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};
startServer();      

server.listen(PORT, async () => { //Inicia el servidor, le dice el puerto, hace que se ejecute en bucle y permite ejecutar un pedazo de codigo al iniciar
    await sequelize.authenticate(); //Testea la conexión
    await sequelize.sync(); //Sincroniza (o no) los modelos con la base de datos. Puedo sincronizar una sola con User.sync()
    /*
    OPCIONES:
    sequelize.sync() : Crea la tabla SI y SOLO SI no existía
    sequelize.sync({force: true}) : crea la tabla eliminandola primero (Los datos se borran)
    sequelize.sync({alter: true}) : Modifica la tabla existente (Los datos no se borran)
    [./img/sync.png]
    permite un segundo parametro, una condición
    sequelize.sync({force: true}, match: /_test$/) : Solo si termina con _test
    */
    console.log("El servidor está ON en el puerto", PORT);
});

//ç----- EXTRAS -----

//---Modelos---

//•Si al crear un modelo, a un campo se le asigna solo el dataType se puede escribir:
sequelize.define(
    'User', 
    { name: DataTypes.STRING },
);

//•Borrar modelos
User.drop(); //Borra una tabla
sequelize.drop(); //Borra todas las tablas

//---Validations y Constraints---
//AllowNull está por default en True
//Si está allowNull definido en false y un valor se ingresa como null se saltean todas las demás validaciones
//Si está allowNull definido en true y un valor se ingresa como null se saltean todas las validaciones INTEGRADAS, las personalizadas no
//[./img/ejemploUsoDeAllowNullParaSaltearValidaciones.png]
//Para perosnalizar el mensaje de error de AllowNull se usa la validacion integrada isNull y configurando su msg

//---Asociations---

//Las relaciones se forman de a pares porque si hago solo 
a.hasOne(b)
//Y quiero hacer un
b.findAll({
    include: a //No me deja, porque 'b' no conoce a 'a'
})

//Alias
a.hasOne(b, { as: 'HOLA'})
b.belongsTo(a, { as: 'CHAU'})

await a.findAll({ include: 'HOLA' }); //Alias en la linea de a
await b.findAll({ include: 'CHAU' }); //Alias definido en la linea de B

//Distintas asociaciones con dos mismos modelos
const equipo = sequelize.define(
    'Equipo',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: DataTypes.STRING
})

const partido = sequelize.define(
    'Partido',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fecha: DataTypes.DATE
})

partido.hasOne(equipo, { as: 'Local' }); //getLocal()
partido.hasOne(equipo, { as: 'Visitante' }); //getVisitante()
equipo.belongsTo(partido);

//--Super MxN--
//MxN normal
alumno.belongsToMany(profe, {Through: horas })
profe.belongsToMany(alumno, {Through: horas })

//Puedo hacer
alumno.findAll({ include: profe })
profe.findAll({ include: alumno })
//Pero no
alumno.findAll({ include: horas }) //No se conocen
profe.findAll({ include: horas }) //No se conocen
horas.findAll({ include: alumno }) //No se conocen
horas.findAll({ include: profe }) //No se conocen

//Dos 1xM
alumno.hasMany(horas);
horas.belongsTo(alumno);
profe.hasMany(horas);
horas.belongsTo(profe);
//Esto en escencia es lo mismo que el MxN

//Puedo hacer
alumno.findAll({ include: horas })
profe.findAll({ include: horas })
horas.findAll({ include: alumno })
horas.findAll({ include: profe })
//Pero no
alumno.findAll({ include: profe }) //No se conocen
profe.findAll({ include: alumno }) //No se conocen
//Podes emularlo haciendo, aunque el JSON devuelto es un poco distinto
alumno.findAll({ 
    include: {
        model: horas,
        include: profe
    }
})

//Super MxN
alumno.belongsToMany(profe, {Through: horas })
profe.belongsToMany(alumno, {Through: horas })
alumno.hasMany(horas);
horas.belongsTo(alumno);
profe.hasMany(horas);
horas.belongsTo(profe);

//Puedo hacer todo
alumno.findAll({ include: profe })
profe.findAll({ include: alumno })
alumno.findAll({ include: horas }) 
profe.findAll({ include: horas }) 
horas.findAll({ include: alumno }) 
horas.findAll({ include: profe }) 

//Pero, de que sirve?
//Si yo tuviera por ejemplo un torneo, en donde hay equipos, partidos y jugadores, pero los jugadores pueden cambiar de equipo en mitad del torneo, pero no del partido
partido.belongsToMany(equipo, { through: 'partidoEquipo' });
equipo.belongsToMany(partido, { through: 'partidoEquipo' });
equipo.hasMany(partidoEquipo);
partidoEquipo.belongsTo(equipo);
//Ahora queremos asociar el jugador, pero, este no tiene un equipo definido, ni tampoco un partido definido, lo que si tiene definido es en que equipo está en un partido determinado, eso es justamente "partidoEquipo", la tabla intermedia
partidoEquipo.belongsToMany(jugador, { through: 'jugadorPartidoEquipo'});
jugador.belongsToMany(partidoEquipo, { through: 'jugadorPartidoEquipo'});

const partidos = await partido.findAll({ //busco los partidos
    include: { 
        partidoEquipo:{ //Traigo los partidoEquipo
            include: [
                {
                    model: jugador, //Traigo los jugadpres
                    through: { attributes: [] },
                },
                equipo //Traigo el equipo
            ]
        },
    }
})

console.log(partidos, partidos.partidoEquipo.equipo, partidos.partidoEquipo.jugador)

//---Instancias---

//•Crear una instancia (no se usa New)
const us1 = User.build({lastName: 'Lauti'});

//Las instancias de un modelo no van a la base de datos, para eso está save:
await us1.save(); //Puedo usar await pq save es un metodo asyncrono

const us1 = await User.create({lastName: 'Lauti'}); //Combinacion de build y save


//•modificar una instancia y depsues modificarla en la BD
us1.lastName = 'Lau'
await us1.save()

//•cambiar una parte de la base de datos en base a cambios en la instancia
us1.lastName = 'Lau';
us1.admin = true;
await us1.save({ fields: ['lastName'] });

//•resetear la instancia a como está en la BD
await us1.reload();

//•Borrar una instancia
await us1.destroy(); //Borra de la bd tambien

//•incrementar o decrementar un campo de una instancia en un rango
await us1.increment('id', {by:2})

await us1.decrement({
    'id': 2,
    'plata': 100,
})
//ambos savean la instancia

//Se pueden crear instancias en masa
const users = await User.bulkCreate([{ lastName: 'Lauti' }, { lastName: 'Rabi', admin: true}]) //Bulk create no hace validaciones
const users = await User.bulkCreate([{ lastName: 'Lauti' }, { lastName: 'Rabi', admin: true}], {
    validate: true, //Ahora si valida. Si la validacion falla, no s ecrea ninguno de los dos
    fields: ['lastName'] //Acepta el campo fields
}); 

//---CRUD Simples---

//--SELECT--
//-FindAll-

//•Ponerle una agregación sin tener que poner todos los campos (Agregar un campo al select)
await User.findAll({
    attributes: {
        include: [[sequelize.fn('COUNT', sequelize.col('id')), 'Cant_id']]
    }
}) //SELECT id, lastName, admin, count(id) AS cant_id FROM User

//•Sacar un campo del SELECT
await User.findAll({
    attributes: { exclude: ['admin'] },
}) //SELECT id, lastName FROM User

//-FindOrCreate-
//Busca deacuerdo a ciertas clausulas, si lo encuentra devuelve el registro y un boolean en false, si no, la crea rellenando los demás espacios con los valores en defaults:{} y devolviendo ese boolean en true
const {lau, creado} = await User.findOrCreate({
    where: { lastName: 'Lauti' }, 
    defaults: {
        admin: 'false',
    },
});
console.log(creado)
//-FindAndCountAll-
//Combinacion entre FindAll y Count, devuelve dos cosas, el SELECT y el COUNT. Se usa con limit y offset y si se usa group by count en lugar de un valor es un objeto con valores
const {cant, registros} = await User.findAndCountAll()

//---CRUD con Asociaciones---
//se pueden hacer selects con mas de una tabla relacionada

const equipo = sequelize.define(
    'Equipo',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: DataTypes.STRING
})

const partido = sequelize.define(
    'Partido',
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fecha: DataTypes.DATE
})

partido.hasOne(equipo);
equipo.belongsTo(partido);

const arbitro = sequelize.define('arbitro', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: DataTypes.STRING,
})

partido.hasOne(arbitro);
arbitro.belongsTo(partido);

const partidos = await partido.findAll({
    include: ['Equipo', {
        model: 'arbitro',
        /* CONFIGURACIONES */
    }]
})
//o tambien

const partidos = await partido.findAll({
    include: { all: true } //Trae todas las tablas relacionadas
})
const partidosConMasDatos = await partido.findAll({
    include: { all: true, nested: true } //Trae todas las tablas relacionadas y las tablas relacionadas a estas de forma recursiva
})

//Otras funciones de los modelos
const cantLautaros = await User.count();
const cantLautaros = await User.count({
    where: {
        lastName: 'Lautaro'
    }
});
const cantLautaros = await User.max();
const cantLautaros = await User.min();
const cantLautaros = await User.sum();

//çCONCEPTOS
/*
CONVENCIÓN
Nombre Tabla en minúscula
Mayuscula al referirse a la clase. Minuscula para una instancia de la clase
//[./img/convencion.png]



• Al ejecutar el codigo se ejecutan todos los endpoints como en la programación estructurada, pero no se ejecutan sus funciones callback (En este caso las arrow). Estas funciones callback se ejecutan cuando a Node le llega algo, y node está en el puerto 3000, entonces, hasta que no le llegue algo a la pc con puerto 3000, Node no hace nada, y cada endpoint tiene ademas otra condicion, el primer parámetro, la URL. Entonces Node no hace nada hasat que le llegue algo, pero cada endpoint no hace nada hasta que no le llegue a node algo por el puerto 3000 y que acceda a /primerParametroEndpoint. Server.listen funciona distinto, porque como su condicion es que el SO asigne el puerto 3000 correctamente, se ejecuta al instante
En resumen: Los endpoints se ejecutan al principio y se guardan en un lugar como recetas (el '/algo' + la callback), no sus callbacks, estas esperan a que alguien acceda a /algo porque esa es su condicion. Server listen espera a que se asigne el puerto, una vez echo eso, se ejecuta lo de adentro, por eso eso si se ejecuta primero
• Una función asíncrona envuelve los return en promesas (las promesas son objetos) y además si hay un error no frena la ejecucion sino que envuelve el error en si ej una promesa. Permite usar Await
El Await le dice al ejecutor (Node) que mientras ocurra esta linea, no siga ejecutando nada DE ESA FUNCIÓN, pero si de otras cosas fuera
• Puedo ejecutar una funcionm al instante poniendole () al final
• Para ejecutar al instante una función anónima además le tengo que poner parentesis al principio y al final (() = >{])();



• En una relacion:
El nombre del campo se define como  nombre del modelo + id
Los get, set y create se definen como set/set/create + nombre del modelo en mayuscula
Al incluir otro modelo en un select, se usa el nombre de la constante, o el nombre del modelo entre comillas

• En una relacion:
casa.hasOne(puerta, 
    {
        foreignKey: 'Entrada'
    }
)
Cambia el nombre del campo a nivel de sql, pero tanto el include, como sus metodos get, set y create se quedan con el asignado por default por sequelize: puerta

casa.hasOne(puerta, 
    {
        as: 'Entrada'
    }
)
Cambia el nombre de la relacion que tienen casa y puerta, y además el nombre del campo. ahora para incluirlo, se necesita poner include: 'entrada' y sus metodos son getEntrada, setEntrada y createEntrada

*/