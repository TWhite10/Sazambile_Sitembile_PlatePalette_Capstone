import jwt from "jsonwebtoken";

export const requireJwtAuth = async (req, res, next) => {
    try {
        // Get the token 
        const authHeader = req.headers.authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                error: {
                    message: "Authentication required :("
                }
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Add users information to the request
        req.user = decoded;
        
        next();
    } catch (error) {
        res.status(401).json({
            error: {
                message: "Invalid token :("
            }
        });
    }
};