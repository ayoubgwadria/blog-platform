const Article = require('../models/Article');

const setupArticleNamespace = (namespace) => {
  namespace.on('connection', (socket) => {
    console.log('New client connected to /articles');

    socket.on('article:get', async (data) => {
      try {
        const page = parseInt(data.page) || 1;
        const limit = parseInt(data.limit) || 10;
        const skip = (page - 1) * limit;

        const [articles, count] = await Promise.all([
          Article.find()
            .populate('author', 'email role')
            .populate({
              path: 'comments',
              populate: [
                { path: 'author', select: 'email role' },
                { path: 'replies', populate: { path: 'author', select: 'email role' } },
              ],
            })
            .sort('-createdAt')
            .skip(skip)
            .limit(limit),
          Article.countDocuments(),
        ]);

        namespace.emit('article:get', {
          data: articles,
          meta: {
            page,
            limit,
            total: count,
            hasNext: count > page * limit,
          },
        });
      } catch (error) {
        namespace.emit('article:error', { message: error.message });
      }
    });

    socket.on('article:create', async (data) => {
      try {
        const article = await Article.create({
          ...data,
          author: data.authorId,
        });
        namespace.emit('article:create', article);
      } catch (error) {
        namespace.emit('article:error', { message: error.message });
      }
    });

    socket.on('article:update', async (data) => {
      try {
        const article = await Article.findByIdAndUpdate(
          data.id,
          { $set: data.article },
          { new: true, runValidators: true }
        ).populate('author', 'email');

        if (!article) {
          socket.emit('article:error', { message: 'Article not found' });
          return;
        }

        namespace.emit('article:update', article);
      } catch (error) {
        namespace.emit('article:error', { message: error.message });
      }
    });

    socket.on('article:delete', async (id) => {
      try {
        const article = await Article.findByIdAndDelete(id);
        if (!article) {
          socket.emit('article:error', { message: 'Article not found' });
          return;
        }

        namespace.emit('article:delete', id);
      } catch (error) {
        namespace.emit('article:error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from /articles');
    });
  });
};

module.exports = { setupArticleNamespace };