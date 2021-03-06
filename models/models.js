var path = require('path');

//Postgres DATABASE_URL = postgres://user:pass@host:port/database
//SQLite   DATABASE_URL = sqlite://:@:/
var url	= process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/)
var DB_name 	= (url[6]||null);
var user 		= (url[2]||null);
var pwd 		= (url[3]||null);
var protocol 	= (url[1]||null);
var dialect 	= (url[1]||null);
var port 		= (url[5]||null);
var host 		= (url[4]||null);
var storage 	= process.env.DATABASE_STORAGE;

//cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name,user,pwd,
	{ 	dialect:  protocol,
		protocol: protocol,
		port:     port,
		host:     host,
		storage:  storage,   //solo SQLite (.env)
		omitnull: true       //solo Postgres
	}
);

//importar la definicion de la tabla en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//importar la definicion de la tabla comment.js
var Comment = sequelize.import(path.join(__dirname,'comment'));

Comment.belongsTo(Quiz); //pertenece a
Quiz.hasMany(Comment);   //tiene muchas


exports.Quiz = Quiz; //exportar definicion de la tabla Quiz
exports.Comment = Comment; ////exportar definicion de la tabla Comment

// sequelize.sync() crea e inicializa tabla de preguntas en bd
sequelize.sync();

	// success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count) {
		if (count === 0) { // la tabla se inicializa solo si esta vacia
			Quiz.create({   pregunta : 'capital de Italia',
							respuesta : 'Roma',
							tipo : "otro"
						})
			Quiz.create({   pregunta : 'capital de argentina',
							respuesta : 'Buenos Aires',
							tipo : "otro"
						})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
