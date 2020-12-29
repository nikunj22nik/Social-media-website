const {db, Comments}=require('../db');


async function createComment(postId,body,userId,username){
try{
const comment=await Comments.create({
     postId,
     body,
     userId,
     username
});
if(comment){
    return true;
}

       }
catch(err){
    return false;
}


}

async function findallcomment(postId){
  const comments=await Comments.findAll({
      where:{
          postId
      }
  })

  return comments;
    
}


module.exports={
    createComment,
    findallcomment
};

