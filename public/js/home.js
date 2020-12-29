
const readmoreBtn = $('.read');
const comment = $('.comment');
const likes = $('.likes');
console.log(comment);
console.log(readmoreBtn);


//readmore button functionality
readmoreBtn.click(function (event) {

  $.post('/singlepost', { id: event.target.id }, (data) => {
    $('#mbody1').text(data.body);
    $('#modal-title').text(data.title);

    $('#exampleModal').modal("show");
  });


});



//get cooment in modal
comment.click(function (event) {
  console.log(event.target.id);
  document.getElementById('postid').value = event.target.id;

  $.post('/getcomment', {
    postId: event.target.id
  }, (data) => {
    let html = "";
    for (let comment of data) {
      html += `  <div class="accordion my-2" id="accordionExample">
<div class="card">
  <div class="card-header" id="headingOne">
    <h2 class="mb-0">
      <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        Comment by:-${comment.username}
      </button>
    </h2>
  </div>

  <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
    <div class="card-body">
     ${comment.body}
    </div>
  </div>
</div>
</div>`
    }

    document.getElementById('allcomment').innerHTML = html;


  });

  $('#staticBackdrop').modal("show");
console.log("outside the comment section");



})



$("#addcommentBtn").click(function(event){

 
  console.log("hello i am in comment section")
  console.log($("#postid").val()+" "+$("#exampleInputEmail1").val());
  
  if($("#postid").val()!=''&&$("#userid").val()!=''&&$("#exampleInputEmail1").val()!=''){
  $.post('/addcomment',{
    postId:$("#postid").val(),
    comment:$("#exampleInputEmail1").val()
  },(data)=>{
    console.log(data)
    document.getElementById('exampleInputEmail1').value='';
    alert(data);
    $('#staticBackdrop').modal("hide");
  })
  
  }
  })



console.log(likes);
likes.click(function(event){
let userId=document.getElementById('useridlikes').innerText;
console.log("post id is -"+event.target.id);
console.log(userId);
$.post('/postlikes',{
  postid:event.target.id,
  userId
},(data)=>{
  console.log(event.target.children[0]);
  let likenumber=data.len;
 if(data.liked==true){
  document.getElementById(event.target.id).innerHTML=`<i class="fas fa-thumbs-up"></i> Like <span class="badge badge-light contlike"> ${ likenumber}</span>`;
 }
 else{
  document.getElementById(event.target.id).innerHTML=`<i class="far fa-thumbs-up"></i>  Like <span class="badge badge-light contlike"> ${ likenumber}</span>`;  
 }




})


});

$(".change-password").click(function(event){
  $('#changepassword').modal("show");
  $("#password-change-btn").click(function(event){
let oldpass= $('#Password1').val();
  let newpass=$('#Password2').val();


$.post('/changepass',{
  oldpassword:oldpass,
  newpassword:newpass
},(data)=>{
  console.log(data);
  document.getElementById('Password1').value='';
  document.getElementById('Password2').value='';

  alert(data);
    $('#changepassword').modal('hide');


})


  })
})


//show friendrequest modal
$('.showrequest').click(function(event){
  $('#friendRequest').modal('show');





})


$('.deleteuser').click(function(event){
  $.post('/deleterequest',{
    friendId:event.target.id
  },(data)=>{
    alert(data);
    $('#friendRequest').modal('hide');
    location.reload(true)
  })
  
  
  })

$('.adduser').click(function(event){
  console.log(event.target.id);

$.post('/adduserrequest',{
  friendId:event.target.id
},(data)=>{
  alert(data);
  $('#friendRequest').modal('hide');
  location.reload(true);
})


})



// show notificaton of like,comment

$(".shownotification").click(function(event){
$("#modalLike").modal('show');
$('#closing').click(function(e){
  console.log("ia m in closing tag")
  document.getElementById("messageLength").innerText=0;

$.get('/hidenotification',(data)=>{
  console.log("succesfully");
  
})


})
})






