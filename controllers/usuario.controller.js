'use strict';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import moment from 'moment';
import { Usuario, Transaccion } from '../models';

// Objeto usuario.
var user = new Usuario();

// Objeto a exportar.
const usuarioCtrl = {};

/**
 * Registro de usuarios.
 */
usuarioCtrl.registrar = async (request, response, next) => {
    // Obtiene los parámentos de registro.
    const params = request.body;

    // Comprueba el ingreso de los datos mínimos.
    if (params.nombres 
        && params.primer_apellido 
        && params.tipo_identidad 
        && params.email 
        && params.password 
        && params.fnacimiento 
        && params.cuentas_bancarias 
        && (params.rut || params.rut_provisorio || params.pasaporte)
    ) {
        // Formatea la entrada del tipo de documento de identificación del usuario.
        user.tipo_documento_identidad = params.tipo_identidad;
        let run = null;
        let rut = null;
        let dv = null;
        let rutProvisorio = null;
        let dvProvisorio = null;
        let pasaporte = null;

        switch (user.tipo_documento_identidad) {
            case 'RUT':
                run = params.rut.split('.').join('');
                run = run.split('-');
                rut = run[0];
                dv = run[1];
            break;
            case 'RUT_PROVISORIO':
                run = params.rut.split('.').join('');
                run = run.split('-');
                rutProvisorio = run[0];
                dvProvisorio = run[1];
            break;
            default:
                pasaporte = params.pasaporte.trim();
            break;
        }

        // Formatea la fecha de nacimiento mediante moment para ser guardada en base de datos.
        const fnacimiento = moment(moment(new Date(params.fnacimiento)).format('YYYY-MM-DD')).toDate();

        // Asigna los valore al objeto usuario.
        user.rut = rut;
        user.dv = dv;
        user.rutprovisorio = rutProvisorio;
        user.dvprovisorio = dvProvisorio;
        user.pasaporte = pasaporte;
        user.nombres = params.nombres;
        user.primer_apellido = params.primer_apellido;
        user.segundo_apellido = params.segundo_apellido;
        user.fecha_nacimiento = fnacimiento;
        user.sexo = params.sexo;
        user.email = params.email;
        user.status = 'PENDIENTE';
        user.comision = 0;
        user.rol = 'REFERIDOR';
        user.bancos = params.cuentas_bancarias;

        // Comprueba la existencia del usuario mediante su correo.
        // Esto mismo se puede replicar con la identificación de la persona.
        await Usuario.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
            if (err) {
                response.status(500).send({Status: "NOOK"});
            } else {
                if (!issetUser) {
                    bcrypt.hash(params.password, 10, function(err, hash) {
                        user.password = hash;
                        user.save((err, userStore) => {
                            if (err) {
                                response.status(500).send({Status: "NOOK"});
                            } else {
                                if (!userStore) {
                                    response.status(404).send({Status: "NOOK"});
                                } else {
                                    response.status(200).send({Status: "OK", ID: userStore._id});
                                }
                            }
                        });
                    });
                } else {
                    response.status(200).send({Status: "NOOK"});
                }
            }
        });
    } else {
        response.status(200).send({Status: "NOOK"});
    }
};

/**
 * Activa un nuevo usuario en el sistema.
 */
usuarioCtrl.activar = async (request, response, next) => {
    // Obtiene el id del usuario a actualizar.
    const userId = request.params.id;

    // Obtiene los parámentos de actualización.
    const params = request.body;

    // Comprueba el ingreso de los datos mínimos.
    if (params.comision) {
        // Activa al usuario.
        return await Usuario.findByIdAndUpdate(
            userId,
            {
                $set: {
                    status: "ACTIVO",
                    comision: params.comision / 100
                }
            },
            {
                new: true
            }
        ).then(userUpdated => {
            return response.status(200).send({
                IdUsuario: userUpdated._id,
                Status: "OK",
                Comisión: userUpdated.comision
            });
        }).catch(() => {
            return response.status(500).send({Status: "NOOK"});
        });
    } else {
        response.status(200).send({Status: "NOOK"});
    }
}

/**
 * Obtiene los daldos mensuales de los usuarios.
 */
usuarioCtrl.saldo = async (request, response, next) => {
    // Obtiene el id del usuario a obtener los datos.
    const userId = request.params.id;

    // Comprueba la existencia del usuario.
    return await Usuario.findById(userId, ((err, res) => {
        if (err || !res) {
            return response.status(500).send({Status: "NOOK"});
        }

        // Se formatea el id del usuario para ser utilizado en la agregación.
        const id = mongoose.Types.ObjectId(res._id);

        // Obtiene los saldos de un usuario específico.
        Transaccion.aggregate([
            {
                $match: { fkid_usuario: id }
            },
            {
                $project: {
                    fecha: 1,
                    Acumulado: "$total_a_pagar",
                    Pagada: {$cond: [{$eq: [ "$pagada", "Y" ]}, '$total_a_pagar', 0]},
                    APagar: {$cond: [{$eq: [ "$pagada", "N" ]}, '$total_a_pagar', 0]}
                }
            },
            {
                $group: {
                    "_id": {
                        month: { $month : "$fecha" },
                        year: { $year : "$fecha" }
                    },

                    "ComisionAcumulada": { $sum: "$Acumulado" },
                    "ComisionPagada": {$sum: '$Pagada'},
                    "SaldoAPagar": {$sum: '$APagar'}
                }
            }
        ],
        ((err, result) => {
            if (err) throw err;
            let data = [];
            let Saldo = {};

            // Se recorre el resultado de la agregación para mostrar en pantalla el formato solicitado.
            result.forEach(element => {
                const mes = (element._id.month < 10) ? '0' + element._id.month : '' + element._id.month;
                const agno = (element._id.year < 10) ? '0' + element._id.year : '' + element._id.year;
                const fecha = mes + agno;
                Saldo = {
                    [fecha]: {
                        "ComisionAcumulada": element.ComisionAcumulada,
                        "ComisionPagada": element.ComisionPagada,
                        "SaldoAPagar": element.SaldoAPagar
                    }
                };
                data.push(Saldo);
            });

            response.status(200).send({
                IdUsuario: userId,
                Saldo: data
            });
        }));
    }));
}

// Exporta el objeto controller del usuario.
module.exports = usuarioCtrl;
