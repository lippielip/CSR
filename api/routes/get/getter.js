var express = require('express');
var router = express.Router();
var connection = require('../database').connection;
 // simple multipurpose function for fetching data
router.post('/', function (req, res) {
    console.log("\x1b[34m",`SELECT ${req.body.select ? req.body.select : '*'} FROM ${req.body.tableName} ${req.body.selectiveGet ? req.body.selectiveGet : ''}`,'\x1b[0m')
    connection.query(`SELECT ${req.body.select ? req.body.select : '*'} FROM ${req.body.tableName} ${req.body.selectiveGet}`,
        function (err, result, fields) {
            if (err) res.status(500).send(err);
        res.status(200).send(result);
        console.log(`${req.body.tableName}`,"\x1b[32m",`(sent)`,'\x1b[0m')
    });
});

module.exports = router;