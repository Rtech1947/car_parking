const mongoose = require('mongoose');
mongoose.connect('mongo "mongodb+srv://cluster0.vzrmj.mongodb.net/vehicle" --username rtech45',{ useNewUrlParser:true , useCreateIndex:true,});

var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    username :{
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },
    password:{
        type:String,
        required:true,
    },
    date:{
        type: Date, 
        default: Date.now }
});
var userModel = mongoose.model('users',userSchema);
module.exports = userModel;