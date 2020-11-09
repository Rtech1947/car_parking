const mongoose = require('mongoose');
mongoose.connect('mongo "mongodb+srv://cluster0.vzrmj.mongodb.net/vehicle" --username rtech45',{ useNewUrlParser:true , useCreateIndex:true,});
var conn = mongoose.Collection;
var spaceSchema = new mongoose.Schema({
    spacetitle:{
        type:String,
        required:true,
    },
    totalparkingspace:{
        type:String,
        required:true,
    },
    date:{
        type: Date, 
        default: Date.now }
});
var userModel  = mongoose.model('spaces',spaceSchema);
module.exports = userModel;