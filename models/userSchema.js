const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    imgProfile:{
        type: String,
        require: true,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    email:{ 
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    description:{ 
        type: String,
        require: true,
    },
    age:{ 
        type: Number,
        require: true
    },
    name: { 
        type: String,
        require: true
    },
    lastName:{ 
        type: String,
        require: true
    },
    followers:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        require: true,
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        require: true,
    }],
    genre:{
        type: String,
        enum: ["Hombre", "Mujer"],
        require: true
    },
    role:{ 
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    privacy:{ 
        type: String,
        require: true,
        enum: ["private", "public"],
        default: "public"
    },
    myLists: [ 
        {
            name: { 
                type: String,
                required: true,
            },
            description: { 
                type: String,
                required: true,
            },
            favouritePosts: [
                { 
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                }
            ],
        }
    ]
})


const Users = mongoose.model("Users", userSchema)

module.exports = Users
