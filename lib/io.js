var
  server = require('../bin/www').server_https
  , io = require('socket.io')(server);

io.on('connection', function (socket) {
  console.log('new connection');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

