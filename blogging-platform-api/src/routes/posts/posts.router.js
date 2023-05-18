const postsRouter = require('express').Router();

const { authToken } = require('../../utils/auth.middleware');
const { uploads } = require('../../utils/multer');
const {
    httpGetPosts,
    httpGetPostByID,
    httpGetPostByCategory,
    httpGetPostsCount,
    httpCreatePost,
    httpUpdatePost,
    httpDeletePost,
} = require('./posts.controller');


postsRouter.get('/', httpGetPosts);
postsRouter.get('/:id', authToken, httpGetPostByID);
postsRouter.get('/get/categories', httpGetPostByCategory);
postsRouter.get('/get/count', authToken, httpGetPostsCount);
postsRouter.post('/', authToken, uploads.single('image'), httpCreatePost);
postsRouter.put('/:id', authToken, uploads.single('image'), httpUpdatePost);
postsRouter.delete('/:id', authToken, httpDeletePost);

module.exports = postsRouter;
