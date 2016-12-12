var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var urlroutes = require("./routes.js");
var config = require('./config/config');

app.set('port', config.port);
app.set('address', config.address);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

urlroutes.setRequestUrl(app);

app.listen(process.env.PORT || 8000, function () {
  console.log('Example app listening');
});

// var server = app.listen(process.env.PORT || app.get('port'), app.get('address'),function () {
// var host = server.address().address
// var port = server.address().port
// console.log("Example app listening at http://" + host + '::' + port)
// })
