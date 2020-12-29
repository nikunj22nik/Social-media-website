const {db, likes,Msg}=require('../db');
const Sequelize=require('sequelize');
const Op = Sequelize.Op;
async function userlikeornot(userId,postId){

console.log("userId in databases is"+userId+" "+postId);
    const userLike=await likes.findAll({
        where:{
            [Op.and]: [{ userId }, {   postid:postId }]
            }
    })
//console.log("USERLIKE IS DEFINED AS"+typeof(userLike));
    if(Object.keys( userLike).length === 0){
        return false;
    }
    else{
        return true;
    }

}



async function likeadd(userId,postId){

    try{
const like=await likes.create({
   userId,
   postid:postId,
   likecount:1 
})

return like;
    }catch(err){
        return err;
    }

}




async function allpostIdUserLiked(userId){
const postid=await likes.findAll({
    where:{
        userId:{[Op.eq]:userId}
    },
attribute:{exclude:['id','createdAt','updatedAt']}
})

return postid;
}

async function createmsg(friendId,postId,userId,message){
console.log(message +"meassage is")
    try{
        
if(friendId != userId){
 let msg= await Msg.create({
    friendId:friendId,
    userId:userId,
    postId:postId,
    message:message
  })

return true;

}


}catch(err){
return false;
}

}


async function getMessage(userId){
const message= await Msg.findAll({
     where:{
       [Op.and]:[{userId:userId},{showed:false}]
     },
     order:[['id','DESC']]
 })

//  for(let y of message){
//     console.log(y.message);
// }


return message;

}


async function hidenotify(userId){
  Msg.update(
      {'showed':true},
    { where: {userId:{[Op.eq]:userId}}}
  )

}


module.exports={
    userlikeornot,
    likeadd,allpostIdUserLiked,createmsg,getMessage,hidenotify
}