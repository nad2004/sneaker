import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js'; // Nhớ đúng tên file model user

const auth = async (request, response, next) => {
    try {
        const token = request.cookies.accessToken;
        if (!token) {
            return response.status(401).json({
                message: "Provide token",
                error: true,
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Check nếu cần quyền admin
        if (user.role === "ADMIN") {
            next();
        }else if(token) {
            next();
        }
        request.userId = decoded.id;
      
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            });
        }
        if (error.name === "TokenExpiredError") {
            return response.status(401).json({
                message: "Token expired, please login again",
                error: true,
                success: false
            });
        }
        return response.status(500).json({
            message: "You have not logged in",
            error: true,
            success: false
        });
    }
};

export default auth;
