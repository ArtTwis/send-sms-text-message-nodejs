const mobNumber = document.getElementById('number');

const textMessage = document.getElementById('message');

const sendBtn = document.getElementById('sendBtn');

const responseMessage = document.querySelector('.response');

sendBtn.addEventListener('click', send, false);

const socket = io();

socket.on('smsStatus', function (data) {
  responseMessage.innerHTML =
    '<h5>Text message sent to ' + data.number + '</h5>';
});

function send() {
  const mobileNumber = mobNumber.value.replace(/\D/g, '');
  const text = textMessage.value;

  fetch('/', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ number: mobileNumber, text: text }),
  })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });
}
