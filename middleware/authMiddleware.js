const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req,res,next) => {
    try {
        const token = req.body.token ||
                      req.cookies.token ||
                      (req.header("Authorization") && req.header("Authorization").replace("Bearer ","").trim());
        
        if(!token){
            return res.status(401).json({
                success : false,
                message : "token is missing"
            });
        }

        // verify
        try {
            const decode = jwt .verify(token,process.env.JWT_SECRET);
            // Storing the decoded JWT payload in the request object for further use
			req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success : false,
                message : 'token is invalid'
            });
        }

        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message
        });
    }
}