var users = { admin:  {id:1, username:"admin", password:"1234"},
              carlos: {id:2, username:"carlos", password:"5678"}
            };

// comprueba si el usuario esta registrado en users
// si autenticacion falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback) {
  if (users[login]) {
    if (password === users[login].password){
        callback(null, users[login]);
    }else{
        callback(new Error('password erróneo'));
    }
  }else{
    callback(new Error('No existe el usuario'));
  }
}
