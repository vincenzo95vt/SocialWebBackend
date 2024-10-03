const router = require("express").Router()
const {getAllUsers, loginUsers, addNewUser, updateUserData, refreshToken, addNewList} = require("../controllers/userControllers")
const { verifyToken } = require("../middlewares/auth")


router.get("/", getAllUsers)
router.post("/refreshToken", refreshToken)
router.post("/login", loginUsers)
router.post("/signUp", addNewUser)
router.patch("/addNewList", verifyToken, addNewList)
router.patch("/updateProfile", verifyToken ,updateUserData)


module.exports = router