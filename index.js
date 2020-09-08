
const express = require('express');
const path = require('path');

require('dotenv').config();


//db config
const {dbConnection} = require('./database/config')
dbConnection();

//app de express
const app = express();

//lectura y parseo del body
app.use(express.json());

//node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');


//Path público
const publicPath = path.resolve(__dirname, 'public');

//mis rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/mensajes', require('./routes/mensajes'));


app.use(express.static(publicPath));

server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);

    console.log('servidor corriendo en puerto!!!', process.env.PORT);
});

