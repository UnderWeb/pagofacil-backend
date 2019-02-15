'use strict';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Bancos que ha registrado el usuario con sus cuentas.
 */
const CuentaBancariaSchema = new Schema({
    fkid_banco: {
        type: Schema.ObjectId,
        ref: 'Banco',
        required: true
    },
    tipo_cuenta: {
        type: String,
        enum: ['CORRIENTE', 'AHORRO', 'VISTA', 'CHEQUERA ELECTRÓNICA', 'RUT'],
        required: true,
        default: 'CORRIENTE'
    },
    numero_cuenta: {
        type: Number,
        required: true,
        min: 0
    },
    email_cuenta: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
});

/**
 * Usuarios del sistema.
 */
const UsuarioSchema = new Schema({
    tipo_documento_identidad: {
        type: String,
        enum: ['RUT', 'PASAPORTE'],
        required: true,
        default: 'PASAPORTE'
    },
    rut: {
        type: Number,
        required: false,
        default: null
    },
    dv: {
        type: String,
        required: false,
        uppercase: true,
        trim: true,
        default: null
    },
    rutprovisorio: {
        type: Number,
        required: false,
        default: null
    },
    dvprovisorio: {
        type: String,
        required: false,
        uppercase: true,
        trim: true,
        default: null
    },
    pasaporte: {
        type: String,
        required: false,
        uppercase: true,
        trim: true,
        default: null
    },
    nombres: {
        type: String,
        required: true,
        trim: true
    },
    primer_apellido: {
        type: String,
        required: true,
        trim: true
    },
    segundo_apellido: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    fecha_nacimiento: {
        type: Date,
        required: true
    },
    sexo: {
        type: String,
        enum: ['M', 'F', null],
        required: false,
        default: null
    },
    email: {
        type: String,
        required: true,
        index: { unique: true },
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDIENTE', 'ACTIVO'],
        required: true,
        default: 'PENDIENTE'
    },
    comision: {
        type: Number,
        required: true,
        default: 0
    },
    rol: {
        type: String,
        enum: ['REFERIDOR', 'REFERIDO'],
        required: true,
        default: 'REFERIDOR'
    },
    bancos: [CuentaBancariaSchema],
    token: {
        type: String,
        required: false,
        default: null,
        trim: true
    }
});

/**
 * Exportación del esquema Usuario.
 */
module.exports = mongoose.model('Usuario', UsuarioSchema);
