const express = require("express");

const routes = express.Router();
const fs=require('fs').promises;
const fileUpload = require('express-fileupload');
const uuid = require('uuid').v4;
const Sequelize=require('sequelize');
const Op = Sequelize.Op;
const path=require("path");

const randomstring=require('randomstring');

const { dummy,createUser, allusers ,addfriends,singleuser,userByname,notification,addrequest,generaterelation,deleteRequest,myfriends,putchatmsg,allchat} = require('./controllers/user');

const { createpost ,singlepost,findAllPost,createposthavingImg,allfriendId,postsByusername} = require('./controllers/post');

const {createComment,findallcomment }=require('./controllers/comment');

const {userlikeornot,likeadd,allpostIdUserLiked,createmsg,getMessage,hidenotify}=require('./controllers/likes');

const bcrypt = require('bcryptjs');

const nodemailer=require('nodemailer');

const flash = require('connect-flash');

const passport = require("passport");

const session = require('express-session');

const cookieParser = require('cookie-parser');

const { db, Users,Posts, likes,friends} = require('./db');


routes.use(fileUpload());

routes.use(cookieParser('secret'));

routes.use(session({

  secret: 'secret',
  resave: true,
  maxAge: 3600000,
  saveUninitialized: true,
}))




routes.use(passport.initialize());

routes.use(passport.session());

routes.use(flash());

//global variables
routes.use(function (req, res, next) {

  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
})



const checkAuthenticated=function(req,res,next){

    if(req.isAuthenticated()){
      res.set('Cache-Control','no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0')
      return next();
    }
    else{
      res.redirect('/login');
    }
  }

//Authentication
  let localStrategy = require('passport-local').Strategy;


  passport.use(new localStrategy({ usernameField: 'username' }, async (username, password, done) => {
   
   try{
    const userfind = await Users.findOne({
      where: {
        username: username
      }
    })
  
    if (!userfind) {
      return done(null, false, { message: "User Not Exist" });
    }
  
 //checkk if the account verified
 if(!userfind.active){
   return done(null,false,{message:"you need to verify email first"});
 }
 
    const validpass = await bcrypt.compare(password, userfind.password);
  
    if (!validpass) {
      return done(null, false, { message: "Passwod not matched" });
    }
 return done(null, userfind);
  }
  catch(error){
return done(error,false);
  }


}))
  //end of Authentication
  
  passport.serializeUser(function (user, cb) {
    cb(null, user.id);
  })
  
  passport.deserializeUser(function (id, done) {
    Users.findOne({
      // Using sequelize model functoin
      where: {
        id: id,
      },
    }).then(function (user) {
      if (user == null) {
        done(new Error('Wrong user id.'));
      }
  
      done(null, user); // Standerd deserailize callback
    });
  
  });
  
  ///file upload using multer


  












