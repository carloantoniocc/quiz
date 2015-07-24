var path = require('path');

//cargar modelo ORM
var Sequelize = require('sequelize');

var sequelize = new Sequelize(null,null,null,
					{ dialect: "sqlite", storage:"quiz.sqlite"}
				);
				
//importar la definicion de la tabla en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; //exportar definicion de la tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en bd
sequelize.sync();

	// success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count) {
		if (count === 0) { // la tabla se inicializa solo si esta vacia
			Quiz.create({   pregunta : 'capital de Italia',
							respuesta : 'Roma'
						})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});

