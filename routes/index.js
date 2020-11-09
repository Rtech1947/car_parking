var express = require('express');
var router = express.Router();
var userModule =require('../modules/user');
var spaceModule = require('../modules/spaceform');
var entryModule = require('../modules/entryform');
var exitModule = require('../modules/exitform');
var jwt = require('jsonwebtoken'); 


var getspace = spaceModule.find({});
var getentry = entryModule.find({});
var getexit = exitModule.find({});

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}
/* GET home page. */
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function CheckUsername(req,res,next){
  var uname = req.body.uname;
  var exitUSer = userModule.findOne({username:uname});
  exitUSer.exec((err,data)=>{
    if(err) throw err;
    if(data){
    return res.render('Signup',{title:'VEHICLE PARKING SYSTEM', msg:'USERNAME IS ALREADY REGISTERED'});
    }
    next();
  });
}
function Checkemail(req,res,next){
  var email = req.body.email;
  var existemail = userModule.findOne({email:email});
  existemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('Signup',{title:'VEHICLE PARKING SYSTEM',msg:'EMAIL ALREADY REGISTERED'});
    }
    next();
  });

}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'VEHICLE PARKING SYSTEM' });
});



// Login Here
router.get('/Login', function(req, res, next) {
  res.render('Login', { title: 'VEHICLE PARKING SYSTEM',msg:'' });
});
router.post('/Login', function(req, res, next) {
   var username= req.body.uname;
   var password = req.body.password;
   var checkuser = userModule.findOne({username:username});
   checkuser.exec((err,data)=>{
     if(data==null){
       res.render('Login',{title:'VEHICLE PARKING SYSTEM',msg:'INVALID USERNAME OR PASSWORD'});
     }
     else{
     if(err) throw err;
     var getUserId = data._id;
     var getpassword = data.password;
     if(password==getpassword){
      var token = jwt.sign({ userId:getUserId }, 'loginToken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('Loginuser', username);
      res.redirect('/Dashboard');
     }
     else{
  res.render('Login', { title: 'VEHICLE PARKING SYSTEM',msg:'Invalid username and password' });
     }
    }
   });
});



// Signup 
router.get('/Signup', function(req, res, next) {
  res.render('Signup', { title: 'VEHICLE PARKING SYSTEM',msg:'' });
});
router.post('/Signup',CheckUsername,Checkemail ,function(req, res, next) {
   var username = req.body.uname;
   var email = req.body.email;
   var password = req.body.password;
   var confpassword = req.body.confpassword;
   if(password != confpassword){
     res.render('Signup',{title:'VEHICLE PARKING SYSTEM ', msg:'PASSWORD NOT MATCHED'});
   }
   else{
        var userDetails = new userModule({
          username:username,
          email:email,
          password:password
        });
      userDetails.save((err,doc)=>{
        if(err) throw err;
        res.render('Signup',{title:'VEHICLE PARKING SYSTEM' , msg:'USER REGISTERED SUCCESSFULLY'});
      })
   }

  });




router.get('/Dashboard',checkLoginUser, function(req, res, next) {
  
  res.render('Dashboard', { title: 'VEHICLE PARKING SYSTEM' });
});


// space form 

router.get('/Space',checkLoginUser, function(req, res, next) {
  

  res.render('Space', { title: 'VEHICLE PARKING SYSTEM',msg:'' });
});

router.post('/Space',checkLoginUser, function(req, res, next) {
  
    var spacetitle = req.body.spacetitle;
    var totalparkingspace = req.body.totalparkingspace;
    var  description = req.body.description;
     var spaceDetails = new spaceModule({
       spacetitle:spacetitle,
       totalparkingspace:totalparkingspace
     });
     spaceDetails.save((err,doc)=>{
       if(err) throw err;
       res.render('Space', { title: 'VEHICLE PARKING SYSTEM',msg:'SPACE INSERTED SUCCESSFULLY' });
     });
  
});



// ENTRY 
router.get('/Entry',checkLoginUser, function(req, res, next) {

  res.render('Entry', { title: 'VEHICLE PARKING SYSTEM',msg:'' });
});

router.post('/Entry', function(req, res, next) {
  
   var vnumber = req.body.vnumber;
   var vehicletype = req.body.vehicletype;
   var entrytime = req.body.entrytime;
   var entrydate = req.body.entrydate;
    var entryDetails = new entryModule ({
       vnumber:vnumber,
       entrytime:entrytime,
       entrydate:entrydate,
       vehicletype:vehicletype,
    });
    entryDetails.save((err,doc)=>{
      if(err) throw err;

  
  res.render('Entry', { title: 'VEHICLE PARKING SYSTEM',msg:'Entry Details Successfully' });
    });
});


router.get('/Entries',(req, res, next) =>{
 
  getentry.exec((err,data)=>{
    if(err) throw err;
    res.render('Entries', { title: 'VEHICLE PARKING SYSTEM',records:data });
  });

});







router.get('/delete/:id',checkLoginUser, function(req, res, next) {
  
  var id=req.params.id;
  var del=entryModule.findByIdAndDelete(id);
  del.exec(function(err,data){
    if(err) throw err;
    res.redirect('/Entries');
  });

});



router.get('/edit/:id',checkLoginUser, function(req, res, next) {

  var passcat_id=req.params.id;
  var getpassCategory=entryModule.findById(passcat_id);
  getpassCategory.exec(function(err,data){
    if(err) throw err;
 
    res.render('Entry_edit', { title: 'Password Management System',errors:'',success:'',records:data,id:passcat_id});

  });
});

router.post('/edit/',checkLoginUser, function(req, res, next) {
  
  var passcat_id=req.body.id;
  var vnumber=req.body.vnumber;
  var vehicletype = req.body.vehicletype;
 
 var update_passCat= entryModule.findByIdAndUpdate(passcat_id,{vnumber:vnumber,vehicletype:vehicletype});
 update_passCat.exec(function(err,doc){
    if(err) throw err;
 
res.redirect('/Entries');
  });
});




// Exit

router.get('/Exit',checkLoginUser, function(req, res, next) {

  res.render('Exit', { title: 'VEHICLE PARKING SYSTEM',msg:'' });
});
router.post('/Exit',checkLoginUser, function(req, res, next) {
  
  var vnumber = req.body.vnumber;
  var vehicletype = req.body.vehicletype;
  var exittime = req.body.exittime;
  var exitdate = req.body.exitdate;
  var exitDetails = new exitModule ({
    vnumber:vnumber,
    vehicletype:vehicletype,
    exittime:exittime,
    exitdate:exitdate,
    
  });
    exitDetails.save((err,doc)=>{
      if(err) throw err;

  
  res.render('Exit', { title: 'VEHICLE PARKING SYSTEM',msg:'Exit Details Successfully' });
    
 });
  
});
router.get('/Exits',checkLoginUser, function(req, res, next) {
  
  getexit.exec((err,data)=>{
    if(err) throw err;
    res.render('Exits', { title: 'VEHICLE PARKING SYSTEM',records:data });
  });

});
router.get('/exits/delete/:id',checkLoginUser, function(req, res, next) {
  
  var id=req.params.id;
  var del=exitModule.findByIdAndDelete(id);
  del.exec(function(err){
    if(err) throw err;
    res.redirect('/Exits');
  });
});



router.get('/exits/edit/:id',checkLoginUser, function(req, res, next) {
  
  var passcat_id=req.params.id;
  var getpassCategory=exitModule.findById(passcat_id);
  getpassCategory.exec(function(err,data){
    if(err) throw err;
 
    res.render('Exit_edit', { title: 'Password Management System',errors:'',success:'',records:data,id:passcat_id});

  });
});

router.post('/exits/edit/',checkLoginUser, function(req, res, next) {

  var passcat_id=req.body.id;
   var vnumber = req.body.vnumber;
   var vehicletype = req.body.vehicletype;
 var update_passCat= exitModule.findByIdAndUpdate(passcat_id,{vnumber:vnumber,vehicletype:vehicletype});
 update_passCat.exec(function(err,doc){
    if(err) throw err;
 
res.redirect('/Exits');
  });
});



router.get('/Spaces',checkLoginUser, function(req, res, next) {
 
    getspace.exec((err,data)=>{
      if(err) throw err;
      res.render('Spaces', { title: 'VEHICLE PARKING SYSTEM',records:data });
    });
  
});


// space Delete 
router.get('/spaces/delete/:id',checkLoginUser, function(req, res, next) {
  
  var id=req.params.id;
  var del=spaceModule.findByIdAndDelete(id);
  del.exec(function(err){
    if(err) throw err;
    res.redirect('/Spaces');
  });
});
router.get('/spaces/edit/:id',checkLoginUser, function(req, res, next) {
  
  var passcat_id=req.params.id;
  var getpassCategory=spaceModule.findById(passcat_id);
  getpassCategory.exec(function(err,data){
    if(err) throw err;
    
    res.render('Space_edit', { title: 'Password Management System',errors:'',success:'',records:data,id:passcat_id});

  });
});

router.post('/spaces/edit/',checkLoginUser, function(req, res, next) {

  var passcat_id=req.body.id;
  var spacetitle=req.body.spacetitle;
  var totalparkingspace=req.body.totalparkingspace;
 var update_passCat= spaceModule.findByIdAndUpdate(passcat_id,{spacetitle:spacetitle,totalparkingspace:totalparkingspace});
 update_passCat.exec(function(err,doc){
    if(err) throw err;
 
res.redirect('/Spaces');
  });
});
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});


router.get('/Report', async function(req, res, next) {
  try{
    let spaceData = await getspace.exec();
    let entryData = await getentry.exec();
    
    return res.render('Report', { title: 'VEHICLE PARKING SYSTEM',records_entry:entryData,records_space:spaceData });
    }
      catch(err){
        throw Error();
      }
  });


  router.get('/contact',function(req,res,next){
     res.render('Contact',{title:'VEHICLE PARKING SYSTEM'});
  });

router.get('/About',function(req,res,next){
  res.render('About',{title:'VEHICLE PARKING SYSTEM'})
})

module.exports = router;