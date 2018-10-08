var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var srpSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    mac_address: {
        type: String,
        required: true
    }    
});
module.exports = mongoose.model('macmapping', srpSchema);