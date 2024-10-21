const { sendFollowrequest, acceptFollowRequest, rejectFollowRequest, getFollowRequests } = require("../controllers/followRequestController")
const { verifyToken } = require("../middlewares/auth")

const router = require("express").Router()


router.get("/", verifyToken, getFollowRequests)
router.post("/:id", verifyToken, sendFollowrequest)
router.post("/:id/accept", verifyToken, acceptFollowRequest)
router.post("/:id/reject", verifyToken, rejectFollowRequest)

module.exports = router