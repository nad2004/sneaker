import express from "express";
import { 
    createReviewController, 
    getReviewsByProductController, 
    deleteReviewController 
} from "../controllers/review.controller.js";
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
const router = express.Router();

router.post("/create", createReviewController);
router.post("/get-review-product", getReviewsByProductController);
router.delete("/delete",auth, deleteReviewController);

export default router;
