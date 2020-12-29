const {db ,Users,friends,chatting}=require('../db');
const  bcrypt=require('bcryptjs');
const Sequelize=require('sequelize');
const Op = Sequelize.Op;
    async function createUser(username,password,email,city,secretToken,avatar){

        const user=await Users.findOne({where:{
              username 
     
            }})
      
     if(user){
         
         throw new Error("user already exist");
     }
     else{
        const hash=await bcrypt.hash(password,8);
        
        const userad= await  Users.create({
            username:username,
            email:email,
            password:hash,
            city:city,
            secretToken:secretToken,
            avatar
        })
         return true;
     }



        }


    
async function allusers(userId){
    // const users=Users.findAll({
    //     attributes:{exclude:['email', 'password','secretToken','active','createdAt','updateAt']}
    // friends.findAll({
    //     where:{
    //         id:userId,
    //         attributes:{include:['friendId']}
    //     }
    // })
    // });
    const alreadyfriend=await friends.findAll({
      
        where:{
            friendId:{[Op.eq]:userId}        
           
        },
        attributes:['userId']
    })
let arr=[];
let t=0;
for(let f of alreadyfriend){
arr[t++]=f.userId;
}
 
 const user=await Users.findAll({
       where:{
         id: {[Op.notIn]:arr}   
}

 })
    return user;

}

async function addfriends(userId,friendId){
 try{



 const friend=  await  friends.create({
      userId,
      friendId
  })
  return true;
 }catch(error){
    
     return false;
 }


}
    
async function singleuser(userId){

    const user=await Users.findOne({
        where:{
            id:userId
        }
    })
    return user;
}
    


async function userByname(query){
 
    const user=Users.findAll({
    where: {
     username:{ [Op.like]:'%'+ query + "%"    } 
    }
})
    return user;
}




async function notification(userId){
   try{
    const requestpending= await friends.findAll({
   where:{
       userId:{[Op.eq]:userId},
       status:1
   }
    })
    return requestpending;
}catch(err){
    return err;
}
}


async function addrequest(userId,friendId){
try{
  const updatefriend=  await friends.update(
        {status:0},
       { where:{
            userId:userId,
            friendId:friendId
        }
    })
    return true;
}catch(err){
    
    return err;
}
}

async function generaterelation(UserId,friendId){
    try{
  const gen= await friends.create({
       userId:friendId,
       friendId:UserId,
       status:0
   })
return true;
}catch(err){
    return err;
}
}
async function deleteRequest(friendId,userId){
   try{
    const dest= await friends.destroy({
        where:{
            [Op.and]: [{ friendId:friendId }, {  userId:userId }]
            
           
        }
    })
return true;
}catch(err){
    return false;
}
}



async function dummy(userId){
    const alreadyfriend=await friends.findAll({
      
        where:{
         friendId:{[Op.eq]:userId}      
           
        },
        attributes:['friendId']
    })
let arr=[];
let t=0;
for(let f of alreadyfriend){
arr[t++]=f.friendId;
}
return arr;
}

async function myfriends(userId){
    console.log(userId);
  let frnd=  await friends.findAll({
        where:{
            [Op.and]:[{userId:{[Op.eq]:userId}},{status:0}]
        }
    })
    return frnd;
}

async function putchatmsg(message,username,friendname){
   try{
  let d=  await chatting.create({
        message,
        username,
        friendname
    })
return true;
}catch(err){
    return false;
}
}

async function allchat(friendname,username){
    try{
const chat=await chatting.findAll({
    where:{
        [Op.and]:[{friendname},{username}]
    }
})
return chat;
    }  catch(err){
let arr=[];
return arr;
    }
}
        module.exports={
            createUser,
            allusers,addfriends,singleuser,userByname,notification,addrequest,generaterelation,
            deleteRequest,dummy,myfriends,putchatmsg,allchat
     };



































