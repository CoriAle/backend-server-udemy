var express = require('express')
var app = express();
//Rutas
//Despues de ejecutra, se ejecuta la siguiente instrucción
app.get('/', (req, res, next)=>{
	res.status(200).json({
		ok: true,
		mensaje: 'Petición realizada correctamente'
	});
});

module.exports = app;