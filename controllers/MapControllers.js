var GoogleMap = require('../models/GoogleMap');

exports.create = function(req, res) {
	GoogleMap.create({  position: JSON.stringify(req.body)}).then(function(task) {
	res.send(req.body);
	})
};

exports.show = function(req, res) {
	console.log("tes");
	var obj = {};
	res.send(req.body);
};

