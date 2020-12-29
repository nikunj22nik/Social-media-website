   const express=require('express');
   const fs=require('fs').promises;
   const app=express();



   const PORT=process.env.PORT||5001;
   const path=require('path');

   const passport=require('passport');
   const routes=require('./routes.js');
   const http=require('http');

   const {db,Users}=require("./db");
   const server=http.createServer(app);

   app.use(express.static('public'));
   app.use(express.urlencoded({extended:true}));

   app.use(express.json());
   app.set("view engine","ejs");
   app.set("views",path.join(__dirname,'views'));

   app.get('/',routes);
   app.post('/register',routes);

   app.get('/login',routes);
   app.post('/login',routes);

   app.get('/success',routes);
   app.get('/writepost',routes);

   app.post('/writepost',routes);
   app.get('/userpost',routes);
   app.get('/mypost',routes);
   app.post('/singlepost',routes);
   app.post('/addcomment',routes);
   app.get('/home',routes);
   app.post('/getcomment',routes);

   app.post('/postlikes',routes);
   app.get('/verify',routes);
   app.post('/verify',routes);
   app.get('/addfriend',routes);
   app.post('/addfriend',routes);
   app.post('/changepass',routes);
   app.post('/search',routes);
   app.get('/specificuser',routes);
   app.post('/adduserrequest',routes);
   app.post('/deleterequest',routes);
  app.post('/putchat',routes);
   app.get('/hidenotification',routes);
   app.post('/getchat',routes);
   app.get('/chat',routes);
   db.sync().then(()=>{
         server.listen(PORT,()=>{
             console.log("server is up on port"+PORT);
       })
   
    }).catch(console.error);


//Sockt 
const socketio=require("socket.io");
const io=socketio(server);

io.sockets.on('connection', function (socket) {
    socket.on('join', function (data) {
      socket.join(data.name); // We are using room of socket io
    });
  });
io.on('connection',(socket)=>{
    
    console.log("connection succesfully"+socket.id);
    socket.on('msg_send',(data)=>{
        socket.join(data.by);

        if(data.to){
            io.to(data.to).emit('msg_rcved',data);
        }

    })
})



