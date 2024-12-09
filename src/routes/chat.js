var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../chatingApp.db');

router.get('/', function(req, res) {
    
    const sqlGetUsers = "SELECT name, email FROM users";
    db.all(sqlGetUsers, (err, userList) => {
        if (err) {
            console.error("", err.message);
            res.state(500).send("Server Error");
        }  

        let usuariosDisponibles = [];
        if (userList) {
            usuariosDisponibles = userList.map(user => user.email); 
        }
        console.log(usuariosDisponibles);

        res.render('chat', { usuarios: usuariosDisponibles }); 
});
});

// Conectar al servidor usando Socket.IO
const socket = io();

// Obtener referencias a los elementos del DOM
const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msg");
const sendButton = document.getElementById("send");

// Variables globales (asegúrate de que estas variables estén disponibles en la vista EJS)
const userId = window.userId; // Definida en el script del cliente en chat.ejs
const chatId = window.chatId; // Chat global por defecto

// Escuchar nuevos mensajes desde el servidor
socket.on("chat message", (message) => {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${message.username}:</strong> ${message.content}`;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll al final
});

// Enviar mensaje al servidor
function sendMessage() {
  const content = msgInput.value.trim();
  if (content) {
    socket.emit("chat message", { userId, chatId, content });
    msgInput.value = ""; // Limpiar campo de entrada
  }
}

// Asignar evento al botón de enviar
sendButton.addEventListener("click", sendMessage);

// Permitir enviar mensajes con la tecla "Enter"
msgInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});


module.exports = router;