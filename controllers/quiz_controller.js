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
				quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
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
		if (req.query.respuesta === quiz.respuesta) {
			res.render('quizes/answer',
						{ quiz: quiz, respuesta : 'Correcto', errors:[] });
		} else {
			res.render('quizes/answer',
						{ quiz:quiz, respuesta: 'Incorrecto', errors:[] });
		}
		})
	}


// GET /quizes
exports.index = function(req,res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', {quizes:quizes, errors: [] });
	})
}
