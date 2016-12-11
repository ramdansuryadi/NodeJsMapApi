var Sequelize = require('sequelize');
var database = new Sequelize('nodejsmap', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

var test = database.authenticate()
   .then(function () {
   console.log("CONNECTED! ");
   })
   .catch(function (err) {
   console.log("ERROR");
   })
.done();

module.exports = database
module.exports.port = 8000;
module.exports.address = 'localhost';





