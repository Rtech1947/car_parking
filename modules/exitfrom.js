const mongoose = require('mongoose');
mongoose.connect('mongo "mongodb+srv://cluster0.vzrmj.mongodb.net/vehicle" --username rtech45',{ useNewUrlParser:true , useCreateIndex:true,});
var conn = mongoose.Collection;
var exitSchema = new mongoose.Schema({
    vnumber:{
        type:String,
        required:true,
    },
    vehicletype:{
        type:String,
        required:true,
    },
    exittime:{
        type:String,
        required:true,
    },
    exitdate:{
        type:Date,
        required:true,
    },
    date:{
        type: Date, 
        default: Date.now }
});
var exitModel  = mongoose.model('Exites',exitSchema);
module.exports = exitModel;