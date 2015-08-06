var models = require('../models/models');

exports.new = function(req, res) {
  res.render('comments/new.ejs', { quizId: req.params.quizId, errors: [] } )
}

exports.create = function(req, res) {

  var comment = models.Comment.build(
    { texto: req.body.comment.texto,
      QuizId: req.params.quizId
    });

    comment
    .validate()
    .then(
      function(err){
        if (err) {
          res.render('comments/new.ejs', {comment: comment, errors: err.errors})
        } else {
          comment
          .save()
          .then(  function () {res.redirect('/quizes/'+req.params.quizId)})
        }       //res.redirect: redireccion Http a lista de preguntas
      }
    ).catch(  function(error) {next(error)});
}