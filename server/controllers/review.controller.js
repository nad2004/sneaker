import ReviewModel from "../models/review.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
export async function createReviewController(request, response) {
    try {
        const { user, product, rating, comment } = request.body;

        if (!user || !product || !rating) {
            return response.status(400).json({
                message: "Provide user, product, rating, and comment",
                error: true,
                success: false
            });
        }

        const productExists = await ProductModel.findById(product);
        if (!productExists) {
            return response.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        const newReview = new ReviewModel({ user, product, rating, comment });
        await newReview.save();

        return response.json({
            message: "Review created successfully",
            error: false,
            success: true,
            data: newReview
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getReviewsByProductController(request, response) {
    try {
        const { productId } = request.body;

        const reviews = await ReviewModel.find({ product: productId }).populate("user", "name avatar email");

        return response.json({
            message: "Reviews fetched successfully",
            error: false,
            success: true,
            data: reviews
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function deleteReviewController(request, response) {
    try {
        const { reviewId, userId } = request.body; // Lấy reviewId và userId từ request

        // Lấy thông tin user từ database (hoặc từ JWT nếu bạn dùng authentication)
        const user = await UserModel.findById(userId);
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Kiểm tra xem review có tồn tại không
        const review = await ReviewModel.findById(reviewId);
        if (!review) {
            return response.status(404).json({
                message: "Review not found",
                error: true,
                success: false
            });
        }

        // Nếu user có role "ADMIN", cho phép xóa mà không cần kiểm tra userId
        if (user.role !== "ADMIN" && review.user.toString() !== userId) {
            return response.status(403).json({
                message: "You are not authorized to delete this review",
                error: true,
                success: false
            });
        }

        // Nếu hợp lệ thì xóa review
        await ReviewModel.findByIdAndDelete(reviewId);

        return response.json({
            message: "Review deleted successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

