const socket = io.connect();

//------------------------------------------------------------------------------------

const formAgregarProducto = document.getElementById('formAgregarProducto');

formAgregarProducto.addEventListener('submit', (e) => {
  e.preventDefault();
  const newProd = {
    name: document.getElementById('nombre').value,
    price: document.getElementById('precio').value,
    photo: document.getElementById('foto').value,
  };
  socket.emit('addProduct', newProd);
  document.getElementById('nombre').value = '';
  document.getElementById('precio').value = '';
  document.getElementById('foto').value = '';
});

socket.on('productos', async (productos) => {
  const html = await makeHtmlTable(productos);
  document.getElementById('productos').innerHTML = html;
});

function makeHtmlTable(productos) {
  return fetch('plantillas/tabla-productos.hbs')
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      const html = template({ productos });
      return html;
    });
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername');
const inputMensaje = document.getElementById('inputMensaje');
const btnEnviar = document.getElementById('btnEnviar');

const formPublicarMensaje = document.getElementById('formPublicarMensaje');
formPublicarMensaje.addEventListener('submit', (e) => {
  e.preventDefault();
  const newMessage = {
    mail: document.getElementById('inputUsername').value,
    message: document.getElementById('inputMensaje').value,
  };

  if (newMessage.message !== '') {
    socket.emit('addMessage', newMessage);
  }
  document.querySelector('#inputMensaje').value = '';
});

socket.on('mensajes', async (mensajes) => {
  const html = await makeHtmlList(mensajes);
  document.getElementById('mensajes').innerHTML = html;
});

function makeHtmlList(mensajes) {
  return fetch('plantillas/tabla-mensajes.hbs')
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      const html = template({ mensajes });
      return html;
    });
}

function check() {
  if (inputUsername.value != '' && inputUsername.checkValidity()) {
    btnEnviar.disabled = false;
  } else {
    btnEnviar.disabled = true;
  }
}
inputUsername.addEventListener('input', check);
