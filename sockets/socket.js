const {io} = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();
console.log('init server');

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon jovi'));
bands.addBand(new Band('Héroes del silencio'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('Kiss'));


//console.log(bands);



//mensajes de sockets
io.on('connection', client => {

    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands())

    client.on('disconnect', () => {
        console.log('cliente desconectado');
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