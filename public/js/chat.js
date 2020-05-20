const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocation = document.querySelector('#send-location');

socket.on('message', (message) => {
  console.log(message);
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
