var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var bodyParser = require("body-parser");
var config = require('../config/config');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var sequelize = require('../config/config');
var test = sequelize.authenticate()
   .then(function () {
   console.log("CONNECTED! ");
   })
   .catch(function (err) {
   console.log("ERROR");
   })
.done();

var GoogleMap = sequelize.define('GoogleMap', {
  position: Sequelize.STRING,
 
});

module.exports = GoogleMap;