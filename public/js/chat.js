console.log("hiiii");
const socket=io();
let name;

let by=document.getElementById('user_name').innerText;
console.log(by);
    let messageArea = document.querySelector('.messageArea')
    let alluser=$('.username')
    var ulog=false; 
    let a=1;  
alluser.click(function(event){
    ulog=true;
    console.log("yrrrr");
    name=event.target.innerText;
 
$.post('/getchat',{
    friendname:name,
    username:by
},(data)=>{
    $('.messageArea').empty();
for(let u of data){
 
    if(u.username==by){
        let mainDiv=document.createElement('div');
  
        mainDiv.classList.add('outgoing','message');
   
        let html=`<h5>${u.username}</h5>
        <p>${u.message}</p>`;
   
        mainDiv.innerHTML=html;
        messageArea.appendChild(mainDiv);
        scrollToBottom();
    }else{
        let mainDiv=document.createElement('div');
  
        mainDiv.classList.add('incoming','message');
   
        let html=`<h5>${u.username}</h5>
        <p>${u.message}</p>`;
   
        mainDiv.innerHTML=html;
        messageArea.appendChild(mainDiv);
        scrollToBottom();
    }


}


})


    let btn=document.getElementById('button-addon2');


    socket.emit('join', {name:by});


    btn.addEventListener('click',function(event){
 
     sendMessage(document.getElementById('message').value);
    })
    
     
})

   
 
 
 function sendMessage(message){

 let  msg={
     by,
     to:name,
 message:message.trim()
 }
 $.post('/putchat',{
     username:by,
     friendname:name,
     message
 },(data)=>{
     console.log(data);
 })
 appendMessage(msg,'outgoing');
 
 //send to server

socket.emit('msg_send',msg);

}
 
 
 
 function appendMessage(msg,type){
     let mainDiv=document.createElement('div');
  
      let className=type;
      mainDiv.classList.add(className,'message');
 
      let html=`<h5>${by}</h5>
      <p>${msg.message}</p>`;
 
      mainDiv.innerHTML=html;
      messageArea.appendChild(mainDiv);
     }



     socket.on('msg_rcved',(data)=>{
         console.log("data received"+data.message+" "+data.by);
        let mainDiv=document.createElement('div');
  
        mainDiv.classList.add('incoming','message');
   
        let html=`<h5>${data.by}</h5>
        <p>${data.message}</p>`;
   
        mainDiv.innerHTML=html;
        messageArea.appendChild(mainDiv);
        scrollToBottom();
     })

     function scrollToBottom() {
        messageArea.scrollTop = messageArea.scrollHeight
    }
    