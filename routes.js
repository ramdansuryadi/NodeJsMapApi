var MapControllers = require('./controllers/MapControllers');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

exports.setRequestUrl=function(app){
	app.get('/', function (req, res) {
	res.render('index.ejs', { title: 'Hey', message: 'Hello there!' });
	})
	app.post('/savedata', MapControllers.create);
	app.post('/process_get', MapControllers.show);
}


