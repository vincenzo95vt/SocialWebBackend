const Users = require("../models/userSchema")
const Posts = require("../models/postSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { generateToken } = require("../utils/utils")

const updateUserData = async (req, res) =>{
    try {
        const userId = req.payload.userId || req.payload._id
        !userId && res.status(400).json({
            message: "User not found" 
        }) 
       const values = req.body
       console.log(values)
        const updatedUser = await Users.findByIdAndUpdate(userId, {
            $set: values
        },
        {
            new: true,
            runValidators: true
        }).populate({
            path:"posts",
            populate: "post postName"
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
                console.log(payload)
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
    console.log(user)
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
        const user = await Users.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        const postsData = await Posts.find({
            _id: { $in: user.posts }  
        }).select('postName post');  

        const transformedPosts = postsData.map(post => ({
            _id: { "$oid": post._id},
            postPath: post.post,
            postName: post.postName,
        }));

        const userData = {
            userId: user._id || user.userId,
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

const findUserByName = async (req, res) => {
    try {
        const following = req.payload.following
        const name = req.params.name;
        const users = await Users.find({
            userName: { $regex: new RegExp(name, "i") }
        }).select("-password");

        if (!users || users.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        const usersWithPosts = await Promise.all(users.map(async (user) => {
            console.log(user)
            if(user.privacy === "private" && following.includes(user._id)){
                return {
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
                    email: user.email,
                    privacy:user.privacy
                }
            }else{
                const postsData = await Posts.find({
                    _id: { $in: user.posts }
                }).select('postName post');
    
                const transformedPosts = postsData.map(post => ({
                    _id: { "$oid": post._id },
                    postPath: post.post,
                    postName: post.postName,
                }));
    
                return {
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
                };
            }
        }));
        console.log(usersWithPosts)
        return res.status(200).json({
            status: 200,
            message: "Users found",
            data: usersWithPosts, 
        });
        
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Error getting user data",
            error: error.message
        });
    }
};

const followUser = async (req, res) => {
    try {
        const userId = req.payload.userId
        const userFollowedId = req.params.id
        if(userId === userFollowedId){
            return res.status(400).json({
                status: 400,
                message: "You can't follow yourself",
                });
        }
        const updatedUser = await Users.findById(userFollowedId)
        if(updatedUser.privacy === "public"){
            const updatedPublicUser = await Users.findByIdAndUpdate(userId,
                {$addToSet: {following: userFollowedId}},
                {new: true}    
            ).populate({
                path:"posts",
                populate: "post postName"
            })
            if(!updatedPublicUser){
                return res.status(404).json({
                    status: 404,
                    message: "User not found",
                });
            }
            
            const updateFollowedUser = await Users.findByIdAndUpdate(userFollowedId,
                {$addToSet: {followers: userId}},
                {new: true}
            )
            if(!updateFollowedUser){
                return res.status(404).json({
                    status: 404,
                    message: "User not found",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "User followed successfully",
                data: updatedPublicUser,
            });
        }else{
            return res.status(400).json({
                status: 400,
                message: "User privacy is set to private, manage this with other endpoint",
                });
        }

    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Error following user",
            error: error.message
        });
    }
}

const getUserById = async (req, res) => {
    try {
        const following = req.payload.following
        const userFoundId = req.params.id
        const userFoundInfo = await Users.findById(userFoundId)
        if(!userFoundInfo){
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }
        if(userFoundInfo.privacy === "private" && following.includes(userFoundId)){
            const userDataPrivate =  {
                userId: userFoundInfo._id,
                userName: userFoundInfo.userName,
                name: userFoundInfo.name,
                lastName: userFoundInfo.lastName,
                age: userFoundInfo.age,
                genre: userFoundInfo.genre,
                imgProfile: userFoundInfo.imgProfile,
                description: userFoundInfo.description,
                followers: userFoundInfo.followers,
                following: userFoundInfo.following,
                email: userFoundInfo.email,
                privacy:userFoundInfo.privacy
            }
            return res.status(200).json({
                status: 200,
                message: "User found",
                data: userDataPrivate
            })
        }else{
            const postsData = await Posts.find({
                _id: { $in: userFoundInfo.posts }
            }).select('postName post');

            const transformedPosts = postsData.map(post => ({
                _id: { "$oid": post._id },
                postPath: post.post,
                postName: post.postName,
            }));

            const userDataPublic = {
                userId: userFoundInfo._id,
                userName: userFoundInfo.userName,
                name: userFoundInfo.name,
                lastName: userFoundInfo.lastName,
                age: userFoundInfo.age,
                genre: userFoundInfo.genre,
                imgProfile: userFoundInfo.imgProfile,
                description: userFoundInfo.description,
                followers: userFoundInfo.followers,
                following: userFoundInfo.following,
                myLists: userFoundInfo.myLists,
                email: userFoundInfo.email,
                privacy: userFoundInfo.privacy,
                posts: transformedPosts,
            };
            return res.status(200).json({
                status: 200,
                message: "User found",
                data: userDataPublic
            })
        }
        
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Error geting user data",
            error: error.message
        });
    }
}


module.exports = {getAllUsers, loginUsers, addNewUser, updateUserData, refreshToken, addNewList, 
                    getUserData, addPostToList, findUserByName, followUser, getUserById}