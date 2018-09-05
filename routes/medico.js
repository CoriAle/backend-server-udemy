var express = require('express');
var app = express();
var Medico = require('../models/Medico');

var mdAutenticacion = require('../middlewares/autenticacion');


/*===================================================*
	PETICIÓN OBTENER MEDICOS
 *===================================================*/
app.get('/', (req, res)=>{
	var desde = req.query.desde || 0;
	desde = Number(desde);

	Medico.find({})
	.skip(desde) //Comenzar desde
	.limit(5)
	.populate('usuario', 'nombre email')
	.populate('hospital')
	.exec((err, medicos)=>{
		if(err){
			return res.status(500).json({
				ok: false,
				errors: err,
				mensaje: 'Error cargando medicos'

			});
		}//endif

		Medico.count({},(err, conteo)=>{
			return res.status(200).json({
				ok: true,
				medicos: medicos,
				total: conteo
			});
		});
		
	});
});

/*===================================================*
	PETICIÓN CREAR MÉDICO
 *===================================================*/
 app.post('/', mdAutenticacion.verificaToken, (req, res)=>{
 	var body = req.body;
 	var usuario = req.usuario;
 	var medico = new Medico({
 		nombre:  body.nombre,
		usuario: usuario,
		hospital: body.hospital
 	});

 	//Guardar en la BD
 	medico.save((err, medico)=>{
 		if(err){
 			return res.status(400).json({
 				ok: false,
 				error: err,
 				mensaje: 'Error al guardar médico'
 			});
 		}

 		return res.status(201).json({
 			ok: true,
 			medico: medico
 		});
 	});
 });

 /*===================================================*
	PETICIÓN ACTUALIZAR MÉDICO
 *===================================================*/

 app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{
 	var id = req.params.id;
 	var body = req.body;
 	Medico.findById(id, (err, medico)=>{
 		if(err){
 			return res.status(500).json({
 				ok: false,
 				errors: err,
 				mensaje: 'Error al recuperar médico'
 			});
 		}//endif
 		if(!medico){
 			return res.status(404).json({
 				ok: false,
 				errors:{message:"No existe un médico con ese id"},
 				mensaje: "No existe un médico con ese id."
 			});
 		}//endif

 		medico.nombre =  body.nombre;
 		medico.hospital = body.hospital;
 		medico.usuario = req.usuario._id;

 		medico.save((err, medico)=>{
 			if(err){
 				return res.status(500).json({
	 				ok: false,
	 				errors: err,
	 				mensaje: 'Error al actualizar médico'
 				});
 			}//endif
 			return res.status(200).json({
 				ok: true,
 				medico: medico
 			});

 		});
 	})
 });
module.exports = app;

 /*===================================================*
	PETICIÓN ACTUALIZAR MÉDICO
 *===================================================*/

 app.delete('/:id', (req, res)=>{
 	var id = req.params.id;
 	Medico.findByIdAndRemove(id, (err, medico)=>{
 		if(err){
 			return res.status(500).json({
 				ok: false,
 				errors: err,
 				mensaje: "Error al eliminar médico."
 			});
 		}//endif
 		if(!medico){
 			return res.status(400).json({
 				ok: false,
 				errors: {message: "No existe un médico con ese id"},
 				mensaje: "No existe un médico con ese id"
 			});
 		}//endif
 		return res.status(200).json({
 			ok: true,
 			medico: medico
 		});
 	});
 });