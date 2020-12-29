const Sequelize=require('sequelize');
const db=new Sequelize({
  database:"socialmediaproject",
  host:"localhost",
  dialect:"mysql",
  username:"root",
  password:"nikunj"
})

const Users=db.define('user',{
    id:{
      type:Sequelize.DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true  
    },
    username:{
        type:Sequelize.DataTypes.STRING(50),
        allowNull:false,
        unique:true
    },
    email:{
        type:Sequelize.DataTypes.STRING(50),
        allowNull:false
    },
    password:{
        type:Sequelize.DataTypes.STRING(260),
        allowNull:false
    },

    city:{
       type:Sequelize.DataTypes.STRING(50),
       allowNull:false
    },
    secretToken:{
      type:Sequelize.DataTypes.STRING(100),
     
    },
    active:{
      type:Sequelize.DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
    avatar:{
      type:Sequelize.DataTypes.STRING
  }

})

const Posts=db.define('post',{
  id:{
    type:Sequelize.DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  title:{
    type:Sequelize.DataTypes.STRING(200),
    allowNull:false,
  },
  body:{
    type:  Sequelize.DataTypes.TEXT('long')
  },
username:{
  type:Sequelize.DataTypes.STRING(50),
  allowNull:false
},
likes:{
  type:Sequelize.DataTypes.INTEGER,
  defaultValue:0
},
postImg:{
  type:Sequelize.DataTypes.STRING
},
liked:{
  type:Sequelize.DataTypes.BOOLEAN,
  defaultValue:false
}

   })


    const Comments=db.define('comment',{
        id:  { type:Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        },
        body:{
            type:  Sequelize.DataTypes.TEXT('long')
        },
        username:{
          type:Sequelize.DataTypes.STRING(50),
          allowNull:false
        }
        })


       const likes=db.define('like',{
        id:  { type:Sequelize.DataTypes.INTEGER,
          autoIncrement:true,
          primaryKey:true,
          },
          postid:{
              type: Sequelize.DataTypes.INTEGER,
              allowNull:false 
          },
          likecount:{
            type: Sequelize.DataTypes.INTEGER,
            
          },
          userId:{
            type: Sequelize.DataTypes.INTEGER,
            allowNull:false
          }
       }) 



       const friends=db.define('friend',{
          
        id:  { type:Sequelize.DataTypes.INTEGER,
          autoIncrement:true,
          primaryKey:true,
          },
          userId:{
            type:Sequelize.DataTypes.INTEGER,
            allowNull:false
          },
          friendId:{
            type:Sequelize.DataTypes.INTEGER,
            allowNull:false
          },
          status:{
            type:Sequelize.DataTypes.INTEGER,
            defaultValue:1
          }
     })
        Users.hasMany(Posts);
        Posts.belongsTo(Users);


        Users.hasMany(Comments);
        Comments.belongsTo(Users);

        Posts.hasMany(Comments);
        Comments.belongsTo(Posts);
const Msg=db.define('message',{
  id:  { type:Sequelize.DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
    },
    message:{
      type:Sequelize.DataTypes.STRING,
      allowNull:false
    },
    userId:{
      type:Sequelize.DataTypes.INTEGER
    },postId:{
      type:Sequelize.DataTypes.INTEGER
    },
    friendId:{
      type:Sequelize.DataTypes.INTEGER
    },
    showed:{
      type:Sequelize.DataTypes.BOOLEAN,
      defaultValue:false
    }

})

const chatting=db.define('chatting',{
  id:  { type:Sequelize.DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
    },
    message:{
      type: Sequelize.TEXT('long'),
      allowNull:false
    },
    username:{
      type:Sequelize.DataTypes.STRING
    },
    friendname:{
      type:Sequelize.DataTypes.STRING

    }

})


        module.exports={
            db,
            Users,
            Posts,
            Comments,likes, friends,Msg,chatting
        }































