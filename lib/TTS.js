var
  fs = require('fs'),
  cluster = require('cluster'),
  zmq = require('zmq'),
  num_clusters = 8,
  
  config = require(__dirname + '/../config/config.js');

if (cluster.isMaster) {
  var 
    router = zmq.socket('router').bind(config.routerIPC),
    dealer = zmq.socket('dealer').bind(config.dealerIPC);

  router.on('message', function() {
    var frames = Array.prototype.slice.call(arguments); 
    dealer.send(frames);
  });

  dealer.on('message', function() {
    var frames = Array.prototype.slice.call(arguments); 
    router.send(frames);
  });

  cluster.on('online', function(worker) {
    console.log(`Worker ${worker.process.pid} online`);
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' exited with code ' + code);
  });

  for (var i = 0; i < num_clusters; i++) {
    cluster.fork();
  }

  module.exports = router;
} else {

  var 
    replier = zmq.socket('rep').connect(config.dealerIPC),
    request = require('request'),
    
    querystring = require('querystring');

  if (!replier) throw Error('replier is not established!');

  replier.on('message', function(data) {
    var 
      requester = JSON.parse(data),
      comment_id = requester.comment_id,
      text = requester.text,
      options = {
        url: 'https://openapi.naver.com/v1/voice/tts.bin',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'Cache-Control': 'no-cache',
          'User-Agent': 'curl/7.43.0',
          'Accept': '*/*',
          'X-Naver-Client-Id': config.naver.clientID,
          'X-Naver-Client-Secret': config.naver.clientSecret
        },
        body: querystring.stringify({
          speaker: 'mijin',
          text: text,
          speed: 0
        })
      },
      destination = fs.createWriteStream(`${__dirname}/../public/upload/${comment_id}.mp3`);

      console.log(`Worker ${process.pid} : comment_id(${comment_id}) -- ${text}`);
    // TO TTS request 
    request 
      .post(options, function (err, res, body) {
        if (err) throw Error(err);
      }).pipe(destination);
    
  });
}

  
