var MapControllers = require('./controllers/MapControllers');

exports.setRequestUrl=function(app){
	app.get('/', function (req, res) {
	res.sendFile( __dirname + "/views/" + "index.htm" );
	})
	app.post('/savedata', MapControllers.create);
	app.post('/process_get', MapControllers.show);
}