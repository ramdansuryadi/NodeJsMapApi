var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var urlroutes = require("./routes.js");
var config = require('./config/database');

app.set('port', config.port);
app.set('address', config.address);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

urlroutes.setRequestUrl(app);

app.listen(process.env.PORT || app.get('port'), function () {
var address = app.get('address')
var port = app.get('port')
console.log("Example app listening at http://" + address + '::' + port)
});

