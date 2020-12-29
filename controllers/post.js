 const {db,Posts,Users,friends}=require('../db');
 const Sequelize=require('sequelize');

 const Op = Sequelize.Op;
                  
 async function createpost(userId,title,body,username){
 try{
    const postad= await Posts.create({
    userId,
    title,
    body,
    username,

 })

 return postad;
    }
    catch(err){
        return err ;
    }

}

async function createposthavingImg(userId,title,body,username,postImg){
    try{
        const postad= await Posts.create({
        userId,
        title,
        body,
        username,
       postImg
    })
    
    return postad;
        }
        catch(err){
            return err ;
        } 
}


async function singlepost(postId){

    const post= await Posts.findOne({
          where:{
              id:postId
          }
    
    })
return post
}

async function findAllPost(userid){
//     const posts=await Posts.findAll({
//         include:[Users]
//     })
// return posts;

const alreadyfriend=await friends.findAll({
      
    where:{
      userId:{[Op.eq]:userid},
      status:0
       
    },
    attributes:['friendId']
})
let arr=[userid];
let t=1;
for(let f of alreadyfriend){
arr[t++]=f.friendId;
}


const posts=await Posts.findAll({
             where:{
                 userId:{ [Op.in]: arr }
             }
        })

  return posts;

}
async function allfriendId(userid){
    try{
    const alreadyfriend=await friends.findAll({
      
        where:{
           userId:{[Op.eq]:userid}
           
        },
        attributes:['friendId']
    })
    let hashmap=new map();
    
    let t=1;
    for(let f of alreadyfriend){
    hashmap.set(f.friendId,true);
    }
    for (const [key, value] of hashmap.entries()) {
          console.log(key, value);
         }
     return hashmap;
    }catch(err){
        
        return err;
    }

}


async function postsByusername(username){
    try{
    const allpost=await Posts.findAll({
        where:{
            username:{[Op.eq]:username}
        },
        order:[
            ['createdAt','DESC']
        ]
    })
    return allpost
}catch(err){
    return err;
}
}







module.exports={
createpost,
singlepost,
findAllPost,
createposthavingImg,
allfriendId,
postsByusername
}




