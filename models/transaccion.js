'use strict';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Transacciones.
 */
const TransaccionSchema = new Schema({
    idTrx: {
        type: String,
        required: true,
        index: {unique: true},
        trim: true
    },
    tipo_moneda: {
        type: String,
        enum: ['CLP', 'USD', 'EURO'],
        required: true,
        default: 'CLP'
    },
    monto: {
        type: Number,
        required: true,
        min: 0
    },
    total_a_pagar: {
        type: Number,
        required: true,
        min: 0
    },
    detalle: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    comercio: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    fecha: {
        type: Date,
        required: true
    },
    pagada: {
        type: String,
        enum: ['N', 'Y'],
        required: true,
        default: 'N'
    },
    fkid_usuario: {
        type: Schema.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

/**
 * Exportación del esquema Transaccion.
 */
module.exports = mongoose.model('Transaccion', TransaccionSchema, 'transacciones');
