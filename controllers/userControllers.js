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
        message: "User updated successfully",
        data: updatedUser
       })
    } catch (error) {
        res.status(400).json({
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
                message: "Login Successfull",
            })
            :
            res.status(400).json({
                message: "email or password invalid, please try again with another",
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Error login users",
            error: error.message
        })
    }
}

const addNewUser = async (req, res) => {
    try {
        const {userName, name, lastName, email, password, description, age, genre} = req.body
        const user =  new Users({
            userName: userName,
            name: name,
            lastName: lastName,
            email: email,
            password: bcrypt.hash(password, 10),
            description: description,
            age: age,
            genre: genre
        })
    await user.save()
    res.status(200).json({
        message:"User created succesfully"
    })
    } catch (error) {
        res.stauts(400).json({
            message: "Error creating user",
            error: error.message
        })
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