const Article = require('../models/Article');
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
    if (!parentCommentId) {
      await Article.findByIdAndUpdate(articleId, {
        $push: { comments: comment._id }
      });
    }
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
    await Comment.findByIdAndUpdate(parentCommentId, {
      $push: { replies: comment._id }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};