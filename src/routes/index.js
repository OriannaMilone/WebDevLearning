var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../chatingApp.db');

router.get('/', function(req, res, next) {
  res.render('index');
});


router.post("/loginUserDDBB", function(req, res){
    let useremail = req.body.email;
    let userpassword = req.body.password;

    console.log("User email: ", useremail);
    console.log("User password: ", userpassword);


    const checkEmailQuery = "SELECT password FROM users WHERE email = ? ";
    db.all(checkEmailQuery, [useremail], (err, password) => {
      if (err) {
        console.error("Error loading the user");
        res.status(500).send("Server error");
      }
      if (password === userpassword) {
          console.log("User logged in");
      }
    });
    res.status(200).send("User logged in");
});

module.exports = router;

