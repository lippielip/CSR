var express = require('express');
var router = express.Router();
var connection = require('../database').connection;

// function to change values
router.post('/', function (req, res, next) {
    for (let i = 0; i < Object.keys(req.body).length - 1; i++) { //loop through all categories
        var category = Object.keys(req.body)[i];
        //check if there are already 2 Presentations present
        if (category === 'presentations') {
            connection.query(`SELECT Date FROM presentations WHERE Date = '${req.body.presentations.Date}'`,
                function (err, result, fields) {
                    if (err) console.log(err)
                    console.log(result.length)
                    if (result.length === 2) {
                        res.status(304).send()
                    } else {
                        var proplength = Object.values(req.body[category]).length; // category amount
                        console.log("\x1b[31m", `Property Amount for Category ${category}: ${proplength}`, '\x1b[0m')
                        for (let j = 0; j < proplength; j++) { // loop through all properties
                            values = Object.values(req.body[category])[j]
                            keys = Object.keys(req.body[category])[j];
                            console.log("\x1b[34m", `UPDATE`, '\x1b[0m', ` ${category}`, "\x1b[32m", `SET`, '\x1b[0m', `${keys} = '${values}'`, "\x1b[32m", `WHERE`, '\x1b[0m', `${req.body.idInfo.idName} = ${req.body.idInfo.id}`)
                            connection.query(`UPDATE ${category} SET ${keys} = '${values}' WHERE ${req.body.idInfo.idName} = ${req.body.idInfo.id} `, function (err, result, fields) {
                                if (err) console.log(err)
                            });
                        }
                        res.status(200).send()
                    }
                })
        } else {
            var proplength = Object.values(req.body[category]).length; // category amount
            console.log("\x1b[31m", `Property Amount for Category ${category}: ${proplength}`, '\x1b[0m')
            for (let j = 0; j < proplength; j++) { // loop through all properties
                values = Object.values(req.body[category])[j]
                keys = Object.keys(req.body[category])[j];
                console.log("\x1b[34m", `UPDATE`, '\x1b[0m', ` ${category}`, "\x1b[32m", `SET`, '\x1b[0m', `${keys} = '${values}'`, "\x1b[32m", `WHERE`, '\x1b[0m', `${req.body.idInfo.idName} = ${req.body.idInfo.id}`)
                connection.query(`UPDATE ${category} SET ${keys} = '${values}' WHERE ${req.body.idInfo.idName} = ${req.body.idInfo.id} `, function (err, result, fields) {
                    if (err) console.log(err)
                });
            }
            res.status(200).send()
        }
    }
});



module.exports = router;