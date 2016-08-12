var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// passport
var config = require('./config/config.js');
var passport = require('passport');
var NaverStrategy = require('passport-naver').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;

var UserModel = require('./models/UserModel.js');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserModel.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new NaverStrategy({
    clientID: config.naver.clientID,
    clientSecret: config.naver.clientSecret,
    callbackURL: config.naver.callbackURL
	},
    function(accessToken, refreshToken, profile, done) {
        UserModel.findOne({
            'id': profile.id
        }, function(err, user) {
            if (!user) {
                user = new UserModel({
                    name: profile.displayName,
                    provider: 'naver',
                    naver: profile._json
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });

      /*
      UserModel.findOne({
        'id': profile.id
      }, function(err, user) {
        if (!user) {
          user = new UserModel({
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          });
          user.save(function(err) {
            if (err) console.log(err);
              return done(err, user);
          });
        } else {
            return done(err, user);
        }
      });
      */
    }
));

passport.use(new KakaoStrategy({
    clientID : config.kakao.clientID,
    callbackURL : config.kakao.callbackURL
  },
  function(accessToken, refreshToken, profile, done){
      UserModel.findOne({
        'id': profile.id
      }, function(err, user) {
        if (!user) {
          user = new UserModel({
            id: profile.id,
            name: profile.username,
          });
          user.save(function(err) {
            if (err) console.log(err);
              return done(err, user);
          });
        } else {
            return done(err, user);
        }
      });
    // 사용자의 정보는 profile에 들어있다. 
  }
));

// router
var routes = require('./routes/index');
var users = require('./routes/users.js');
var comments = require('./routes/Comments');
var locations = require('./routes/Locations');
var auths = require('./routes/auth.js');

// mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/doodletoy');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongodb error: '));
db.once('open', () => {
  console.log('mongodb connected');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/comments', comments);
app.use('/locations', locations);
app.use('/auth', auths);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
