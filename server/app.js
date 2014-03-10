console.log('in app.js')
var express = require('express')
stuff = require('./routes/stuff')

this.server = express()

exports.listen = function () {
  this.server.listen.apply(this.server, arguments);
  console.log('listening on port ' + arguments[0]);
};

exports.close = function (callback) {
  this.server.close(callback);
};

this.server.get('/', function(req, res) {
  res.send('please select a collection, e.g., /collections/messages')
});

this.server.get('/lists', stuff.findLists);
this.server.get('/users', stuff.findUsers);
this.server.get('/items', stuff.findItems);

