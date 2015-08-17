var models = require('../models/models');

exports.load = function(req, res, next, commentId) {
  console.log('Autoload de comment.................................'+commentId)
  models.Comment.find({
            where: { id: Number(commentId)	}
  }).then(
    function(comment) {
      if (comment) {
        req.comment = comment;
        next();
      } else {
        next(new Error('No existe commentId='+ commentId));
      }
    }
  ).catch(function(error) { next(error); });
}

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

exports.publish = function(req, res) {
  req.comment.publicado = true
  console.log("Proceso de publicacion activo............................")
  req.comment.save( {fields:["publicado"] })
  .then ( function(){ res.redirect('/quizes/' + req.params.quizId); } )
  .catch( function(error){next(error)});
}
