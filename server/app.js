console.log('in app.js')
var express = require('express')
stuff = require('./routes/stuff')

this.server = express()
/*
var secret='x';
expressJwt=require('express-jwt')
this.server.use('/api', expressJwt({secret: secret}));
this.server.use(express.json());
this.server.use(express.urlencoded());
*/
exports.listen = function () {
  this.server.listen.apply(this.server, arguments);
  console.log('listening on port ' + arguments[0]);
};

exports.close = function (callback) {
  this.server.close(callback);
};

this.server.use(express.bodyParser());
//this.server.use(express.static(path.join(__dirname, '../client')));

this.server.get('/api/', function(req, res) {
  res.jsonp('please select a collection, lists, users or items')
});

this.server.get('/api/lists', stuff.findLists);

this.server.get('/api/users', stuff.findUsers);
this.server.post('/api/users', stuff.createUser); //POST=Create
this.server.del('/api/users/:name', stuff.deleteUser);
this.server.get('/api/users/:name', stuff.findUserByName);
this.server.put('/api/users/:name/:lid', stuff.addList2user);//PUT=Update

this.server.get('/api/products', stuff.findProducts);
this.server.get('/api/products/:lid', stuff.findProductsByLid);
this.server.get('/api/products/done/:lid', stuff.findProductsDone4Lid);
this.server.get('/api/products/needed/:lid', stuff.findProductsNeeded4Lid);
this.server.get('/api/products/:name/:shops', stuff.findProducts4UserByLname);
this.server.post('/api/products/:lid', stuff.addProduct4Lid);//POST=Create new prouct
this.server.del('/api/products/:pid', stuff.deleteProduct);
this.server.put('/api/products/needed/:pid', stuff.updateProduct2needed);
this.server.put('/api/products/done/:pid', stuff.updateProduct2done);

