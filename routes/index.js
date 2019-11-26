var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/report', function(req, res, next) {
  res.render('report');
});
router.get('/sendemail', function(req, res, next) {
  res.render('sendemail');
});
router.get('/chatroom', function(req, res, next) {
  res.render('chatroom');
});
module.exports = router;
