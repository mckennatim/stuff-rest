var express = require('express')
stuff = require('./routes/stuff')

var app = express()
/*
var secret='x';
expressJwt=require('express-jwt')
app.use('/api', expressJwt({secret: secret}));
app.use(express.json());
app.use(express.urlencoded());
*/
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', false)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-xsrf-token");
  next();
});

/*
app.options('*', function(req,res){
  res.send(200);
})
*/
app.use(express.bodyParser());
//app.use(express.static(path.join(__dirname, '../client')));

app.get('/api/', function(req, res) {
  res.jsonp('please select a collection, lists, users or items')
});


app.get('/api/users', stuff.findUsers);
app.post('/api/users', stuff.createUser); //POST=Create
app.del('/api/users/:name', stuff.deleteUser);
app.get('/api/users/:name', stuff.findUserByName);
app.put('/api/users/:name/:lid', stuff.addList2user);//PUT=Update

app.get('/api/products', stuff.findProducts);
app.get('/api/products/:lid', stuff.findProductsByLid);
app.get('/api/products/needed/:lid', stuff.findProductsNeeded4Lid);
app.get('/api/products/done/:lid', stuff.findProductsDone4Lid);
app.get('/api/products/:name/:shops', stuff.findProducts4UserByLname);
app.post('/api/products/:lid', stuff.addProduct4Lid);//POST=Create new prouct
app.del('/api/products/:pid', stuff.deleteProduct);
app.put('/api/products/:pid', stuff.updateProduct);

app.get('/api/lists', stuff.findLists);
app.get('/api/lists/:lid', stuff.getList)
app.post('/api/lists/:shops', stuff.createList)
app.del('/api/lists/:lid', stuff.deleteList)
app.put('/api/lists/:lid', stuff.updateList)


app.listen(3000);
console.log('listening on port 3000');