const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocation = document.querySelector('#send-location');
const $messages = document.querySelector('#messages'); //for render messages

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

// options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
// for rooms and username Qs --Query String user to extract query
// location.search user for query body --"?username=yogi&room=hello"
// ignoreQueryPrefix use for ignore ? on query-body

socket.on('message', (message) => {
  console.log(message);

  //render message on web pages
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
  // insertAdjacentHTML allow to insert other html Adjacent to selected elements
  // beforeend show messages after div that mean old messages show first like whtsApp
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //disable button 🔻
  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (error) => {
    //enable button after sending message 💆‍♂️
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = ''; //clear input after submit
    $messageFormInput.focus();
    if (error) {
      //for bad words
      return console.log(error);
    }
    console.log('msg delivered');
  });
});

socket.on('locationMessage', (url) => {
  console.log(url);
  //render location msg on web pages
  const html = Mustache.render(locationTemplate, {
    url: url,
    createdAt: moment(url.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$sendLocation.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.');
  }
  //disable send locaton  btn 🔲
  $sendLocation.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        //enable sendLocation button after acknowledgement
        $sendLocation.removeAttribute('disabled');

        // for acknowledgement
        console.log('location shared');
      }
    );
  });
});

// use for send { username, room } on server
socket.emit('join', { username, room });
