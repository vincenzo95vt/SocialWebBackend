const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.header("auth-token")
    if(!token) return res.status(400).json({
        message: "Access denied. No token provided."
    })
    try {
        const payload = jwt.verify(token, process.env.SECRET_TOKEN)
        req.payload = payload;
        next()
    } catch (error) {
        try {
            const payload = jwt.verify(token, process.env.REFRESH_TOKEN)
            req.payload = payload;
            next()
        } catch (error) {
            res.status(400).send("Expired token")
        }
    }
}

module.exports = {verifyToken}