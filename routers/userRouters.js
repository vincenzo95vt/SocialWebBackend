const router = require("express").Router()
const {getAllUsers, loginUsers, addNewUser, updateUserData} = require("../controllers/userControllers")
const { verifyToken } = require("../middlewares/auth")


router.get("/", getAllUsers)
router.post("/login", loginUsers)
router.post("/signUp", addNewUser)
router.patch("/updateProfile", verifyToken ,updateUserData)


module.exports = router