const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config.js');


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            message: "Please Login to access the page"
        })
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userId = decoded.userId;
        return next();
    }
    catch(err) {
        res.status(403).json({
            message: "Unauthorized :: verification failed"
        })
    }
}

module.exports = {
    authMiddleware
}
