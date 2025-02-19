const Comment = require('../models/Comment');

const setupCommentNamespace = (namespace) => {
  namespace.on('connection', (socket) => {
    console.log('New client connected to /comments');

    // Événement : Création d'un commentaire
    socket.on('comment:create', async (data) => {
      try {
        const { articleId, content, authorId, parentCommentId } = data;

        // Créer le commentaire
        const comment = await Comment.create({
          article: articleId,
          content,
          author: authorId,
          parentComment: parentCommentId
        });

        // Broadcast à l'auteur de l'article
        namespace.emit(`article:${articleId}:comment`, comment);

        // Répondre au client
        socket.emit('comment:created', comment);
      } catch (error) {
        socket.emit('comment:error', { message: error.message });
      }
    });

    // Événement : Réponse à un commentaire
    socket.on('comment:nested', async (data) => {
      try {
        const { parentCommentId, content, authorId } = data;

        // Créer le commentaire imbriqué
        const comment = await Comment.create({
          parentComment: parentCommentId,
          content,
          author: authorId
        });

        // Broadcast au parent
        namespace.emit(`comment:${parentCommentId}:reply`, comment);

        // Répondre au client
        socket.emit('comment:reply:created', comment);
      } catch (error) {
        socket.emit('comment:error', { message: error.message });
      }
    });

    // Déconnexion
    socket.on('disconnect', () => {
      console.log('Client disconnected from /comments');
    });
  });
};

module.exports = { setupCommentNamespace };