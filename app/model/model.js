var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ApiSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('apiUrl', ApiSchema);
