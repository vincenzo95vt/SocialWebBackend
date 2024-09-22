const Post = require("../models/postSchema")

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        if(!posts){
            return res.status(200).json({
                message: "No posts found",
            })
        }else{
            return res.status(200).json({
                status: 200,
                message:"Success request",
                posts: posts
                })
        }
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: "Something went wrong providing the data"
        })
    }
}

module.exports = {getAllPosts}