const Comment = require('../models/Comment');
const Article = require('../models/Article');

const setupCommentNamespace = (namespace) => {
  namespace.on('connection', (socket) => {
    console.log('New client connected to /comments');

    socket.on('comment:create', async (data) => {
      try {
        const { articleId, content, authorId, parentCommentId } = data;

        const comment = await Comment.create({
          article: articleId,
          content,
          author: authorId,
          parentComment: parentCommentId,
        });

        if (!parentCommentId) {
          await Article.findByIdAndUpdate(articleId, {
            $push: { comments: comment._id },
          });
        }

        namespace.emit(`article:${articleId}:comment`, comment);
        socket.emit('comment:created', comment);
      } catch (error) {
        socket.emit('comment:error', { message: error.message });
      }
    });

    socket.on('comment:nested', async (data) => {
      try {
        const { parentCommentId, content, authorId } = data;

        const comment = await Comment.create({
          parentComment: parentCommentId,
          content,
          author: authorId,
        });

        const parentComment = await Comment.findById(parentCommentId)
          .populate('article')
          .exec();

        await Comment.findByIdAndUpdate(parentCommentId, {
          $push: { replies: comment._id },
        });

        namespace.emit(`article:${parentComment.article._id}:comment`, {
          ...comment.toObject(),
          parentCommentId,
        });

        socket.emit('comment:reply:created', comment);
      } catch (error) {
        socket.emit('comment:error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from /comments');
    });
  });
};

module.exports = { setupCommentNamespace };