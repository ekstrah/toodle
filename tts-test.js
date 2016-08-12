var querystring = require('querystring');
var fs = require('fs'),
  request = require('request'),
  config = require('./config/config.js');

var options = {
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
    text: '저기 저 뜀틀이 내가 뛸 뜀틀인가 내가 안 뛸 뜀틀인가 내가 그린 기린 그림은 목이 긴 기린 그림인가 목이 안긴 기린 그림인가 네가 그린 기린 그림은 못 그린 기린 그림이고 내가 그린 기린 그림은 잘 그린 기린 그림이다',
    speed: 0
  })
};

console.log('options=');
console.log(options);

var destination = fs.createWriteStream('./test5.mp3');

request
  .post(options, function (err, res, body) {
    if (err) throw Error(err);
    console.log(res);
  }).pipe(destination);
