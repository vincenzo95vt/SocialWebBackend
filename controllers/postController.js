const { model } = require("mongoose")
const Post = require("../models/postSchema")
const { post } = require("../routers/postRouters")

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        .populate({
            path:"userPoster",
            select:"userName imgProfile"
        })
        .populate({
            path: "comments",
            populate:{
                path: "usuario",
                model:"Users",
                select:"userName"
            }
        })
        if(!posts){
            return res.status(200).json({
                message: "No posts found",
            })
        }else{
            console.log(posts)
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