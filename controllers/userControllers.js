const Users = require("../models/userSchema")
const Posts = require("../models/postSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { generateToken } = require("../utils/utils")

const updateUserData = async (req, res) =>{
    try {
        const userId = req.payload.userId
        !userId && res.status(400).json({
            message: "User not found" 
        }) 
       const {userName, name, lastName, email,  description, age, genre, myLists} = req.body
        const updatedUser = await Users.findByIdAndUpdate(userId, {
            userName: userName,
            name: name,
            lastName:lastName,
            email: email,
            description:description,
            age:age,
            genre:genre,
            myLists:myLists
        })
       res.status(200).json({
        status:200, 
        message: "User updated successfully",
        data: updatedUser
       })
    } catch (error) {
        res.status(400).json({
            status:400, 
            message: "Error login users",
            error: error.message
        })
    }
}


const loginUsers = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await Users.findOne({
            email: email, 
        })
        if(user){
            const validatePassword = await bcrypt.compare(password, user.password)
            if(validatePassword){
                 const postsData = await Posts.find({
                    _id: { $in: user.posts } 
                }).select('postName post'); 

                const transformedPosts = postsData.map(post => ({
                    _id: { "$oid": post._id },
                    postPath: post.post,
                    postName: post.postName,
                    
                }));
                const payload = {
                    userId: user._id,
                    userName: user.userName,
                    name: user.name,
                    lastName: user.lastName,
                    age: user.age,
                    genre: user.genre,
                    imgProfile: user.imgProfile,
                    description: user.description,
                    followers: user.followers,
                    following: user.following,
                    myLists: user.myLists,
                    email: user.email,
                    privacy: user.privacy,
                    posts: transformedPosts,
                }
                const token = generateToken(payload, false)
                const token_refresh = generateToken(payload, true)
                return res.status(200).json({
                    status: 200,
                    message: "User logged successfully",
                    data: {
                        token: token,
                        token_refresh: token_refresh,
                        userData: payload
                        }
                })
            }else if (!validatePassword){
                return res.status(401).json({
                    status: 401,
                    message: "Email and/or password don´t match"
                })
            }
        }else{
            return res.status(401).json({
                status: 401,
                message: "Email and/or password don´t match"
            })
        }
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Error login users",
            error: error.message
        })
    }
}

const refreshToken = (req, res) => {
    try {
        const ref_token = req.headers["auth-token"]
        if(!ref_token){
            return res.status(401).json({
                status: 401,
                message: "No refresh token provided",
            });
        }

        jwt.verify(ref_token, process.env.REFRESH_TOKEN, (err, payload) => {
            if(err){
                return res.status(403).json({
                    status: 403,
                    message: "Invalid refresh token",
                });
            }

            if (!payload) {
                return res.status(401).json({
                    status: 401,
                    message: "Access denied"
                });
            }
        })
        const user = {
            userId: payload._id,
            email: payload.email,
            name: payload.name,
            lastName: payload.lastName,
            userName: payload.userName,
            description: payload.description,
            age: payload.age,
            imgProfile: payload.imgProfile,
            privacy: payload.privacy
        }
        const new_token = generateToken(user, false)
        const new_refresh_token = generateToken(user, true)

        return res.status(200).json({
            status: 200,
            message: "Refresh token generated",
            data:{
                token: new_token,
                refresh_token: new_refresh_token
            }
        })
        
    } catch (error) {
        res.status(401).json({
            status: 401,
            message: "Error refreshing tokens",
            error: error.message
        }) 
    }
}

const addNewUser = async (req, res) => {
    try {
        const {userName, name, lastName, email, password, age, genre} = req.body
        const user =  new Users({
            userName: userName,
            name: name,
            lastName: lastName,
            email: email,
            password: await bcrypt.hash(password, 10),
            age: age,
            genre: genre
        })
    await user.save()
    res.status(200).json({
        status:200,
        message:"User created succesfully"
    })
    } catch (error) {
        if(error.code === 11000){
            res.status(400).json({
                status: 400,
                message:"Email already in use, please try again with another",
            })
        }else{
            res.status(400).json({
                status: 400,
                message: "Error creating user",
                error: error.message
            })
        }
    }
    
}


const getAllUsers = async (req, res) =>{
    try {
        const data = await Users.find()
        !data ? res.status(400).json({
            message: "No users found"
        })
        :
        res.status(200).json({
            message: "Users found",
            data: data
        })
    } catch (error) {
        res.status(400).json({
            message: "Error fetching users",
            error: error.message
        })
    }
}

const addPostToList = async (req, res) => {
    try {
        const userId = req.payload.userId
        const postId = req.body.postId
        const listId = req.params.listId
        const user = await Users.findById(userId)
        if(!user){
            res.status(400).json({
                message: "User not found",
                })
        }
        console.log(listId)
        const list = user.myLists.find(list => list._id == listId)
        console.log(list)
        list.favouritePosts.push(postId)
        await user.save()
        res.status(200).json({
            message: "Post added to list",
            data: list
            })
    } catch (error) {
        res.status(400).json({
            message: "Error adding post to list",
            error: error.message
        })
    }
}

const addNewList = async (req, res) => {
    try {
        const userId = req.payload.userId
        const {name, postId} = req.body 
        const user = await Users.findById(userId)
        if(!user){
            res.status(400).json({
                message: "User not found"
            })
        }else{
            if(postId){
                const newList = {
                    name: name,
                    favouritePosts: [postId],
                }
                user.myLists.push(newList)
                await user.save()
            }else{
                const newList= {
                    name: name,
                    favouritePosts: []
                }
                user.myLists.push(newList)
                await user.save()
            }
            res.status(200).json({
                status: 200,
                message: "List created successfully"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Error adding list",
            error: error.message
        })
    }
}

const getUserData = async (req, res) => {
    try {
        const userId = req.payload.userId;

        // Buscar el usuario sin el campo de la contraseña
        const user = await Users.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        // Obtener los datos de los posts del usuario
        const postsData = await Posts.find({
            _id: { $in: user.posts }  // Asume que `user.posts` es un array de IDs de posts
        }).select('postName post');  // Seleccionamos los campos relevantes

        // Formatear los datos de los posts
        const transformedPosts = postsData.map(post => ({
            _id: { "$oid": post._id },
            postPath: post.post,
            postName: post.postName,
        }));

        // Crear el payload con los datos del usuario y los posts
        const userData = {
            userId: user._id,
            userName: user.userName,
            name: user.name,
            lastName: user.lastName,
            age: user.age,
            genre: user.genre,
            imgProfile: user.imgProfile,
            description: user.description,
            followers: user.followers,
            following: user.following,
            myLists: user.myLists,
            email: user.email,
            privacy: user.privacy,
            posts: transformedPosts,  // Incluir los posts transformados
        };

        return res.status(200).json({
            status: 200,
            message: "User data fetched successfully",
            data: userData,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: "Error get user data",
            error: error.message
        });
    }
};



module.exports = {getAllUsers, loginUsers, addNewUser, updateUserData, refreshToken, addNewList, getUserData, addPostToList}