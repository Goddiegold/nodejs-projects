const mongoose = require('mongoose');

const Post = require('../../models/posts.model');
const Cateory = require('../../models/categories.model');
const handleError = require('../../utils/errors.handler');

// Get all posts
const httpGetPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate({ path: 'author', select: 'username -_id' })
            .select('title image author')
            .sort('+username');
      
        if (posts.length === 0) return res.status(204).json({ posts: 'No Content' });

        res.status(200).json({ posts });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get post by ID
async function httpGetPostByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ user: 'Invalid ID' });
        
        const post = await Post.findById(req.params.id)
            .select('-_id -__v')
            .populate({ path: 'author', select: 'username -_id' });

        if (!post) return res.status(404).json({ post: 'Not Found' });

        res.status(200).json({ post });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function httpGetPostByCategory(req, res) {
    try {
        const category = req.query.category;

        let formattedCategory;

        if (category) {
            formattedCategory = category.trim().replace(/\s/g, '-').toLowerCase();
        }

        const filteredPosts = await Post.find({ category: formattedCategory })
            .populate({ path: 'author', select: 'username -_id' })
            .select('title image author');
      
        if (!filteredPosts) return res.status(404).json({ posts: 'Not Found' });

        res.status(200).json({ filteredPosts });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function httpGetPostsCount(req, res) {
    try {
        const postsCount = await Post.countDocuments();

        if (postsCount === 0) return res.status(204).json({ posts: 'No Content' });

        res.status(200).json({ postsCount });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Create a new post
const httpCreatePost = async (req, res) => {
    const user = req.user;
    if (!user) return res.status(401).json({ user: 'Unauthorized' });

    const { title, content, category } = req.body;

    const formattedCategory = category.trim().replace(/\s/g, '-').toLowerCase();

    const categoryCheck = await Cateory.findOne({ name: formattedCategory });
    if (!categoryCheck) return res.status(404).json({ category: 'Not Found' });

    const file = req.file
    if (!file) return res.status(400).json({ image: 'Required' });

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    try {
        const CreatedPost = await Post.create({
            title,
            content,
            image: `${basePath}${fileName}`,
            category: formattedCategory,
            author: user._id,
        });

        if (!CreatedPost) return res.status(501).json({ post: 'Not Implemented' });

        res.status(201).json({ post: 'Created' });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Update an existing post
const httpUpdatePost = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ user: 'Unauthorized' });

        const postId = req.params.id;
        if (!mongoose.isValidObjectId(postId))
            return res.status(400).json({ post: 'Invalid ID' });
        
        const post = await Post.findOne({ _id: postId, author: user._id });
        if (!post) return res.status(404).json({ post: 'Not Found' });
    
        let fileName;
        let basePath;
        if (req.file) {
            fileName = req.file.filename;
            basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        }

        const { title, content, category } = req.body;

        if (category) {
            const categoryCheck = await Cateory.findOne({ name: category });

            if (!categoryCheck) return res.status(404)
                .json({ category: 'Not Found' });
        }

    
        const updatedPost = await Post.findByIdAndUpdate(
            post._id,
            {
                title,
                content,
                category,
                image: `${basePath}${fileName}`
            },
            { new: true }
        );

        if (!updatedPost) return res.status(304).json({ post: 'Not Modified' })

        res.status(200).json({ post: 'Modified' });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Delete a blog post
const httpDeletePost = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ user: 'Unauthorized' });

        const postId = req.params.id;
        if (!mongoose.isValidObjectId(postId))
            return res.status(400).json({ post: 'Invalid ID' });

        const post = await Post.findOne({ _id: postId, author: user._id });
        if (!post) return res.status(404).json({ post: 'Not Found' });

        const deletedPost = await Post.findByIdAndDelete(post._id);

        if (deletedPost.deletedCount === 0) return res.status(417)
            .json({ message: 'Expectation Failed' });

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    httpGetPosts,
    httpGetPostByID,
    httpGetPostByCategory,
    httpGetPostsCount,
    httpCreatePost,
    httpUpdatePost,
    httpDeletePost,
};