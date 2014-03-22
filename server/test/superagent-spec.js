var superagent = require('superagent')
var expect = require('expect.js')

describe('superagent:', function(){
  var name = 'tim7';
  var ucnt = 0;
  var listId = '0';
  var otherListId = '00';
  var listShops = 'testShop';
  it('GET / should be running and return: please select...', function(done){
    superagent.get('http://localhost:3000')
      .end(function(e, res){
        //console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        expect(res.body).to.be.a('string')
        done()
      })    
  })
  describe('users', function(){
    
    it('DELs users/:name from users->success=1', function(done){
      superagent.del('http://localhost:3000/users/'+name)
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
          done()
        })
    }) 
    it('GETs {} if users/:tim7 doesnt exist', function(done){
      superagent.get('http://localhost:3000/users/'+name)
        .end(function(e,res){
          //console.log(res.body)
          expect(res.body).to.eql({})
          done()
        })
    })    
    it('GETs all users and counts em', function(done){
      superagent.get('http://localhost:3000/users')
        .end(function(e, res){
          // console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body.length).to.be.above(0)
          expect(res.body).to.be.an('array')
          //possible util 
          var listOfUsers= res.body.map(function (item){return item.name});
          //console.log(listOfUsers);
          ucnt = listOfUsers.length;
          //console.log(ucnt);
          done()
        })
    })

    it('POSTs a new /user/:tim7 -> full array of objects ', function(done){
      superagent.post('http://localhost:3000/users')
        .send({name:name, email:"tim@sitebuilt.net", lists:[]})
        .end(function(e,res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body.length).to.eql(1)
          expect(res.body[0]._id.length).to.eql(24)
          expect(res.body[0].name).to.be(name)
          done()
        })    
    })
    it('GETs all users expecting the count to go up', function(done){
      superagent.get('http://localhost:3000/users')
        .end(function(e, res){
          // console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body.length).to.be.above(0)
          expect(res.body).to.be.an('array')
          //possible util 
          var listOfUsers= res.body.map(function (item){return item.name});
          //console.log(listOfUsers);
          expect(listOfUsers.length).to.be(ucnt+1);
          //console.log(listOfUsers.length);
          done()
        })
    })
    +    
    it('GETs a users/:tim7', function(done){
      superagent.get('http://localhost:3000/users/'+name)
        .end(function(e,res){
          //console.log(res.body)
          expect(res.body.name).to.eql(name)
          done()
        })
    })

    it('rejects POST of duplicate user/:tim7 ->11000', function(done){
      superagent.post('http://localhost:3000/users')
        .send({name:name, email:"tim@sitebuilt.net", lists:[]})
        .end(function(e,res){
          //console.log(res.body.code)
          expect(res.body.code).to.eql(11000)
          done()
        })    
    })

    it('PUTs a new :list on /users/:name/:listId->list', function(done){
      superagent.put('http://localhost:3000/users/'+name+'/'+listId)
        .send()
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(typeof res.body).to.eql('object')
          expect(res.body.lid).to.eql(listId) 
          expect(res.body.shops).to.be(listShops)       
          done()
        })
    })
    it('rejects a PUT of new :list on /users->list already included', function(done){
      superagent.put('http://localhost:3000/users/'+name+'/'+listId)
        .send()
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.be('list already included')       
          done()
        })
    })    
    it('reject a PUT of new :list for user -> name taken, choose another', function(done){
      superagent.put('http://localhost:3000/users/'+name+'/'+otherListId)
        .send()
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.be('name taken, choose another')       
          done()
        })
    })         
  })
  describe('products', function(){
    it('GETs all /products', function(done){
      superagent.get('http://localhost:3000/products/')
        .end(function(e,res){
          expect(e).to.eql(null)
          done()          
        })
    })
    it('GETs all /products for /:listId 0', function(done){
      superagent.get('http://localhost:3000/products/'+listId)
        .end(function(e,res){
          //console.log(res.body)          
          expect(res.body.length).to.eql(5)          
          done()          
        })
    })   
  })  
})