
import express from 'express';
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} from '../controllers/postController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getPosts)
    .post(protect, authorize('admin'), createPost);

router.route('/:id')
    .get(getPost)
    .put(protect, authorize('admin'), updatePost)
    .delete(protect, authorize('admin'), deletePost);

export default router;
