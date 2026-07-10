const { Sequelize, DataTypes, Op, BelongsTo, HasMany } = require("sequelize");

const sequelize = new Sequelize('Sequelize', 'root', "", {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

//ç Modelo

const Trabajador = sequelize.define(
    'Trabajador',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: DataTypes.STRING,
        apodo: {
            type: DataTypes.STRING,
            validate: {
                tieneNums(value) {
                    for (i = 0; i < value.lenght(); i++) { //Acordarse de que son ; no ,
                        if (i == 0 || i == 1 || i == 2 || i == 3 || i == 4 ) {
                            throw new Error("No se permiten los numeros 1, 2, 3 ni 4")
                        }
                    }
                }
            }
        },
        mail: {
            type: DataTypes.STRING,
            validate: [isEmail]
        },
        departamento: {
            type: DataTypes.STRING,
            validate: {
                isIn: {
                    args: [["RRHH", "Ventas", "Servicio Técnico"]],
                    msg: "Departamento no valido"
                }
            }
        },
        admin: {
            type: DataTypes.BOOLEAN,
            default: false
        }
    },
    {
        timestamps: false, 
        freezeTableName: true, 
        tableName: 'trabajadores'
    },
);

const Sello = sequelize.define(
    'Sello',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }
);

const Lapiz = sequelize.define(
    'Lapiz',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }
);

const Empresa = sequelize.define(
    'Empresa',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }
);

//ç Asociaciones

//1x1
Trabajador.hasOne(Sello, { foreignKey: 'dueñoId' });
Sello.belongsTo(Trabajador, { as: 'dueño', foreignKey: 'dueñoId' });

//1xM
Trabajador.hasMany(Lapiz, { foreignKey: 'dueñoId' });
Lapiz.belongsTo(Trabajador, { as: 'dueño', foreignKey: 'dueñoId' });

//MxN
Trabajador.belongsToMany(Empresa, { through: 'TrabajadoresEmpresas' });
Empresa.belongsToMany(Trabajador, { through: 'TrabajadoresEmpresas' });

//ç CRUD

//Simple

//SELECT
const trabajadoresAdminODeRRHH = Trabajador.findAll({
    where: {
        [op.or]: [
            {admin: true},
            {departamento: 'RRHH'}
        ],
        [op.And]: [
            {admin: true},
            {departamento: 'RRHH'}
        ]
    }
});

const trabajadoresCondicion = Trabajador.findAll({
    where: {
        nombre: {
            [op.or]: ['Favio', 'Roberto'], //Favio o Roberto
            [op.like]: '%a', //%dice donde está el resto de la palabra. Termina en a
            [op.like]: 'a%', //%dice donde está el resto de la palabra. Empieza con a
            [op.like]: '%a%', //%dice donde está el resto de la palabra. Contiene a
            [op.notLike]: '%a',
            [op.iLike]: '%a%', //Como el like, pero ignora acentos y esas cosas. No ignora mayusculas
            [op.notILike]: '%a%',
            [op.not]: null, //No es NULL
            [op.is]: null, //Es NULL
            [op.and]: {
                [op.gt]: 3, //Es mayor a 3 y
                [op.ne]: 7 //No es 7
            },
        },
        id: {
            [op.between]: [1, 4] //Entre 1 y 4
        },
    }
});

const trabajadoresOrdenadosPorEdadAscendente = Trabajador.findAll({
    order: [['edad']]
});

const cantTrabajadoresAgrupadosPorEdad = Trabajador.findAll({
    group: ['edad']
});

const los10UsuariosMasViejos = Trabajador.findAll({
    limit: 10
});

const trabajador1 = Trabajador.findByPk(1);


//INSERT
await Trabajador.create({
    nombre: 'Juan',
    apodo: 'Juanse',
    mail: 'juanse@gmail.com',
    departamento: 'RRHH',
    admin: true
    },
    { fields: ['nombre', 'apodo', 'mail', 'departamento'] }
);

//UPDATE
await Trabajador.update(
    { admin: true, departamento: 'Ventas' },
    {
        where: {
            id: 1
        }
    }
);

//DELETE
await Trabajador.destroy({
    where: {
        admin: false
    }
});

//Con Asociaciones

//SELECT
//Carga Anticipada
const trabajadorConSuSello = await Trabajador.findOne({
    where: {
        //OPCIONES
    },
    include: {
        model: Sello,
        required: true
    }
});

const lapizConSuDueño = await Lapiz.findOne({
    include: 'dueño',
});

console.log("Nombre Trabajador: " + trabajadorConSuSello.nombre + "Id del Sello:" + trabajadorConSuSello.Sello.id);

const lapizConSuDueñoYSuSello = await Lapiz.findOne({
    inclue: {
        model: Trabajador,
        as: 'dueño',
        include: [
            {
                include: Sello
            }/*,
            { Otro modelo si lo hubiera }
            */
        ]
    }
});

console.log("Id Lapiz: " + lapizConSuDueñoYSuSello.id + "Id del sello del dueño del lapiz" + lapizConSuDueñoYSuSello.dueño.Sello.id);  //.alias en lugar de .modelo

const lapicesDeTrabajador = await Trabajador.findOne({
    include: Lapiz
});

console.log("Id Trabajador: " + lapicesDeTrabajador.id + "Id del primer lapiz: " + lapicesDeTrabajador.Lapices[0].id);
//Carga Diferida
const trabajadorSinSello = await Trabajador.findOne();
console.log(trabajadorSinSello.nombre)

const ahoraSuSello = await trabajadorSinSello.getSello();
console.log(ahoraSuSello.id)

//INSERT
await Sello.create({
    id: 10,
    dueñoId: 2
})

//UPDATE y DELETE
await Lapiz.update(
    { dueñoId: 3 },
    {
        where: {
            id: 10,
        }
    }
);

await Lapiz.destroy({
    where: {
        dueñoId: 2,
    }
});

/*
EN CASO DE NO FUNCIONAR LOS ERRORES MAS TIPICOS SON:
1. ALGO NO IMPORTADO
2. FALTA UN ASYNC O AWAIT
*/