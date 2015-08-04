var models = require('../models/models');

// GET /quizes/question
exports.question = function(req, res) {
	models.Quiz.findAll().then(function(quiz) {
		res.render('quizes/question', {pregunta : quiz[0].pregunta, errors: [] });
	})
}

// GET /quizes/answer
exports.answer = function(req, res){
	models.Quiz.findAll().then(function(quiz) {

		if(req.query.respuesta == quiz[0].respuesta){
			res.render('quizes/answer', {respuesta: 'Correcto'});
		}else{
			res.render('quizes/answer', {respuesta: 'Incorrecto'});
		}
	})
}

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(// crea un objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
		);

		res.render('quizes/new', {quiz:quiz, errors: [] });
}

//POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz
	.validate()
	.then(
		function(err){
			if (err){
				res.render('quizes/new', {quiz:quiz, errors: err.errors})
			}else{
				// guarda en BD los campos pregunta y respuesta de quiz
				quiz.save({fields: ["pregunta", "respuesta","tipo"]}).then(function(){
					res.redirect('/quizes');
				})
			}
		}
	)
}

//GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz:quiz, errors: []} );
	})
}

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta === req.quiz.respuesta) {
			res.render('quizes/answer',
						{ quiz: req.quiz, respuesta : 'Correcto', errors:[] });
		} else {
			res.render('quizes/answer',
						{ quiz: req.quiz, respuesta: 'Incorrecto', errors:[] });
		}
		})
	}


// GET /quizes
exports.index = function(req,res,next) {
	var busqueda = req.query.texto_busqueda
	console.log('valor de busqueda : ' + busqueda)
	if (busqueda === undefined) {
		models.Quiz.findAll().then(
				function(quizes) {
					res.render('quizes/index.ejs', { quizes:quizes, errors: [] });
				}
		).catch(function(error) { next(error); })
	} else {
			models.Quiz.findAll( {where: ["pregunta like ?", "%" + busqueda.replace(" ", "%") + "%"], order: ["pregunta"] } ).then(
					function(quizes) {
						res.render('quizes/index.ejs', { quizes:quizes, errors: [] });
					}
			).catch(function(error) { next(error); })
	}
}

// Autoload - factoriza el codigo si ruta incluye : quizId
exports.load = function(req, res, next, quizId){
		models.Quiz.findById(quizId).then(
			function(quiz) {
				if (quiz) {
					req.quiz = quiz;
					next();
				} else {
					next(new Error('No existe quizId='+ quizId));
				}
			}
		).catch(function(error) { next(error); });
};

// Delete /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error) { next(error) } );
}

// Edit /quizes/id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload de instancia quiz
  res.render('quizes/edit',  { quiz:quiz ,errors: [] })
}

exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('quizes/edit', { quiz: req.quiz, errors: err.errors });
			} else {
				req.quiz
				.save( { fields: ["pregunta", "respuesta"] } )
				.then( function() {res.redirect('/quizes');} );
			}
		}
	)
}

exports.autor = function(req, res) {
		var quiz = req.quiz;
		res.render('autor',{ quiz:quiz ,errors: [] });
}
