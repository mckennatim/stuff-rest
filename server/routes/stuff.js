var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("stuffDb");
    db.collection('lists', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'lists' collection doesn't exist. Creating it with sample data...");
            populateDB(lists);
        }
    });
    db.collection('users', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'users' collection doesn't exist. Creating it with sample data...");
            populateDB(users);
        }
    });
    db.collection('items', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'items' collection doesn't exist. Creating it with sample data...");
            populateDB(items);
        }
    });    
});

exports.findById = function(req, res) {
    console.log('in find by id');
    console.log(req.params);
    var id = req.params.id;
    var list = req.params.list;
    console.log(typeof id);
    var ObjectId = require('mongoose').Types.ObjectId;
    db.collection(list, function(err, collection) {
        collection.find({_id:ObjectId(id)}).toArray(function(err, items) {
            //console.log(items);
            res.jsonp(items);
        });
    });
};

exports.findByName = function(req, res) {
    console.log('in find by name');
    console.log(req.params);
    var name = req.params.name;
    db.collection('users', function(err, collection) {
        collection.find({name:name}).toArray(function(err, items) {
            //console.log(items);
            res.jsonp(items);
        });
    });
};

var find =function(na, res){
    db.collection(na, function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log(items);
            res.jsonp(items);
        });
    });
};

exports.findLists = function(req, res) {
    console.log('in findLists');
    find('lists', res);
};

exports.findUsers = function(req, res) {
    console.log('in findUsers');
    find('users', res);
};

exports.findItems = function(req, res) {
    console.log('in findItem');
    find('items', res);
};


exports.createUser = function(req, res){
    //res.cookie('name', 'tobi', { domain: 'localhost', path: '/framewks/rest', secure: true });
    var body= req.body; 
    db.collection('users', function(err, collection) {
        collection.insert(body, function(err, saved) {
            console.log(saved);
            res.jsonp(saved);
        });
    });      
};

exports.getUsersLists = function (req, res) {//lists/:name
    console.log('in getUsersLists');
    var name =req.params.name;
    console.log(name);
    db.collection('users', function(err, collection) {
        collection.find({name:name},{lists:1}).toArray(function(err, items) {
            //console.log(items);
            res.jsonp(items);
        });
    });   
};

exports.addList2user = function(req, res){
    console.log('in addList2user');
    var name =req.params.name; 
    var lid =req.params.lid;
    var ObjectId = require('mongoose').Types.ObjectId;
    db.collection('lists', function(err, collection) {
        collection.findOne({_id:ObjectId(lid)}, function(err, items) {
            userlist=(items);
            db.collection('users', function(err, collection) {
                collection.update({name:name},{$push:{lists:userlist}}, {upsert:false}, function(err, saved) {
                    res.jsonp(saved);
                });
            });
            res.jsonp('saved');
        });
    });
};

exports.getListItems4user = function(req, res){
    console.log('in getListItems4user');
    var user =req.params.user; 
    var list =req.params.list;
    db.collection('users', function(err, collection) {
        collection.findOne({name:user}, function(err, auser) {
            var userlists=auser.lists;
            obj = _un.find(userlists, function(obj) { return obj.name == 'groceries'});
            console.log(obj._id);
            /*
            db.collection('items', function(err, collection) {
                collection.find({name:name},{lists:1}).toArray(function(err, items) {
            
                    res.jsonp(saved);
                });
            });
*/
            res.jsonp(obj._id);
        });
    });
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
{lid:'5315545dafcb3c583086f86d',item:'banana', done:false},
{lid:'lid5315545dafcb3c583086f86d',item:'coffee', done:false},
{lid:'lid5315545dafcb3c583086f86d',item:'brown sugar', done:false},
{lid:'lid5315545dafcb3c583086f86d',item:'bacon', done:false},
{lid:'lid5315545dafcb3c583086f86d',item:'apples', done:false},
{lid:'lid5315545dafcb3c583086f86d',item:'brown gravy', done:true},
{lid:'lid5315545dafcb3c583086f86d',item:'bags', done:true},
{lid:'lid5315545dafcb3c583086f86d',item:'applesauce', done:true},
{lid:'lid5315545dafcb3c583086f86d',item:'sugar', done:true},
{lid:'lid5315545dafcb3c583086f86d',item:'baby back ribs', done:true},
{lid:'lid5315545dafcb3c583086f86d',item:'apple butter', done:true}
];

var lists =[];
lists.name = 'lists';
lists.items = [
{name:'groceries'},
{name:'hardware'},
{name:'drugs'},
{name:'groceries'},
{name:'building'},
{name:'garden'},
{name:'groceries'}
];

var users = [];
users.name = 'users';
users.items= [
{name: 'tim', email: 'mckenna.tim@gmail.com', lists:[]},
{name: 'tim2', email: 'mckt_jp@yahoo.com', lists:[]}
];
