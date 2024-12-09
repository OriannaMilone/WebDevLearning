var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { createServer } = require("http");
const { Server } = require("socket.io");

var indexRouter = require('./routes/index'); 
var chatRouter = require('./routes/chat');
const chatSocket = require("./socket/chat"); 

const debug = require('debug')('appLogs'); // 'appLogs' es el namespace para los logs
debug('This is a verbose log');


var app = express();
const httpServer = createServer(app);
const io = new Server(httpServer); // Inicializar Socket.IO

chatSocket(io); // Inicializar el servidor de chat

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.title = "Learning Web Dev";

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/chat', chatRouter); // Solo uso /chat si no necesitas /index

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
