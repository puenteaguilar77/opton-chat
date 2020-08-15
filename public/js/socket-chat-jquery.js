var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');

//referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');


//Funciones para renderizar usuarios
function renderizarUsuarios(personas) {
    console.log(personas);

    let html = ''
    html += '<li>';
    html += '   <a href = "javascript:void(0)"class = "active"> Chat de <span> ' + params.get('sala') + ' </span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/default-user.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    divUsuarios.html(html);

}

//Renderizar los mensajes

function renderizarMensajes(mensaje, yo) {
    let html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    let adminClass = 'info';
    if (mensaje.nombre === 'Admin') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/default-user.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Admin') {
            html += '<div class="chat-img"><img src="assets/images/users/default-user.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '    <h5>' + mensaje.nombre + '</h5>';
        html += '    <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += ' <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    }

    divChatbox.append(html);

}

function scrollBottom() {

    // selectors
    let newMessage = divChatbox.children('li:last-child');

    // heights
    let clientHeight = divChatbox.prop('clientHeight');
    let scrollTop = divChatbox.prop('scrollTop');
    let scrollHeight = divChatbox.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


//Listeners


divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }
});

formEnviar.on('submit', function(e) {

    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {

        return;

    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus //con esto se borra lo que escribimos en la caja de texto y se activa el cursor en la misma caja de texto
        renderizarMensajes(mensaje, true);
        scrollBottom();

    });

});