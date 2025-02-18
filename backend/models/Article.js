const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    text: true 
  },
  content: {
    type: String,
    required: true
  },
  image: String,
  tags: [{
    type: String,
    index: true 
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

articleSchema.index({ title: 1 }); 
articleSchema.index({ tags: 1 }); 

module.exports = mongoose.model('Article', articleSchema);