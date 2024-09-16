const router = require("express").Router()
const {getAllUsers, loginUsers} = require("../controllers/userControllers")


router.get("/", getAllUsers)
router.post("/login", loginUsers)



module.exports = router