import prisma from '../prisma.js';
import { formatResponse } from '../utils/helpers.js';

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { fullName: true }
                }
            }
        });

        res.status(200).json(
            formatResponse(true, 'Posts retrieved successfully', { posts })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res, next) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: req.params.id },
            include: {
                author: {
                    select: { fullName: true }
                }
            }
        });

        if (!post) {
            return res.status(404).json(
                formatResponse(false, 'Post not found')
            );
        }

        res.status(200).json(
            formatResponse(true, 'Post retrieved successfully', { post })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (Admin only)
export const createPost = async (req, res, next) => {
    try {
        const { title, content, type, status, isPinned, slug, coverImage } = req.body;

        const post = await prisma.post.create({
            data: {
                title,
                content,
                type,
                status,
                isPinned,
                slug,
                coverImage,
                authorId: req.user.id
            }
        });

        res.status(201).json(
            formatResponse(true, 'Post created successfully', { post })
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Admin only)
export const updatePost = async (req, res, next) => {
    try {
        const { title, content, type, status, isPinned, slug, coverImage } = req.body;

        const post = await prisma.post.findUnique({
            where: { id: req.params.id }
        });

        if (!post) {
            return res.status(404).json(
                formatResponse(false, 'Post not found')
            );
        }

        const updatedPost = await prisma.post.update({
            where: { id: req.params.id },
            data: {
                title,
                content,
                type,
                status,
                isPinned,
                slug,
                coverImage
            }
        });

        res.status(200).json(
            formatResponse(true, 'Post updated successfully', { post: updatedPost })
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Post not found'));
        }
        next(error);
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Admin only)
export const deletePost = async (req, res, next) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: req.params.id }
        });

        if (!post) {
            return res.status(404).json(
                formatResponse(false, 'Post not found')
            );
        }

        await prisma.post.delete({
            where: { id: req.params.id }
        });

        res.status(200).json(
            formatResponse(true, 'Post deleted successfully')
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(formatResponse(false, 'Post not found'));
        }
        next(error);
    }
};
