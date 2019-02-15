'use strict';

// Carga las variables en el archivo process.env
import * as dotenv from 'dotenv';
dotenv.load({ path: '.env' });

// Constantes de la aplicación.
const SECRET = process.env.APP_KEY;
const SERVER_PORT = process.env.SERVER_PORT;
const MONGODB_URI = process.env.DB_HOST + ":" + process.env.DB_PORT;
const DATABASE = process.env.DB_DATABASE;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

// Exportación de las constantes de la aplicación.
export {
    SECRET,
    SERVER_PORT,
    MONGODB_URI,
    DATABASE,
    USERNAME,
    PASSWORD
};
