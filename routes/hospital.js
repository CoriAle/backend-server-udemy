var express = require('express');
var app=express();

var Hospital = require('../models/Hospital');
var mdAutenticacion = require('../middlewares/autenticacion');


/*===================================================*
	PETICIÓN OBTENER HOSPITALES
 *===================================================*/

app.get('/', (req, res)=>{

	Hospital.find({}).
	exec((err, hospitales)=>{
		if(err){
			return res.status(500).json({
				ok: false,
				errors:err,
				mensaje: "Error cargando hospitales"
			});
		}//End if

		return res.status(200).json({
			ok: true,
			hospitales: hospitales
		});
	});
});

/*===================================================*
	PETICIÓN CREAR HOSPITAL
 *===================================================*/
app.post('/', mdAutenticacion.verificaToken, (req,  res)=>{
	var body = req.body;
	var hospital = new Hospital({
		nombre: body.nombre,
		img: body.img,
		usuario: req.usuario
	});
	//Guardar en la BD
	hospital.save((err, hospital)=>{
		if(err){
			return res.status(400).json({
				ok: false,
				errors: err,
				mensaje: 'Error al crear hospital'
			});
		}//Fin if

		return res.status(201).json({
			ok: false,
			hospital: hospital
		});
	});

});
/*===================================================*
	PETICIÓN ACTUALIZAR HOSPITAL
 *===================================================*/
 app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{
 	var id = req.params.id;
 	var body = req.body;

 	Hospital.findById(id, (err, hospital)=>{
 		if(err){
 			return res.status(500).json({
 				ok: false,
 				errors: err,
 				mensaje: "Ocurrión un problema al recuperar hospital"
 			});
 		}//endif
 		if(!hospital){
 			return res.status(404).json({
 				ok: false,
 				errors: {message: "No existe un hospital con este ID"},
 				mensaje: "No existe un hospital con ese id "+ id +"."
 			});
 		}//end if
 		//Actualizar el hospital
 		hospital.nombre = body.nombre;
 		hospital.save((err, hospital)=>{
 			if(err){
	 			return res.status(500).json({
	 				ok: false,
	 				errors: err,
	 				mensaje: "Ocurrión un problema al actualizar"
	 			});
	 		}//endif
	 		return res.status(200).json({
	 			ok: true,
	 			hospital: hospital
	 		});
 		});
 		
 	});

 });

/*===================================================*
	PETICIÓN ELIMINAR HOSPITAL
 *===================================================*/
 app.delete('/:id', mdAutenticacion.verificaToken,(req, res)=>{
 	var id = req.params.id;
 	console.log('id', id);
 	Hospital.findByIdAndRemove(id, (err, hospital)=>{
 		if(err){
 			return res.status(500).json({
 				ok: false,
 				errors: err,
 				mensaje: 'Ocurrión un error al eliminar hospital'
 			});
 	
 		}//Fin If
		if(!hospital){
			return res.status(404).json({
				ok: false,
				errors: {message: "No existe un hospital con este ID"},
				mensaje: 'No existe un hospital con ese id'
			});
 		}//endif

 		return res.status(200).json({
 			ok: true,
 			hospital: hospital
 		});
 	});
 });
module.exports = app;