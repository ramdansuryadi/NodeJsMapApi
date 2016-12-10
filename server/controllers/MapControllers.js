var GoogleMap = require('../models/GoogleMap');

exports.create = function(req, res) {
  GoogleMap.create({  position: JSON.stringify(req.body)}).then(function(task) {
 
  res.send(req.body);
})
  



};