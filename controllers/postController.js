const Post = require("../models/postSchema")

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
            return res.status(200).json({
                status: 200,
                message:"Success request",
                posts: posts
                })
        }
    } catch (error) {
        return res.status(400).json({
            status: 401,
            message: "Something went wrong providing the data",
            error: error
        })
    }
}

const addNewComment = async (req, res) => {
    try {
        const userComment = req.payload.userId
        const postId = req.params.id
        const {comment} = req.body
        console.log(req.body)
        const data = await Post.findById(postId)
        !data ? res.status(404).send("Cannot find any post with those params") :
        data.comments.push({
            usuario: userComment,
            content: comment,
        })
        await data.save()
        res.status(200).json({
            status: 200,
            message: "Comment added successfully",
            data: data
        })
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Something went wrong adding the comment",
            error: error
        })
    }
}

module.exports = {getAllPosts, addNewComment}