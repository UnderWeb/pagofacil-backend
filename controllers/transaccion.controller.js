'use strict';
import { Usuario, Transaccion } from '../models';

// Objeto transacción.
var transaction = new Transaccion();

// Objeto a exportar.
const transaccionCtrl = {};

/**
 * Registra una nueva transacción.
 */
transaccionCtrl.registrar = async (request, response, next) => {
    // Obtiene los parámentos de registro.
    const params = request.body;

    // Variable que guarda la cantidad de comisión de la transacción.
    let total = 0;

    // Comprueba el ingreso de los datos mínimos.
    if (params.codigo 
        && params.tipo_moneda 
        && params.monto 
        && params.detalle 
        && params.comercio 
        && params.referidor
    ) {
        // Guarda la cantidad de comisión de la transacción en la variable total.
        await Usuario.findById(params.referidor).then((usuario) => {
            total = usuario.comision * params.monto;
        });
        // Asignar valores al objeto transacción.
        transaction.idTrx = params.codigo;
        transaction.tipo_moneda = params.tipo_moneda;
        transaction.monto = params.monto;
        transaction.total_a_pagar = total;
        transaction.detalle = params.detalle;
        transaction.comercio = params.comercio;
        transaction.fecha = Date.now();
        transaction.pagada = 'N';
        transaction.fkid_usuario = params.referidor;

        // Comprueba la existencia de la transacción.
        await Transaccion.findOne({idTrx: transaction.idTrx}, (err, issetTransaction) => {
            if (err) {
                response.status(500).send({Status: "NOOK", error: err});
            } else {
                if (!issetTransaction) {
                    transaction.save((err, transactionStore) => {
                        if (err) {
                            response.status(500).send({Status: "NOOK"});
                        } else {
                            if (!transactionStore) {
                                response.status(404).send({Status: "NOOK"});
                            } else {
                                response.status(200).send({IdTrx: transactionStore.idTrx, Status: "OK"});
                            }
                        }
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
 * Actualiza una transacción que ha sido pagada.
 */
transaccionCtrl.pagar = async (request, response, next) => {
    // Obtiene el código de la transacción a actualizar.
    const codigo = request.params.codigo;

    // Obtiene los parámentos de actualización.
    const params = request.body;

    // Comprueba el ingreso de los datos mínimos.
    if (params.pagada && params.pagada == 'Y') {
        // Actualiza la transacción pagada.
        return await Transaccion.findOneAndUpdate(
            {idTrx: codigo},
            {
                $set: {
                    pagada: "Y"
                }
            },
            {
                new: true
            }
        ).then(transactionUpdated => {
            return response.status(200).send({
                IdTrx: transactionUpdated.idTrx,
                Status: "OK",
                Monto: transactionUpdated.monto
            });
        }).catch(err => {
            return response.status(500).send({Status: "NOOK"});
        });
    } else {
        response.status(200).send({Status: "NOOK"});
    }
}

// Exporta el objeto controller de la transacción.
module.exports = transaccionCtrl;
