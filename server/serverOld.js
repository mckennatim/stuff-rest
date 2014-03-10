var express = require('express'),
    path = require('path'),
    stuff = require('./routes/stuff'),
    mongoose = require('mongoose');
    _un = require('underscore');



var app = express();
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, '../client')));

app.get('/lists', stuff.findLists);

app.listen(3020);
console.log('Listening on port 3020...');