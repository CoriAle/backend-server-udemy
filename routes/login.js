var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();
var Usuario = require('../models/usuario');

var SEED = require('../config/config').SEED;

app.post('/',(req, res)=>{
	var body = req.body;
	Usuario.findOne({email: body.email},(err, usuarioDB)=>{

		if(err){
			return res.status(500).json({
			ok: false,
			mensaje: 'Error al buscar usuarios',
			errors: err
			});
		}// end if
		if(!usuarioDB){
			return res.status(404).json({
			ok: false,
			mensaje: 'Credenciales incorrectas - email',
			errors: {message: "Credenciales incorrectas - email"}
			});
		}//end if

		if(!bcrypt.compareSync(body.password, usuarioDB.password)){
			return res.status(404).json({
			ok: false,
			mensaje: 'Credenciales incorrectas - password',
			errors: {message: "Credenciales incorrectas - password"}
			});
		}

		//Crear un token
		var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400})//4 horas
		usuarioDB.password = ":)"
		return res.status(200).json({
					ok: true,
					usuario: usuarioDB,
					token: token,
					id: usuarioDB._id
				
				});
	});
	
});
module.exports = app;