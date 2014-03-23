console.log("in stuff")
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,    
    db;
//to translate mongo id string to mongo _id
var ObjectId = require('mongoose').Types.ObjectId;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("stuffDb");
    //var mongoskin = require('mongoskin')
    //var db = mongoskin.db('mongodb://localhost:27017/stuffTest', {safe:true})
    //var db = require('../config/dbConfig')
    //console.log(db)
    db.collection('users', {strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'users' collection doesn't exist. Creating it with sample data...");
        populateDB(users);
        db.collection('users', function(err, collection) {
          collection.ensureIndex({name:1},{unique:true}, function(err, saved) {
              //console.log(err);
          });
        });
      };
    });  
    //console.log(db)
    db.collection('lists', {strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'lists' collection doesn't exist. Creating it with sample data...");
        populateDB(lists);
        db.collection('lists', function(err, collection) {
          collection.ensureIndex({lid:1}, function(err, saved) {
              //console.log(err);
          });
        });        
      }
    });
    db.collection('products', {strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'products' collection doesn't exist. Creating it with sample data...");
        populateDB(products);
        db.collection('products', function(err, collection) {
          collection.ensureIndex({lid:1,done:-1,product:1}, function(err, saved) {
              //console.log(err);
          });
        });
      }
    });  
}); 

var find =function(na, res){
    db.collection(na, function(err, collection) {
        collection.find().toArray(function(err, items) {
            if(err){res.jsonp(err)}else{res.jsonp(items)};
        });
    });
};

exports.findLists = function(req, res) {
    console.log('in findLists');
    find('lists', res);
};
exports.findUsers = function(req, res) {
    console.log('in findLists');
    find('users', res);
};
exports.findProducts = function(req, res) {
    console.log('in findLists');
    find('products', res);
};
exports.createUser = function(req, res){
  console.log('in createUser');
  var body= req.body; 
  db.collection('users', function(err, collection) {
      collection.insert(body, function(err, saved) {
          if(err){res.jsonp(err)}else{res.jsonp(saved)};
      });
  });      
};
exports.deleteUser = function(req, res){
  console.log('in delete user by name');
  console.log(req.params);
  var name = req.params.name;
  db.collection('users', function(err, collection) {
    collection.remove({name:name}, function(err, saved) {
      if(err){res.jsonp(err)}else{res.jsonp(saved)};
    });
  });      
};
exports.findUserByName = function(req, res) {
    console.log('in find user by name');
    console.log(req.params);
    var name = req.params.name;
    db.collection('users', function(err, collection) {
        collection.findOne({name:name},function(err, items) {
            console.log(items);
            res.jsonp(items);
        });
    });
};
exports.findProductsByLid = function(req, res) {
    console.log('in find user by name');
    console.log(req.params);
    var lid = req.params.lid;
    db.collection('products', function(err, collection) {
        collection.find({lid:lid}).toArray(function(err, items) {
            //console.log(items);
            res.jsonp(items);
        });
    });
};
exports.addList2user = function(req, res){
  console.log('in addList2user');
  var name =req.params.name; 
  var lid =req.params.lid;
  var shopName;
  //var ObjectId = require('mongoose').Types.ObjectId;
  db.collection('lists', function(err, collection) {
    collection.findOne({lid:lid}, function(err, alist) {
      if(err){
        res.jsonp(err);
      }else if (alist==null){
        res.jsonp("null list with that lid");
      } else {
        shopName=alist.shops
        db.collection('users', function(err, collection) {
          collection.find({name:name},{lists:{$elemMatch:{lid:lid}}}).toArray(function(err,userLid){
            //console.log(userLid[0].lists==undefined)
            console.log(userLid[0].lists)
            if (err){
              ret.jsonp(err)
            }else if(userLid[0].lists!=undefined){
              console.log('!undefined-list already included');
              res.jsonp('list already included');
            }else{
              collection.find({name:name},{lists:{$elemMatch:{shops:shopName}}}).toArray(function(err,userName){
                console.log(userName);
                if(userName[0].lists!=undefined){
                  console.log('!undefined-name taken, choose another');
                  res.jsonp('name taken, choose another');
                }else{
                  collection.update({name:name},{$push:{lists:alist}}, {upsert:false}, function(err, saved) {
                    if(err){res.jsonp(err)}else{
                      console.log('adding this list')
                      res.jsonp(alist)};
                  });
                }
              });
            }                                      
          });
        });       
      }
    });
  });
};

