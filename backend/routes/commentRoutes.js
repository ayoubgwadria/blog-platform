const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { createCommentSchema, replyCommentSchema} = require('../validators/commentValidator');
const validate = require('../middleware/validate');
const { authMiddleware } = require('../middleware/auth');

router.post('/add', authMiddleware(), validate(createCommentSchema), commentController.createComment);
router.post('/reply',  authMiddleware(),validate(replyCommentSchema), commentController.replyComment);

module.exports = router;