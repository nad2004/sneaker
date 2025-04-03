import jwt from 'jsonwebtoken'

const auth = (request, response, next) => {
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

        request.userId = decoded.id; // Gán userId vào request
        next(); // Tiếp tục middleware tiếp theo
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
