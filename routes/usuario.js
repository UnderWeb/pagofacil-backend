'use strict';
import express from 'express';
import { usuario } from '../controllers';

var api = express.Router();

api.post('/usuario/registrar', usuario.registrar);
api.put('/usuario/activar/:id', usuario.activar);
api.get('/usuario/saldo/:id', usuario.saldo);

module.exports = api;
