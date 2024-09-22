const { getAllPosts } = require("../controllers/postController")
const { verifyToken } = require("../middlewares/auth")

const router = require("express").Router()

router.get("/", verifyToken, getAllPosts)

module.exports = router