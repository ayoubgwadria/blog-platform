exports.articleAuth = {
    create: (req, res, next) => {
      if (!['writer', 'editor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Role non autorisé' });
      }
      next();
    },
  
    update: async (req, res, next) => {
      const article = await Article.findById(req.params.id);
      if (!article) return res.status(404);
      
      if (article.author.toString() !== req.user.id && !['editor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Action non autorisée' });
      }
      next();
    },
  
    delete: (req, res, next) => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin requis' });
      }
      next();
    }
  };