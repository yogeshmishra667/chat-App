const path = require('path');
const express = require('express');
const app = express();
//socket.io setup
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//Set Public(static) Folder 🗄
const publicPathDir = path.join(__dirname, '../public');
app.use(express.static(publicPathDir));

//print msg when new user connected
//server (emit) -> client (receive) - countUpdated
//client (emit) -> server (receive) - increment

io.on('connection', (socket) => {
  console.log('a user connected');
  //emit use for transfer event data 👇
  socket.emit('message', 'welcome!!');
  socket.broadcast.emit('message', 'new user joined 🔥 ');
  // send a message to everyone except for a certain emitting socket

  socket.on('sendMessage', (message) => {
    io.emit('message', message); //send every single connected client
  });

  //when user disconnected
  socket.on('disconnect', () => {
    io.emit('message', 'user disconnected 😞');
  });
});

//run server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`express server run on ${PORT} `);
});
