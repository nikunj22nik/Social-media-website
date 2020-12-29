
const readmoreBtn=$('.read');
const comment=$('.comment');
console.log(comment);
console.log(readmoreBtn);

readmoreBtn.click(function(event){
  
    $.post('/singlepost',{id:event.target.id},(data)=>{
    $('.modal-body').text(data.body);
    $('#title').text(data.title);
    $('#exampleModal').modal("show");
    
        });

    });

    comment.click(function(event){
      console.log(event.target.id);
      document.getElementById('postid').value=event.target.id;
      $('#staticBackdrop').modal("show");
})










