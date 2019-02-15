'use strict';
import express from 'express';
import { transaccion } from '../controllers';

var api = express.Router();

api.post('/transaccion/registrar', transaccion.registrar);
api.put('/transaccion/pagar/:codigo', transaccion.pagar);

module.exports = api;
