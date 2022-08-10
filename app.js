const express = require('express');

const app = express();

const ejs = require('ejs');

const Vonage = require('@vonage/server-sdk');

const socketIO = require('socket.io');

const bodyParser = require('body-parser');

// Init Nexmo
const vonage = new Vonage(
  {
    apiKey: '57cf2d83',
    apiSecret: '51lcCV6DT1KdHizs',
  },
  { debug: true }
);

// Init app
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index route
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  const from = 'Vonage APIs';
  const to = '91' + req.body.number;
  const text = req.body.text;

  vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      const data = {
        id: responseData.messages[0]['message-id'],
        number: responseData.messages[0]['to'],
      };

      //   Emit to the client
      io.emit('smsStatus', data);
    }
  });
});

// Define port
const port = 8080;

// start server
const server = app.listen(port, () =>
  console.log(`Server is listening on port ${port}`)
);

// Connect to socket.io
const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('Connected :: socket.io');
  io.on('disconnect', () => {
    console.log('Disconnected :: socket.io');
  });
});
