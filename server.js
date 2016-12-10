var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var bodyParser = require("body-parser");
var GoogleMap = require('./server/models/GoogleMap');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var MapControllers = require('./server/controllers/MapControllers');

module.exports = app;

app.post('/savedata', MapControllers.create);


app.use(express.static(__dirname + '/client'));
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/client/" + "index.htm" );
})

app.post('/process_get', function (req, res) {
   var obj = {};
   console.log('body: ' + JSON.stringify(req.body));
   res.send(req.body);
})

var server = app.listen(8000, function () {
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)

})