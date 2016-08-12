var
  request = require('request'),
  rp = require('request-promise'),

  Q = require('q'),
  async = require('async'),

  from = process.argv[2],
  to = process.argv[3],

  cheerio = require('cheerio'),

  config = require('../config/config.js'),

  url = 'http://openAPI.seoul.go.kr:8088/417a4c64446d6a7334335553486e78/xml/SearchPublicToiletPOIService/1/1000/';

if (!from || !to)
  throw Error('Usage: node openAPI... {from} {to}');

rp
  .get(url)
  .then( function (body) {
    var $ = cheerio.load(body, {
       xmlMode: true // needed!!!!!
    });

    $('row').each(function (idx, elem) {
      var
        [name, latitude, longitude] = [
          $(this).children('FNAME').text(),
          $(this).children('Y_WGS84').text(),
          $(this).children('X_WGS84').text()
        ];

      if (name.length > 1 && !!latitude && !!longitude) {
        request
          .post({
            url: config.baseURL + '/locations',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            form: {
              name: name,
              latitude: latitude,
              longitude: longitude
            }
          }, function (err, res, body) {
            if(err) console.error(err);
          });
      }
    });

  })
  .catch( function (err) {
    throw Error(err);
  })
