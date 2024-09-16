const router = require("express").Router()
const {getAllUsers, loginUsers, addNewUser} = require("../controllers/userControllers")


router.get("/", getAllUsers)
router.post("/login", loginUsers)
router.post("/signUp", addNewUser)



module.exports = router