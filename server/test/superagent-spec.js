var superagent = require('superagent')
var expect = require('expect.js')

describe('superagent:', function(){
  var name = 'tim7';
  var ucnt = 0;
  var listId = '1';
  var listShops = 'groceries';
  it('GET / should be running and return: please select...', function(done){
    superagent.get('http://localhost:3000')
      .end(function(e, res){
        console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        expect(res.body).to.be.a('string')
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
        console.log(listOfUsers);
        ucnt = listOfUsers.length;
        console.log(ucnt);
        done()
      })
  })

  it('POSTs a new /user/:tim7 -> full array of objects ', function(done){
    superagent.post('http://localhost:3000/users')
      .send({name:name, email:"tim@sitebuilt.net", lists:[]})
      .end(function(e,res){
        console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.eql(1)
        expect(res.body[0]._id.length).to.eql(24)
        expect(res.body[0].name).to.be(name)
        done()
      })    
  })

  it('rejects POST of duplicate user/:tim7 ', function(done){
    superagent.post('http://localhost:3000/users')
      .send({name:name, email:"tim@sitebuilt.net", lists:[]})
      .end(function(e,res){
        console.log(res.body.code)
        expect(res.body.code).to.eql(11000)
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
        console.log(listOfUsers);
        expect(listOfUsers.length).to.be(ucnt+1);
        console.log(listOfUsers.length);
        done()
      })
  })



  it('PUTs a new :list on /users/:name/:listId', function(done){
    superagent.put('http://localhost:3000/users/'+name+'/'+listId)
      .send()
      .end(function(e, res){
        console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.lid).to.eql(listId) 
        expect(res.body.shops).to.be(listShops)       
        done()
      })
  })
   
  it('DELs users/:name from users ', function(done){
    superagent.del('http://localhost:3000/users/'+name)
      .end(function(e, res){
        console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body).to.eql(1)
        done()
      })
  })   
})