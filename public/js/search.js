console.log("hello");
    let btn=$(".addfriend");
  console.log(btn);
     btn.click(function(event){
         const p=event.target.id
          console.log(p);
        $.post('/addfriend',{
            friendId:p
        },(data)=>{
            if(data.state){
            alert(data.msg);
            $(`#${p}`).attr("disabled", true);
            }else{
    alert(data.msg)
            }
        
        })
       
    
     })

