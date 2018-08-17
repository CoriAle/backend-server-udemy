var express = require('express');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();


var Usuario = require('../models/usuario');
// ==========================
//Obtener todos los usuarios
//============================
app.get('/', (req, res, next)=>{
	
		Usuario.find({},'nombre email img role')
			.exec(

				(err, usuarios)=>{
				if(err){
					return res.status(500).json({
					ok: false,
					mensaje: 'Error cargando usuarios',
					errors: err
					});
				}// end if
				return res.status(200).json({
					ok: true,
					usuarios: usuarios
				
				});
			});


});

// ==========================
//Verificar token
//============================
/*
app.use('/', (req, res, next)=>{
	var token = req.query.token;
	jwt.verify(token, SEED,(err, decoded)=>{ //Verificar si firma es válida
		if(err){
			return res.status(401).json({
			ok: false,
			mensaje: 'Token incorrecto',
			errors: err
			});
		}// end if
		next();//Puede continuar con la siguiente función
	});
});*/

// ==========================
//Crear un nuevo usuario 
//============================
app.post('/', mdAutenticacion.verificaToken,(req, res)=>{
	var body = req.body;
	//Crear nuevo usuario
	var usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		img: body.img,
		role: body.role
	});
	//Guardar en bd
	usuario.save((err, usuarioGuardado)=>{
		if(err){
			return res.status(400).json({
			ok: false,
			mensaje: 'Error al crear usuarios',
			errors: err
			});
		}// end if

		return res.status(201).json({
			ok: true,
			usuario: usuarioGuardado,
			usuariotoken: req.usuario
		});
	});
	
	

});

// ===========================
//Actualizar usuario 
//============================
app.put('/:id',mdAutenticacion.verificaToken, (req, res)=>{
	var id = req.params.id;
	var body=req.body;
	Usuario.findById(id, (err, usuario)=>{
		if(err){
			return res.status(500).json({
			ok: false,
			mensaje: 'Error al recuperar usuario',
			errors: err
			});
		}// end if
		if(!usuario){
			return res.status(404).json({
			ok: false,
			mensaje: 'El usuario con el id'+id+'no existe.',
			errors: {message: "No existe un usuario con este ID"}
			});
		}//end if
		usuario.nombre =  body.nombre;
		usuario.email =  body.email;
		usuario.role =  body.role;

		usuario.save((err, usuarioGuardado)=>{
			if(err){
				return res.status(400).json({
				ok: false,
				mensaje: 'Error al actualizar usuario',
				errors: err
				});
			}// end if
			usuarioGuardado.password = ":)"
			return res.status(200).json({
				ok: true,
				usuario: usuarioGuardado
			});
		});
		
	});
	
});

// ===========================
//Eliminar usuario 
//============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
	var id = req.params.id;
	
	Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
		if(err){
			return res.status(500).json({
			ok: false,
			mensaje: 'Error al borrar usuarios',
			errors: err
			});
		}// end if
		if(!usuarioBorrado){
			return res.status(404).json({
			ok: false,
			mensaje: 'El usuario con el id'+id+'no existe.',
			errors: {message: "No existe un usuario con este ID"}
			});
		}//end if
		return res.status(200).json({
			ok: true,
			usuario: usuarioBorrado
		});
	});
});
module.exports = app;