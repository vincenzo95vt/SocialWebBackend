const Users = require("../models/userSchema")
const bcrypt = require("bcrypt")

const updateUserData = async (req, res) =>{
    try {
        const userId = req.payload.userId
        !idUser && res.status(400).json({
            message: "User not found" 
        }) 
       const {username, name, lastname, email,  description, age, genre, myLists} = req.body
        const updatedUser = await Users.findByIdAndUpdate(idUser, {
            userName: username,
            name: name,
            lastname:lastname,
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
            validatePassword ? res.status(200).json({
                status:400,
                message: "Login Successfull",
            })
            :
            res.status(400).json({
                status: 400,
                message: "email or password invalid, please try again with another",
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

module.exports = {getAllUsers, loginUsers, addNewUser, updateUserData}