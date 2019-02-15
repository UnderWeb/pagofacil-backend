'use strict';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Bancos.
 * Esquema creado debido a que si existen nuevos bancos o se fusionan, es mejor que sea mantenible 
 * para que el sistema sea más escalable.
 * Por otro lado, considerar que un usuario puede estar en más de un banco.
 * En esta ocasión el único campo que tendrá será el nombre.
 * Otros campos que se pueden agregar es si está vigente o no, un sub documento de sucursales, etc., 
 * pero esto no es necesario para lo pedido.
 */
const BancoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    }
});

/**
 * Exportación del esquema Banco.
 */
module.exports = mongoose.model('Banco', BancoSchema, 'bancos');
