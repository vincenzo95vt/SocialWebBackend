const jwt = require("jsonwebtoken")

const generateToken = (payload, isRefresh) => {
    if(isRefresh){
        return jwt.sign(payload, process.env.REFRESH_TOKEN, {expiresIn: "5min"})
    }
    return jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn:"15min"})
}

module.exports = {generateToken}