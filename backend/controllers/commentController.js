const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  try {
    const { articleId, content, authorId, parentCommentId } = req.body;

    const comment = await Comment.create({
      article: articleId,
      content,
      author: authorId,
      parentComment: parentCommentId
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.replyComment = async (req, res) => {
  try {
    const { parentCommentId, content, authorId } = req.body;

    const comment = await Comment.create({
      parentComment: parentCommentId,
      content,
      author: authorId
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};