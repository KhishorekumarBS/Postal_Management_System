var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var srpSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    displaydate: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    subject: {
    	type: String,
    	required: true
    },
    ddnum: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dealinghand: {
        type: String,
        required: true
    },
    actiondate: {
        type: String,
        required: true
    },
    sendflag: {
        type: String,
        required: true
    },
    stockfile: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('srpschema', srpSchema);