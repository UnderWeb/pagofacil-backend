'use strict';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// Carga de rutas.
const usuario_routes = require('../routes/usuario');
const transaccion_routes = require('../routes/transaccion');

app.use(bodyParser.urlencoded({extended: false}));

// Convierte lo que trae el body a json.
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Allow-Request-Method');
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
    response.header('Allow', 'GET, POST, OPTIONS, PUT');
    next();
});

// Rutas base * (api es prefijo).
app.use('/api', usuario_routes);
app.use('/api', transaccion_routes);

// Exportación del módulo.
module.exports = app;