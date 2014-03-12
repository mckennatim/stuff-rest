    var assert = require('assert');
    var mongoskin = require('mongoskin');
    var db = mongoskin.db('mongodb://localhost:27017/stuffTest', {safe:true});

    result = [];

    describe('basic database tests', function(){
      it('should have 3 users', function(done){
        db.collection('users').find().toArray(function  (err,result){
          console.log(result.length);
          assert.equal(result.length,3);
          done();
        });
      });
      it('should be able to insert new user', function(done){
        body={"name":"tim3", "email":"tim@sitebuilt.net", "lists":[]};
        db.collection('users', function(err, collection) {
          collection.insert(body, function(err, saved) {
              //console.log(saved);
              assert.equal(saved[0].name,body.name);
              done();
          });
        });       
      });
      /*
      it('detects if new user already exists and says so', function(done{
        body={"name":"tim3", "email":"tim@sitebuilt.net", "lists":[]};
        db.collection('users', function(err, collection) {
          collection.insert(body, function(err, first) {

            });
          });
        }); 
      }));
    */
    });