const router = require("express").Router()
const {getAllUsers, loginUsers, addNewUser, updateUserData, refreshToken} = require("../controllers/userControllers")
const { verifyToken } = require("../middlewares/auth")


router.get("/", getAllUsers)
router.post("/refreshToken", verifyToken, refreshToken)
router.post("/login", loginUsers)
router.post("/signUp", addNewUser)
router.patch("/updateProfile", verifyToken ,updateUserData)


module.exports = router