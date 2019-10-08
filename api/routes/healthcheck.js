var express = require('express');
var router = express.Router();
// simple multipurpose function for fetching data
router.get('/', function (req, res) {
	res.send('ok');
});

module.exports = router;
