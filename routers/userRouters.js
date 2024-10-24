const router = require("express").Router()
const {getAllUsers, loginUsers, addNewUser, updateUserData, refreshToken, addNewList, getUserData, addPostToList, findUserByName, followUser, getUserById} = require("../controllers/userControllers")
const { verifyToken } = require("../middlewares/auth")


router.get("/", getAllUsers)
router.get("/:id", verifyToken, getUserById)
router.get("/refreshUserData", verifyToken, getUserData)
router.get("/findUserByName/:name", verifyToken, findUserByName)
router.post("/refreshToken", refreshToken)
router.post("/followUser/:id", verifyToken, followUser)
router.post("/login", loginUsers)
router.post("/signUp", addNewUser)
router.patch("/addNewList", verifyToken, addNewList)
router.patch("/addPostToList/:listId", verifyToken, addPostToList)
router.patch("/", verifyToken ,updateUserData)


module.exports = router