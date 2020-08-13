var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

//los on son para escuchar información que envía el server
socket.on('connect', function() {

    console.log('Conectado al Server');
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios Conectados: ', resp);
    });

});

socket.on('disconnect', function() {
    console.log('Desconectado del Server');
});

//Los emits son para enviar información al server
socket.emit('enviarMensaje', {
    usuario: 'Optimus Neo',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('Resp Server:', resp);
});

//Escuchar la información del server
socket.on('crearMensaje', function(mensaje) {
    console.log('Información del Server:', mensaje);
});

//Escuchar cambios de usuarios
//Escuchar cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {
    console.log(personas);
});

//Mensajes privados (Acción de escuchar al cliente con su mensaje privado)
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado: ', mensaje);
});