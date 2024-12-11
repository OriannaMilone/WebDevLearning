///routes/previewschat.js
var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../chatingApp.db');

router.get('/', function(req, res, next) {
    const userData = req.session.user;
    console.log("ID")
    console.log(userData.id)
    const selectChatsQuery = "SELECT chat_id FROM user_chat WHERE user_id = ?";
    db.all(selectChatsQuery, [userData.id], (err, chats) =>{
        if (err) {
            console.error("Server Error: ",  err.message);
            res.status(500).send("Server Error");
        }
        console.log(chats)
        //Esto no es lo que hay que mandar, hay que hacer la consulta en chats ahora, 
        //esta es la consulta de chats para este usuario pero hay que hacerla para el chats ahora, y sacar el title
        //ya de ahí tambien tendrá su id que mandamos a chat 
    res.render('previewchat', {chats: chats});
    });
});

router.post("/selectChat", function(req, res){
    const chatId = req.body.chat_id;
    console.log(chatId);
    res.redirect('/chat/' + chat_id);
});

module.exports = router;