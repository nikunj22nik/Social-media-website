  const nodemailer=require('nodemailer');
  
  const transport=nodemailer.createTransport({
 
  service:"gmail",
      auth:{
       user:'nikunjgupta77341@gmail.com',
       pass:'7669306341'
  }

});

var mailOption={
  from:"nikunjgupta77341@gmail.com",
  to:"mak.glf33@gmail.com",
  subject:"you are intelligent boy",
  text:" himnshi wiil be your wife."
};
transport.sendMail(mailOption,function(error,info){
  if(error){
    console.log(error);
  }
else{
  console.log('email sent'+ info.response);
}

});

 







 
  





                  














  



  

  


























































