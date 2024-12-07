var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});


router.post("/userName", function(req, res, next){
  let currentUser = req.body.currentUserName

});

module.exports = router;
