var mongoskin = require('mongoskin')
var db = mongoskin.db('mongodb://localhost:27017/stuffDb', {safe:true})
module.exports = db