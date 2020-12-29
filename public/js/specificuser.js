const comment = $('.comment');


console.log(comment);

comment.click(function(event){
  $.post('/getcomment', {
        postId: event.target.id
      }, (data) => {
        let html = "";
        for (let comment of data) {
            html +=`<div class="row">
            <div class="col s12 m12">
              <div class="card">
                <div class="card-content black-text">
                  <span class="card-title" style="font-family: 'Langar', cursive;"><i class="fas fa-user"></i>  ${comment.username}</span>
                  <p style="font-family: 'PT Sans', sans-serif;">${comment.body}</p>
                </div>
                </div>
                </div>
                </div>`;
          
        }
        document.getElementById('allcomment').innerHTML = html;


        
    })
    //js for show modal
    
  
  
 
    const elem = document.getElementById('showcomment');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
   let postId = event.target.id;
//post id fetch

$("#addcommentBtn").click(function(event){

    let usercomment=$("#usercomment").val()

 $.post('/addcomment',{
    postId:postId,
     comment:usercomment
},(data)=>{
  document.getElementById('usercomment').value='';
    alert(data);
})


})




})

const likes = $('.likes');
console.log(likes);
likes.click(function(event){

event.preventDefault();

$.post('/postlikes',{
  postid:event.target.id
},(data)=>{
  console.log(event.target.children[0]);
  let likenumber=data.len;
 // console.log(event.target);
 if(data.liked==true){
 event.target.innerHTML=`<i class="fas fa-thumbs-up"></i> Like ${ likenumber}`;
 }
 else{
 event.target.innerHTML=`<i class="far fa-thumbs-up"></i>  Like ${ likenumber}`;  
 }


   })
});
