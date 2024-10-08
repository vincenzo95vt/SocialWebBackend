const router = require("express").Router()
const {getAllUsers, loginUsers, addNewUser, updateUserData, refreshToken, addNewList, getUserData, addPostToList, findUserByName} = require("../controllers/userControllers")
const { verifyToken } = require("../middlewares/auth")


router.get("/", getAllUsers)
router.get("/refreshUserData", verifyToken, getUserData)
router.get("/findUserByName/:name", verifyToken, findUserByName)
router.post("/refreshToken", refreshToken)
router.post("/login", loginUsers)
router.post("/signUp", addNewUser)
router.patch("/addNewList", verifyToken, addNewList)
router.patch("/addPostToList/:listId", verifyToken, addPostToList)
router.patch("/updateProfile", verifyToken ,updateUserData)


module.exports = router