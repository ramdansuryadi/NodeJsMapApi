var GoogleMap = require('../models/GoogleMap');

exports.create = function(req, res) {
	GoogleMap.create({  position: JSON.stringify(req.body)}).then(function(task) {
	res.send(req.body);
	})
};

exports.show = function(req, res) {
	var obj = {};
	console.log('body: ' + JSON.stringify(req.body));
	res.send(req.body);
};
