var app = require('./app.js')
var config = require('./config/changeDb')
config.change2db('./config/', 'stuffDb')
app.listen(3000)
