'use strinct';
import connection from './database';
import { SERVER_PORT } from './environment';
import app from './app';

// Puerto de la api.
const PORT = process.env.port || SERVER_PORT;

// Servidor nodejs.
const server = app.listen(PORT, () => {
    console.log(`Server listening for request on port ${PORT}...`);
});

export default server;
