var Sequelize = require('sequelize');
var bodyParser = require("body-parser");
var DB = require('../config/database');

var GoogleMap = DB.define('GoogleMap', {
  position: Sequelize.STRING,
});

module.exports = GoogleMap;