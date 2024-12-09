//Chat Server Logic
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../chatingApp.db');


//Detectar la conexión de un nuevo cliente
module.exports = (io) => {
    io.on("connection", (socket) => {
      console.log("Un usuario se ha conectado");

   // Obtener chat_id desde el cliente
    const chat_id = socket.handshake.query.chat_id;
    if (!chat_id) {
      console.error("Chat ID no proporcionado");
      socket.emit("error", { message: "Chat ID requerido" });
      return;
    }

    //Cargar historial de mensajes
    const messagesHistQuery = "SELECT content, user_id FROM messages WHERE chat_id = ?";
    db.all(messagesHistQuery, [chat_id], (err, messages) => {
        if (err) {
            console.error("Error loading chat history", err.message);
            res.status(500).send("Server error");
        } 
        //Sacar los user_id de los mensajes
        const user_ids = messages.map(message => message.user_id);
        console.log(user_ids);

        //Sacar los nombres de los usuarios
        const placeholders = user_ids.map(() => '?').join(',');
        const userEnvolvedQuery = `SELECT id, name FROM users WHERE id IN (${placeholders})`;

        db.all(userEnvolvedQuery, uni, (err, users) => {
            if (err) {
                console.error("Error loading user names", err.message);
                socket.emit("error", { message: "Server error while loading chat history" });
            }
            //Mapear los nombres de los usuarios a los mensajes
            messages = messages.map((message, index) => {
                message.username = users[index].name;
                return message;
            });
            console.log(messages);
            //Enviar historial de mensajes al cliente
            socket.emit("chat history", messages);          
        });  
    });
    
    //Desconexión de un cliente
    socket.on("disconnect", () => {
        console.log("Un usuario se ha desconectado");
      });  
});
};


//envio y recepción de mensajes



