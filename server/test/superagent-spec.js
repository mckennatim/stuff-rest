var superagent = require('superagent')
var expect = require('expect.js')

describe('superagent:', function(){
  var name = 'tim7';

  it('post a new /user/:tim7 ', function(done){
    superagent.post('http://localhost:3000/users')
      .send({name:name, email:"tim@sitebuilt.net", lists:[]})
      .end(function(e,res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.eql(1)
        expect(res.body[0]._id.length).to.eql(24)
        id = res.body[0]._id
        done()
      })    
  })

  it('retrieves an object', function(done){
    superagent.get('http://localhost:3000/users/'+name)
      .end(function(e, res){
        console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)        
        expect(res.body.name).to.eql(name)        
        done()
      })
  })

  it('retrieves a collection', function(done){
    superagent.get('http://localhost:3000/users')
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        var listOfUsers= res.body.map(function (item){return item.name});
        console.log(listOfUsers);
        expect(listOfUsers).to.contain(name)        
        done()
      })
  })

  it('updates an object', function(done){
    superagent.put('http://localhost:3000/users/'+name+'/1')
      .send()
      .end(function(e, res){
        console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.lid).to.eql('1')        
        done()
      })
  })

  it('checks an updated object', function(done){
    superagent.get('http://localhost:3000/users/'+name)
      .end(function(e, res){
        console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)        
        expect(res.body._id).to.eql(id)        
        expect(res.body.name).to.eql(name)        
        done()
      })
  })   
  /* 
  it('removes an object', function(done){
    superagent.del('http://localhost:3000/collections/test/'+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.msg).to.eql('success')    
        done()
      })
  })
  */      
})