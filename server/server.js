var express = require('express'),
    path = require('path'),
    stuff = require('./routes/stuff'),
    mongoose = require('mongoose');



var app = express();
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, '../client')));

app.post('/users', stuff.createUser);
app.put('/users/:name/:lid', stuff.addList2user);
app.get('/:name', stuff.find);
app.get('/users/:name', stuff.findByName);
app.get('/:list/:id', stuff.findById);

app.listen(3020);
console.log('Listening on port 3020...');