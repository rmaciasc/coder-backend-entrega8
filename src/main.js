const express = require('express');

const { Server: HttpServer } = require('http');
const { Server: Socket } = require('socket.io');

const ContenedorSQL = require('./contenedores/ContenedorSQL.js');
const config = require('./config.js');

//--------------------------------------------
// instancio servidor, socket y api

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

const productosApi = new ContenedorSQL(config.mariaDb, 'productos');
const mensajesApi = new ContenedorSQL(config.sqlite3, 'mensajes');

//--------------------------------------------
// NORMALIZACIÓN DE MENSAJES

// Definimos un esquema de autor

// Definimos un esquema de mensaje

// Definimos un esquema de posts

//--------------------------------------------
// configuro el socket

io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado!');

  // carga inicial de productos
  const productos = await productosApi.listarAll();
  socket.emit('productos', productos);

  // actualizacion de productos
  socket.on('addProduct', async (newProd) => {
    const _ = await productosApi.guardar(newProd);
    const productos = await productosApi.listarAll();
    console.log(productos);
    io.sockets.emit('productos', productos);
  });

  // carga inicial de mensajes
  const mensajes = await mensajesApi.listarAll();
  socket.emit('mensajes', mensajes);
  // actualizacion de mensajes
  socket.on('addMessage', async (newMessage) => {
    console.log(newMessage);
    const _ = await mensajesApi.guardar(newMessage);
    const mensajes = await mensajesApi.listarAll();
    console.log(mensajes);
    io.sockets.emit('mensajes', mensajes);
  });
});

//--------------------------------------------
// agrego middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//--------------------------------------------

app.get('/api/productos-test', (req, res) => {});

//--------------------------------------------
// inicio el servidor

const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
  console.log(
    `Servidor http escuchando en el puerto ${connectedServer.address().port}`
  );
});
connectedServer.on('error', (error) =>
  console.log(`Error en servidor ${error}`)
);
