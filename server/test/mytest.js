var assert = require('assert')
, request = require('supertest')
, should = require('should')
, http = require('http');

var app = require('../app.js');


describe('basic server tests', function () {
  var url = 'http://localhost:3020';
  before(function(){
    //var config = require('../config/change2db');
    //config.change2db('../config/', 'stuffTest');
    app.listen(3020); 
  });
  it('should return 200', function (done) {
    http.get('http://localhost:3020', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });

  it('should say "please select..."', function (done) {
    http.get('http://localhost:3020', function (res) {
      var data = '';
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        assert.equal('please select a collection, lists, users or items', data);
        done();
      });
    });
  });

  it ('should return 3 users', function(done){
    http.get('http://localhost:3020/users', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  })
/*
  it('creates user by POST to /user', function(done){
    data ='{"name":"tim3", "email":"tim@sitebuilt.net"}';
    request(url)
      .post('/users')
      .send(data)
        // end handles the response
      .end(function(err, res) {
        if (err) {console.log('error');};
        // this is should.js syntax, very clear
        res.should.have.status(200);
        done();
      });
  })
*/
  after(function(){
    //app.close();
  });
  
});    
