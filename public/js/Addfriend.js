







console.log("hii");

let btn=$(".addfriend");

btn.click(function(event){
    let friendId=event.target.id;
    let id=event.target.id
    console.log(id);
    $.post('/addfriend',{
        friendId
    },(data)=>{
        if(data.state){
        alert(data.msg);
        $(`#${id}`).attr("disabled", true);
        }else{
alert(data.msg)
        }
    
    })
})

















































