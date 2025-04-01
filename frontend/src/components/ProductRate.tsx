import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import axios from "axios";
import { useState, useEffect } from 'react';

interface ProductReview {
    _id: string;
    product: string;
    user: {
        _id: string;
        avatar: string;
        name: string;
        email: string;
    };
    comment: string;
    rating: number;
    createdAt: string;
}

const ProductRate: React.FC<{ productId: string }> = ({ productId }) => {
    const [rating, setRating] = useState<number>(5);
    const [productReview, setProductReview] = useState<ProductReview[]>([]);

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const reviewResponse = await axios.post("http://localhost:8080/api/review/get-review-product", { productId });
                setProductReview(reviewResponse.data?.data || []);
            } catch (error) {
                console.error("Failed to fetch review product:", error);
            }
        };
        fetchData();
    }, [productId]); // Chạy lại khi `productId` thay đổi

    // Tính rating khi `productReview` thay đổi
    useEffect(() => {
        if (productReview.length > 0) {
            const totalRated = productReview.reduce((total, review) => total + review.rating, 0);
            const averageRating = totalRated / productReview.length;
            setRating(averageRating);
        } else {
            setRating(5); // Mặc định nếu không có đánh giá
        }
    }, [productReview]); // Chạy khi `productReview` thay đổi

    return (
        <Box sx={{ '& > legend': { mt: 2 } }} className="mt-1">
            <Rating
                name="read-only"
                value={rating}
                readOnly
                sx={{ fontSize: "16px", color: "#FBBF24" }}
            />
        </Box>
    );
};

export default ProductRate;
