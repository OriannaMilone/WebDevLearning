var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { createServer } = require("http");
const { Server } = require("socket.io");

var indexRouter = require('./routes/index'); 
var chatRouter = require('./routes/chat'); // Chat client logic
const chatSocket = require("./socket/chat"); // Chat server logic

// Inicializar Express y HTTP Server
var app = express();
const httpServer = createServer(app);
const io = new Server(httpServer); // Inicializar Socket.IO

chatSocket(io); // Inicializar el servidor de chat

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.title = "Learning Web Dev";

app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Middleware to parse bodies requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/index', indexRouter);
app.use('/chat', chatRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
