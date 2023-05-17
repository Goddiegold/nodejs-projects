const postsRouter = require('express').Router();

const { authToken } = require('../../utils/auth.middleware');
const { uploads } = require('../../utils/multer');
const {
    httpGetPosts,
    httpGetPostByID,
    httpGetPostsCount,
    httpCreatePost,
    httpUpdatePost,
    httpDeletePost,
} = require('./posts.controller');


postsRouter.get('/', httpGetPosts);
postsRouter.get('/:id', authToken, httpGetPostByID);
postsRouter.get('/get/count', authToken, httpGetPostsCount);
postsRouter.post('/', authToken, uploads.single('image'), httpCreatePost);
postsRouter.put('/', authToken, uploads.single('image'), httpUpdatePost);
postsRouter.delete('/', authToken, httpDeletePost);

module.exports = postsRouter;