//routing  
 routes.get('/',(req,res)=>{
    res.render('signup');
  });

  
  routes.post('/register',async(req,res)=>{
    let { username, password, email, cpassword ,city} = req.body;
  let err;
  if (!username || !password || !email || !cpassword || !city) {

    err = "fill all the fields";
    res.render('signup', {
      'err': err
    })
  }

  if (password != cpassword) {
    err = "Pssword Don't Match"
    res.render('signup', {
      "err": err,
      "email": email,
      "username": username,
      "city":city


    })
  }  
  const file=req.files.avatar;
  const img_name=file.name;
  
  if(req.files != undefined && file.mimetype != "image/jpeg" && file.mimetype != "image/png"){
    err="Please Upload Jpg/Jpeg or png image"
    res.render('signup',{"err":err,
    "email":email,"username":username,"city":city});
  }


//generate secret token

const secretToken =randomstring.generate();


  if (typeof err == 'undefined') {
   let useremail=email
    try {
      var userad=null;
   
if(!req.files){
  username=username.toLowerCase();
  userad= await createUser(username, password, email,city,secretToken);
  const transport=nodemailer.createTransport({

    service:"gmail",
       auth:{
       user:'nikunjgupta77341@gmail.com',
       pass:'Nikunj@9870697900'
 }

});

var mailOption={
 from:"nikunjgupta77341@gmail.com",
 to:`${useremail}`,
 subject:"Your Verification Token",

 
 html:`
 <p>Your secret Token is <b>${ secretToken}</b></p>
 <p>Please verify this token  using the  link given below:</p>
 <a href="http://localhost:5001/verify">http://localhost:5001/verify</a>`

};
transport.sendMail(mailOption,function(error,info){
 if(error){
   console.log(error);
 }
else{
 console.log('email sent'+ info.response);
}

});
req.flash('success_message', "Register Succesfully...Please Verify first check your email")
res.redirect('/login');
}
else{
  console.log("here with image")

let randnumber=uuid();
  file.mv('public/images/upload_images/'+username+randnumber+file.name, async function(err) {
                             
if(err){
  res.status(500).send(err);

}
let imgname=randnumber+img_name;
   username=username.toLowerCase();
  userad=await createUser(username,password,email,city,secretToken,imgname);
  const transport=nodemailer.createTransport({

    service:"gmail",
       auth:{
       user:'nikunjgupta77341@gmail.com',
       pass:'Nikunj@9870697900'
 }

});

var mailOption={
 from:"nikunjgupta77341@gmail.com",
 to:`${useremail}`,
 subject:"Your Verification Token",

 
 html:`
 <p>Your secret Token is <b>${ secretToken}</b></p>
 <p>Please verify this token  using the  link given below:</p>
 <a href="http://localhost:5001/verify">http://localhost:5001/verify</a>`

};
transport.sendMail(mailOption,function(error,info){
 if(error){
   console.log(error);
 }
else{
 console.log('email sent'+ info.response);
}

});
req.flash('success_message', "Register Succesfully...Please Verify first check your email")
res.redirect('/login');
})

}
 
  

          }
 catch (err) {
      res.render('signup', { "err": err });
    }
 }

})
    
  
routes.get('/register', (req, res) => {
    res.render('signup');
  })


  routes.post('/login', (req, res, next) => {
      passport.authenticate('local', {
      failureRedirect: '/login',
      successRedirect: '/success',
      failureFlash: true
  
    })(req, res, next);
  })
  
  
  routes.get('/success', checkAuthenticated,async (req, res) => {
    const user=await Users.findOne({
      where:req.user.id
    })
    const userImg=user.avatar;
    console.log(userImg);
    if(userImg==null){
      res.render('success',{'username':req.user.username,"userProfile":null})
    }else{
    res.render('success',{'username':req.user.username,"userProfile":userImg});
    }

  })
  routes.get('/username',checkAuthenticated,(req,res)=>{
      res.send(
        { user: req.user.username } 
      )
  })
  
  routes.get('/login', (req, res) => {
    res.render('login');
  })



  //verify user email
routes.get('/verify',(req,res)=>{
  res.render('verify');
})

routes.post('/verify',async(req,res)=>{
  try{
  const {secretToken}=req.body;
  //find account that matches witch secret token
  const user= await Users.findOne({
     where:{
      secretToken:secretToken
     }
   })


if(!user){

  req.flash('error','Wrong secret Token');
  res.redirect('/verify');
  return;
}
const id=user.id;
console.log("user id is "+user.id);
const userupdate=await Users.update(
  
 {active:true, secretToken:''} 
 ,{ where:{ id } }
)
req.flash('success_message',"Thank you! Now you may login");
res.redirect('login');
  }catch(error){
    next(error);
  }
})

  routes.get('/writepost',checkAuthenticated,async(req,res)=>{
    const user=await Users.findOne({
      where:req.user.id
    })
    const userImg=user.avatar;
    res.render('writepost',{"username":req.user.username,"userId":req.user.id,"userProfile":userImg});
})

routes.post('/writepost',checkAuthenticated,async(req,res)=>{

  const userId=req.user.id;

let err;
  if(req.body.body==''&&req.body.title==''&&!req.files){
    const user=await Users.findOne({
      where:req.user.id
    })
    const userImg=user.avatar;
    err="You not filled any entity"
 return res.render('writepost',{"err":err,"username":req.user.username,"userProfile":userImg});
  }


  if(!req.files&&(req.body.body!=''||req.body.title!='')){

    const post=await createpost(userId,req.body.title,req.body.body,req.body.username);
    const user=await Users.findOne({
      where:req.user.id
    })

    let ss="succesfully posted"
    const userImg=user.avatar;
    console.log(userImg);
  return  res.render('writepost',{"success":ss,"username":req.user.username,"userProfile":userImg});
   
  } 

  const file=req.files.postImg;
  const img_name=file.name

  if(req.files != undefined && file.mimetype != "image/jpeg" && file.mimetype != "image/png"){
    err="Please Upload Jpg/Jpeg or png image"
    const user=await Users.findOne({
      where:req.user.id
    })
    const userImg=user.avatar;
  return  res.render('writepost',{"err":err,"username":req.user.username,"userProfile":userImg});
  }
  let randnumber=uuid();
  file.mv('public/images/upload_post/'+req.body.username+randnumber+file.name, async function(err) {

    if(err){
  res.status(500).send(err);
  }
  let imgname=randnumber+img_name;
  const postad=await createposthavingImg(req.user.id,req.body.title,req.body.body,req.user.username,imgname);
  let ss="succesfully posted"
   
  const user=await Users.findOne({
    where:req.user.id
  })
  const userImg=user.avatar;

  

  return  res.render('writepost',{"success":ss,"username":req.user.username,"userProfile":userImg});

})

});


