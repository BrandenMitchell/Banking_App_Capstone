//AUTHENTICATE USER LOGIN


const tokenService = require('../services/tokenService');
const User = require('../models/User');


const authMiddleware = async (req, res, next) => {
    try {
        
        //check if auth header exists
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message: "No auth Token Provided"});
        }

        //extract the token
        const token = authHeader.split(' ')[1];
        console.log("Token received:", token);

        //verify token
        const decoded = tokenService.verifyAccessToken(token);
        if(!decoded) {
            return res.status(403).json({message: 'Invalid or expired token'});
        }

        //fetch the user
        const user = await User.findById(decoded.sub).select('-password'); //.select() tells mongo what fields to incl or exclu from the req, -password prevents the pass from being sent. 
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        req.user = user;

        next(); //continue to next route

    } catch(err) {
        console.error("Auth middleware error: ", err);
        res.status(500).json({message: "server error related to auth middleware: Failed"});
    }
};


module.exports = authMiddleware;