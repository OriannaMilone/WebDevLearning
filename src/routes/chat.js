//routes/chat.js
var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../chatingApp.db');

router.get('/', function (req, res) {
    const userData = req.session.user;

    const chatsQuery = `
    SELECT uc.chat_id, c.title 
    FROM user_chat uc
    INNER JOIN chats c ON uc.chat_id = c.id
    WHERE uc.user_id = ?
`;

    db.all(chatsQuery, [userData.id], function (err, chats) {
        if (err) {
            console.error("Error getting chats:", err.message);
            res.status(500).send("Error getting chats");
        } else {
            res.render('chat', {
                user_id: userData.id,
                user_name: userData.username,
                chats: chats
            });
        }
    });
});


// Enviar un mensaje al chat
router.post('/send-message', function (req, res) {
    const { chat_id, message, user_id } = req.body;
    const insertMessageQuery = "INSERT INTO messages (chat_id, user_id, content) VALUES (?, ?, ?)";

    // const insertChatQuery = "INSERT INTO user_chat (chat_id, user_id) VALUES (?, ?)";
    db.run(insertMessageQuery, [chat_id, user_id, message], function (err) {
        if (err) {
            console.error("Error sending message:", err.message);
            res.status(500).send("Error sending message");
        } else {
            res.status(200).send("Message sent successfully");
        }
    });
});

module.exports = router;