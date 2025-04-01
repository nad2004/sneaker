import  { useState, useEffect } from "react";
import { Avatar, Pagination , IconButton, Menu, MenuItem} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";


import Rating from '@mui/material/Rating';
interface User {
    _id: string;
    avatar: string;
    name: string;
    email: string;
  }
  interface ProductReview{
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
const CommentSection: React.FC<{ productId: any }> = ({ productId }) => {
    const [page, setPage] = useState(1);
    const commentsPerPage = 5;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedReview, setSelectedReview] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [productReview, setProductReview] = useState<ProductReview[] | null>([]);
    
    useEffect(() => {
        fetchData();
    },[])
    const fetchData = async() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
        try{
           
            const reviewResponse = await axios.post("http://localhost:8080/api/review/get-review-product", {productId: productId});
            console.log(reviewResponse.data)
            setProductReview(reviewResponse.data?.data);
        } catch (error) {
            console.error("Failed to fetch review product:", error);
        }
        
    }
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, reviewId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedReview(reviewId);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedReview(null);
    };
    const handleDelete = async (reviewId: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.delete(`http://localhost:8080/api/review/delete`,
                { 
                headers: { Authorization: `Bearer ${token}` },
                data: { reviewId, userId: user?._id }
            });
            alert("Comment deleted successfully!");
            handleMenuClose();
            window.location.reload();
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert(error?.response.data.message)
        }
    };
    const totalPages = Math.ceil((productReview?.length || 0) / commentsPerPage);
    const displayedReviews = productReview?.slice((page - 1) * commentsPerPage, page * commentsPerPage);
    return (
        <>
        <div className=" my-8">
        <label className="pb-2 border-b-2 border-black font-semibold text-black">User Review</label>
      </div>
        <div className="max-w-full mx-auto bg-white p-4 shadow-md rounded-md">
       
        {/* Input comment */}
        

        <div className="mt-6">
            {/* List comments */}
            {displayedReviews?.map((review) => (
                <div key={review._id} className="mt-6">
                    <div className="flex items-start space-x-3 border-b pb-4">
                        <Avatar src={review?.user?.avatar} />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">
                                    {review?.user?.name}{" "}
                                    <span className="text-gray-400 text-sm">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </p>
                                <div>
                                    <IconButton onClick={(e) => handleMenuOpen(e, review._id)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedReview === review._id}
                                        onClose={handleMenuClose}
                                    >
                                        {/* <MenuItem onClick={handleEdit}>Edit</MenuItem> */}
                                        <MenuItem onClick={() => {handleDelete(review._id)}}>Thu Hồi</MenuItem>
                                    </Menu>
                                </div>
                            </div>
                            <Rating name="read-only" value={review.rating} readOnly />
                            <p className="text-gray-600 mt-1">{review.comment}</p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        color="primary"
                    />
                </div>
            )}
        </div>
        
        </div>
        </>
  );
};

export default CommentSection;
