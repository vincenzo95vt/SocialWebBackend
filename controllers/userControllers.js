const Users = require("../models/userSchema")
const bcrypt = require("bcrypt")


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
        const {username, name, lastname, email, password, description, age, genre} = req.body
        const user =  new Users({
            username: username,
            name: name,
            lastname: lastname,
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

module.exports = {getAllUsers, loginUsers, addNewUser}