routes.get('/userpost',checkAuthenticated,async(req,res)=>{

     const userId=req.user.id;
       const post = await  Posts.findAll({ 
           where:{
             userId
            }
          
          })
       //   res.render('mypost',{'posts':post});
  
          res.send(post);
  })

  routes.get('/mypost',checkAuthenticated,async(req,res)=>{
    const userId=req.user.id;
    const post = await  Posts.findAll({ 
        where:{
          userId
         }
   })

       const user=await Users.findOne({
        where:req.user.id
      })
      const userImg=user.avatar;
 res.render('mypost',{posts:post,'username':req.user.username,'userId':req.user.id,"userProfile":userImg});
  })



routes.post('/singlepost',async(req,res)=>{

const post=await singlepost(req.body.id);
console.log(post);
res.send( post);

})

routes.post('/addcomment',checkAuthenticated,async(req,res)=>{
  try{
 let comm=await createComment(req.body.postId,req.body.comment,req.user.id,req.user.username);
   

   let message=`${req.user.username} Commented on Your Post -${req.body.comment}`;
   
   const postbyuser=await singlepost(req.body.postId);
let create_msg=await createmsg(req.user.id,req.body.postId,postbyuser.userId,message);
 


  res.send("Comment Succesfully Added");
}catch(err){
  res.send(new Error("something went wrong"));
}


})


routes.get('/home',checkAuthenticated,async(req,res)=>{
const user=await Users.findOne({
  where:{
    id:req.user.id
  }
})
const userImg=user.avatar
const allpost=await findAllPost(req.user.id);
const allpostliked=await allpostIdUserLiked(req.user.id);
if(allpost.length==0){
  let hashmap=new Map();
  let secondmap=new Map(); 
  let friendrequestuser=[];
  let b=[];
 res.render('home',{posts:allpost,'username':req.user.username,'userId':req.user.id,"userProfile":userImg,"notification":0,"hash": hashmap,"hash1":secondmap,"friendrequestuser":friendrequestuser,"requests":b,"messageLen": 0,"get_message":b});
}
else{
//sort the array according to time
  allpost.sort(function(a,b){
    var dateA=new Date(a.createdAt); 
    var dateB=new Date(b.createdAt);
    return dateA-dateB;
  })

let hashmap=new Map();
let secondmap=new Map();
for(let i of allpostliked){
hashmap.set(i.postid,true);
}

for(let j of allpost){
 
  if(!secondmap.has(j.userId)){
   const single_User=await singleuser(j.userId); 
   const image=single_User.avatar;
    secondmap.set(j.userId,image);
   }
}


const requestpending=await notification(req.user.id);
let notify=0;
let friendrequestuser=[];
if(requestpending.length>0){
notify=requestpending.length;
for(let y of requestpending){
 let requested_user_name=await singleuser(y.friendId);
 friendrequestuser.push(requested_user_name);
 }
}





const get_message=await getMessage(req.user.id);
let messageLen=get_message.length;

res.render('home',{posts:allpost,'username':req.user.username,'userId':req.user.id,"userProfile":userImg,"hash":hashmap,"hash1":secondmap,"notification":notify,"requests":requestpending,"friendrequestuser":friendrequestuser,"messageLen": messageLen,"get_message":get_message})
}

})

routes.post('/getcomment',async(req,res)=>{

  const comment=await findallcomment(req.body.postId);
  res.send(comment);

})

routes.post('/postlikes',async(req,res)=>{

console.log("post Id is "+req.body.postid);
const user=await userlikeornot(req.user.id,req.body.postid);
console.log(user);

if(user){
  const yut=await likes.findAll({
    where:{
      postid:req.body.postid
    }
  })
  const k=(yut.length)-1;
const likedelete=await likes.destroy({
    where: {
      postid:req.body.postid,
      userId:req.user.id
    }
})
let pl=await Posts.update({likes:k},{where:{id:req.body.postid}})
      res.send({len:k,liked:false});
}
else{
        console.log(req.user.id+" postlike "+req.body.postid);
         const likeadds=await likeadd(req.user.id,req.body.postid);
         const yut=await likes.findAll({
         where:{
           postid:req.body.postid
       }
    })

    const postbyuser=await singlepost(req.body.postid);
         let user_name =  await singleuser(req.user.id);
                user_name=user_name.username;
    let msgcreate=  await createmsg(req.user.id,req.body.postid,postbyuser.userId,`${user_name} Liked your post`);
    const k= yut.length;
       let pl=  await Posts.update({likes:k},{where:{id:req.body.postid}})
       res.send({len:k,liked:true});
      }

  })




