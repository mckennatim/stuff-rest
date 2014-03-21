console.log("in stuff")
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,    
    db;

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
              console.log(err);
          });
        });
      };
    });  
    //console.log(db)
    db.collection('lists', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'lists' collection doesn't exist. Creating it with sample data...");
            populateDB(lists);
        }
    });
    db.collection('products', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'products' collection doesn't exist. Creating it with sample data...");
            populateDB(products);
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
    //res.cookie('name', 'tobi', { domain: 'localhost', path: '/framewks/rest', secure: true });
    var body= req.body; 
    db.collection('users', function(err, collection) {
        collection.insert(body, function(err, saved) {
            if(err){res.jsonp(err)}else{res.jsonp(saved)};
        });
    });      
};exports.deleteUser = function(req, res){
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
  var ret ='0';
  //var ObjectId = require('mongoose').Types.ObjectId;
  db.collection('lists', function(err, collection) {
    collection.findOne({lid:lid}, function(err, alist) {
      if(err){
        res.jsonp(err);
      }else if (alist==null){
        res.jsonp("null list with that lid");
      } else {
        db.collection('users', function(err, collection) {
          collection.findOne({name:name},function(err,user){
            var ulists = user.lists
            console.log(ulists)
            console.log(alist)
            console.log(include(ulists,alist))
            if (err){
              ret.jsonp(err)
            }else if(include(ulists,alist)){
              res.jsonp('list already included');
            }else{
              console.log(alist)
              collection.update({name:name},{$push:{lists:alist}}, {upsert:false}, function(err, saved) {
                if(err){res.jsonp(err)}else{res.jsonp(alist)};
              });
            }                                       
          });
        });       
      }
    });
  });
};
//does object exist in array
function include(arr,obj) {
  if (arr.length==0){
    console.log('returning false')
  }else{
    return (arr.indexOf(obj) != -1)+1;
  }
}
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
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
{lid:'0',product:'sugar', done:true},
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
{lid:'0', shops:'testShop'}
];

var users = [];
users.name = 'users';
users.items= [
{name: 'tim', email: 'mckenna.tim@gmail.com', lists:[]},
{name: 'peri', email: 'perimckenna@gmail.com', lists:[]},
{name: 'tim2', email: 'mckt_jp@yahoo.com', lists:[]}
];
