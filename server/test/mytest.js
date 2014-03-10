var app = require('../app.js')
var config = require('../config/changeDb')
config.change2db('../config/', 'test')
app.listen(3020)