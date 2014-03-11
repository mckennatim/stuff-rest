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
    });