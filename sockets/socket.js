const {io} = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const{comprobarJWT} = require('../helpers/jwt');
const{usuarioConectado,usuarioDesconectado, grabarMensaje} = require('../controller/socket');
const { emit } = require('../models/usuario');

const bands = new Bands();
console.log('init server');

// bands.addBand(new Band('Queen'));
// bands.addBand(new Band('Bon jovi'));
// bands.addBand(new Band('Héroes del silencio'));
// bands.addBand(new Band('Metallica'));
// bands.addBand(new Band('Kiss'));


//console.log(bands);



//mensajes de sockets
io.on('connection', client => {

    console.log('cliente conectado');
   // console.log(client.handshake.headers);

   //Veriicar autenticacion con x-token
    const [valido, uid]= comprobarJWT(client.handshake.headers['x-token']);
    if(!valido){return client.disconnect()}

    //Si el cliente está autorizado cambio a online
    console.log('cliente autorizado');
    usuarioConectado(uid);

    //ingresar al usuario a una sala
    //sala global Broadcast
    //sala por cliente.id
    client.join(uid);

    //client.to(uid).emit();
    client.on('mensaje-personal', async (payload)=>{
        console.log(payload);
        await grabarMensaje(payload);

        io.to(payload.para).emit('mensaje-personal', payload);
    });


    client.emit('active-bands', bands.getBands())

    client.on('disconnect', () => {
        console.log('cliente desconectado');
        usuarioDesconectado(uid);
    });

    client.on('mensaje', (payload)=>{
        console.log('un mensajee!!', payload);

        io.emit('mensaje',{admin: 'Nuevo mensaje'});
    });

    client.on('emitir-mensaje', (payload)=>{
        io.emit('nuevo-mensaje', payload);
    });

    client.on('vote-band', (payload)=>{
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands())
        console.table(payload)
    });

    client.on('add-band', (payload)=>{
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands())
    });

    client.on('delete-band', (payload)=>{
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

});