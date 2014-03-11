var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stuffTest', function(err, res){
  mongoose.connection.db.dropDatabase(function(err, res){
    mongoose.connection.close(function(err, res){
      var app = require('../app.js');
      var config = require('../config/change2db');
      config.change2db('../config/', 'stuffTest');
      app.listen(3020);      
    });  
  });
})

