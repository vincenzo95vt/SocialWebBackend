const express = require("express")
const mongoose = require("mongoose")
const app = express()
const cors = require("cors")
app.use(express.json())
const PORT = 4400
require("dotenv").config()
app.use(cors())
const urlMongoDB = process.env.URL_MONGODB
mongoose.connect(urlMongoDB)
const db = mongoose.connection


const userRouters = require("./routers/userRouters")
const postRouters = require("./routers/postRouters")


db.on("error", (error) => {
    console.error("Error to connect")
})

db.once("connected", () => {
    console.log("Connection success")
})

db.on("disconnected", (error) => {
    console.error("mongoose default connection is disconnected")
})

app.use("/users", userRouters)
app.use("/posts", postRouters)
app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`)
})
