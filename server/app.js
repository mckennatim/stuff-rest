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

this.server.use(express.bodyParser());
//this.server.use(express.static(path.join(__dirname, '../client')));

this.server.get('/', function(req, res) {
  res.send('please select a collection, lists, users or items')
});

this.server.get('/lists', stuff.findLists);
this.server.get('/users', stuff.findUsers);
this.server.get('/items', stuff.findItems);
this.server.post('/users', stuff.createUser);
this.server.get('/users/:name', stuff.findUserByName);
this.server.put('/users/:name/:lid', stuff.addList2user);

