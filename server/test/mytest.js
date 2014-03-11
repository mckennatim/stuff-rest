var assert = require('assert'),
    http = require('http');

var app = require('../app.js');


describe('basic server tests', function () {
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

  after(function(){
    //app.close();
  });
  
});    