//Adding a friend routes




routes.get('/addfriend',async(req,res)=>{
  let k=await allusers(req.user.id);
  let rr=await dummy(req.user.id);

  console.log("length of dummy is"+rr.length);

for(let q of k){
  console.log(q.avatar);
}
console.log(k.length);
let length=((k.length)-3)/3;
let left=(k.length)%3;
console.log("length is"+ Math.floor(length));
   res.render('Addfriend',{"users":k,"userId":req.user.id,"len":Math.floor(length),"total_len":k.length,"left":left});
})
routes.post('/addfriend',async(req,res)=>{

let friendId=req.body.friendId;
let userId=req.user.id;
console.log(friendId+" "+userId);
 let t=await addfriends(friendId,userId);
     
if(t){
  res.send({msg:"succesfully added your friend",state:true});
}else{
res.send({msg:"OOPS!!something went wrong try again",state:false});
}


  })




//changing user password

routes.post('/changepass',async(req,res)=>{

  console.log(req.body.oldpassword+" "+req.body.newpassword+" "+req.user.id);
  const user=await singleuser(req.user.id);
  const verified =await bcrypt.compare(req.body.oldpassword,user.password);
  console.log(verified);
 if(verified){


  const hash=await bcrypt.hash(req.body.newpassword,8);
  Users.update({
    password:hash
  },{
    where:{id:req.user.id}
  }
  )
  res.send("Your Password correctly changed")
 }else{
   res.send("Please enter correct current password");
 }



})

//search a user
routes.post('/search',async(req,res)=>{
  const u=await userByname(req.body.username);
  const alreadyfriend=await friends.findAll({
      
    where:{
       userId:{[Op.eq]:req.user.id}
       
    },
    attributes:['friendId']
})
let hashmap=new Map();

let t=1;
hashmap.set(req.user.id,true);
for(let f of alreadyfriend){
hashmap.set(f.friendId,true);
}
for (const [key, value] of hashmap.entries()) {
      console.log(key, value);
     }


 res.render('search',{'userdata':u,"hash1":hashmap});
})
routes.get('/search',async(req,res)=>{
  res.render('search');
})




//getting profile  and posts of specific user

routes.get('/specificuser',async(req,res)=>{
  let username = req.query.username;
  console.log(username);
  const allpost=await postsByusername(username);
console.log(req.user.id+"username is-"+req.user.username);
const allpostliked=await allpostIdUserLiked(req.user.id);
let hashmap=new Map();

for(let i of allpostliked){
hashmap.set(i.postid,true);
}

res.render('specificuser',{"posts":allpost,"username":req.user.username,"userId":req.user.id,"hash1":hashmap});
})



routes.post('/adduserrequest',async(req,res)=>{

const first=await addrequest(req.user.id,req.body.friendId);
console.log(first);
 if(first){
  const gen=await generaterelation(req.user.id,req.body.friendId);
  
  if(gen){
    res.send("Now! you both are friends");
  }else{
    res.send("Sorry some problem");
  }

 }
 else{
   res.send("something went wront")
 }

})


routes.post('/deleterequest',async(req,res)=>{
 const del= await deleteRequest(req.body.friendId,req.user.id);

if(del){
  res.send("succesfully delted");
}else{
  res.send("sorry deleted");
}
})



//chat application 

routes.get('/chat',checkAuthenticated,async(req,res)=>{
 let my_frnd= await myfriends(req.user.id);
let arr=[];
for(let u of my_frnd){
  let friend_Id=u.friendId;
 let user_info= await singleuser(friend_Id);
 arr.push(user_info);
}


 res.render('chat',{"myfriend":arr,"username":req.user.username});
})


routes.post('/putchat',async(req,res)=>{

const putchat=await putchatmsg(req.body.message,req.body.username,req.body.friendname);

if(putchat){
  res.send("success");
}else{
  res.send("unsuccesfull hack");
}

})

routes.post('/getchat',async(req,res)=>{
let chat1=  await allchat(req.body.friendname,req.body.username);
let chat2=  await allchat(req.body.username,req.body.friendname);
let final=chat1.concat(chat2);
final.sort(function(a,b){
var dateA=new Date(a.createdAt);
var dateB=new Date(b.createdAt);

  return dateA-dateB;
})

res.send(final);
})



routes.get('/hidenotification',async(req,res)=>{
 let p=await hidenotify(req.user.id);

})
















    module.exports=routes




















     