exports.findProducts4UserByLname = function(req, res) {
  console.log('in find /products/:name/:shops by name');
  console.log(req.params);
  var name = req.params.name;
  var shops = req.params.shops;
  var lid;
  db.collection('users', function(err, collection) {
    collection.find({name:name},{lists:{$elemMatch:{shops:shops}}}).toArray(function(err,listInfo){
      console.log(listInfo[0]);
      if(listInfo[0]==undefined){
        res.jsonp('that list or user doesn\'t exist')
      }else{
        lid = listInfo[0].lists[0].lid;
        db.collection('products', function(err, collection) {
          collection.find({lid:lid}).toArray(function(err,theList){
            //console.log(theList)
            res.jsonp(theList)
          })
        })
      }
    })    
  })
}
exports.addProduct4Lid=function(req, res){
  console.log('in addProduct4Lid');
  console.log(req.params);
  var lid = req.params.lid;
  var body= req.body; 
  console.log(body);
  db.collection('products', function(err, collection) {
      collection.insert(body, function(err, saved) {
          if(err){res.jsonp(err)}else{res.jsonp(saved)};
      });
  });  
}  
exports.deleteProduct=function(req,res){
  console.log('in delete product by _id');
  console.log(req.params);
  var pid = ObjectId(req.params.pid);
  db.collection('products', function(err, collection) {
    collection.remove({_id:pid}, function(err, saved) {
      if(err){res.jsonp(err)}else{res.jsonp(saved)};
    });
  });      
}
/*------------------------------------------------------------------------------------------------*/

var populateDB = function(huh) {
    console.log("Populating database...");
    var name= huh.name;
    var coll= huh.items;
    db.collection(name, function(err, collection) {
        collection.insert(coll, {safe:true}, function(err, result) {});
        //console.log(result);
    });
};


var products =[];
products.name = 'products';
products.items = [   
{lid:'1',product:'banana', done:false},
{lid:'4',product:'coffee', done:false},
{lid:'4',product:'brown sugar', done:false},
{lid:'4',product:'bacon', done:false},
{lid:'1',product:'apples', done:false},
{lid:'5',product:'2x4-8\'', done:false},
{lid:'0',product:'brown gravy', done:true},
{lid:'0',product:'bags', done:true},
{lid:'0',product:'applesauce', done:true},
{lid:'00',product:'sugar', done:true},
{lid:'0',product:'baby back ribs', done:true},
{lid:'1',product:'brown gravy', done:true},
{lid:'7',product:'bags', done:true},
{lid:'7',product:'applesauce', done:true},
{lid:'4',product:'sugar', done:true},
{lid:'1',product:'baby back ribs', done:true},
{lid:'4',product:'apple butter', done:true}
];

var lists =[];
lists.name = 'lists';
lists.items = [
{lid:'1', shops:'groceries'},
{lid:'2', shops:'hardware'},
{lid:'3', shops:'drugs'},
{lid:'4', shops:'groceries'},
{lid:'5', shops:'building'},
{lid:'6', shops:'garden'},
{lid:'7', shops:'groceries'},
{lid:'0', shops:'testShop'},
{lid:'00', shops:'testShop'}
];

var users = [];
users.name = 'users';
users.items= [
{name: 'tim', email: 'mckenna.tim@gmail.com', lists:[]},
{name: 'tim7', email: 'mckenna.tim@gmail.com', lists:[]},
{name: 'peri', email: 'perimckenna@gmail.com', lists:[]},
{name: 'tim2', email: 'mckt_jp@yahoo.com', lists:[]}
];
