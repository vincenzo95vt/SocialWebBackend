const { getAllPosts, addNewComment } = require("../controllers/postController")
const { verifyToken } = require("../middlewares/auth")

const router = require("express").Router()

router.get("/", verifyToken, getAllPosts)
router.post("/addNewComment/:id", verifyToken, addNewComment)


module.exports = router