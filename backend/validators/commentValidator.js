const Joi = require('joi');

const createCommentSchema = Joi.object({
  articleId: Joi.string().hex().length(24).required(),
  content: Joi.string().min(1).max(500).required(),
  authorId: Joi.string().hex().length(24).required(),
  parentCommentId: Joi.string().hex().length(24).optional()
});

const replyCommentSchema = Joi.object({
  parentCommentId: Joi.string().hex().length(24).required(),
  content: Joi.string().min(1).max(500).required(),
  authorId: Joi.string().hex().length(24).required()
});

module.exports = { createCommentSchema, replyCommentSchema };