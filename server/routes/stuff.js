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
              done();
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
    db.collection('items', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'items' collection doesn't exist. Creating it with sample data...");
            populateDB(items);
        }
    });  
}); 

var find =function(na, res){
    db.collection(na, function(err, collection) {
        collection.find().toArray(function(err, items) {
            //console.log(items);
            res.jsonp(items);
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
exports.findItems = function(req, res) {
    console.log('in findLists');
    find('items', res);
};
exports.createUser = function(req, res){
    //res.cookie('name', 'tobi', { domain: 'localhost', path: '/framewks/rest', secure: true });
    var body= req.body; 
    db.collection('users', function(err, collection) {
        collection.insert(body, function(err, saved) {
            //console.log(saved);
            res.jsonp(saved);
        });
    });      
};
exports.findUser = function(req,res){
    console.log('in findUser');

};

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


var items =[];
items.name = 'items';
items.items = [   
{lid:'1',item:'banana', done:false},
{lid:'4',item:'coffee', done:false},
{lid:'4',item:'brown sugar', done:false},
{lid:'4',item:'bacon', done:false},
{lid:'1',item:'apples', done:false},
{lid:'5',item:'2x4-8\'', done:false},
{lid:'1',item:'brown gravy', done:true},
{lid:'7',item:'bags', done:true},
{lid:'7',item:'applesauce', done:true},
{lid:'4',item:'sugar', done:true},
{lid:'1',item:'baby back ribs', done:true},
{lid:'4',item:'apple butter', done:true}
];

var lists =[];
lists.name = 'lists';
lists.items = [
{lid:1, name:'groceries'},
{lid:2, name:'hardware'},
{lid:3, name:'drugs'},
{lid:4, name:'groceries'},
{lid:5, name:'building'},
{lid:6, name:'garden'},
{lid:7, name:'groceries'}
];

var users = [];
users.name = 'users';
users.items= [
{name: 'tim', email: 'mckenna.tim@gmail.com', lists:[]},
{name: 'peri', email: 'perimckenna@gmail.com', lists:[]},
{name: 'tim2', email: 'mckt_jp@yahoo.com', lists:[]}
];
