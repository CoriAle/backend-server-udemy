var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
	nombre: {type: String, required:[true, 'El nombre es necesario']},
	img:{type:String, required:false},
	usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'}, //Relación con la colección de usuarios

},{collection:'hospitales'}); //Para indicar como quiero que se llame la colección en mongoose

module.exports = mongoose.model('Hospital', hospitalSchema);