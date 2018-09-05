const express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');
const app = express();
var Usuario = require('../models/usuario');
var Medico = require('../models/Medico');
var Hospital = require('../models/Hospital');
 
// default options
app.use(fileUpload());

//Rutas
//Despues de ejecutra, se ejecuta la siguiente instrucción


app.put('/:tipo/:id', (req, res, next)=>{
	var tipo = req.params.tipo;
	var id = req.params.id;

	//tipos de coleccion
	var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
	if(tiposValidos.indexOf(tipo)<0){
		return res.status(400).json({
					ok: false,
					mensaje: 'Tipo de colección no es válida.',
					errors: {message: "Tipo de colección no es válida."}
			});
	}
	if(!req.files){
		return res.status(400).json({
					ok: false,
					mensaje: 'No seleccionó  nada',
					errors: {message: "Debe seleccionar una imagen"}
			});
	}

	//Obtener nombre del archivo
	var archivo = req.files.imagen;
	var nombreCortado  = archivo.name.split('.');
	var extensionArchivo = nombreCortado[ nombreCortado.length-1];

	//Solo estas extenciones aceptamos
	var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

	if(extensionesValidas.indexOf(extensionArchivo)<0){
		return res.status(400).json({
					ok: false,
					mensaje: 'Extensión no válida',
					errors: {message: "Las extensiones válidas son" + extensionesValidas.join(', ')}
			});
	}
	//NOMBRE DE ARCHIVO PERSONALIZADO
	var nombreArchivo  =  `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
	//Mover el archivo del temporal a un path
	var path = `./uploads/${tipo}/${nombreArchivo}`;

	archivo.mv(path, err=>{
		if(err){
			return res.status(500).json({
					ok: false,
					mensaje: 'Error al mover archivo',
					errors: err
			});
		}
	subirPorTipo(tipo, id, nombreArchivo, res);

	/*return res.status(200).json({
		ok: true,
		mensaje: 'Archivo movido',
		extensionArchivo: extensionArchivo
	});*/
		
	});
	
});
function subirPorTipo(tipo, id, nombreArchivo, res){
	if(tipo ==='usuarios'){
		if(!usuario){
			return res.status(400).json({
					ok: true,
					mensaje: 'Usuario no existe',
					errors: {message: "Usuario no existe"}
				});
		}
		Usuario.findById(id, (err, usuario)=>{
			var pathViejo = './uploads/usuarios/'+usuario.img;
			//Si existe elimina la imagen anterior
			if(fs.existsSync(pathViejo)){
				fs.unlink(pathViejo);
			}

			usuario.img = nombreArchivo;
			usuario.save((err, usuarioActualizado)=>{
			usuarioActualizado.password = ':)';
			return res.status(200).json({
					ok: true,
					mensaje: 'Imagen de usuario actualizada',
					usuario: usuarioActualizado
				});
			});
		});
	}
	if(tipo ==='medicos'){
		Medico.findById(id, (err, medico)=>{
			if(!medico){
			return res.status(400).json({
					ok: true,
					mensaje: 'Médico no existe',
					errors: {message: "Médico no existe"}
				});
		}
			var pathViejo = './uploads/medicos/'+medico.img;
			//Si existe elimina la imagen anterior
			
			if(fs.existsSync(pathViejo)){
				console.log("existe")
				fs.unlink(pathViejo);
			}
			medico.img = nombreArchivo;
			medico.save((err, medicoActualizado)=>{
				return res.status(200).json({
					ok: true,
					mensaje: 'Imagen de medico actualizada',
					medico: medicoActualizado
				});
			});
		});
	}
	if(tipo ==='hospitales'){
		Hospital.findById(id, (err, hospital)=>{
			if(!hospital){
			return res.status(400).json({
					ok: true,
					mensaje: 'Hospital no existe',
					errors: {message: "Hospital no existe"}
				});
		}
			var pathViejo = './uploads/hospitales/'+hospital.img;
			//Si existe elimina la imagen anterior
			if(fs.existsSync(pathViejo)){
				fs.unlink(pathViejo);
			}
			hospital.img = nombreArchivo;
			hospital.save((err, hospitalActualizado)=>{
				return res.status(200).json({
					ok: true,
					mensaje: 'Imagen de hospital actualizada',
					hospital: hospitalActualizado
				});
			});
		});
	}

}

module.exports = app;