const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, text: true },
  content: { type: String, required: true },
  image: String,
  tags: [{ type: String }],
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  },
  views: { type: Number, default: 0 }
});

articleSchema.index({ title: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Article', articleSchema);
