const mongoose = require("mongoose")

const commentsModel = new mongoose.Schema({
    usuario: {type: mongoose.Schema.Types.ObjectId, require: true},
    content: {type: String},
    date: {type: Date, default: Date.now}
})

const postSchema = new mongoose.Schema({
    post:{ 
        type: String,
        require: true
    },
    postName:{ 
        type: String,
        require: true
    },
    description: { 
        type: String,
        require: true,
        default: ""
    },
    userPoster:{
        type: mongoose.Schema.Types.ObjectId,   
        ref: "Users",
        required: true
    },
    comments:[commentsModel],
    date:{
        type: Date,  
        default: Date.now(),
        require: true
    },
    favourites:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users", 
    }]
})

const Post = mongoose.model("Post", postSchema)

module.exports = Post