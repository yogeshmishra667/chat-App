const path = require('path');
const express = require('express');
const Filter = require('bad-words');
const app = express();
const {
  generateMessage,
  generateLocationMessage,
} = require('../src/utils/message');
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
  socket.emit('message', generateMessage('welcome!!'));
  socket.broadcast.emit('message', generateMessage('new user joined 🔥 '));
  // send a message to everyone except for a certain emitting socket

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter(); // for bad words
    if (filter.isProfane(message)) {
      return callback('profanity is not allowed');
    }
    io.emit('message', generateMessage(message)); //send every single connected client
    callback();
  });

  //when user disconnected
  socket.on('disconnect', () => {
    io.emit('message', generateMessage('user disconnected 😞'));
  });

  socket.on('sendLocation', (coords, callback) => {
    io.emit(
      'locationMessage',
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });
});

//acknowledgement blueprint;
//server (emit) -> client (receive) --acknowledgement --> server
//client (emit) -> server (receive) --acknowledgement --> client

//run server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`express server run on ${PORT} `);
});
