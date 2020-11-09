const mongoose = require('mongoose');
mongoose.connect('mongo "mongodb+srv://cluster0.vzrmj.mongodb.net/vehicle" --username rtech45',{ useNewUrlParser:true , useCreateIndex:true,});
var conn = mongoose.Collection;
var entrySchema = new mongoose.Schema({
    vnumber:{
        type:String,
        required:true,
    },
    vehicletype:{
        type:String,
        required:true,
    },
    entrytime:{
        type:String,
        required:true,
    },
    entrydate:{
        type:Date,
        required:true,
    },
    date:{
        type: Date, 
        default: Date.now }
});
var entryModel  = mongoose.model('Entries',entrySchema);
module.exports = entryModel;