'use strict';

// Importa la librería del ORM Mongoose.
import mongoose from 'mongoose';

// Importa las constantes del sistema referente a la conexión a la base de datos.
import { MONGODB_URI, DATABASE, USERNAME, PASSWORD } from './environment';

/**
 * Conexión a base de datos mongodb.
 */
const connection = mongoose.connect(
    "mongodb://" + USERNAME + ":" + PASSWORD + "@" + MONGODB_URI + "/" + DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
).then(() => {
    console.log('Waiting for connections on DB...');
}).catch(err => console.log(err));

/**
 * Exportar conexión.
 */
module.exports = connection;
