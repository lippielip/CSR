var express = require('express');
var router = express.Router();
var connection = require('../database').connection;

router.post('/', function (req, res) {
    var CategoryAmount = Object.keys(req.body.presentation).length;
    var CategoryNames = Object.keys(req.body.presentation);
    var Presentation_ID;
    connection.query(`SELECT User_ID FROM (users) WHERE Username = '${req.body.presentation.Presenter}'`,
        function (err, result) {
            if (err) {
                req.body.presentation.Presenter = null;
            } else {
                req.body.presentation.Presenter = result[0].User_ID
                console.dir(req.body.presentation)
            }
        });
    
    connection.query(`INSERT INTO presentations (${CategoryNames[0]}) VALUES ('${Object.values(req.body.presentation)[0]}')`,
        function (err) {
            if (err) console.log(err);
        });
    connection.query(`SELECT LAST_INSERT_ID()`,
        function (err, result) {
            if (err) res.status(502).send();
            Presentation_ID = result[0]['LAST_INSERT_ID()'];

            for (let i = 0; i < CategoryAmount; i++) {
                console.log(`UPDATE presentations SET ${CategoryNames[i]} = '${Object.values(req.body.presentation)[i]}' WHERE Presentation_ID = ${Presentation_ID} `)
                connection.query(`UPDATE presentations SET ${CategoryNames[i]} = '${Object.values(req.body.presentation)[i]}' WHERE Presentation_ID = ${Presentation_ID} `, // insert all values
                    function (err) {
                        if (err) res.status(503).send();
                    });
            };
        res.status(200).send(`Successfully added Presentation ${CategoryNames[0]}!`);
    });
})
module.exports = router;