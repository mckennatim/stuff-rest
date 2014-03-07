var express = require('express'),
    path = require('path'),
    stuff = require('./routes/stuff'),
    mongoose = require('mongoose');
    _un = require('underscore');



var app = express();
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, '../client')));

app.get('/lists/:name', stuff.getUsersLists);
app.post('/users', stuff.createUser);
//app.post('/lists/:user/:lname', stuff.createList4user);
app.put('/users/:name/:lid', stuff.addList2user);
//app.put('/items/:lid', stuff.add2List);
app.get('/lists', stuff.findLists);
app.get('/users', stuff.findUsers);
app.get('/items', stuff.findItems);
app.get('/users/name/:name', stuff.findByName);
app.get('/:list/id/:id', stuff.findById);
app.get('/items/:user/:list', stuff.getListItems4user);
//app.get('/items/:lid, stuff', stuff.)


app.listen(3020);
console.log('Listening on port 3020...');