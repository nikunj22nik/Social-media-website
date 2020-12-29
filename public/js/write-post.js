
 $(function(){
    let title=document.getElementById('title');
    let body=document.getElementById('description');
    let username=document.getElementById('username').innerText;
 

  
  

    const formData = new FormData();

    const handleImageUpload = event => {
      
        const files = event.target.files
      console.log(files);
        formData.append('myFile', files[0])
             
}

   document.querySelector('#fileUpload').addEventListener('change', event => {
    handleImageUpload(event)
  })


    $('.alertBox').hide(); 
    $('.errorBox').hide();

    btn.addEventListener("click",(event)=>{
       event.preventDefault()

       //https://flaviocopes.com/file-upload-using-ajax/
  
  
       title=title.value;
         body=body.value;
         console.log(formData);  
          console.log(title+" "+body+" "+" "+username)

    
// if(title!="" && body !="" ){

//      $.post('/writepost',{
//         username,
//         title,
//         body

//     },(data)=>{
//         $('.alertBox').show();
      

//         setTimeout(function(){   location.reload(); }, 3000);
   
//     })

// }
// else{
//     $('.errorBox').show();
//     setTimeout(function(){   location.reload(); }, 3000);
// }

})


})



   