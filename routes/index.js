var express = require('express');
var router = express.Router();

var sendSuccess = function(res, content) {
	res.status(200).json({
    success: true,
    content: content
  }).end();
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
