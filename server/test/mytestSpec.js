var assert = require('assert')
, request = require('supertest')
, should = require('should')
, http = require('http');

var app = require('../app.js');


describe('basic server tests', function () {
  var url = 'http://localhost:3020';
  before(function(done){
    app.listen(3020); 
    done();
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

  it ('should return all the users', function(done){
    http.get('http://localhost:3020/users', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  })
  it('creates user by POST to /user', function(done){
    var data = {name:"tim3", email:"tim@sitebuilt.net", lists:[]};
    request(url)
      .post('/users')
      .send(data)
        // end handles the response
      .end(function(err, res) {
        if (err) {console.log('error');};
        res.should.have.status(200);
        done();
      });
  })
  it ('should return user data for users/tim', function(done){
    http.get('http://localhost:3020/users/tim', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  })
  /* 
  it('adds a list to user by PUT to /user/:name/:lid', function(done){
    var name = 'tim';
    var  body = {lid: '1'};
    var url='http://localhost:3020/users'+name;
    superagent.put(url)
      .send(body)
      .end(function(err, res) {
        if (err) {console.log('error')};
        res.should.have.status(200);
        done();
      });
  })
  */   
  after(function(){
    //app.close();
  });
  
});    
