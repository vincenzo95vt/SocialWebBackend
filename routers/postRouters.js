const { getAllPosts, addNewComment, getPostById, deletePostById, updatePost } = require("../controllers/postController")
const { verifyToken } = require("../middlewares/auth")

const router = require("express").Router()

router.get("/", verifyToken, getAllPosts)
router.get("/:postId", verifyToken, getPostById)
router.post("/addNewComment/:id", verifyToken, addNewComment)
router.patch("/:id", verifyToken, updatePost)
router.delete("/:postId", verifyToken, deletePostById)

module.exports = router