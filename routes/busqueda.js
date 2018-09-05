var express = require('express')
var app = express();
var Hospital = require('../models/Hospital');
var Medico = require('../models/Medico');
var Usuario = require('../models/usuario');



/*===================================================*
	BÚSQUEDA POR COLECCIÓN
 *===================================================*/

 app.get('/coleccion/:tabla/:busqueda', (req, res)=>{
 	var busqueda = req.params.busqueda;
 	var regex =  new RegExp(busqueda, 'i')
 	var tabla = req.params.tabla;
 	console.log(tabla)
 	var promesa;


 	switch(tabla){
 		case 'usuarios':
 			promesa = buscarUsuarios(busqueda, regex);
 			break;
 		case 'medicos':
 			promesa = buscarMedicos(busqueda, regex);
 			break;
 		case 'hospitales':
 			promesa = buscarHospitales(busqueda, regex);
 			break;
 		default:
 			return res.status(400).json({
 				ok: false,
 				mensaje: 'Los tipos de búsqueda solo son: usuarios, medicos y hospitales',
 				error: {message: 'tipo de tabl/colección no válido'}
 			});
 	}

 	promesa.then(data=>{
 		return res.status(200).json({
				ok: true,
				[tabla]: data
		});
 	});
 	
 });
 /*===================================================*
	BÚSQUEDA GENERAL
 *===================================================*/
app.get('/todo/:busqueda', (req, res, next)=>{

	var busqueda = req.params.busqueda;
	var regex =  new RegExp(busqueda, 'i')

	Promise.all([
		buscarHospitales(busqueda, regex), 
		buscarMedicos(busqueda, regex),
		buscarUsuarios(busqueda, regex)
	])//Recibe un arreglo de promesas
	.then(respuestas=>{ //Arreglo de los datos del resolve de cad apromesa
		return res.status(200).json({
				ok: true,
				hospitales: respuestas[0],
				medicos: respuestas[1],
				usuarios: respuestas[2]
		});
	}); //finthen


});

function buscarHospitales(busqueda, regex){
	
	return new Promise((resolve, reject)=>{
		Hospital.find({nombre: regex})
		.populate('usuario', 'nombre email')
		.exec((err, hospitales)=>{
			if(err){
				reject('Error al carcar hospitales', err)
			}
			else
			{
				resolve(hospitales)
			}
		});
	});
	
}

function buscarMedicos(busqueda, regex){
	
	return new Promise((resolve, reject)=>{
		Medico.find({nombre: regex})
		.populate('usuario', 'nombre email')
		.populate('hospital')
		.exec((err, medicos)=>{
			if(err){
				reject('Error al carcar hospitales', err)
			}
			else
			{
				resolve(medicos)
			}
		});
	});
	
}

function buscarUsuarios(busqueda, regex){
	
	return new Promise((resolve, reject)=>{
		Usuario.find({}, 'nombre email role')
			.or([{'nombre': regex}, {'email': regex}]) //Arreglo de condiciones
			.exec((err, usuarios)=>{
				if(err){
					reject('Error al cargar usuarios', err)
				}//endif
				else{
					resolve(usuarios)
				}//endelse
			}); //endexec
		}); //EndPromise
}
module.exports = app;