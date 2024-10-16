const Post = require("../models/postSchema")

const getAllPosts = async (req, res) => {
    try {
        const payload = req.payload
        if(!payload){
            return res.status(401).json({message: "Unauthorized"})
        }
        const posts = await Post.find()
        .populate({
            path:"userPoster",
            select:"userName imgProfile privacy followers"
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
        }

        const filteredPosts = posts.filter(post => {
            const userPoster = post.userPoster;
            if (userPoster.privacy === "private") {
                return userPoster.followers.includes(payload.userId);
            }
            return true;
        });
        return res.status(200).json({
            status: 200,
            message:"Success request",
            posts: filteredPosts
            })
        
    } catch (error) {
        return res.status(401).json({
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

const getPostById = async(req, res)  => {
    try {
        const postId = req.params.postId
        const post = await Post.findById(postId).populate({
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
        if(!post){
            return res.status(400).json({
                status: 400,
                message: "Post not found",
            })
        } else{
            return res.status(200).json({
                status: 200,
                message: "Post found",
                data: post
            })
        }
    } catch (error) {
       return res.status(400).json({
            status: 400,
            message: "Error get user data",
            error: error
        })
    }
}

const deletePostById = async (req, res) => {
    try {
        const userId = req.payload.userId || req.payload._id
        const postId = req.params.postId;
        const post = await Post.findById(postId)
        if (!post){
            return res.status(400).json({
                status: 400,
                message:"post not found",
                })
        }else{
            if(post.userPoster.toString() !== userId.toString()){
                return res.status(400).json({
                    status: 400,
                    message: "You cannot delete this post",
                })
            }else{
                await Post.findByIdAndDelete(postId)
                return res.status(200).json({
                    status: 200,
                    message: "Post deleted successfully",
                })
            }
        }
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Error get user data",
            error: error
        })
    }
}

module.exports = {getAllPosts, addNewComment, getPostById, deletePostById}