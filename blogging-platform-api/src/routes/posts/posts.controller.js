const mongoose = require('mongoose');

const Post = require('../../models/posts.model');
const Cateory = require('../../models/categories.model');

// Get all posts
const httpGetPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .select('title image author');
      
        if (posts.length === 0) return res.status(404).json({ message: 'No post found' });

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get post by ID
async function httpGetPostByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid User Id');
        
        const post = await Post.findById(req.params.id)
            .select('-_id -__v');

        if (!post) return res.status(404).json({ error: `Post not found` });

        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetPostsCount(req, res) {
    try {
        const postsCount = await Post.countDocuments();

        if (postsCount === 0) return res.status(404).json({ error: 'There is no post yet' });

        res.status(200).json({ postsCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Create a new post
const httpCreatePost = async (req, res) => {
    const { _id } = req.user;
    if (!_id) return res.status(404).json({ error: 'Unauthorized' });

    const { title, content, category } = req.body;

    const formattedCategory = category.trim().replace(/\s/g, '-').toLowerCase();

    const categoryCheck = await Cateory.findOne({ name: formattedCategory });
    if (!categoryCheck) return res.status(400)
        .send('Please select an existing category or create a new category');

    const file = req.file
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    try {
        const post = await Post.create({
            title,
            content,
            image: `${basePath}${fileName}`,
            category: formattedCategory,
            author: _id,
        });

        const { createdAt } = post;

        res.status(201).json({ state: true, createdAt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update an existing post
const httpUpdatePost = async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) return res.status(404).json({ error: 'Unauthorized' });

        const postId = req.params.id;
        if (!mongoose.isValidObjectId(postId))
            return res.status(400).send('Invalid Post Id');
        
        const post = await Post.findOne({ _id: postId, author: userId._id });
        if (!post)
            return res.status(404).json({ message: 'User cannot perform this operation' });
    
        let fileName;
        let basePath;
        if (req.file) {
            fileName = req.file.filename;
            basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        }

        const { title, content, category } = req.body;

        if (category) {
            const categoryCheck = await Cateory.findOne({ name: category });

            if (!categoryCheck) return res.status(400)
                .send('Please select an existing category or create a new categoryt');
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

        if (!updatedPost) return res.status(404).json({ error: 'Post was not updated' })

        res.json({ updatedPost });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a blog post
const httpDeletePost = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) return res.status(404).json({ error: 'Unauthorized' });

        const postId = req.params.id;
        if (!mongoose.isValidObjectId(postId))
            return res.status(400).send('Invalid Post Id');

        const post = await Post.findOne({ _id: postId, author: userId });
        if (!post)
            return res.status(404).json({ message: 'User cannot perform this operation' });

        const deletedPost = await Post.findByIdAndDelete(post._id);

        if (deletedPost.deletedCount === 0)
            return res.status(404).json({ error: 'Post not deleted' });

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    httpGetPosts,
    httpGetPostByID,
    httpGetPostsCount,
    httpCreatePost,
    httpUpdatePost,
    httpDeletePost,
};