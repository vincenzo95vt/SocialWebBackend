const { getAllPosts, addNewComment, getPostById } = require("../controllers/postController")
const { verifyToken } = require("../middlewares/auth")

const router = require("express").Router()

router.get("/", verifyToken, getAllPosts)
router.get("/:postId", verifyToken, getPostById)
router.post("/addNewComment/:id", verifyToken, addNewComment)


module.exports = router